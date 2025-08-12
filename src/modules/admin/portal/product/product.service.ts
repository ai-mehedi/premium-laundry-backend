import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductitemDto } from './dto/create-productitem.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Itemtype, ItemtypeModel } from 'src/models/itemtype-schema';
import { Service, ServiceModel } from 'src/models/Service-schema';
import {
  Product,
  ProductModel,
} from 'src/models/product-schema';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';

@Injectable()
export class Productervice {
  constructor(
    @InjectModel(Itemtype.name)
    private readonly ItemtypeModel: ItemtypeModel,
    @InjectModel(Service.name)
    private readonly ServiceModel: ServiceModel,
    @InjectModel(Product.name)
    private readonly ProductModel: ProductModel,
  ) { }

  async findServicesAll() {
    return this.ServiceModel.find({ isActive: true });
  }
  async finditemtypeAll() {
    return this.ItemtypeModel.find({ isActive: true });
  }



  async findsubproductItemById(_id: string) {
    return await this.ProductModel.findById(_id)
      .populate('itemtypeID')
      .populate('serviceId');
  }

  async findProductAll() {
    return this.ProductModel.find({ isActive: true })
      .populate('itemtypeID')
      .populate('serviceId')
      .lean();
  }

  async addUpdateproductItem(data: CreateProductitemDto) {
    interface ServicePrice {
      washAndIron: number | string;
      drycleaning: number | string;
      iron: number | string;
      StainSpotRemoval: number | string;
    }

    const price: ServicePrice = {
      washAndIron: data.pwashAndIron,
      drycleaning: data.pedrycleaning,
      iron: data.piron,
      StainSpotRemoval: data.pStainSpotRemoval,
    };
    const vendorPrice: ServicePrice = {
      washAndIron: data.vwashAndIron,
      drycleaning: data.vdrycleaning,
      iron: data.viron,
      StainSpotRemoval: data.vStainSpotRemoval,
    };
    if (data.action_id) {
      const checksubservice = await this.ProductModel.findOne({
        _id: data.action_id,
      });

      if (!checksubservice) {
        throw new BadRequestException({
          message: 'product items does not exist.',
          field: 'action_id',
        });
      }

      const isActive =
        typeof data.isActive === 'string'
          ? data.isActive === 'true'
          : data.isActive === true;

      await this.ProductModel.updateOne(
        {
          _id: data.action_id,
        },
        {
          $set: {
            thumbnail: data.thumbnail,
            isActive: data.isActive,
            serviceId: data.serviceId,
            itemtypeID: data.itemtypeID,
            popular: data.popular,
            title: data.title,
            price: price,
            vendorPrice: vendorPrice,
          },
        },
      );
    }

    if (!data.action_id) {
      const checkEmail = await this.ProductModel.findOne({
        _id: data.action_id,
      });
      if (checkEmail) {
        throw new BadRequestException({
          message: 'product items already exists.',
          field: 'action_id',
        });
      }
      await this.ProductModel.create({
        thumbnail: data.thumbnail,
        isActive: data.isActive,
        serviceId: data.serviceId,
        popular: data.popular,
        itemtypeID: data.itemtypeID,
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
    const renderPath = 'views/admin/portal/products/widgets/list.ejs';
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
        },
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
        },
      },
    ];

    const results = await this.ProductModel.paginate({}, options);

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
    const result = await this.ProductModel.findOneAndDelete({
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
