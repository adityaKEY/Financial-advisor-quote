const { responseFormatter, statusCodes, generateId } = require("../utils");
const { event, quote, lead } = require("../db");
const { generateUniqueString } = require("../utils/generateId");

exports.getMetaData = async (request, reply) => {
  try {
    const { metaMasters } = request.body;
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
      dob: request.body.dob,
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
      total_premium: request.body.total_premium
    }

    const entityIdentity = await quote.getEntityIdentity(reqBody.leadid);
    await quote.updateEntityDobByIdentity(entityIdentity, reqBody.dob);
    const quoteRes = await quote.createQuote(reqBody);
    if (quoteRes.length) {
      await event.insertEventTransaction(request.isValid);
      return reply
        .status(statusCodes.OK)
        .send(
          responseFormatter(
            statusCodes.OK,
            "Quote created successfully",
            {quick_quote_id: quoteRes[0].quick_quote_id}
          )
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
}
