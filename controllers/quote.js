const { responseFormatter, statusCodes } = require("../utils");
const { event, quote, lead } = require("../db");

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
