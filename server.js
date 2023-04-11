const path = require('path');
const fs = require('fs');
const https = require('https');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const session = require("express-session");

const options = {
    key: fs.readFileSync(path.join(__dirname + "/certificates/cert.key")),
    cert: fs.readFileSync(path.join(__dirname + "/certificates/cert.crt")),
}

dotenv.config({ path: './config/main.env' });

const routes = require('./routes/routes');


const app = express();
const port = process.env.PORT;
const https_port = process.env.HTTPS_PORT;

let userProfile;

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// SAML Strategy for passport -- single IDP
const strategy = new SamlStrategy({
    entryPoint: process.env.SSO_ENTRYPOINT,
    issuer: process.env.SSO_ISSUER,
    path: '/login/callback',
    callbackUrl: process.env.SSO_CALLBACKURL,
    cert: fs.readFileSync(path.join(__dirname + "/certificates/NodeJS_SAML_App.cer"), "utf-8"),
    logoutCallbackUrl: process.env.SSO_CALLBACKLOGOUTURL,
}, (profile, done) => {
    userProfile = profile;
    return done(null, {
        userProfile,
        nameID: profile['nameID'],
        email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        displayName: profile['http://schemas.microsoft.com/identity/claims/displayname'],
        firstName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
        lastName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
        userId: profile['http://schemas.microsoft.com/identity/claims/objectidentifier']
    });
});

passport.use(strategy);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'This is secret'
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));

app.use('/', routes);

app.get('/login', passport.authenticate('saml', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.post('/login/callback', passport.authenticate('saml', {
    failureRedirect: '/',
    failureFlash: true
}), (req, res) => {
    res.redirect('/');
});

/** the logout() function removes the req.user property and also clears the login session */
// app.post('/logout', (req, res) => {
//     req.logout((err) => {
//         if (err)
//             return next(err);

//         res.redirect('/');
//     })
// });

app.get('/logout', (req, res) => {
    strategy.logout(req, (err, request) => {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.redirect(request);
        }
    });

});

app.get('/logout/callback', (req, res, next) => {
    // req.session.destroy();
    req.logout((err) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
            return;
        }
    });
    res.redirect('/');
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

https.createServer(options, app).listen(https_port, () => {
    console.log(`Server is running on https://localhost:${https_port}`);
});


