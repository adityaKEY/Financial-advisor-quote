const { responseFormatter, statusCodes, generateId } = require("../utils");
const { event, quote, lead } = require("../db");
const { generateUniqueString } = require("../utils/generateId");
const axios = require("axios");
const https = require("https");
require("dotenv").config();
const moment = require("moment/moment");

exports.getMetaData = async (request, reply) => {
  try {
    const { metaMasters } = request.body;
    let addOnRider;
    if (metaMasters.includes("7b7bb29b0c94475b8949770af6bcac52")) {
      addOnRider = await quote.getAddOnRider();
    }
    const metaData = await quote.getMetaData(metaMasters); // Getting meta data from DB & maping keys

    if (metaData.length > 0) {
      await event.insertEventTransaction(request.isValid);
      const groupedData = metaData.reduce((acc, item) => {
        if (!acc[item.meta_master_name]) {
          acc[item.meta_master_name] = [];
        }
        acc[item.meta_master_name].push(item);
        return acc;
      }, {});
      groupedData["Add_On_Riders"] = addOnRider;
      return reply
        .status(statusCodes.OK)
        .send(
          responseFormatter(
            statusCodes.OK,
            "Meta Data retrieved successfully",
            groupedData
          )
        );
    } else {
      return reply
        .status(statusCodes.NO_CONTENT)
        .send(responseFormatter(statusCodes.NO_CONTENT, "Data not found"));
    }
  } catch (error) {
    return reply
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .send(
        responseFormatter(
          statusCodes.INTERNAL_SERVER_ERROR,
          "Internal server error occurred",
          { error: error.message }
        )
      );
  }
};

exports.getLeadInfo = async (request, reply) => {
  try {
    const { idlead } = request.body;
    const identity = request.isValid.identity;
    const leadInfo = await lead.getLeadInfo(idlead, identity);
    if (leadInfo.length) {
      await event.insertEventTransaction(request.isValid);
      return reply
        .status(statusCodes.OK)
        .send(
          responseFormatter(
            statusCodes.OK,
            "Fetched Lead Info Successfully",
            leadInfo[0]
          )
        );
    } else {
      return reply
        .status(statusCodes.OK)
        .send(responseFormatter(statusCodes.OK, "Lead Info Not Found"));
    }
  } catch (error) {
    return reply
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .send(
        responseFormatter(
          statusCodes.INTERNAL_SERVER_ERROR,
          "Internal server error occurred",
          { error: error.message }
        )
      );
  }
};

exports.createQuote = async (request, reply) => {
  try {
    const reqBody = {
      quote_identity: generateId.generateUniqueString(),
      quick_quote_id: generateId.generateQuickQuiteId(),
      dob: moment(request.body.dob, "DD/MM/YYYY").format("YYYY/MM/DD"),
      product_name: request.body.product_name,
      leadid: request.body.leadid,
      nationality: request.body.nationality,
      residential_status: request.body.residential_status,
      smoker: request.body.smoker,
      occupation: request.body.occupation,
      educational_background: request.body.educational_background,
      annual_income: request.body.annual_income,
      coverage_amount: request.body.coverage_amount,
      cover_till_age: request.body.cover_till_age,
      premium_payment_term: request.body.premium_payment_term,
      payment_type: request.body.payment_type,
      base_premium: request.body.base_premium,
      add_on_rider_amt: request.body.add_on_rider_amt,
      total_premium: request.body.total_premium,
    };

    const entityIdentity = await quote.getEntityIdentity(reqBody.leadid);
    await quote.updateEntityDobByIdentity(entityIdentity, reqBody.dob);
    const quoteRes = await quote.createQuote(reqBody);
    if (quoteRes.length) {
      await event.insertEventTransaction(request.isValid);
      return reply.status(statusCodes.OK).send(
        responseFormatter(statusCodes.OK, "Quote created successfully", {
          quick_quote_id: quoteRes[0].quick_quote_id,
        })
      );
    } else {
      return reply
        .status(statusCodes.OK)
        .send(responseFormatter(statusCodes.OK, "Quote did not created"));
    }
  } catch (error) {
    return reply
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .send(
        responseFormatter(
          statusCodes.INTERNAL_SERVER_ERROR,
          "Internal server error occurred",
          { error: error.message }
        )
      );
  }
};

