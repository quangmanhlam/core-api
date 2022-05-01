import {Model} from "mongoose";
import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";

import {generateCodeWithPrefix, removeVietnameseTonesAndLowerCase} from "../utils";
import {USER_MODEL} from "../constants";
import {STATUS, USER_PREFIX_CODE} from "../modules/user/constants";
import {
    IConditionUpdateManyUser,
    IDataUpdateManyUser,
    IDeleteManyUser,
    IGetManyUser,
    IGetOneUser,
    IOptions
} from "./types";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(USER_MODEL) private userModel: Model<any>
    ) {
    }

    /**
     * Get user by email
     * @param email
     * @return {Promise}
     */
    async getByEmail(email: string): Promise<any> {
        const filter = { email, status: STATUS.ACTIVE, isDeleted: false };
        return await this.userModel.findOne(filter).lean();
    }

    /**
     * Get user by phone
     * @param phone
     * @return {Promise}
     */
    async getByPhone(phone: string): Promise<any> {
        const filter = { phone, status: STATUS.ACTIVE, isDeleted: false };
        return await this.userModel.findOne(filter).lean();
    }

    async getByUsername(username: string): Promise<any> {
        const filter = { username, status: STATUS.ACTIVE, isDeleted: false };
        return await this.userModel.findOne(filter).lean();
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
        return await this.userModel.findOne({ _id: id, isDeleted: false }).lean();
    }

    async getOne(data: IGetOneUser, fields?: any): Promise<any> {
        const {id, status, phone, email, createdBy} = data;
        let filter: any = {isDeleted: false};
        if (id) filter._id = id;
        if (phone) filter.phone = { $regex: ".*" + phone + ".*" };
        if (email) filter.email = email;
        if (status) filter.status = status;
        if (createdBy) filter.createdBy = createdBy;

        return await this.userModel.findOne(filter, fields).lean();
    }

    /**
     * Get list.
     * @param data
     * @param options
     * @return {any[]}
     */
    async paginate(data: IGetManyUser, options: IOptions = { offset: 0, limit: 10, select: null }): Promise<any> {
        const {name, phone, email, status, roleId, createdBy, isArchived} = data;
        const filter: any = {isDeleted: false, isArchived: false};
        if (name) filter.nameSearch = { $regex: ".*" + removeVietnameseTonesAndLowerCase(name) + ".*" };
        if (phone) filter.phone = { $regex: ".*" + phone + ".*" };
        if (email) filter.email = { $regex: ".*" + email + ".*" };
        if (roleId) filter.roleId = roleId;
        if (status) filter.status = status;
        if (createdBy) filter.createdBy = createdBy;
        if (isArchived === 'true') filter.isArchived = true;

        // @ts-ignore
        if (!options.sort) options.sort = { _id: -1 };

        // @ts-ignore
        return await this.userModel.paginate(filter, options);
    }

    /**
     * Create one.
     * @param data
     * @param createdBy
     * @return {any}
     */
    async createOne(data: any, createdBy?: string) {
        if (createdBy) data.createdBy = createdBy;
        data = this.addSearchField({ ...data, isRootAdmin: false });

        let user = await this.userModel.create(data);
        // update user code
        const userId = user._id.toString();
        const resultCode = await this.updateCodeById({id: userId}, user.incrementId);

        user.code = resultCode.code;
        return user;
    }

    async updateOne(condition: IGetOneUser, data: any, updatedBy?: string) {
        // get condition
        const {id, status, email, phone, createdBy, ignoreIsAdmin} = condition;

        if (updatedBy) data.updatedBy = updatedBy;
        data = this.addSearchField(data);

        const filter: any = { isDeleted: false };
        if (!ignoreIsAdmin) filter.isRootAdmin = false;
        if (id) filter._id = id;
        if (email) filter.email = email;
        if (phone) filter.phone = phone;
        if (status) filter.status = status;
        if (createdBy) filter.createdBy = createdBy;

        return await this.userModel.updateOne(filter, { $set: { ...data, updatedBy } });
    }

    async updateMany(condition: IConditionUpdateManyUser, data: IDataUpdateManyUser) {
        // get condition
        const {id, ids, createdBy} = condition;

        const filter: any = { isRootAdmin: false, isDeleted: false };
        if (id) filter._id = id;
        if (ids && ids.length > 0) filter._id = {$in: ids};
        if (createdBy) filter.createdBy = createdBy;
        const update = {$set: data};

        return await this.userModel.updateMany(filter, update);
    }

    async deleteOne(condition: IGetOneUser, deletedBy?: string) {
        // get condition
        const {id, status, email, phone, createdBy} = condition;

        const filter: any = { isRootAdmin: false, isDeleted: false };
        if (id) filter._id = id;
        if (email) filter.email = email;
        if (phone) filter.phone = phone;
        if (status) filter.status = status;
        if (createdBy) filter.createdBy = createdBy;

        const update: any = {
            $set: {
                isDeleted: true,
                status: STATUS.DELETED,
                deletedAt: new Date().toISOString()
            }
        };
        if (deletedBy) update.$set.deletedBy = deletedBy;

        return await this.userModel.updateOne(filter, update);
    }

    async deleteMany(condition: IDeleteManyUser, deletedBy?: string) {
        // get condition
        const {id, status, email, phone, ids, createdBy} = condition;

        const filter: any = { isRootAdmin: false, isDeleted: false };
        if (id) filter._id = id;
        if (email) filter.email = email;
        if (phone) filter.phone = phone;
        if (status) filter.status = status;
        if (createdBy) filter.createdBy = createdBy;
        if (ids && ids.length > 0) filter._id = {$in: ids};

        const update: any = {
            $set: {
                isDeleted: true,
                status: STATUS.DELETED,
                deletedAt: new Date().toISOString()
            }
        };
        if (deletedBy) update.$set.deletedBy = deletedBy;

        return await this.userModel.updateMany(filter, update);
    }

    async updateCodeById(condition: IGetOneUser, incrementId: number) {
        const data = {
            code: generateCodeWithPrefix(USER_PREFIX_CODE, incrementId)
        };
        await this.updateOne(condition, data);
        return data;
    }

    async createMany(data: any) {
        for (let i = 0; i < data.length; i++) {
            data[i] = this.addSearchField(data[i]);
        }
        return await this.userModel.insertMany(data);
    }

    async deleteManyByIds(ids: any) {
        const filter = { _id: { $in: ids } };
        return await this.userModel.deleteMany(filter);
    }
}
