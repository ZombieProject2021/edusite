import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards, UseInterceptors, UploadedFile, HttpCode, HttpStatus
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MediaService } from './media.service';
import { memoryStorage } from 'multer';

@ApiTags('media')
@Controller('api/media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Загрузить медиафайл' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File, @Body('alt') alt?: string) {
    return this.mediaService.upload(file, alt);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список медиафайлов' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.mediaService.findAll({ page, limit, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить медиафайл по ID' })
  async findOne(@Param('id') id: string) {
    return this.mediaService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить метаданные медиафайла' })
  async update(
    @Param('id') id: string,
    @Body() data: { alt?: string; caption?: string; title?: string },
  ) {
    return this.mediaService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Удалить медиафайл' })
  async delete(@Param('id') id: string) {
    return this.mediaService.delete(id);
  }
}