exports.getAddOnPremium = async (request, reply) => {
  try {
    // Retrieve Add-On Riders and Meta Data
    const addOnRider = await quote.getAddOnRider();
    const metaData = await quote.getMetaData([
      "f600b9faf4934b25af40d33c938c30b7",
    ]);

    // Group the meta data by 'meta_master_name'
    const groupedData = metaData.reduce((acc, item) => {
      if (!acc[item.meta_master_name]) {
        acc[item.meta_master_name] = [];
      }
      acc[item.meta_master_name].push(item);
      return acc;
    }, {});

    // Extract premium-related request data
    const premiumRequest = request.body;
    const quoteArray = [
      premiumRequest.smoker,
      premiumRequest.premium_payment_term,
      premiumRequest.policy_term,
      premiumRequest.payment_type,
    ];
    const premiumRawData = await quote.getPremiumRawData(quoteArray);
    // Calculate gender
    const gender = request.body.gender ? request.body.gender.toLowerCase() : "";
    let result;
    if (gender === "male") {
      result = "M";
    } else if (gender === "female") {
      result = "F";
    } else {
      result = "T";
    }
    const dob = request.body.dob; // "17/11/1999"
    const [day, month, year] = dob.split("/"); // Destructure the day, month, and year

    // Create a valid Date object
    const birthDate = new Date(year, month - 1, day); // month is zero-indexed

    // Calculate age
    const age = new Date().getFullYear() - birthDate.getFullYear();
    const ageAtDate =
      new Date().getMonth() < birthDate.getMonth() ||
      (new Date().getMonth() === birthDate.getMonth() &&
        new Date().getDate() < birthDate.getDate())
        ? age - 1
        : age;

    // Function to convert coverage amounts to numeric values
    const convertToNumeric = (coverageString) => {
      if (coverageString.includes("Cr")) {
        return parseInt(coverageString.replace(" Cr", "")) * 10000000; // 1 Cr = 10 million
      } else if (coverageString.includes("Lakhs")) {
        return parseInt(coverageString.replace(" Lakhs", "")) * 100000; // 1 Lakh = 100 thousand
      }
      return 0;
    };

    // Prepare data for the axios POST request
    const data = addOnRider.map((item) => {
      return {
        age: ageAtDate,
        ppt: premiumRawData.Premium_Payment_Term,
        gender: result,
        product_term: premiumRawData.Policy_Term,
        tobacco: premiumRawData.Smoker,
        product_Name: item.product_name.replace(/\s+/g, "_"), // Replace spaces with underscores
      };
    });

    const url = process.env.PREMIUM_URL;
    const agent = new https.Agent({
      rejectUnauthorized: false, // Disable SSL certificate verification
    });

    // Get premium rates from the external API
    const premiumRate = await axios.post(url, data, { httpsAgent: agent });
    let premium = premiumRate.data.results;

    // Check if the premium is null and filter them out
    premium = premium.filter((item) => item.premium !== null);
    // Map through each addOnRider and add the coverage amount and premium details
    // Map through each addOnRider and add the coverage amount and premium details
    const resultData = addOnRider
      .map((item) => {
        // Extract the coverage amounts and filter out the ones with premium 0
        const coverageAmounts = groupedData.Coverage_Amount.map((coverage) => {
          const amountNumeric = convertToNumeric(coverage.meta_data_name);
          // Get the corresponding premium rate for each coverage amount
          const premiumData = premium.find(
            (premiumItem) =>
              premiumItem.product_Name.replace(/\s+/g, "_") ===
              item.product_name.replace(/\s+/g, "_")
          );

          // If premium is found, calculate the premium
          let calculatedPremium = 0;
          if (premiumData) {
            const premiumAmount = premiumData.premium;
            const premiumYearly = (premiumAmount / 1000) * amountNumeric;
            // Calculate the premium (adjusted for payment type)
            switch (premiumRawData.Payment_Type.toLowerCase()) {
              case "monthly":
                calculatedPremium = premiumYearly / 12;
                break;
              case "quarterly":
                calculatedPremium = premiumYearly / 4;
                break;
              case "half-yearly":
                calculatedPremium = premiumYearly / 2;
                break;
              case "annual":
                calculatedPremium = premiumYearly; // Annual premium is the yearly premium
                break;
              default:
                return reply.status(400).send({
                  error:
                    "Invalid payment frequency. Please specify 'Monthly', 'Quarterly', 'Half-Yearly', or 'Annual'.",
                });
            }
          }

          // Return the coverage amount and calculated premium only if premium is > 0
          if (calculatedPremium > 0) {
            return {
              amount: coverage.meta_data_name, // e.g., "50 Lakhs"
              text: `@ ₹${calculatedPremium.toFixed(2)} / ${
                premiumRawData.Payment_Type
              }`, // Example text with calculated premium
              premium: Number(calculatedPremium.toFixed(2)), // The calculated premium value
            };
          }

          // If premium is 0, return nothing for this coverage amount
          return null;
        }).filter((item) => item !== null); // Filter out any null values (where premium was 0)

        // Return the complete response object for each addOnRider
        return {
          idproduct: item.idproduct,
          product_name: item.product_name,
          product_description: item.product_description,
          coverage_amount: coverageAmounts, // Only include coverage amounts with premium > 0
        };
      })
      .filter((item) => item.coverage_amount.length > 0); // Filter out items with empty coverage_amount arrays

    // Construct the final response
    return reply
      .status(statusCodes.OK)
      .send(
        responseFormatter(
          statusCodes.OK,
          "Calculated Premium For AddOns",
          resultData
        )
      );
  } catch (error) {
    // Log only the necessary parts of the error object
    console.error("Error occurred while calculating premium: ", error);

    // Return an error response
    return reply.status(statusCodes.INTERNAL_SERVER_ERROR).send(
      responseFormatter(
        statusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error occurred",
        { error: error.message } // Only pass error.message, not the whole error object
      )
    );
  }
};

