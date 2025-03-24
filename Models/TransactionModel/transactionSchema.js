const mongoose = require('mongoose')
const moment = require('moment')

const transactionSchema = new mongoose.Schema({
    accountNo:{
        type: Number,
    },
    type:{
        type: Number,
    },
    amount:{
        type: Number,
    },
    transactionDate: {
        type: String,
        default: moment().format()
    },
})

const Transaction = mongoose.model('Transaction',transactionSchema)

module.exports = Transaction;