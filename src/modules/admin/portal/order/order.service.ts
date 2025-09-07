import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderModel } from 'src/models/order.schema';
import { PaginationQuery } from 'src/shared/dto/pagination.dto';
import { PaginationOptions } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { PaginationUI } from 'src/common/helpers/utils/pagination-uri.utils';
import { RenderEjsFile } from 'src/common/helpers/utils/utils';
import { join } from 'path';
import { Admin, AdminModel } from 'src/models/admin.schema';
import { Product, ProductModel } from 'src/models/product-schema';
import { title } from 'process';


@Injectable()
export class OrderService {

  constructor(
    @InjectModel(Order.name)
    private readonly OrderModel: OrderModel,
    @InjectModel(Product.name)
    private readonly ProductModel: ProductModel,
    @InjectModel(Admin.name)
    private readonly AdminModel: AdminModel,
  ) { }

  async getAllOrders() {
    return this.OrderModel.find().populate('user').sort({ createdAt: -1 });
  }


  async addOrderProduct(id: string) {

    const order = await this.OrderModel.findById({ _id: id });
    console.log('Order found:', order);
    if (!order) {
      throw new NotFoundException({
        message: 'Order not found',
      });
    }

    const product = await this.ProductModel.findOne({ title: "dummy" });
    console.log('Product found:', product);
    if (!order) {
      throw new NotFoundException({
        message: 'Order not found',
      });
    } else {
      await this.OrderModel.findByIdAndUpdate(id,
        {
          $push: {
            products: {
              productId: product._id,
              productName: product.title,
              quantity: 1,
              subtotal: 0,
              vendorSubtotal: 0,
              services: [
                {
                  service: "iron",
                  price: 0,
                  vendorPrice: 0,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        }
      );
    }
  }

  async deleteOrderProduct(id: string, productId: string) {
    const order = await this.OrderModel.findById(id);
    if (!order) {
      throw new NotFoundException({
        message: 'Order not found',
      });
    }

    await this.OrderModel.findByIdAndUpdate(id, {
      $pull: {
        products: {
          _id: productId,
        },
      },
    });
  }

  async findAllAdmins() {
    return this.AdminModel.find({ isActive: true }).select('name email roles');
  }





  async findAllProducts() {
    return this.ProductModel.find();
  }

  async findAllOrdersById(id: string) {
    return this.OrderModel.findById(id)
      .populate('user');

  }


  async findFaqById(_id: string) {
    return this.OrderModel.findById(_id);
  }

  async addUpdateFaq(data: CreateOrderDto) {
    if (data.action_id) {
      const checkFaq = await this.OrderModel.findOne({ _id: data.action_id });
      if (!checkFaq) {
        throw new BadRequestException({
          message: 'Orders does not exist.',
          field: 'action_id',
        });
      }

      await this.OrderModel.updateOne(
        {
          _id: data.action_id,
        },
        {
          $set: {
            orderstatus: data.orderstatus,
            note: data.note,
            supplier: data.supplier,
          },
        },
      );

      await this.OrderModel.updateOne(
        {
          _id: data.action_id,
        },
        {
          $push: {
            statuses: {
              status: data.orderstatus,
              updatedBy: data.supplier,
              note: data.note,
            },
          },
        },
      );
    }


  }


  async confirmPaginatedList({
    limit,
    page,
    sortBy,
    sortOrder,
    searchText,
  }: PaginationQuery) {
    const options: PaginationOptions = { page, limit };
    const pagination = new PaginationUI();
    const renderPath = 'views/admin/portal/orders/widgets/confirmlist.ejs';
    const searchBy = ['orderId'];

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
    const results = await this.OrderModel.paginate({ orderstatus: 'Order Confirmed' }, options);

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




  async deliveryPaginatedList({
    limit,
    page,
    sortBy,
    sortOrder,
    searchText,
  }: PaginationQuery) {
    const options: PaginationOptions = { page, limit };
    const pagination = new PaginationUI();
    const renderPath = 'views/admin/portal/orders/widgets/deliverylist.ejs';
    const searchBy = ['orderId'];

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
    const results = await this.OrderModel.paginate({ orderstatus: 'Delivered' }, options);

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


  async getPaginatedList({
    limit,
    page,
    sortBy,
    sortOrder,
    searchText,
  }: PaginationQuery) {
    const options: PaginationOptions = { page, limit };
    const pagination = new PaginationUI();
    const renderPath = 'views/admin/portal/orders/widgets/list.ejs';
    const searchBy = ['orderId'];

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
    const results = await this.OrderModel.paginate({ orderstatus: 'pending' }, options);

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



}
