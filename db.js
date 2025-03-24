const mongoose = require("mongoose")

const Url = process.env.MONGO_URL;
const mongoURL = Url

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('connected', () => {
    console.log("Connected to Server")
})
db.on('disconnected', () => {
    console.log('console is Disconnected')
})

db.on('error', (error) => {
    console.log('console is Error', error)
})

module.exports = db;