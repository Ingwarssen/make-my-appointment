const { expect } = require('chai');
const method = require('./logout');
const responseSender = require('../../../utils/responseSender');

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

describe(testName, () => {
  it('response ok if not logged in', function test() {
    const successSpy = this.sandbox.spy(responseSender, 'ok');
    const res = this.custom.res;
    const req = {
      session: {}
    };

    req.session.destroy = this.sandbox.spy();

    method(req, res);

    expect(successSpy).calledOnce;
    expect(req.session.destroy).not.calledOnce;
  });
  it('logs out with session destroy', function test() {
    const successSpy = this.sandbox.spy(responseSender, 'ok');
    const res = this.custom.res;
    const req = {
      session: {
        loggedIn: true
      }
    };

    req.session.destroy = this.sandbox.spy();

    method(req, res);

    expect(successSpy).calledOnce;
    expect(req.session.destroy).calledOnce;
  });
});
