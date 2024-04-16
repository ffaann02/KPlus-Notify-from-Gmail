const axios = require('axios');
const { createConfig } = require('./utils');
const nodemailer = require('nodemailer');
const CONSTANTS = require('./constrant.js');
const { google } = require('googleapis');
const { filterOnlyKPLUSmail, convertMailToJSON } = require('./kplus.js');

require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI,
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function getMails(req, res) {
    try{
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/threads?maxResults=100`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = createConfig(url, token);
        const response = await axios(config);
        res.json(response.data);
    }
    catch(error){
        console.log(error);
        res.send(error);
    }
}

async function getMailsDate(req, res) {
    
    try {
        const date = req.params.date;
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/threads?maxResults=100&q=after:${date} before:${nextDay.toISOString().split('T')[0]}`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = createConfig(url, token);
        const response = await axios(config);
        res.json(response.data);
    } catch(error) {
        console.log(error);
        res.send(error);
    }
}

async function getMailsDateKPLUS(req, res) {
    try {
        const date = req.params.date;
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/threads?maxResults=100&q=after:${date} before:${nextDay.toISOString().split('T')[0]}`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = createConfig(url, token);
        const response = await axios(config);
        const filteredData = await filterOnlyKPLUSmail(response.data);
        
        const ids = filteredData.map(email => email.id);
        const fetchedEmails = [];
        for (const id of ids) {
            const email = await readMailById(req.params.email, id, token); // Using readMail function
            const emailJSON = await convertMailToJSON(email); // Convert email to JSON
            fetchedEmails.push(emailJSON);
        }
        console.log(fetchedEmails);
        res.json(fetchedEmails);
    } catch(error) {
        console.log(error);
        res.send(error);
    }
}

async function readMailById(email, messageId, token) {
    try {
        const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages/${messageId}`;
        const config = createConfig(url, token);
        const response = await axios(config);
        const decodedData = Buffer.from(response.data.payload.body.data, 'base64').toString('utf-8');
        return decodedData;
    } catch(error) {
        console.log(error);
        return null;
    }
}


async function readMail(req, res) {
    try{
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/messages/${req.params.messageId}`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = createConfig(url, token);
        const response = await axios(config);
        const decodedData = Buffer.from(response.data.payload.body.data, 'base64').toString('utf-8');
        console.log(decodedData);
        let data = await response.data;
        res.json(data);
    }
    catch(error){
        console.log(error);
        res.send(error);
    }
}

module.exports = {
    getMails,
    getMailsDate,
    getMailsDateKPLUS,
    readMail,
};