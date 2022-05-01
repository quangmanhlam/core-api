import * as mongoose from 'mongoose';

export const ActionSchema = new mongoose.Schema({
    name: {type: String, required: true},
    nameSearch: {type: String, default: null, index: true},
    key: {type: String, required: true},
    url: {type: String, required: true},
    method: {type: String, required: true},

    isDeleted: {type: Boolean, default: false},
    isArchived: {type: Boolean, default: false},
    createdBy: {type: String, default: null},
    updatedBy: {type: String, default: null},
    deletedBy: {type: String, default: null},
    deletedAt: {type: Date, default: null},
}, {
    timestamps: true,
    collection: 'actions',
    autoIndex: true,
    autoCreate: true,
});

ActionSchema.index({createdAt: -1});
ActionSchema.index({isDeleted: -1});
