const mongoose = require('mongoose')
const moment = require('moment')

const staffSchema = new mongoose.Schema({
    bankId: {
        type: mongoose.Types.ObjectId
    },
    branchId: {
        type: mongoose.Types.ObjectId
    },
    name: {
        type: String,
    },
    contactNo: {
        type: Number,
    },
    salary: {
        type: Number,
    },
    email: {
        type: String,
    },
    type: {
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

const Staff = mongoose.model('Staff', staffSchema)

module.exports = Staff;