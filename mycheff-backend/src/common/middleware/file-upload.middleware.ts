import { Injectable } from '@nestjs/common';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuid } from 'uuid';

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Injectable()
export class FileUploadService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'recipes');
          
          // Create directory if it doesn't exist
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Generate unique filename
          const uniqueSuffix = uuid();
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Check file type
        const allowedMimes = [
          'image/jpeg',
          'image/jpg', 
          'image/png',
          'image/gif',
          'image/webp',
          'video/mp4',
          'video/mpeg',
          'video/quicktime',
          'video/x-msvideo', // .avi
          'video/webm'
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
        }
      },
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
        files: 5, // Maximum 5 files per request
      },
    };
  }
}

// File type detection helper
export const getMediaType = (mimetype: string): 'image' | 'video' => {
  if (mimetype.startsWith('image/')) {
    return 'image';
  } else if (mimetype.startsWith('video/')) {
    return 'video';
  }
  throw new Error(`Unsupported media type: ${mimetype}`);
};

// File size formatter
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to get file URL
export function getFileUrl(filename: string, type: 'image' | 'video' = 'image'): string {
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
  return `${baseUrl}/uploads/recipes/${type}s/${filename}`;
}

// File validation helper
export function validateFileType(file: MulterFile): { isValid: boolean; type: 'image' | 'video' | 'unknown' } {
  if (file.mimetype.startsWith('image/')) {
    return { isValid: true, type: 'image' };
  } else if (file.mimetype.startsWith('video/')) {
    return { isValid: true, type: 'video' };
  }
  return { isValid: false, type: 'unknown' };
} 