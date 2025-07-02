import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { ApiTags } from '@nestjs/swagger';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';

@ApiTags('Blogs')
@Controller('web/blog')
export class BlogController {
  constructor(private readonly BlogService: BlogService) {}

  @Get()
  findAllBlogs(@Query() queryDto: PaginationQuery) {
    return this.BlogService.findAllBlogs(queryDto);
  }

  @Get(':slug')
  findOneBlog(@Param('slug') slug: string) {
    return this.BlogService.findBlogBySlug(slug);
  }
}
