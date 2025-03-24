const mongoose = require('mongoose')
const moment = require('moment')

const branchSckema = new mongoose.Schema({
    bankId: {
        type: mongoose.Types.ObjectId
    },
    branchName: {
        type: String,
    },
    IFSCCode: {
        type: String,
    },
    address: {
        type: String,
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

const Branch = mongoose.model('Branch', branchSckema)

module.exports = Branch;