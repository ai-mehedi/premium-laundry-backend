import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Faq, FaqModel } from 'src/models/faq-schema';
import { I18nService } from 'nestjs-i18n';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';

@Injectable()
export class FaqService {
  constructor(
    @InjectModel(Faq.name)
    private readonly faqModel: FaqModel,
    private readonly i18n: I18nService,
  ) {}

  async findFaqById(_id: string) {
    return this.faqModel.findById(_id);
  }

  async addUpdateFaq(data: CreateFaqDto) {
    if (data.action_id) {
      const checkFaq = await this.faqModel.findOne({ _id: data.action_id });
      if (!checkFaq) {
        throw new BadRequestException({
          message: 'FAQ does not exist.',
          field: 'action_id',
        });
      }

      await this.faqModel.updateOne(
        {
          _id: data.action_id,
        },
        {
          $set: {
            title: data.title,
            description: data.description,
          },
        },
      );
    }

    if (!data.action_id) {
      const checkEmail = await this.faqModel.findOne({ _id: data.action_id });
      if (checkEmail) {
        throw new BadRequestException({
          message: 'FAQ already exists.',
          field: 'action_id',
        });
      }
      await this.faqModel.create({
        title: data.title,
        description: data.description,
      });
    }
  }

  async getPaginatedList({
    limit,
    page,
    sortBy,
    sortOrder,
    searchText,
  }: PaginationQuery) {
    const options: PaginationOptions = { page, limit };
    const pagination = new PaginationUI();
    const renderPath = 'views/admin/portal/faqs/widgets/list.ejs';
    const searchBy = ['title'];

    limit = limit || 25;
    pagination.per_page = limit;
    const offset = (page - 1) * limit;

    options.sortOrder = {
      direction: sortOrder,
      id: sortBy,
    };

    if (searchText) {
      options.search = {
        searchText,
        searchBy,
      };
    }

    const results = await this.faqModel.paginate({}, options);

    const paginate_ui = pagination.getAllPageLinks(
      Math.ceil(results.total / limit),
      Math.abs(results.page),
    );

    let html_data = '';
    let serial_number = offset;

    for (const result of results.records) {
      serial_number++;
      html_data += await RenderEjsFile(join(global.ROOT_DIR, renderPath), {
        result,
        serial_number,
      });
    }

    return {
      data_exist: results.total > 0,
      data: html_data,
      total_count: results.total,
      pagination: paginate_ui,
    };
  }

  async deleteFaq(id: string) {
    const result = await this.faqModel.findOneAndDelete({
      _id: id,
    });

    if (!result) {
      throw new NotFoundException({
        message: 'FAQ not found',
      });
    }
    return {
      message: 'FAQ deleted successfully',
    };
  }
}
