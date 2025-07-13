import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { Testimonial, TestimonialModel } from 'src/models/testimonial-schema';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';

@Injectable()
export class TestimonialService {
  constructor(
    @InjectModel(Testimonial.name)
    private readonly TestimonialModel: TestimonialModel,
  ) { }

  async addUpdateTestimonial(data: CreateTestimonialDto) {
    if (data.action_id) {
      const checkService = await this.TestimonialModel.findOne({ _id: data.action_id });
      if (!checkService) {
        throw new BadRequestException({
          message: 'Testimonial does not exist.',
          field: 'action_id',
        });
      }

      await this.TestimonialModel.updateOne(
        {
          _id: data.action_id,
        },
        {
          $set: {
            name: data.name,
            thumbnail: data.thumbnail,
            isActive: data.isActive,
            description: data.description,
          },
        },
      );
    }

    if (!data.action_id) {
      const checkEmail = await this.TestimonialModel.findOne({
        _id: data.action_id,
      });
      if (checkEmail) {
        throw new BadRequestException({
          message: 'Testimonial already exists.',
          field: 'action_id',
        });
      }
      await this.TestimonialModel.create({
        name: data.name,
        thumbnail: data.thumbnail,
        isActive: data.isActive,
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
    const renderPath = 'views/admin/portal/testimonials/widgets/list.ejs';
    const searchBy = ['name'];

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

    const results = await this.TestimonialModel.paginate({}, options);

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

  async findTestimonialById(_id: string) {
    return this.TestimonialModel.findById(_id);
  }

  async deleteTestimonial(id: string) {
    const result = await this.TestimonialModel.findOneAndDelete({
      _id: id,
    });

    if (!result) {
      throw new NotFoundException({
        message: 'Testimonial not found',
      });
    }
    return {
      message: 'Testimonial deleted successfully',
    };
  }

}
