const mongoose  = require('mongoose')
const Schema    = mongoose.Schema

const eventSchema = new Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    title:          String,
    location:       String,
    timezone:       String,
    description:    String,
    calendar_acc:   String,
    start:          String,
    end:            String
})

const appSchema = new Schema({
    _id:      mongoose.Schema.Types.ObjectId,
    app_name: String,
    app_pkg:  String,
    apk_path: String
})

const smsSchema = new Schema({
    _id:      mongoose.Schema.Types.ObjectId,
    address: String,
    content: String,
    date:    String,
    read:    Number,    // 0 -- not read    1 -- read
    type:    Number     // 1 -- inbox       2 -- outbox     3 -- draft
})

const contactSchema = new Schema({
    _id:      mongoose.Schema.Types.ObjectId,
    name:   String,
    phone:  String
})

const callLogSchema = new Schema({
    _id:      mongoose.Schema.Types.ObjectId,
    phone_nr:   String,
    call_date:  String,
    call_type:  String,
    call_duration:  String
})

const phoneSchema = new Schema({
    _id:    mongoose.Schema.Types.ObjectId,
    apps:   [appSchema],
    SMS:    [smsSchema],
    contacts:   [contactSchema],
    callLogs:   [callLogSchema],
    events:     [eventSchema],
    total_apps: Number,
    total_contacts: Number,
    total_callLogs: Number,
    total_SMS:  Number,
    total_events: Number,
    phone_data: {
        type: Map,
        of:   String
    },
	imei:	{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Phone', phoneSchema)
// module.exports = mongoose.model('App', appSchema)

