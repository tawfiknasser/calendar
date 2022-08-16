const http = require('http');
const app = require('./app');
const logger = require('./lib/logger');

const httpServer = http.createServer(app);

httpServer.listen(process.env.PORT, () => {
  logger.info(
    `${new Date()} 🚀🚀🚀 Started Http Server at http://localhost:${
      process.env.PORT
    }`,
  );
});
