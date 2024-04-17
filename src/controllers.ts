import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { createConfig, ConfigType } from './utils';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { filterOnlyKPLUSmail, convertMailToJSON } from './kplus';

import dotenv from 'dotenv';
dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID!,
  process.env.CLIENT_SECRET!,
  process.env.REDIRECT_URI!
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN! });

async function getMails(req: any, res: any): Promise<void> {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/threads?maxResults=100`;
    const { token } = await oAuth2Client.getAccessToken();
    const config: AxiosRequestConfig = createConfig(url, token);
    const response: AxiosResponse = await axios(config);
    res.json(response.data);
  } catch(error) {
    console.log(error);
    res.send(error);
  }
}

async function getMailsDate(req: any, res: any): Promise<void> {
  try {
    const date: string = req.params.date;
    const nextDay: Date = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/threads?maxResults=100&q=after:${date} before:${nextDay.toISOString().split('T')[0]}`;
    const { token } = await oAuth2Client.getAccessToken();
    const config: AxiosRequestConfig = createConfig(url, token);
    const response: AxiosResponse = await axios(config);
    res.json(response.data);
  } catch(error) {
    console.log(error);
    res.send(error);
  }
}

async function getMailsDateKPLUS(req: any, res: any): Promise<void> {
  try {
    const date: string = req.params.date;
    const nextDay: Date = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/threads?maxResults=100&q=after:${date} before:${nextDay.toISOString().split('T')[0]}`;
    const { token } = await oAuth2Client.getAccessToken();
    const config: AxiosRequestConfig = createConfig(url, token);
    const response: AxiosResponse = await axios(config);
    const filteredData = await filterOnlyKPLUSmail(response.data);
    const ids: string[] = filteredData.map((email: any) => email.id);
    const fetchedEmails: any[] = [];
    for (const id of ids) {
      const email: string | null = await readMailById(req.params.email, id, token); // Using readMail function
      if (email) {
        const emailJSON = await convertMailToJSON(email); // Convert email to JSON
        fetchedEmails.push(emailJSON);
      }
    }
    console.log(fetchedEmails);
    res.json(fetchedEmails);
  } catch(error) {
    console.log(error);
    res.send(error);
  }
}

async function readMailById(email: string, messageId: string, token: string): Promise<string | null> {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${email}/messages/${messageId}`;
    const config: AxiosRequestConfig = createConfig(url, token);
    const response: AxiosResponse = await axios(config);
    const decodedData: string = Buffer.from(response.data.payload.body.data, 'base64').toString('utf-8');
    return decodedData;
  } catch(error) {
    console.log(error);
    return null;
  }
}

async function readMail(req: any, res: any): Promise<void> {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/messages/${req.params.messageId}`;
    const { token } = await oAuth2Client.getAccessToken();
    const config: AxiosRequestConfig = createConfig(url, token);
    const response: AxiosResponse = await axios(config);
    const decodedData: string = Buffer.from(response.data.payload.body.data, 'base64').toString('utf-8');
    console.log(decodedData);
    let data = await response.data;
    res.json(data);
  } catch(error) {
    console.log(error);
    res.send(error);
  }
}

export {
  getMails,
  getMailsDate,
  getMailsDateKPLUS,
  readMail,
};
