const axios = require("axios");
const https = require("https");
require("dotenv").config();

const createQuote = async (quoteData) => {
  try {
    quoteData["APIKey"] = process.env.APIKEY;
    const url = process.env.NVESTCREATEURL;
    const agent = new https.Agent({
      rejectUnauthorized: false, // Disable SSL certificate verification
    });
    const headers = {
      "Content-Type": "application/json",
    };
    // const response = await axios.post(url, config);
    const response = await axios.post(url, quoteData, {
      httpsAgent: agent,
      headers: headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getQuote = async (quoteData) => {
  try {
    quoteData["APIKey"] = process.env.APIKEY;
    const url = process.env.NVESTGETURL;
    const agent = new https.Agent({
      rejectUnauthorized: false, // Disable SSL certificate verification
    });
    const headers = {
      "Content-Type": "application/json",
    };
    // const response = await axios.post(url, config);
    const response = await axios.post(url, quoteData, {
      httpsAgent: agent,
      headers: headers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getFields = async (quoteData) => {
  try {
    const url = process.env.NVESTFIELDSURL;
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const response = await axios.get(url, {
      params: quoteData,
      httpsAgent: agent,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createQuote,
  getQuote,
  getFields,
};
