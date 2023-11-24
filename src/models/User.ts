const mongoose = require('mongoose');
const { ObjectId, Schema } = mongoose;

const userSchema = new Schema(
  {
    id: Number,
    userName: String,
    password: String,
    email: String,
    provider: String,
    createAt: Date,
    fixedLocation: String,
    tag: Array,
    thirdPartyId: String,
    avatar: {
      type: ObjectId,
      ref: 'Media',
    },
  },
  { collection: 'users' }
);

userSchema.statics.findOrCreate = async function findOrCreate(profile) {
  var userObj = new this();
  const user = await this.findOne({ thirdPartyId: profile.id });
  if (!user) {
    userObj.userName = profile.displayName;
    userObj.thirdPartyId = profile.id;
    userObj.email = profile.email;
    userObj.provider = profile.provider;
    const newUser = await userObj.save();
    console.log('no user', newUser);
    return newUser;
  } else {
    // console.log('User is in the database!', user);
    return user;
  }
};

module.exports = mongoose.model('User', userSchema);
