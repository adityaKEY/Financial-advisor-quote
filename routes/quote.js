const { authentication, validation } = require("../middleware");
const { quote } = require("../controllers");


async function quoteRoutes(fastify, options) {
    fastify.post(
        "/fetch-quote-meta-data",
        { preHandler: [authentication, validation] },
        quote.getMetaData
    );
  }
  
  module.exports = quoteRoutes;