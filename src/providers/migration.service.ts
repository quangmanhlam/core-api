import {Model} from "mongoose";
import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";

import {MIGRATION_MODEL} from "../constants";

@Injectable()
export class MigrationService {
    constructor(
        @InjectModel(MIGRATION_MODEL) private migrationModel: Model<any>
    ) {
    }

    /**
     * Get user by object id
     * @param id
     * @return {Promise}
     */
    async getById(id: string): Promise<any> {
        return await this.migrationModel.findOne({_id: id, isDeleted: false}).lean();
    }

    /**
     * Get by collectionName
     * @param collectionName
     * @return {Promise}
     */
    async getByName(collectionName: string): Promise<any> {
        return await this.migrationModel.findOne({collectionName}).lean();
    }

    async insertOrUpdate(data: any) {
        return await this.migrationModel.updateOne(data, data, {upsert: true});
    }

    /**
     * Update data to deleted. Set date and user call delete.
     * @param {string} collectionName
     */
    async deleteOne(collectionName: string) {
        return await this.migrationModel.deleteOne({collectionName});
    }

    async getOne(data: any): Promise<any> {
        const {id, name} = data;
        let filter: any = {};
        if (id) filter.id = id;
        if (name) filter.name = name;

        return await this.migrationModel.findOne(filter).lean();
    }

    async createMany(data: any) {
        return await this.migrationModel.insertMany(data);
    }

    async deleteManyByIds(ids: any) {
        const filter = {_id: {$in: ids}};
        return await this.migrationModel.deleteMany(filter);
    }
}
