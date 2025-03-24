const mongoose = require('mongoose')
const moment = require('moment')

const bankSchema = new mongoose.Schema({
    bankName: {
        type: String,
    },
    shareName:{
        type: String,
    },
    sharePrice:{
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

const Bank = mongoose.model('Bank',bankSchema)

module.exports = Bank;