import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductModel } from 'src/models/product-schema';
import { User, UserModel } from 'src/models/user.schema';
import { Order, OrderModel } from 'src/models/order.schema';
import { RandomString } from 'src/common/helpers/utils/string.utils';
import { hashPassword } from 'src/common/helpers/utils/password.utils';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Product.name)
    private readonly ProductModel: ProductModel,
    @InjectModel(User.name)
    private readonly UserModel: UserModel,
    @InjectModel(Order.name)
    private readonly OrderModel: OrderModel,

  ) { }

  async create(createOrderDto: CreateOrderDto) {
    let userId: string;
    let orderId = Math.floor(100000 + Math.random() * 900000).toString();
    const userPaaword = "12345678"; // Default password for new users

    const hashPass = await hashPassword(userPaaword);
    // 1. Find or create user
    let user = await this.UserModel.findOne({ phone: createOrderDto.phone });
    if (!user) {
      user = await this.UserModel.create({
        name: createOrderDto.name,
        phone: `+88${createOrderDto.phone}`,
        fullAddress: createOrderDto.address,
        password: hashPass,
        isActive: true,
      });
    }
    userId = user._id.toString();

    // 2. Validate products and enrich product info
    const productIds = createOrderDto.products.map((p) => p.id);
    const foundProducts = [];

    for (const productId of productIds) {
      const product = await this.ProductModel.findById(productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }
      foundProducts.push(product);
    }

    if (foundProducts.length !== productIds.length) {
      throw new NotFoundException('Some products not found');
    }

    const enrichedProducts = createOrderDto.products.map((item: any) => {
      const matchedProduct = foundProducts.find(
        (p) => p._id.toString() === item.id
      );

      let vendorSubtotal = 0;

      // Enrich services with vendor prices and calculate vendor subtotal
      const enrichedServices = item.services.map((service: any) => {
        let vendorPrice = 0;

        if (service.service === 'Wash & Iron') {
          vendorPrice = matchedProduct.vendorPrice.washAndIron;
        } else if (service.service === 'Dry Clean') {
          vendorPrice = matchedProduct.vendorPrice.drycleaning;
        } else if (service.service === 'Iron') {
          vendorPrice = matchedProduct.vendorPrice.iron;
        }

        vendorSubtotal += vendorPrice * item.quantity;

        return {
          ...service,
          vendorPrice,
        };
      });

      return {
        productId: matchedProduct._id,
        productName: matchedProduct.title,
        quantity: item.quantity,
        services: enrichedServices,
        subtotal: item.subtotal,            // customer price (already calculated)
        vendorSubtotal: vendorSubtotal,     // calculated vendor price for this product
      };
    });
    // console.log(JSON.stringify(enrichedProducts, null, 2));
    const OrderStatus = {
      status: 'Pending',
      updatedBy: user.name,
      note: 'Order created successfully',
    }

    const newOrder = {
      user: userId,
      orderId: orderId,
      name: createOrderDto.name,
      phone: createOrderDto.phone,
      address: createOrderDto.address,
      shippingTime: createOrderDto.shippingTime,
      promoCode: createOrderDto.promoCode,
      promoOfferPrice: createOrderDto.promoOfferPrice,
      subtotal: createOrderDto.subtotal,
      total: createOrderDto.total,
      products: enrichedProducts,
      statuses: OrderStatus,
      createdAt: new Date(),
    };


    const order = await this.OrderModel.create(newOrder);
    order.save();



    return {
      message: '✅ Order created successfully',
      orderId: order.orderId,
    };
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
