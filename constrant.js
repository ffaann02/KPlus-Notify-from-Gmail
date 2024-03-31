require("dotenv");

const auth = {
    type: "OAuth2",
    user: process.env.USER_EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
};

const mailOptions = {
    from: process.env.USER_EMAIL,
    to: "Arun Kanojia<arun.kanoji@live.com>",
    subject: "Gmail API using Node JS",
};

module.exports = { 
    auth, 
    mailOptions 
};
