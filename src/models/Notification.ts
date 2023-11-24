const mongoose = require('mongoose');
const { Schema, ObjectId} = mongoose;

const notificationSchema = new Schema({
  id: Number,
  text: String,
  mediaJson: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Media' 
  }]
},{ collection: 'notifications' });

module.exports = mongoose.model('Notifications', notificationSchema)