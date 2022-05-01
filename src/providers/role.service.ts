import {Model} from "mongoose";
import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";

import {ROLE_MODEL} from "../constants";
import {removeVietnameseTonesAndLowerCase} from "../utils";
import {
    IConditionDeleteManyRole,
    IConditionUpdateManyRole,
    IDataUpdateManyRole,
    IGetManyRole,
    IGetOneRole,
    IOptions
} from "./types";

@Injectable()
export class RoleService {

    constructor(
        @InjectModel(ROLE_MODEL) private roleModel: Model<any>,
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
        return await this.roleModel.findOne({_id: id, isDeleted: false}).lean();
    }

    async getOne(data: IGetOneRole): Promise<any> {
        const {id, createdBy} = data;
        let filter: any = {_id: id, isDeleted: false};
        if (createdBy) filter.createdBy = createdBy;

        return await this.roleModel.findOne(filter).lean();
    }

    /**
     * Get list.
     * @param data
     * @param options
     * @return {any[]}
     */
    async paginate(data: IGetManyRole, options: IOptions = {offset: 0, limit: 10}): Promise<any> {
        const {name, id, ids, createdBy, isArchived} = data;
        const filter: any = {isDeleted: false, isArchived: false};
        if (name) filter.nameSearch = {$regex: '.*' + removeVietnameseTonesAndLowerCase(name) + '.*'};
        if (id) filter._id = id;
        if (createdBy) filter.createdBy = createdBy;
        if (ids && ids.length > 0) filter._id = {$in: ids};
        if (isArchived === 'true') filter.isArchived = true;

        // @ts-ignore
        if (!options.sort) options.sort = { _id: -1 };

        // @ts-ignore
        return await this.roleModel.paginate(filter, options);
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
        return await this.roleModel.create(data);
    }

    async updateOne(condition: IGetOneRole, data: any, updatedBy?: string) {
        // get condition
        const {id, createdBy} = condition;

        if (updatedBy) data.updatedBy = updatedBy;
        data = this.addSearchField(data);

        const filter: any = {isDeleted: false};
        if (id) filter._id = id;
        if (createdBy) filter.createdBy = createdBy;

        return await this.roleModel.updateOne(filter, {$set: {...data, updatedBy}});
    }

    async updateMany(condition: IConditionUpdateManyRole, data: IDataUpdateManyRole): Promise<any> {
        // get condition
        const {id, ids, createdBy} = condition;
        const filter: any = {isDeleted: false};
        if (id) filter._id = id;
        if (createdBy) filter.createdBy = createdBy;
        if (ids && ids.length > 0) filter._id = {$in: ids};

        return await this.roleModel.updateMany(filter, {$set: data});
    }

    async deleteOne(condition: IGetOneRole, deletedBy?: string) {
        // get condition
        const {id, createdBy} = condition;

        const filter: any = {isDeleted: false};
        if (id) filter._id = id;
        if (createdBy) filter.createdBy = createdBy;

        const update: any = {
            $set: {
                isDeleted: true,
                deletedAt: new Date().toISOString(),
            }
        };
        if (deletedBy) update.$set.deletedBy = deletedBy;

        return await this.roleModel.updateOne(filter, update);
    }

    async deleteMany(condition: IConditionDeleteManyRole, deletedBy?: string) {
        // get condition
        const {id, ids, createdBy} = condition;

        const filter: any = {isDeleted: false};
        if (id) filter._id = id;
        if (createdBy) filter.createdBy = createdBy;
        if (ids && ids.length > 0) filter._id = {$in: ids};

        const update: any = {
            $set: {
                isDeleted: true,
                deletedAt: new Date().toISOString(),
            }
        };
        if (deletedBy) update.$set.deletedBy = deletedBy;

        return await this.roleModel.updateOne(filter, update);
    }

    async createMany(data: any) {
        for (let i = 0; i < data.length; i++) {
            data[i] = this.addSearchField(data[i]);
        }
        return await this.roleModel.insertMany(data);
    }

    async deleteManyByIds(ids: any) {
        const filter = {_id: {$in: ids}};
        return await this.roleModel.deleteMany(filter);
    }
}
