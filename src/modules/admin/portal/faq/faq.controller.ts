import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Render,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { AdminRolesGuard } from 'src/common/guards/admin-roles.guard';
import { AdminRoles } from 'src/common/decorators/admin-roles.decorator';
import { ADMIN_ROLE } from 'src/common/types/admin-auth.types';

@Controller('admin/portal/faqs')
@UseGuards(AdminRolesGuard)
@AdminRoles(ADMIN_ROLE.ADMIN, ADMIN_ROLE.MODERATOR)
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get('list')
  @Render('admin/portal/faqs/list')
  faqsList() {
    return {
      title: 'FAQs',
    };
  }

  @Post('list')
  async faqsListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.faqService.getPaginatedList(queryDto);
    return result;
  }

  @Get('add')
  @Render('admin/portal/faqs/add')
  async addUpdateFaq(@Query('id') id: string) {
    let title = 'Add FAQ';
    let is_update = false;
    let action_data = {};
    if (id) {
      const checkAdmin = await this.faqService.findFaqById(id);
      if (!checkAdmin) {
        throw new NotFoundException({
          message: 'FAQ not found',
        });
      }
      title = 'Update FAQ';
      is_update = true;
      action_data = checkAdmin.toObject();
    }

    return {
      title: title,
      is_update: is_update,
      action_data: action_data,
    };
  }

  @Post('add')
  async addUpdateFaqSubmit(@Body() data: CreateFaqDto) {
    await this.faqService.addUpdateFaq(data);
    return {
      message: data.action_id ? 'FAQ has been updated' : 'FAQ has been added',
      redirect: '/admin/faqs/list',
    };
  }

  @Delete()
  async deleteFaq(@Query('id') id: string) {
    return await this.faqService.deleteFaq(id);
  }
}
