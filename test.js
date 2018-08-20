const memoization = require('./memoizaton');
const expect = require('chai').expect;
const sinon = require('sinon');

// hint: use https://sinonjs.org/releases/v6.1.5/fake-timers/ for faking timeouts

describe('memoization', function () {
    //Test Case 1
    it('should memoize function result', () => {
        let returnValue = 5;
        const testFunction = (key) => returnValue;

        const memoized = memoization.memoize(testFunction, (key) => key, 1000);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);

        returnValue = 10;

        // TODO currently fails, should work after implementing the memoize function
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
        //original function execute again with different cache key
        expect(memoized('b544d3ae-a72d-4755-8ce5-d25db415b776')).to.not.equal(5);
        expect(memoized('b544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(10);
    });
    //Test Case 2
    it('memoize function while cache key provided by resolver', () => {
        let cacheKey = 'c544d3ae';
        const testFunction = (key, firstValue, secondValue) => {
            if (typeof firstValue !== 'undefined' && typeof secondValue !== 'undefined') {
                return firstValue + secondValue;
            }
            return key;
        }
        const memoized = memoization.memoize(testFunction, (key) => cacheKey, 1000);
        expect(memoized(cacheKey, 5, 10)).to.equal(15);
        //Passing different arguments but still value return from cache as cache key detect from resolver
        expect(memoized(cacheKey, 5, 20)).to.equal(15);
    });

    //Test Suite to test with fake timer
    describe('Memoization check with fake timers', function () {
        let clock;
        beforeEach(function () {
            clock = sinon.useFakeTimers();
        });

        afterEach(function () {
            clock.restore();
        });
        it('should memoize function result until timeout exceeds', () => {
            let returnValue = 5;

            const testFunction = (key) => returnValue;

            const memoized = memoization.memoize(testFunction, (key) => key, 2000);
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
            returnValue = 10;
            clock.tick(20);
            //Same value should return from cache
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
            clock.tick(1000);
            //Same value should return from cache as Timeout not exceed
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
            //Timeout exceeds so original function should execute again
            clock.tick(2000);
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(10);

        });
    });
});