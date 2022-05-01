import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    roleId: {type: String, default: null, index: true},
    name: {type: String, default: null, required: true},
    nameSearch: {type: String, default: null, index: true},
    photo: {type: String, default: null},
    email: {type: String, default: null, trim: true},
    phone: {type: String, default: null, index: true, trim: true},
    password: {type: String, default: null},

    status: {type: String, default: null, index: true},
    isRootAdmin: {type: Boolean, default: false},
    settings: {type: Map, default: null},

    isDeleted: {type: Boolean, default: false, index: true},
    createdBy: {type: String, default: null},
    updatedBy: {type: String, default: null},
    deletedBy: {type: String, default: null},
    deletedAt: {type: Date, default: null},
}, {
    timestamps: true,
    collection: 'users',
    autoIndex: true,
    autoCreate: true,
});

UserSchema.index({createdAt: -1});
