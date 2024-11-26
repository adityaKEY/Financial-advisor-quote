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
  fastify.post(
    "/get-addon-premium",
    { preHandler: [authentication, validation] },
    quote.getAddOnPremium
  );
  fastify.post(
    "/calculate-premium",
    { preHandler: [authentication, validation] },
    quote.calculatePremium
  );
}

module.exports = quoteRoutes;
