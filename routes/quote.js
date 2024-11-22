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
    fastify.post(
        "/create-quote",
        { preHandler: [authentication, validation] },
        quote.createQuote
    );
  }
  
  module.exports = quoteRoutes;