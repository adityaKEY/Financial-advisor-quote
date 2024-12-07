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

    const { ptPptList, formInputs } = response.data;

    // Filter out duplicates based on PPTName and PTName
    const pptList = [
      ...new Map(
        ptPptList.map((item) => [
          item.PPTName,
          { key: item.PPTName, value: item.PPTValue },
        ])
      ).values(),
    ];
    const ptList = [
      ...new Map(
        ptPptList.map((item) => [
          item.PTName,
          { key: item.PTName, value: item.PTValue },
        ])
      ).values(),
    ];

    formInputs.forEach((input) => {
      if (input.fieldType === "List" && input.listItems.length === 0) {
        if (input.keywordName === "@PR_PPT") {
          input.listItems = pptList;
        } else if (input.keywordName === "@PR_PT") {
          input.listItems = ptList;
        }
      }
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
