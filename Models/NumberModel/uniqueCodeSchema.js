const mongoose = require('mongoose')

const uniqueCodeSchema = new mongoose.Schema({
    number: {
        type: Number,
    }
})

const Numbers = mongoose.model('Numbers',uniqueCodeSchema)

module.exports = Numbers;