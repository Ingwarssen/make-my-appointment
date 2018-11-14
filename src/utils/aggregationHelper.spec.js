const faker = require('faker');
const mongoose = require('mongoose');
const { expect } = require('chai');
const method = require('./aggregationHelper');

const ObjectId = mongoose.Types.ObjectId;

const testName = (__filename)
  .replace(/(.*src\/)|(\.spec\.js)/g, '')
  .replace(/\//g, '-');

describe(testName, () => {
  const mid = faker.random.number({ min: 4, max: 9 });

  describe('getSearchMatch', () => {
    const fieldsArray = faker.lorem.words(mid).split(' ');
    const searchValue = faker.lorem.words();
    it('returns proper values', async function func() {
      const result = await method.getSearchMatch(fieldsArray, searchValue);
      const firstElement = {
        [fieldsArray[0]]: {
          $regex  : searchValue.split(' ')[0],
          $options: 'i'
        }
      };
      const lastElement = {
        [fieldsArray[fieldsArray.length - 1]]: {
          $regex  : searchValue.split(' ')[searchValue.split(' ').length - 1],
          $options: 'i'
        }
      };
      expect(result).to.be.ok;
      expect(result).to.be.an('object');

      expect(result.$match.$or[0]).to.eql(firstElement);
      expect(result.$match.$or[result.$match.$or.length - 1]).to.eql(lastElement);
    });
  });

  describe('toObjectId', () => {
    const options = [];
    for (let i = 0; i < mid; i += 1) {
      options[i] = `${ObjectId()}`;
    }

    it('converts array', async function func() {
      const result = await method.toObjectId(options);
      expect(result).to.be.ok;
      expect(result).to.be.an('array');
      expect(result[0]).to.be.an('object');
      expect(`${result[0]}`).to.be.equal(options[0]);
      expect(result[result.length - 1]).to.be.an('object');
    });

    it('converts single value', async function func() {
      const result = await method.toObjectId(options[0]);
      expect(result).to.be.ok;
      expect(result).to.be.an('object');
    });

    it('returns same object', async function func() {
      const obj = ObjectId();
      const result = await method.toObjectId(obj);
      expect(result).to.be.ok;
      expect(result).to.be.an('object');
      expect(`${result}`).to.be.equal(`${obj}`);
    });
  });

  describe('toArray', () => {
    it('returns same array', async function func() {
      const options = faker.lorem.words().split(' ');
      const result = await method.toArray(options);

      expect(result).to.be.ok;
      expect(result).to.be.an('array');

      expect(result).to.eql(options);
    });
    it('returns new array', async function func() {
      const options = faker.lorem.word();
      const result = await method.toArray(options);

      expect(result).to.be.ok;
      expect(result).to.be.an('array');
      expect(result[0]).to.equal(options);
    });
  });
});
