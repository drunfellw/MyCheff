import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeMedia, MediaType } from '../../entities/recipe-media.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(RecipeMedia)
    private mediaRepository: Repository<RecipeMedia>,
  ) {}

  async uploadRecipeMedia(
    recipeId: string,
    files: Express.Multer.File[],
    isPrimary = false,
  ) {
    const mediaEntries: RecipeMedia[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const mediaType = this.getMediaType(file.mimetype);

      const media = this.mediaRepository.create({
        recipeId,
        mediaType,
        originalName: file.originalname,
        fileName: file.filename,
        mimeType: file.mimetype,
        fileSize: file.size,
        filePath: file.path || `/uploads/${file.filename}`,
        sortOrder: i,
      });

      mediaEntries.push(await this.mediaRepository.save(media));
    }

    return mediaEntries;
  }

  async getRecipeMedia(recipeId: string) {
    return await this.mediaRepository.find({
      where: { recipeId },
      order: { sortOrder: 'ASC' },
    });
  }

  async updateMediaOrder(mediaId: string, sortOrder: number) {
    return await this.mediaRepository.update(mediaId, { sortOrder });
  }

  async setPrimaryMedia(recipeId: string, mediaId: string) {
    // This functionality might need to be implemented differently
    // based on business logic (maybe using sortOrder = 0 for primary)
    return await this.mediaRepository.update(
      { id: mediaId, recipeId },
      { sortOrder: 0 }
    );
  }

  async deleteMedia(mediaId: string) {
    const media = await this.mediaRepository.findOne({
      where: { id: mediaId }
    });

    if (!media) {
      throw new BadRequestException('Media not found');
    }

    // Delete file from filesystem
    const filePath = path.join('./uploads', media.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    return await this.mediaRepository.delete(mediaId);
  }

  private getMediaType(mimetype: string): MediaType {
    if (mimetype.startsWith('image/')) {
      return MediaType.IMAGE;
    } else if (mimetype.startsWith('video/')) {
      return MediaType.VIDEO;
    } else {
      throw new BadRequestException('Unsupported file type');
    }
  }

  private generateFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }

  async optimizeImages() {
    // TODO: Implement image optimization with sharp or similar
    console.log('Image optimization not implemented yet');
  }
} 