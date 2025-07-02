import {
  Controller,
  Get,
  Post,
  Render,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { AdminRoles } from 'src/common/decorators/admin-roles.decorator';
import { AdminRolesGuard } from 'src/common/guards/admin-roles.guard';
import { ADMIN_ROLE } from 'src/common/types/admin-auth.types';

@Controller('admin/portal/newsletters')
@UseGuards(AdminRolesGuard)
@AdminRoles(ADMIN_ROLE.ADMIN, ADMIN_ROLE.MODERATOR)
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Get('list')
  @Render('admin/portal/newsletters/list')
  ListNewsletters() {
    return {
      title: 'Newsletters',
    };
  }

  @Post('list')
  async newsletterListPaginated(@Query() queryDto: PaginationQuery) {
    return await this.newsletterService.getPaginatedList(queryDto);
  }

  @Delete()
  async deleteNewsletter(@Query('id') id: string) {
    return await this.newsletterService.deleteNewsletter(id);
  }
}
