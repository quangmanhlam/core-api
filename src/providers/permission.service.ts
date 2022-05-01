import {Model} from "mongoose";
import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";

import {PERMISSION_MODEL} from "../constants";
import {removeVietnameseTonesAndLowerCase} from "../utils";
import {
    IConditionDeleteManyPermission,
    IConditionUpdateManyPermission,
    IDataUpdateManyPermission,
    IGetManyPermission,
    IGetOnePermission,
    IOptions
} from "./types";

@Injectable()
export class PermissionService {

    constructor(
        @InjectModel(PERMISSION_MODEL) private permissionModel: Model<any>
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
        return await this.permissionModel.findOne({_id: id}).lean();
    }

    async getOne(data: IGetOnePermission): Promise<any> {
        const {id, key} = data;
        let filter: any = {_id: id};
        if (key) filter.key = key;

        return await this.permissionModel.findOne(filter).lean();
    }

    /**
     * Get list clubs.
     * @param data
     * @param options
     * @return {any[]}
     */
    async paginate(data: IGetManyPermission, options: IOptions = {offset: 0, limit: 10}): Promise<any> {
        const {name, key, id, ids} = data;
        const filter: any = {};
        if (name) filter.nameSearch = {$regex: '.*' + removeVietnameseTonesAndLowerCase(name) + '.*'};
        if (key) filter.key = key;
        if (id) filter._id = id;
        if (ids && ids.length > 0) filter._id = { $in: ids };

        // @ts-ignore
        if (!options.sort) options.sort = { _id: -1 };

        // @ts-ignore
        return await this.permissionModel.paginate(filter, options);
    }

    async find(data: IGetManyPermission): Promise<any> {
        const {key, id, ids} = data;
        const filter: any = {};
        if (key) filter.key = key;
        if (id) filter._id = id;
        if (ids && ids.length > 0) filter._id = { $in: ids };

        return await this.permissionModel.find(filter).lean();
    }

    /**
     * Create one.
     * @param data
     * @param createdBy
     * @return {any}
     */
    async createOne(data: any, createdBy?: string) {
        if (createdBy) data.createdBy = createdBy;
        data = this.addSearchField(data);
        return await this.permissionModel.create(data);
    }

    async updateOne(condition: IGetOnePermission, data: any, updatedBy?: string) {
        // get condition
        const {id, key} = condition;

        if (updatedBy) data.updatedBy = updatedBy;
        data = this.addSearchField(data);

        const filter: any = {};
        if (id) filter._id = id;
        if (key) filter.key = key;

        return await this.permissionModel.updateOne(filter, {$set: {...data, updatedBy}});
    }

    async updateMany(condition: IConditionUpdateManyPermission, data: IDataUpdateManyPermission) {
        // get condition
        const {id, ids} = condition;
        const filter: any = {};
        if (id) filter._id = id;
        if (ids && ids.length > 0) filter._id = {$in: ids};
        const update = {$set: data};

        return await this.permissionModel.updateMany(filter, update);
    }

    async deleteOne(condition: IConditionDeleteManyPermission) {
        // get condition
        const {id, ids} = condition;

        const filter: any = {};
        if (id) filter._id = id;
        if (ids && ids.length > 0) filter._id = {$in: ids};

        return await this.permissionModel.deleteOne(filter);
    }

    async deleteMany(condition: IConditionDeleteManyPermission) {
        // get condition
        const {id, ids} = condition;
        const filter: any = {};
        if (id) filter._id = id;
        if (ids && ids.length > 0) filter._id = {$in: ids};
        return await this.permissionModel.deleteMany(filter);
    }

    async createMany(data: any) {
        for (let i = 0; i < data.length; i++) {
            data[i] = this.addSearchField(data[i]);
        }
        return await this.permissionModel.insertMany(data);
    }

    async deleteManyByIds(ids: any) {
        const filter = {_id: {$in: ids}};
        return await this.permissionModel.deleteMany(filter);
    }
}
