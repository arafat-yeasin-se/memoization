const memoization = require('./memoizaton');
const expect = require('chai').expect;
const sinon = require('sinon');

// hint: use https://sinonjs.org/releases/v6.1.5/fake-timers/ for faking timeouts

describe('memoization', function () {
    //Test Case
    it('should memoize function result', () => {
        let returnValue = 5;
        const testFunction = (key) => returnValue;

        const memoized = memoization.memoize(testFunction, (key) => key, 1000);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
        returnValue = 10;
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
    });

    //Test Case
    it('should memoize function result for different cache key', () => {
        let returnValue = 5;
        const testFunction = (key) => returnValue;

        const memoized = memoization.memoize(testFunction, (key) => key, 1000);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
        returnValue = 10;
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
        //original function execute again with different cache key
        expect(memoized('b544d3ae-a72d-4755-8ce5-d25db415b776')).to.not.equal(5);
        expect(memoized('b544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(10);
        returnValue = 15;
        expect(memoized('b544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(10);
        expect(memoized('d544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(15);
    });

    //Test Case
    it('detect cache key provided by resolver and should memoize function result upon resolver provided key', () => {
        let cacheKey = 'c544d3ae';
        const testFunction = (key, firstValue, secondValue) => {
            if (typeof firstValue !== 'undefined' && typeof secondValue !== 'undefined') {
                return firstValue + secondValue;
            }
            return key;
        };
        const memoized = memoization.memoize(testFunction, (key) => cacheKey, 1000);
        expect(memoized(cacheKey, 5, 10)).to.equal(15);
        //Passing different arguments but still value return from cache as cache key detect from resolver
        expect(memoized(cacheKey, 5, 20)).to.equal(15);
    });

    //Test Case
    it('should memoize function result upon key parameter of original function', () => {
        let cacheKey = 'c544d3ae';
        const testFunction = (key, value) => {
            if (typeof value !== 'undefined') {
                return value;
            }
            return key;
        };
        const memoized = memoization.memoize(testFunction, (key) => key, 1000);
        expect(memoized(cacheKey, 10)).to.equal(10);
        //passing only cache key and memoize function return result based on cache key
        expect(memoized(cacheKey)).to.equal(10);
        //Passing different parameter but still value return from cache as cache key remain same
        expect(memoized(cacheKey, 15)).to.equal(10);
    });

    //Test Case
    it('should memoize function result without resolver and timeout', () => {
        let cacheKey = 'c544d3ae', returnValue = 5;
        const testFunction = (key) => returnValue;
        const memoized = memoization.memoize(testFunction);
        expect(memoized(cacheKey)).to.equal(5);
        //Passing different arguments but still value return from cache as cache key detect from resolver
        expect(memoized(cacheKey)).to.equal(5);
    });

    //Test Suite to test with fake timer
    describe('memoization check with fake timers', function () {
        let timer;
        beforeEach(function () {
            //Initialize fake timer with timestamp 1 and store the reference of the timer
            timer = sinon.useFakeTimers({
                now: 1
            });
        });
        afterEach(function () {
            timer.restore();
        });

        //Test Case
        it('memoize function should cache result until timeout exceeds', () => {
            let returnValue = 5;

            const testFunction = (key) => returnValue;

            const memoized = memoization.memoize(testFunction, (key) => key, 2000);
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
            returnValue = 10;
            timer.tick(20);
            //Same value should return from cache
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
            timer.tick(1000);
            //Same value should return from cache as Timeout not exceed
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
            //Timeout exceeds so original function should execute again
            timer.tick(2000);
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(10);

        });

        //Test Case
        it('memoize function should cache result until timeout exceeds [Tested with frequent changed value]', () => {

            const testFunction = (key) => Date.now();

            const memoized = memoization.memoize(testFunction, (key) => key, 2000);
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(1);
            timer.tick(20);
            //Same value should return from cache
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(1);
            timer.tick(1000);
            //Same value should return from cache as Timeout not exceed
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(1);
            //Timeout exceeds so original function should execute again
            timer.tick(2000);
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(3021);

        });
    });
});