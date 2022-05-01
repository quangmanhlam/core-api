import * as mongoose from 'mongoose';

export const SettingSchema = new mongoose.Schema({
    name: {type: String, required: true},
    key: {type: String, required: true, unique: true},
    value: {type: String, default: null},
    extraData: {type: Map, default: null},

    isDeleted: {type: Boolean, default: false, index: true},
    isArchived: {type: Boolean, default: false, index: true},
    createdBy: {type: String, default: null},
    updatedBy: {type: String, default: null},
    deletedBy: {type: String, default: null, index: true},
    deletedAt: {type: Date, default: null},
}, {
    timestamps: true,
    collection: 'settings',
    autoIndex: true,
    autoCreate: true,
});
SettingSchema.index({createdAt: -1});
