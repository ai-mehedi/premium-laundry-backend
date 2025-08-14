import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { AdminRolesGuard } from 'src/common/guards/admin-roles.guard';
import { AdminRoles } from 'src/common/decorators/admin-roles.decorator';
import { ADMIN_ROLE } from 'src/common/types/admin-auth.types';

@Controller('admin/portal/testimonials')
@UseGuards(AdminRolesGuard)
@AdminRoles(ADMIN_ROLE.ADMIN, ADMIN_ROLE.MODERATOR)
export class TestimonialController {
  constructor(private readonly TestimonialService: TestimonialService) {}
  @Get('list')
  @Render('admin/portal/testimonials/list')
  CategoriesList() {
    return {
      title: 'categories',
    };
  }
  @Post('list')
  async TestimonialListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.TestimonialService.getPaginatedList(queryDto);
    return result;
  }

  @Get('add')
  @Render('admin/portal/testimonials/add')
  async addUpdateTestimonial(@Query('id') id: string) {
    let title = 'Add Testimonial';
    let is_update = false;
    let action_data = {};
    if (id) {
      const checkAdmin = await this.TestimonialService.findTestimonialById(id);
      if (!checkAdmin) {
        throw new NotFoundException({
          message: 'Testimonial not found',
        });
      }
      title = 'Update Testimonial';
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
  async addUpdateServiceSubmit(@Body() data: CreateTestimonialDto) {
    await this.TestimonialService.addUpdateTestimonial(data);
    return {
      message: data.action_id
        ? 'Testimonial has been updated'
        : 'Testimonial has been added',
      redirect: '/admin/testimonials/list',
    };
  }

  @Delete()
  async deleteService(@Query('id') id: string) {
    return await this.TestimonialService.deleteTestimonial(id);
  }
}
