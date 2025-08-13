import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminModel } from 'src/models/admin.schema';
import { Order, OrderModel } from 'src/models/order.schema';
import { Payment, PaymentModel } from 'src/models/payment-schema';
import { User, UserModel } from 'src/models/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: AdminModel,
    @InjectModel(Order.name)
    private readonly orderModel: OrderModel,
    @InjectModel(Payment.name)
    private readonly paymentModel: PaymentModel,
    @InjectModel(User.name)
    private readonly userModel: UserModel,
  ) { }

  async getAdminCount() {
    const orders = await this.orderModel.find().exec();
    const totalorder = orders.length;
    const completeordertotal = orders.filter(order => order.orderstatus === 'Delivered').length;
    const totalamount = orders
      .filter(order => order.orderstatus === 'Delivered')
      .reduce((sum, order) => sum + order.total, 0);

    const Vendorcost = orders
      .filter(order => order.orderstatus === 'Delivered')
      .reduce((sum, order) => sum + order.vendorCosts, 0);
    const revenue = totalamount - Vendorcost;

    const totaluser = await this.userModel.countDocuments().exec();

    const totalpaymentamount = await this.paymentModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]).exec();

    console.log(totalpaymentamount[0]?.total)
    return {
      totalorder,
      completeordertotal,
      totalamount,
      Vendorcost,
      revenue,
      totaluser,
      totalpaymentamount: totalpaymentamount[0]?.total || 0
    };
  }

}



