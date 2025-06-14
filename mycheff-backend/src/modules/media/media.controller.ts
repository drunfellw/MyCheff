import { 
  Controller, 
  Post, 
  Get, 
  Delete, 
  Put, 
  Param, 
  UseInterceptors, 
  UploadedFiles, 
  UseGuards,
  Body,
  ParseUUIDPipe 
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { MediaService } from './media.service';

@ApiTags('Media')
@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload/:recipeId')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload media files for a recipe' })
  async uploadRecipeMedia(
    @Param('recipeId', ParseUUIDPipe) recipeId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('isPrimary') isPrimary = false,
  ) {
    const media = await this.mediaService.uploadRecipeMedia(recipeId, files, isPrimary);
    
    return {
      success: true,
      data: media,
    };
  }

  @Get('recipe/:recipeId')
  @ApiOperation({ summary: 'Get all media for a recipe' })
  async getRecipeMedia(@Param('recipeId', ParseUUIDPipe) recipeId: string) {
    const media = await this.mediaService.getRecipeMedia(recipeId);
    
    return {
      success: true,
      data: media,
    };
  }

  @Put(':mediaId/order')
  @ApiOperation({ summary: 'Update media display order' })
  async updateMediaOrder(
    @Param('mediaId', ParseUUIDPipe) mediaId: string,
    @Body('sortOrder') sortOrder: number,
  ) {
    await this.mediaService.updateMediaOrder(mediaId, sortOrder);
    
    return {
      success: true,
      message: 'Media order updated successfully',
    };
  }

  @Put(':mediaId/primary/:recipeId')
  @ApiOperation({ summary: 'Set media as primary for recipe' })
  async setPrimaryMedia(
    @Param('recipeId', ParseUUIDPipe) recipeId: string,
    @Param('mediaId', ParseUUIDPipe) mediaId: string,
  ) {
    await this.mediaService.setPrimaryMedia(recipeId, mediaId);
    
    return {
      success: true,
      message: 'Primary media updated successfully',
    };
  }

  @Delete(':mediaId')
  @ApiOperation({ summary: 'Delete media file' })
  async deleteMedia(@Param('mediaId', ParseUUIDPipe) mediaId: string) {
    await this.mediaService.deleteMedia(mediaId);
    
    return {
      success: true,
      message: 'Media deleted successfully',
    };
  }
} 