const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const movieSchema = new mongoose.Schema({
    title: String,
    year: Number
})
movieSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('Movie', movieSchema)
