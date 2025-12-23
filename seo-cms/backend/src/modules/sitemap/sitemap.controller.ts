import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { SitemapService } from './sitemap.service';

@ApiTags('sitemap')
@Controller('')
export class SitemapController {
  constructor(private sitemapService: SitemapService) {}

  @Get('sitemap.xml')
  @ApiOperation({ summary: 'Получить sitemap.xml' })
  async getSitemap(@Res() res: Response, @Query('siteUrl') siteUrl?: string) {
    const xml = await this.sitemapService.generateXml(siteUrl || 'http://localhost:3000');
    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  }

  @Get('robots.txt')
  @ApiOperation({ summary: 'Получить robots.txt' })
  async getRobotsTxt(@Res() res: Response, @Query('siteUrl') siteUrl?: string) {
    const txt = await this.sitemapService.generateRobotsTxt(siteUrl || 'http://localhost:3000');
    res.setHeader('Content-Type', 'text/plain');
    res.send(txt);
  }
}
