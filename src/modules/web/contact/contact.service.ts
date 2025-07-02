import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact, ContactModel } from 'src/models/contact-schema';
import { InjectModel } from '@nestjs/mongoose';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: ContactModel,
    private readonly i18n: I18nService,
  ) {}

  async createContact(createContactDto: CreateContactDto) {
    const createdContact = new this.contactModel(createContactDto);
    await createdContact.save();
    return {
      message: this.i18n.t('response-messages.contact.created'),
    };
  }
}
