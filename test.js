const memoization = require('./memoizaton');
const expect = require('chai').expect;
const sinon = require('sinon');

// hint: use https://sinonjs.org/releases/v6.1.5/fake-timers/ for faking timeouts

describe('memoization', function () {
    //Test Case 1
    it('should memoize function result', () =>{
        let returnValue = 5;
        const testFunction =  (key) => returnValue;

        const memoized = memoization.memoize(testFunction, (key) => key, 1000);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);

        returnValue = 10;

        // TODO currently fails, should work after implementing the memoize function
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);

    });
    //Test Case 2
    it('memoize function while cache key provided by resolver', () =>{
        let cacheKey = 'c544d3ae';
        const testFunction =  (key, firstValue, secondValue) => {
            if(typeof firstValue !== 'undefined' && typeof secondValue !== 'undefined'){
                return firstValue + secondValue;
            }
            return key;
        }
        const memoized = memoization.memoize(testFunction, (key) => cacheKey, 1000);
        expect(memoized(cacheKey, 5, 10)).to.equal(15);
        expect(memoized(cacheKey, 5, 10)).to.equal(15);
    });
});