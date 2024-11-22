const quote = require("./quote");
async function routes(fastify, options) {
  // Register user and lead routes with prefixes
  fastify.register(quote, { prefix: "/quote" });
}

module.exports = routes;
