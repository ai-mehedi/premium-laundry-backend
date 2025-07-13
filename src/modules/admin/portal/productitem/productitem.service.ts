import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductitemDto } from './dto/create-productitem.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subservice, SubserviceModel } from 'src/models/subservice-schema';
import { Service, ServiceModel } from 'src/models/Service-schema';
import { ProductItems, ProductItemsModel } from 'src/models/productitems-schema';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';


@Injectable()
export class ProductitemService {
  constructor(
    @InjectModel(Subservice.name)
    private readonly SubserviceModel: SubserviceModel,
    @InjectModel(Service.name)
    private readonly ServiceModel: ServiceModel,
    @InjectModel(ProductItems.name)
    private readonly ProductItemsModel: ProductItemsModel,
  ) { }

  async findServicesAll() {
    return this.ServiceModel.find({ isActive: true })
  }
  async findsubServicesAll() {
    return this.SubserviceModel.find({ isActive: true })
  }


  async findsubproductItemById(_id: string) {
    return await this.ProductItemsModel.findById(_id).populate('subserviceId').populate('serviceId');
  }

  async findproductItemsAll() {
    return this.ProductItemsModel.find({ isActive: true })
      .populate('subserviceId')
      .populate('serviceId')
      .lean();
  }


  async addUpdateproductItem(data: CreateProductitemDto) {
    interface ServicePrice {
      washAndIron: number | string;
      drycleaning: number | string;
      iron: number | string;
    }

    const price: ServicePrice = {
      washAndIron: data.pwashAndIron,
      drycleaning: data.pedrycleaning,
      iron: data.piron,
    }
    const vendorPrice: ServicePrice = {
      washAndIron: data.vwashAndIron,
      drycleaning: data.vdrycleaning,
      iron: data.viron,
    }
    if (data.action_id) {
      const checksubservice = await this.SubserviceModel.findOne({
        _id: data.action_id,
      });

      if (!checksubservice) {
        throw new BadRequestException({
          message: 'product items does not exist.',
          field: 'action_id',
        });
      }


      const isActive = (typeof data.isActive === 'string' ? data.isActive === 'true' : data.isActive === true);




      await this.ProductItemsModel.updateOne(
        {
          _id: data.action_id,
        },
        {
          $set: {
            thumbnail: data.thumbnail,
            isActive: data.isActive,
            serviceId: data.serviceId,
            subserviceId: data.subserviceId,
            title: data.title,
            price: price,
            vendorPrice: vendorPrice,


          },
        },
      );
    }



    if (!data.action_id) {
      const checkEmail = await this.ProductItemsModel.findOne({
        _id: data.action_id,
      });
      if (checkEmail) {
        throw new BadRequestException({
          message: 'product items already exists.',
          field: 'action_id',
        });
      }
      await this.ProductItemsModel.create({
        thumbnail: data.thumbnail,
        isActive: data.isActive,
        serviceId: data.serviceId,
        subserviceId: data.subserviceId,
        title: data.title,
        price: price,
        vendorPrice: vendorPrice,


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
    const renderPath = 'views/admin/portal/productitems/widgets/list.ejs';
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

    options.extraStages = [
      {
        $lookup: {
          from: 'services',
          localField: 'serviceId',
          foreignField: '_id',
          as: 'serviceData',
        },
      },
      {
        $unwind: {
          path: '$serviceData',
          preserveNullAndEmptyArrays: true,
        }
      },
      {
        $lookup: {
          from: 'subservices',
          localField: 'subserviceId',
          foreignField: '_id',
          as: 'subserviceData',
        },
      },
      {
        $unwind: {
          path: '$subserviceData',
          preserveNullAndEmptyArrays: true,
        }
      }
    ]

    const results = await this.ProductItemsModel.paginate({}, options);

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

  async deleteProductitem(id: string) {
    const result = await this.SubserviceModel.findOneAndDelete({
      _id: id,
    });

    if (!result) {
      throw new NotFoundException({
        message: 'Product item not found',
      });
    }
    return {
      message: 'Product item deleted successfully',
    };
  }


}
