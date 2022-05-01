import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { IGetOneUserResetPass } from "./types";

import { USER_RESET_PASS_MODEL } from "../constants";

@Injectable()
export class UserResetPassService {
    constructor(
      @InjectModel(USER_RESET_PASS_MODEL) private userResetPassModel: Model<any>
    ) {
    }

    /**
     * Get one by object id
     * @param id
     * @return {Promise}
     */
    async getById(id: string): Promise<any> {
        return await this.userResetPassModel.findOne({ _id: id }).lean();
    }

    async getOne(data: IGetOneUserResetPass, fields?: any): Promise<any> {
        const { id, userId, verifyCode, isExpired, status } = data;
        let filter: any = { };
        if (id) filter._id = id;
        if (userId) filter.userId = userId;
        if (status) filter.status = status;
        if (verifyCode) filter.verifyCode = verifyCode;
        if (isExpired === false) {
            filter.expiredAt = {$gte: new Date().toISOString()}
        }

        return await this.userResetPassModel.findOne(filter, fields).lean();
    }

    /**
     * Create one.
     * @param data
     * @param createdBy
     * @return {any}
     */
    async createOne(data: any, createdBy?: string) {
        if (createdBy) data.createdBy = createdBy;
        return await this.userResetPassModel.create(data);
    }

    async updateOne(condition: IGetOneUserResetPass, data: any) {
        // get condition
        const { id, userId } = condition;

        const filter: any = { };
        if (id) filter._id = id;
        if (userId) filter.userId = userId;

        return await this.userResetPassModel.updateOne(filter, { $set: data });
    }
}
