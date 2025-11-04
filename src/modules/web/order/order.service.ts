import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductModel } from 'src/models/product-schema';
import { User, UserModel } from 'src/models/user.schema';
import { Order, OrderModel } from 'src/models/order.schema';
import { hashPassword } from 'src/common/helpers/utils/password.utils';
import { Coupon, CouponModel } from 'src/models/coupon-schema';
import { SEND_SMS_TEMPLATE, SMSService } from 'src/shared/services/sms.service';
import { phoneDto } from './dto/order-get.dto';
import { RandomNumberString } from 'src/common/helpers/utils/string.utils';
import { OTPdto } from './dto/otp.dto';
import { OrderStatusDto } from './dto/orderstatuse.dto';
import { UpdateOrderDto } from './dto/update.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Product.name)
    private readonly ProductModel: ProductModel,
    private readonly smsService: SMSService,
    @InjectModel(User.name)
    private readonly UserModel: UserModel,
    @InjectModel(Order.name)
    private readonly OrderModel: OrderModel,

    @InjectModel(Coupon.name)
    private readonly CouponModel: CouponModel,


  ) { }


  async updateorder(id: string, updateOrderDto: UpdateOrderDto) {
    let total = 0;
    let promoOfferPrice = 0;
    // 1. Check if order exists
    const existingOrder = await this.OrderModel.findOne({ _id: id });
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    total = updateOrderDto.subtotal;

    // 2. If promoCode used, update coupon usage
    if (updateOrderDto.promoCode && updateOrderDto.promoCode !== "") {
      const coupon = await this.CouponModel.findOne({
        discountCode: updateOrderDto.promoCode,
        isActive: true,
        isDeleted: false,
        expierationDate: { $gte: new Date() } // valid, not expired
      });


      if (coupon) {
        // Calculate discount
        const discountPercentage = coupon.percentage || 0;
        const discountAmount = (updateOrderDto.subtotal * discountPercentage) / 100;

        // Apply discount to total
        promoOfferPrice = discountAmount;
        total = updateOrderDto.subtotal - discountAmount;

        // Update coupon usage
        await this.CouponModel.updateOne(
          { _id: coupon._id },
          {
            $inc: {
              usedAmount: discountAmount,
              maximumAttendeeCapacity: -1,
            },
            $set: {
              updatedAt: new Date(),
            }
          }
        );
      } else {
        throw new BadRequestException("❌ Invalid or expired promo code");
      }
    }

    // 3. Validate products and fetch vendor info
    const productIds = updateOrderDto.products.map((p) => p.productId);
    const foundProducts = [];

    for (const productId of productIds) {
      const product = await this.ProductModel.findById(productId);
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }
      foundProducts.push(product);
    }

    // 4. Enrich products with vendor costs
    const enrichedProducts = updateOrderDto.products.map((item: any) => {
      const matchedProduct = foundProducts.find(
        (p) => p._id.toString() === item.productId
      );

      let vendorSubtotal = 0;

      const enrichedServices = item.services.map((service: any) => {
        let vendorPrice = 0;

        if (service.service === 'washAndIron') {
          vendorPrice = matchedProduct.vendorPrice.washAndIron;
        } else if (service.service === 'drycleaning') {
          vendorPrice = matchedProduct.vendorPrice.drycleaning;
        } else if (service.service === 'iron') {
          vendorPrice = matchedProduct.vendorPrice.iron;
        } else if (service.service === 'StainSpotRemoval') {
          vendorPrice = matchedProduct.vendorPrice.StainSpotRemoval;
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
        subtotal: item.subtotal,        // customer subtotal
        vendorSubtotal: vendorSubtotal, // vendor subtotal
      };
    });

    const vendorCosts = enrichedProducts.map((item) => item.vendorSubtotal);
    const totalVendorCost = vendorCosts.reduce((sum, cost) => sum + cost, 0);

    let deliveryamount = 0;
    if (updateOrderDto.delivery === "Xpress Delivery (24 Hours)") {
      deliveryamount = 100;
    }

    // 5. Prepare update object
    const updatedOrder = {
      ...updateOrderDto,
      total: total,
      promoOfferPrice: promoOfferPrice,
      subtotal: updateOrderDto.subtotal,
      products: enrichedProducts,
      vendorCosts: totalVendorCost,
      deliveryamount: deliveryamount,
      delivery: updateOrderDto.delivery,
      orderstatus: updateOrderDto.OrderStatus,
      updatedAt: new Date(),
    };

  
    // 6. Update order in DB
    await this.OrderModel.updateOne({ _id: id }, { $set: updatedOrder });

    return {
      success: true,
      message: '✅ Order updated successfully',
      orderId: id,
    };
  }

  async create(createOrderDto: CreateOrderDto) {

    let orderId = Math.floor(100000 + Math.random() * 900000).toString();
    const userPaaword = "12345678"; // Default password for new users
    const useruniqueid = RandomNumberString(8);
    const hashPass = await hashPassword(userPaaword);
    // 1. Find or create user
    let user = await this.UserModel.findOne({ phone: createOrderDto.phone });

    if (!user) {
      user = await this.UserModel.create({
        name: createOrderDto.name,
        phone: `${createOrderDto.phone}`,
        fullAddress: createOrderDto.address,
        userId: useruniqueid.toString(),
        password: hashPass,
        isActive: true,
      });


      await this.smsService.sendSMS({
        template: SEND_SMS_TEMPLATE.USER_CREATE,
        phone: user.phone.replace('+', ''),
        payload: {
          NAME: user.name,
          USER_ID: user.userId,
          PASSWORD: userPaaword, // In production, avoid sending plain passwords
        },
      });


    }
    if (createOrderDto.promoCode !== "") {
      //     usedAmount:+promoOfferPrice ,
      const coupon = await this.CouponModel.findOne({ discountCode: createOrderDto.promoCode });
      if (coupon) {
        await this.CouponModel.updateOne(
          { _id: coupon._id },
          {
            $inc: {
              usedAmount: +createOrderDto.promoOfferPrice,
              maximumAttendeeCapacity: -1,
            },
          }
        );
      }
    }
    const userId = user._id.toString();

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
        } else if (service.service === 'Dry Cleaning') {
          vendorPrice = matchedProduct.vendorPrice.drycleaning;
        } else if (service.service === 'Iron') {
          vendorPrice = matchedProduct.vendorPrice.iron;
        } else if (service.service === 'Spot Removal') {
          vendorPrice = matchedProduct.vendorPrice.StainSpotRemoval;
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

    const vendorCosts = enrichedProducts.map((item) => item.vendorSubtotal);
    const totalVendorCost = vendorCosts.reduce((sum, cost) => sum + cost, 0);
    const OrderStatus = {
      status: 'Pending',
      updatedBy: user.name,
      note: 'Order created successfully',
    }
    let totalamount = createOrderDto.total;
    let deliveryamount = 0;
    if (createOrderDto.delivery === "Xpress Delivery (24 Hours)") {
      deliveryamount = 100;
    }


    const newOrder = {
      user: userId,
      orderId: orderId,
      name: createOrderDto.name,
      phone: createOrderDto.phone,
      address: createOrderDto.address,
      shippingTime: createOrderDto.shippingTime,
      pickupdate: createOrderDto.pickupdate,
      email: createOrderDto.email,
      delivery: createOrderDto.delivery,
      vendorCosts: totalVendorCost,
      promoCode: createOrderDto.promoCode,
      promoOfferPrice: createOrderDto.promoOfferPrice,
      subtotal: createOrderDto.subtotal,
      total: totalamount,
      products: enrichedProducts,
      deliveryamount: deliveryamount,
      statuses: OrderStatus,
      createdAt: new Date(),
      orderstatus: createOrderDto.OrderStatus,
    };



    const order = await this.OrderModel.create(newOrder);
    order.save();

    const result = await this.smsService.sendSMS({
      template: SEND_SMS_TEMPLATE.ORDER_CONFIRMATION,
      phone: user.phone.replace('+', ''),
      payload: {
        name: createOrderDto.name,
        code: order.orderId,
      },
    });


    return {
      message: '✅ Order created successfully',
      orderId: order.orderId,
    };
  }

  async findorderbynumber(phonedto: phoneDto) {
    const user = await this.UserModel.findOne({ phone: phonedto.phone })
    const allorder = await this.OrderModel.find({ user: user._id })

    return allorder;
  }

  async otpset(otpDTO: OTPdto) {
    const otp = RandomNumberString(4);
    await this.OrderModel.updateOne({ orderId: otpDTO.orderId }, { otpcode: otp });

    const result = await this.smsService.sendSMS({
      template: SEND_SMS_TEMPLATE.ORDER_DELIVERY_OTP,
      phone: otpDTO.phone.replace('+', ''),
      payload: {
        ORDERID: otpDTO.orderId,
        code: otp,
      },
    });


    return {
      success: true,
      message: 'OTP has been sent to your phone number',
      otp: otp,
      orderId: otpDTO.orderId,
      phone: otpDTO.phone,

    };
  }



  async OrderTracking(orderstatus: OrderStatusDto) {


    const order = await this.OrderModel.findOne({ orderId: orderstatus.orderId });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderstatus.orderId} not found`);
    }
    return {
      success: true,
      message: 'Order status updated successfully',
      order,
    };
  }

}
