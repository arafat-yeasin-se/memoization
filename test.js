const memoization = require('./memoizaton');
const expect = require('chai').expect;
const sinon = require('sinon');

// hint: use https://sinonjs.org/releases/v6.1.5/fake-timers/ for faking timeouts

describe('memoization', function () {
    let originalFunctionSpy = sinon.spy();
    afterEach(() => originalFunctionSpy.resetHistory());

    //Test Case 1
    /*it('should memoize function result', () =>{
        let returnValue = 5;
        const testFunction =  (key) => returnValue;

        const memoized = memoization.memoize(testFunction, (key) => key, 1000);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);

        returnValue = 10;

        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
    });*/
    /*//Test Case 2
    it('should not memoize function result as resolver does not have same set of parameter as original function', () =>{
        let returnValue = 5;
        const testFunction =  (key, param1) => returnValue;

        const memoized = memoization.memoize(testFunction, (key) => key, 1000);
        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);

        returnValue = 10;

        expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(10);
    });*/
   /* //Test Case 3
    it('test original function executed', () =>{
        let returnValue = 5;
        const memoized = memoization.memoize(originalFunctionSpy, () => returnValue, 1000);
        memoized('c544d3ae-a72d-4755-8ce5-d25db415b776');
        expect(originalFunctionSpy.withArgs('c544d3ae-a72d-4755-8ce5-d25db415b776').callCount).to.equal(1);
    });*/
    //Test Case 4
    /*it('test original function and resolver called with same set of arguments', () =>{
        let returnValue = 5;
        let resolverFunctionSpy = sinon.spy();

        const memoized = memoization.memoize(originalFunctionSpy, resolverFunctionSpy, 1000);
        memoized('c544d3ae-a72d-4755-8ce5-d25db415b776',19);
        expect(originalFunctionSpy.withArgs('c544d3ae-a72d-4755-8ce5-d25db415b776', 19).calledOnce).to.equal(true);
        expect(resolverFunctionSpy.withArgs('c544d3ae-a72d-4755-8ce5-d25db415b776', 19).calledOnce).to.equal(true);
        resolverFunctionSpy.resetHistory();
    });*/
    //Test Suite to test with fake timer
    describe('memoization check with fake timers', function () {
        let timer;
        beforeEach(() => {
            //Initialize fake timer with timestamp 1 and store the reference of the timer
            timer = sinon.useFakeTimers({
                now: 1
            });
        });
        afterEach(() => timer.restore());

        /*//Test Case 2
        it('memoize function should cache result until individual memorize function timeout exceeds', () => {
            let returnValue = 5;

            const testFunction = (key) => returnValue;

            const memoized = memoization.memoize(testFunction, (key) => key, 2000);
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
            returnValue = 10;
            timer.tick(1000);
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
            expect(memoized('vkyky544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(10);
            //expect(memoized('v544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(10);
            timer.tick(1021);
            returnValue = 20;
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(20);
            expect(memoized('vkyky544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(10);
            timer.tick(1000);
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(20);
            expect(memoized('vkyky544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(20);
        });*/

       ///Test Case 3
        it('should not memoize function as timeout ', () => {

            let returnValue = 5;
c
            const testFunction = (key, param1) => returnValue;

            const memoized = memoization.memoize(testFunction, (key,param1) => key, 2000);
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(5);

        });
        /*//Test Case 4
        it('memoize function should not cache result as timeout set to 0', () => {

            const testFunction = (key) => Date.now();

            const memoized = memoization.memoize(testFunction, (key) => key, 0);
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(1);
            timer.tick(20);
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.not.equal(1);
            timer.tick(1000);
            expect(memoized('c544d3ae-a72d-4755-8ce5-d25db415b776')).to.equal(1021);

        });*/
    });
});