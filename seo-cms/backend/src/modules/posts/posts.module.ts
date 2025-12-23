import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { SeoService } from '../seo/seo.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, SeoService],
  exports: [PostsService],
})
export class PostsModule {}
