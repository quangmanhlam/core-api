import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { ACTION_MODEL } from "../constants";
import { removeVietnameseTonesAndLowerCase } from "../utils";
import { IGetManyAction, IGetOneAction, IOptions } from "./types";

@Injectable()
export class ActionService {
    constructor(
      @InjectModel(ACTION_MODEL) private actionModel: Model<any>
    ) {
    }

    addSearchField(data: any) {
        if (data.name) {
            data.nameSearch = removeVietnameseTonesAndLowerCase(data.name);
        }
        return data;
    }

    /**
     * Get user by object id
     * @param id
     * @return {Promise}
     */
    async getById(id: string): Promise<any> {
        return await this.actionModel.findOne({ _id: id }).lean();
    }

    async getOne(data: IGetOneAction): Promise<any> {
        const { id, key } = data;
        let filter: any = { _id: id };
        if (key) filter.key = key;

        return await this.actionModel.findOne(filter).lean();
    }

    /**
     * Get list.
     * @param data
     * @param options
     * @return {any[]}
     */
    async paginate(data: IGetManyAction, options: IOptions = { offset: 0, limit: 10 }): Promise<any> {
        const { name, key, id, ids } = data;
        const filter: any = { };
        if (name) filter.nameSearch = { $regex: ".*" + removeVietnameseTonesAndLowerCase(name) + ".*" };
        if (key) filter.key = key;
        if (id) filter._id = id;
        if (ids && ids.length > 0) filter._id = { $in: ids };

        // @ts-ignore
        if (!options.sort) options.sort = { _id: -1 };

        // @ts-ignore
        return await this.actionModel.paginate(filter, options);
    }

    async find(data: IGetManyAction, fields?: any): Promise<any> {
        const { name, key, id, ids } = data;
        const filter: any = { };
        if (name) filter.nameSearch = { $regex: ".*" + removeVietnameseTonesAndLowerCase(name) + ".*" };
        if (key) filter.key = key;
        if (id) filter._id = id;
        if (ids && ids.length > 0) filter._id = { $in: ids };

        return await this.actionModel.find(filter, fields).lean();
    }

    /**
     * Create one.
     * @param data
     * @param createdBy
     * @return {any}
     */
    async createOne(data: any, createdBy?: string) {
        if (createdBy) data.createdBy = createdBy;
        data = this.addSearchField({ ...data });
        return await this.actionModel.create(data);
    }

    async updateOne(condition: IGetOneAction, data: any, updatedBy?: string) {
        // get condition
        const { id, key } = condition;

        if (updatedBy) data.updatedBy = updatedBy;
        data = this.addSearchField(data);

        const filter: any = { };
        if (id) filter._id = id;
        if (key) filter.key = key;

        return await this.actionModel.updateOne(filter, { $set: { ...data, updatedBy } });
    }

    async deleteOne(condition: IGetOneAction) {
        // get condition
        const { id, key } = condition;
        const filter: any = { };
        if (id) filter._id = id;
        if (key) filter.key = key;
        return await this.actionModel.deleteOne(filter);
    }


    async createMany(data: any) {
        for (let i = 0; i < data.length; i++) {
            data[i] = this.addSearchField(data[i]);
        }
        return await this.actionModel.insertMany(data);
    }

    async deleteManyByIds(ids: any) {
        const filter = { _id: { $in: ids } };
        return await this.actionModel.deleteMany(filter);
    }
}
