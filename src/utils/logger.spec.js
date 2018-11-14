const { expect } = require('chai');
const logger = require('./logger');

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

describe(testName, () => {
  it('returns logger', async function func() {
    expect(logger.inspect).to.be.an('function');
    expect(logger).to.have.all.keys(
    '_events',
    '_eventsCount',
    // '_hnames',
    '_maxListeners',
    '_names',
    // 'catchExceptions',
    'debug',
    'domain',
    'emitErrs',
    'error',
    'exceptionHandlers',
    'exitOnError',
    'filters',
    'id',
    'info',
    'inspect',
    'level',
    'levels',
    'padLevels',
    'profilers',
    'rewriters',
    'silly',
    'stripColors',
    'transports',
    'verbose',
    'warn'
    );
  });
});
