const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;

const downSchema = new Schema({
    id: Number,
    userId: {
        type: ObjectId,
        ref: "User"
    },
    eventId: {
        type: ObjectId,
        ref: "Event"
    }
},{ collection: 'downvotes' });

module.exports = mongoose.model('Downvote', downSchema)