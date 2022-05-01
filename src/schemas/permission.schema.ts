import * as mongoose from 'mongoose';

export const PermissionSchema = new mongoose.Schema({
    name: {type: String, required: true},
    nameSearch: {type: String, default: null, index: true},
    key: {type: String, required: true, unique: true},
    actionIds: [],

    isDeleted: {type: Boolean, default: false, index: true},
    isArchived: {type: Boolean, default: false, index: true},
    createdBy: {type: String, default: null},
    updatedBy: {type: String, default: null},
    deletedBy: {type: String, default: null},
    deletedAt: {type: Date, default: null},
}, {
    timestamps: true,
    collection: 'permissions',
    autoIndex: true,
    autoCreate: true,
});

PermissionSchema.index({createdAt: -1});
PermissionSchema.index({isDeleted: -1});
