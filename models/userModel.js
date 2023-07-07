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
    token: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});


const userModel = mongoose.model('user', userSchema);

module.exports = userModel