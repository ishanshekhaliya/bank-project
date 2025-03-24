const mongoose = require('mongoose')
const moment = require('moment')

const userSchema = new mongoose.Schema({
    bankId: {
        type: mongoose.Types.ObjectId
    },
    branchId: {
        type: mongoose.Types.ObjectId
    },
    customerUniqueCode: {
        type: String,
    },
    name: {
        type: String,
    },
    contactNo: {
        type: Number,
    },
    accountNo: {
        type: Number,
    },
    email: {
        type: String,
    },
    isCreaditCard: {
        type: Boolean,
    },
    isDebitCard: {
        type: Boolean,
    },
    // totalBalance: {
    //     type: Number,
    // },
    accountType: {
        type: Number,
    },
    createdAt: {
        type: String,
        default: moment().format()
    },
    updatedAt: {
        type: String,
        default: moment().format()
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User;