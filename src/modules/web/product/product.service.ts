import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { I18nService } from 'nestjs-i18n';
import { Itemtype, ItemtypeModel } from 'src/models/itemtype-schema';
import {
  Product,
  ProductModel,
} from 'src/models/product-schema';

@Injectable()
export class Productervice {
  constructor(
    @InjectModel(Product.name)
    private readonly ProductModel: ProductModel,
    @InjectModel(Itemtype.name)
    private readonly ItemtypeModel: ItemtypeModel,
    private readonly i18n: I18nService,
  ) { }


  async findproductBytype() {
    const itemtypes = await this.ItemtypeModel.aggregate([
      {
        $lookup: {
          from: "products", // must match Mongo collection name
          let: { itemtypeId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$itemtypeID", "$$itemtypeId"] },
                    { $eq: ["$isActive", true] } // filter active products
                  ]
                }
              }
            }
          ],
          as: "products"
        }
      }
    ]);

    console.log(itemtypes);

    return { itemtypes };
  }


  async findAll() {
    return await this.ProductModel.find({
      isActive: true,
    })
      .populate('serviceId')
      .populate('itemtypeID')
      .select('-__v -isDeleted -deletedAt')
      .lean();
  }
}
