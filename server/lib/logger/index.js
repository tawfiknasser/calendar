const bunyan = require('bunyan');
const _ = require('lodash');

let logger; let
  streams;

const initialize = _.once(() => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const bunyanDebugStream = require('bunyan-debug-stream');
    streams = [{
      level: 'error',
      type: 'raw',
      stream: bunyanDebugStream.create({
        basepath: `${__dirname}../`,
        forceColor: true,
      }),
    }, {
      level: 'warn',
      type: 'raw',
      stream: bunyanDebugStream.create({
        basepath: `${__dirname}../`,
      }),
    },
    {
      level: 'info',
      type: 'raw',
      stream: bunyanDebugStream.create({
        basepath: `${__dirname}../`,
        forceColor: true,
      }),
    }];
  } else {
    streams = [
      {
        level: 'error',
        path: 'app_errors.log',
      },
      {
        level: 'warn',
        path: 'app_warns.log',
      },
      {
        level: 'info',
        path: 'app_info.log',
      },
    ];
  }

  logger = bunyan.createLogger({
    name: 'ROBOT Server Log',
    streams,
    serializers: {
      req: bunyan.stdSerializers.req,
      res: bunyan.stdSerializers.res,
      err: bunyan.stdSerializers.err,
    },
  });
});

initialize();

module.exports = logger;
