const user = require("./user");
async function routes(fastify, options) {
  // Register user and lead routes with prefixes
  fastify.register(user, { prefix: "/users" });
}

module.exports = routes;
