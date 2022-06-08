const mongoose = require("mongoose")
const Schema   = mongoose.Schema

const appSchema = new Schema({
    _id:      mongoose.Schema.Types.ObjectId,
    app_name: String,
    app_pkg:  String,
    apk_path: String
})

module.exports.appSchema = appSchema
module.exports = mongoose.model('App', appSchema)