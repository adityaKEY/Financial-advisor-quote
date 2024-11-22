const { responseFormatter, statusCodes } = require("../utils");
const { quote } = require("../db");

exports.getMetaData = async (request, reply) => {
    try {
      const { metaMasters } = request.body;
      const metaData = await quote.getMetaData(metaMasters); // Getting meta data from DB & maping keys   

      if (metaData.length > 0) {
        // await event.insertEventTransaction(request.isValid);
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
          .send(
            responseFormatter(
              statusCodes.NO_CONTENT,
              "Data not found"
            )
          );
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