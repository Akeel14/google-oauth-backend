const User = require('../models/User');


const loginSuccessCallback = async (req, res) => {
    try {
        // Successful authentication, redirect to success screen.
        res.status(300).redirect(`${process.env.FRONTEND_URL}/list`);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const loginSuccess = async (req, res) => {
    try {
        //   const userInfo = {
        //     id: req.session.passport.user.id,
        //     displayName: req.session.passport.user.displayName,
        //     provider: req.session.passport.user.provider,
        //   };
        res.status(200).send('Twitter login success!');
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const error = async (req, res) => {
    try {
        res.status(500).send('Error logging in via Twitter..');
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

const signout = async (req, res) => {
    try {
        req.session.destroy(function (err) {
            console.log('session destroyed.');
        });
        res.status(300).redirect('/');
    } catch (err) {
        res.status(400).send({ message: 'Failed to sign out twitter user' });
    }
};

// function (token, tokenSecret, profile, done) {
// await User.findOrCreate({ twitterId: profile.id },
//     function (err, user) {
//         return done(err, user);
//     });
// }

const handleTwitterAuthentication = async function (token, tokenSecret, profile, done) {
    try {
        const user = await User.findOrCreate(profile);
        // const currentUser = await User.findOne({
        //     twitterId: profile.id_str
        // });
        // if (!currentUser) {
        //     const newUser = await new User({
        //         userName: profile._json.name,
        //         screenName: profile._json.screen_name,
        //         twitterId: profile.id_str,
        //         profileImageUrl: profile._json.profile_image_url,
        //         provider: profile.provider
        //     }).save();
        //     if (newUser) {
        //         done(null, newUser);
        //     }
        // }
        done(null, user);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

module.exports = { loginSuccessCallback, loginSuccess, error, signout, handleTwitterAuthentication }