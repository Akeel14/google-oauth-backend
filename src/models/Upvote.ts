const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;

const upvoteSchema = new Schema({
    id: Number,
    userId: {
        type: ObjectId,
        ref: "User"
    },
    eventId:{
        type: ObjectId,
        ref: "Event"
    }
},{ collection: 'upvotes' });

module.exports = mongoose.model('Upvote', upvoteSchema)