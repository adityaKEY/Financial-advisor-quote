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
  fastify.post(
    "/get-product-recommendations",
    { preHandler: [authentication, validation] },
    quote.productRecommendation
  );
  fastify.post(
    "/calculate-premium-product-recommendations",
    { preHandler: [authentication, validation] },
    quote.calculatePremiumForRecommendedProduct
  );
  fastify.get(
    "/get-quote-count",
    { preHandler: [authentication, validation] },
    quote.getQuoteCount
  );
  fastify.post(
    "/create-quote-nvest",
    { preHandler: [authentication, validation] },
    quote.createQuoteNvest
  );
  fastify.post(
    "/get-quote",
    { preHandler: [authentication, validation] },
    quote.getQuote
  );
  fastify.post(
    "/get-fields",
    { preHandler: [authentication, validation] },
    quote.getFields
  );
}

module.exports = quoteRoutes;
