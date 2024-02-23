const passport = require('passport');
const OpenIDConnectStrategy = require('passport-openidconnect');
const axios = require('axios');
const logger = require('log4js').getLogger("default");
const userData = require('./userData');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

axios.get(process.env.OIDC_ISSUER + "/.well-known/openid-configuration").then((res) => {
    if (res.status == 200) {
        
        passport.use(new OpenIDConnectStrategy({
            issuer: res.data.issuer,
            authorizationURL: res.data.authorization_endpoint,
            tokenURL: res.data.token_endpoint,
            userInfoURL: res.data.userinfo_endpoint,
            clientID: process.env.OIDC_CLIENT_ID,
            clientSecret: process.env.OIDC_CLIENT_SECRET,
            callbackURL: process.env.APP_URL + "/auth/oidc/callback",
            scope: ["profile", "groups"]
        }, async (issuer, uiprofile, idprofile, ctx, idtoken, acctoken, retoken, params, cb) => {
            if (!uiprofile._json.groups) {
                uiprofile._json.groups = [];
            }
            await userData.updateUserData(uiprofile);
            return cb(null, {
                userId: uiprofile.id,
                username: uiprofile.username,
                name: uiprofile.displayName,
                groups: uiprofile._json.groups,
                permissions: await userData.getPermissions(uiprofile)
            });
        }));

    } else {
        logger.error("Unable to configure OpenIdConnect");
    }
}).catch((err) => {
    logger.error(err);
});