import {
  Controller,
  Get,
  Post,
  UseGuards,
  Render,
  Query,
  Delete,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { AdminRolesGuard } from 'src/common/guards/admin-roles.guard';
import { AdminRoles } from 'src/common/decorators/admin-roles.decorator';
import { ADMIN_ROLE } from 'src/common/types/admin-auth.types';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';

@Controller('admin/portal/contacts')
@UseGuards(AdminRolesGuard)
@AdminRoles(ADMIN_ROLE.ADMIN, ADMIN_ROLE.MODERATOR)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('list')
  @Render('admin/portal/contacts/list')
  ListContacts() {
    return {
      title: 'Contacts',
    };
  }

  @Post('list')
  async contactListPaginated(@Query() queryDto: PaginationQuery) {
    return await this.contactService.getContactList(queryDto);
  }

  @Delete()
  async deleteContact(@Query('id') id: string) {
    return await this.contactService.deleteContact(id);
  }
}
