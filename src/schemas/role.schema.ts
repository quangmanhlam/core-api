import * as mongoose from 'mongoose';

const PermissionSchema = new mongoose.Schema({
    id: {type: String, required: true},
    actionIds: {type: Array, default: [], required: true},
}, {_id: false, timestamps: true});

export const RoleSchema = new mongoose.Schema({
    name: {type: String, required: true},
    nameSearch: {type: String, index: true, default: null},
    description: {type: String, default: null},
    permissions: [PermissionSchema],

    isDeleted: {type: Boolean, default: false, index: true},
    isArchived: {type: Boolean, default: false, index: true},
    createdBy: {type: String, default: null},
    updatedBy: {type: String, default: null},
    deletedBy: {type: String, default: null},
    deletedAt: {type: Date, default: null},
}, {
    timestamps: true,
    collection: 'roles',
    autoIndex: true,
    autoCreate: true,
});

RoleSchema.index({createdAt: -1});