exports.calculatePremium = async (request, reply) => {
  try {
    const premiumRequest = request.body;
    const quoteArray = [
      premiumRequest.smoker,
      premiumRequest.premium_payment_term,
      premiumRequest.policy_term,
      premiumRequest.payment_type,
      premiumRequest.coverage_amount,
    ];
    const premiumRawData = await quote.getPremiumRawData(quoteArray);
    const productName = await quote.getProductName(premiumRequest.idproduct);
    // Calculate gender
    const gender = request.body.gender ? request.body.gender.toLowerCase() : "";
    let result;
    if (gender === "male") {
      result = "M";
    } else if (gender === "female") {
      result = "F";
    } else {
      result = "T";
    }

    // Calculate age
    const dob = request.body.dob; // "17/11/1999"
    const [day, month, year] = dob.split("/"); // Destructure the day, month, and year

    // Create a valid Date object
    const birthDate = new Date(year, month - 1, day); // month is zero-indexed

    // Calculate age
    const age = new Date().getFullYear() - birthDate.getFullYear();
    const ageAtDate =
      new Date().getMonth() < birthDate.getMonth() ||
      (new Date().getMonth() === birthDate.getMonth() &&
        new Date().getDate() < birthDate.getDate())
        ? age - 1
        : age;

    const urlData = [
      {
        age: ageAtDate,
        ppt: premiumRawData.Premium_Payment_Term,
        gender: result,
        product_term: premiumRawData.Policy_Term,
        tobacco: premiumRawData.Smoker,
        product_Name: productName.product_name.replace(/\s+/g, "_"), // Replace spaces with underscores
      },
    ];
    const url = process.env.PREMIUM_URL;
    const agent = new https.Agent({
      rejectUnauthorized: false, // Disable SSL certificate verification
    });

    // Get premium rates from the external API
    const premiumRate = await axios.post(url, urlData, { httpsAgent: agent });
    let premium = premiumRate.data.results;
    premium = premium[0].premium;
    const premiumYearly = (premium / 1000) * premiumRawData.Coverage_Amount;
    // Calculate the premium (adjusted for payment type)
    switch (premiumRawData.Payment_Type.toLowerCase()) {
      case "monthly":
        calculatedPremium = premiumYearly / 12;
        break;
      case "quarterly":
        calculatedPremium = premiumYearly / 4;
        break;
      case "half-yearly":
        calculatedPremium = premiumYearly / 2;
        break;
      case "annual":
        calculatedPremium = premiumYearly; // Annual premium is the yearly premium
        break;
      default:
        return reply.status(400).send({
          error:
            "Invalid payment frequency. Please specify 'Monthly', 'Quarterly', 'Half-Yearly', or 'Annual'.",
        });
    }
    return reply.status(statusCodes.OK).send(
      responseFormatter(statusCodes.OK, "Calculated Premium", {
        text: `@ ₹${calculatedPremium.toFixed(2)} / ${
          premiumRawData.Payment_Type
        }`, // Example text with calculated premium
        premium: Number(calculatedPremium.toFixed(2)),
      })
    );
  } catch (error) {
    return reply.status(statusCodes.INTERNAL_SERVER_ERROR).send(
      responseFormatter(
        statusCodes.INTERNAL_SERVER_ERROR,
        "Internal server error occurred",
        { error: error.message } // Only pass error.message, not the whole error object
      )
    );
  }
};
