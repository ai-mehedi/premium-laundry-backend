import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminModel } from 'src/models/admin.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: AdminModel,
  ) {}

  async getAdminCount(): Promise<number> {
    return this.adminModel.countDocuments().exec();
  }
}
