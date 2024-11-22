const { authentication, validation } = require("../middleware");
const { quote } = require("../controllers");


async function quoteRoutes(fastify, options) {
    fastify.post(
        "/fetch-quote-meta-data",
        { preHandler: [authentication, validation] },
        quote.getMetaData
    );
    fastify.post(
        "/get-lead-info",
        { preHandler: [authentication, validation] },
        quote.getLeadInfo
    );
  }
  
  module.exports = quoteRoutes;