import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Query, NotFoundException, UseGuards } from '@nestjs/common';
import { ShoecareService } from './shoecare.service';
import { CreateShoecareDto } from './dto/create-shoecare.dto';
import { UpdateShoecareDto } from './dto/update-shoecare.dto';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { AdminRolesGuard } from 'src/common/guards/admin-roles.guard';
import { AdminRoles } from 'src/common/decorators/admin-roles.decorator';
import { ADMIN_ROLE } from 'src/common/types/admin-auth.types';

@Controller('admin/portal/shoecares')
@UseGuards(AdminRolesGuard)
@AdminRoles(ADMIN_ROLE.ADMIN, ADMIN_ROLE.MODERATOR)
export class ShoecareController {
  constructor(private readonly shoecareService: ShoecareService) { }

  @Get('list')
  @Render('admin/portal/shoecares/list')
  CategoriesList() {
    return {
      title: 'categories',
    };
  }

   @Get('statementlist')
  @Render('admin/portal/shoecares/statementlist')
  async ShoecareStatements() {
    const orders = await this.shoecareService.Statements();
    return {
      title: 'Shoe Cares Statements',
      orders,
    };
  }

  @Get('invoice/:id')
  @Render('admin/portal/shoecares/invoice')
  async invoice(@Param('id') id: string) {
    const invoiceData = await this.shoecareService.invoice(id);
 
    return {
      title: 'Invoice',
      invoice: invoiceData,
    };
  }

  @Post('list')
  async TestimonialListPaginated(@Query() queryDto: PaginationQuery) {
    const result = await this.shoecareService.getPaginatedList(queryDto);
    return result;
  }

  @Get('add')
  @Render('admin/portal/shoecares/add')
  async addUpdateShoecare(@Query('id') id: string) {
    let title = 'Add Shoecare';
    let is_update = false;
    let action_data = {};
    if (id) {
      const checkShoecare = await this.shoecareService.findShoecareById(id);
      if (!checkShoecare) {
        throw new NotFoundException({
          message: 'Shoecare not found',
        });
      }
      title = 'Update Shoecare';
      is_update = true;
      action_data = checkShoecare.toObject();
    }

    return {
      title: title,
      is_update: is_update,
      action_data: action_data,
    };
  }

  @Post('add')
  async addUpdateShoecareSubmit(@Body() data: CreateShoecareDto) {
   
    await this.shoecareService.addUpdateShoecare(data);
    return {
      message: data.action_id
        ? 'Shoecare has been updated'
        : 'Shoecare has been added',
      redirect: '/admin/shoecares/list',
    };
  }

  @Delete()
  async deleteService(@Query('id') id: string) {
    return await this.shoecareService.deleteShoecare(id);
  }
}
