import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Contact')
@Controller('web/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  contactCreate(@Body() createContactDto: CreateContactDto) {
    return this.contactService.createContact(createContactDto);
  }
}
