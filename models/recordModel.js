const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const recordSchema = new Schema({
    math: {
        type: Number,
        required: ["Score is required", true]
    },
    english: {
        type: Number,
        required: ["Score is required", true]
    },
    biology: {
        type: Number,
        required: ["Score is required", true]
    },
    createdBy: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});


const recordModel = mongoose.model('Record', recordSchema)

module.exports = recordModel