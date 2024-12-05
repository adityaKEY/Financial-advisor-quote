const axios = require("axios");
require("dotenv").config();

const createULIPQuote = async (quoteData) => {
  try {
    return quoteData
    const data = {
      APIKey: process.env.APIKEY,
      formInputs: [
        { key: "@LI_FNAME", value: "Parag" },
        { key: "@LI_MNAME", value: "" },
        { key: "@LI_LNAME", value: "Ahuja" },
        { key: "@LI_ENTRY_AGE", value: "28" },
        { key: "@LI_DOB", value: "28 Jun 1996" },
        { key: "@LI_GENDER", value: "M" },
        { key: "@LI_STATE", value: "-1" },
        { key: "@PROPOSER_FNAME", value: "Parag" },
        { key: "@PROPOSER_MNAME", value: "" },
        { key: "@PROPOSER_LNAME", value: "Ahuja" },
        { key: "@PROPOSER_AGE", value: "28" },
        { key: "@PROPOSER_DOB", value: "28 Jun 1996" },
        { key: "@PROPOSER_GENDER", value: "M" },
        { key: "@AGE_PROOF", value: "-1" },
        { key: "@NSAP_FLAG", value: "0" },
        { key: "@COUNTRY", value: "-1" },
        { key: "@BANK_NAME", value: "-1" },
        { key: "@PROCESSING_HUB", value: "-1" },
        { key: "@ARE_YOU", value: "-1" },
        { key: "@OCCUPATION", value: "" },
        { key: "@SameProposer", value: "1" },
        { key: "@INPUT_MODE", value: "1" },
        { key: "@PR_ID", value: "4038" },
        { key: "@PR_PT", value: "30" },
        { key: "@PR_PPT", value: "10" },
        { key: "@DISPLAY_PR_PT", value: "30" },
        { key: "@DISPLAY_PR_PPT", value: "10" },
        { key: "@PR_ANNPREM", value: "" },
        { key: "@PR_MI", value: "0" },
        { key: "@PR_SA", value: "1125000" },
        { key: "@PR_SAMF", value: "0" },
        { key: "@PR_ModalPrem", value: "75000" },
        { key: "@LI_SMOKE", value: "0" },
        { key: "@TargetSTOFund", value: "0" },
      ],
      funds: [
        { fundId: 4001, fundPercent: 0 },
        { fundId: 4002, fundPercent: 0 },
        { fundId: 4003, fundPercent: 0 },
        { fundId: 4004, fundPercent: 0 },
        { fundId: 4005, fundPercent: 0 },
        { fundId: 4006, fundPercent: 0 },
        { fundId: 4007, fundPercent: 0 },
        { fundId: 4008, fundPercent: 0 },
        { fundId: 4009, fundPercent: 0 },
        { fundId: 4010, fundPercent: 0 },
        { fundId: 4011, fundPercent: 100 },
      ],
      riders: [],
      inputOptions: [],
      inputPartialWithdrawal: [],
    };
    const url = process.env.NVESTCREATEURL;
    const agent = new https.Agent({
      rejectUnauthorized: false, // Disable SSL certificate verification
    });
    const headers = {
      "Content-Type": "application/json",
    };
    // const response = await axios.post(url, config);
    const response = await axios.post(url, data, {
      httpsAgent: agent,
      headers: headers,
    });
    return response.data.QuotationId;
  } catch (error) {
    throw error;
  }
};

const createTERMQuote = async (quoteData) => {
  try {
    const quoteData = {
      APIKey: process.env.APIKEY,
      formInputs: [
        { key: "@LI_FNAME", value: "Parag" },
        { key: "@LI_MNAME", value: "" },
        { key: "@LI_LNAME", value: "Ahuja" },
        { key: "@LI_ENTRY_AGE", value: "28" },
        { key: "@LI_DOB", value: "08 Jan 1996" },
        { key: "@LI_GENDER", value: "M" },
        { key: "@LI_STATE", value: "-1" },
        { key: "@PROPOSER_FNAME", value: "Parag" },
        { key: "@PROPOSER_MNAME", value: "" },
        { key: "@PROPOSER_LNAME", value: "Ahuja" },
        { key: "@PROPOSER_AGE", value: "28" },
        { key: "@PROPOSER_DOB", value: "08 Jan 1996" },
        { key: "@PROPOSER_GENDER", value: "M" },
        { key: "@AGE_PROOF", value: "-1" },
        { key: "@NSAP_FLAG", value: "0" },
        { key: "@COUNTRY", value: "-1" },
        { key: "@BANK_NAME", value: "-1" },
        { key: "@PROCESSING_HUB", value: "-1" },
        { key: "@ARE_YOU", value: "-1" },
        { key: "@OCCUPATION", value: "" },
        { key: "@SameProposer", value: "1" },
        { key: "@INPUT_MODE", value: "1" },
        { key: "@PR_ID", value: "14045" },
        { key: "@PR_PT", value: "25" },
        { key: "@PR_PPT", value: "25" },
        { key: "@DISPLAY_PR_PT", value: "25" },
        { key: "@DISPLAY_PR_PPT", value: "25" },
        { key: "@PR_ANNPREM", value: "" },
        { key: "@PR_MI", value: "0" },
        { key: "@PR_SA", value: "5000000" },
        { key: "@PR_SAMF", value: "0" },
        { key: "@PR_ModalPrem", value: "" },
        { key: "@IS_STAFF", value: "0" },
        { key: "@LI_SMOKE", value: "0" },
        { key: "@PR_CHANNEL", value: "6" },
        { key: "@TargetSTOFund", value: "0" },
        { key: "@Preferred", value: "0" },
        { key: "@PR_OPTION_1", value: "2" },
        { key: "@OPTION_VALUE_1", value: "" },
      ],
      funds: [],
      riders: [],
      inputOptions: [],
      inputPartialWithdrawal: [],
    };
    const url = process.env.NVESTCREATEURL;
    const agent = new https.Agent({
      rejectUnauthorized: false, // Disable SSL certificate verification
    });
    const headers = {
      "Content-Type": "application/json",
    };
    // const response = await axios.post(url, config);
    const response = await axios.post(url, data, {
      httpsAgent: agent,
      headers: headers,
    });
    return response.data.QuotationId;
  } catch (error) {
    throw error;
  }
};

const createQuote = async (quoteData) => {

}

module.exports = {
  createULIPQuote,
  createTERMQuote,
  createQuote
};
