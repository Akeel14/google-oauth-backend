const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;

const reportSchema = new Schema({
    id: Number,
    type:{
        type: String,
        enum : ["A", "B", "C"],
        default: ''
    },  
    description: String,  
    eventId:{
        type: ObjectId,
        ref: "Event"
    },
    userId: {
        type: ObjectId,
        ref: "User"
    },
},{ collection: 'reports' });

module.exports = mongoose.model('Report', reportSchema)