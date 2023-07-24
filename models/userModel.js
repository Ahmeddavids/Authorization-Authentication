const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true['Username is required'],
        unique: true
    },
    email: {
        type: String,
        required: true['Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: true['Password is required'],
    },
    records: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Record"
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
    isSuperAdmin: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});


const userModel = mongoose.model('Users', userSchema);

module.exports = userModel