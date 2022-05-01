import * as mongoose from 'mongoose';

export const MigrationSchema = new mongoose.Schema({
    collectionName: {type: String, default: null, unique: true},
}, {
    timestamps: true,
    collection: 'migrations',
    autoIndex: true,
    autoCreate: true,
});
