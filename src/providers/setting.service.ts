import {Model} from "mongoose";
import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";

import {SETTING_MODEL} from "../constants";
import {removeVietnameseTonesAndLowerCase} from "../utils";
import {IGetManyRole, IGetOneRole, IOptions} from "./types";

@Injectable()
export class SettingService {

    constructor(
        @InjectModel(SETTING_MODEL) private settingModel: Model<any>,
    ) {
    }

    /**
     * Get user by object id
     * @param id
     * @return {Promise}
     */
    async getById(id: string): Promise<any> {
        return await this.settingModel.findOne({_id: id, isDeleted: false}).lean();
    }

    async getByKey(key: string): Promise<any> {
        return await this.settingModel.findOne({key}).lean();
    }

    async getOne(data: IGetOneRole): Promise<any> {
        const {id} = data;
        let filter: any = {_id: id, isDeleted: false};

        return await this.settingModel.findOne(filter).lean();
    }

    /**
     * Get list.
     * @param data
     * @param options
     * @return {any[]}
     */
    async paginate(data: IGetManyRole, options: IOptions = {offset: 0, limit: 10}): Promise<any> {
        const {name, id, ids} = data;
        const filter: any = {isDeleted: false};
        if (name) filter.nameSearch = {$regex: '.*' + removeVietnameseTonesAndLowerCase(name) + '.*'};
        if (id) filter._id = id;
        if (ids && ids.length > 0) filter._id = {$in: ids};

        // @ts-ignore
        if (!options.sort) options.sort = {_id: -1};

        // @ts-ignore
        return await this.settingModel.paginate(filter, options);
    }

    /**
     * Create one.
     * @param data
     * @param createdBy
     * @return {any}
     */
    async createOne(data: any, createdBy?: string) {
        if (createdBy) data.createdBy = createdBy;
        data = {...data};
        return await this.settingModel.create(data);
    }

    async updateOne(condition: IGetOneRole, data: any, updatedBy?: string) {
        // get condition
        const {id} = condition;

        if (updatedBy) data.updatedBy = updatedBy;

        const filter: any = {isDeleted: false};
        if (id) filter._id = id;

        return await this.settingModel.updateOne(filter, {$set: {...data, updatedBy}});
    }

    async deleteOne(condition: IGetOneRole, deletedBy?: string) {
        // get condition
        const {id} = condition;

        const filter: any = {isDeleted: false};
        if (id) filter._id = id;

        const update: any = {
            $set: {
                isDeleted: true,
                deletedAt: new Date().toISOString(),
            }
        };
        if (deletedBy) update.$set.deletedBy = deletedBy;

        return await this.settingModel.updateOne(filter, update);
    }

    async createMany(data: any) {
        return await this.settingModel.insertMany(data);
    }

    async deleteManyByIds(ids: any) {
        const filter = {_id: {$in: ids}};
        return await this.settingModel.deleteMany(filter);
    }
}
