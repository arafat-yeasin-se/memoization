/**
 * Creates a function that memoizes the result of func. If resolver is provided,
 * it determines the cache key for storing the result based on the arguments provided to the memorized function.
 * By default, the first argument provided to the memorized function is used as the map cache key. The memorized values
 * timeout after the timeout exceeds. The timeout is in defined in milliseconds.
 *
 * Example:
 * function someFunction(key, otherParameter) {
 *  return Date.now();
 * }
 *
 * const memoized = memoization.memoize(someFunction, (key) => key, 5000)
 *
 * // there is no value for the key provided therefore the first call should directly call the provided function
 * // cache the result and return the value
 * const result = memoized('c544d3ae-a72d-4755-8ce5-d25db415b776', 'not relevant for the key'); // result = 1534252012350
 *
 * // because there was no timeout and only the first argument is used as key this call should return the memorized value from the
 * // first call
 * const secondResult = memoized('c544d3ae-a72d-4755-8ce5-d25db415b776', 'different parameter'); // secondResult = 1534252012350
 *
 * // after 5000 ms the value is not valid anymore and the original function should be called again
 * const thirdResult = memoized('c544d3ae-a72d-4755-8ce5-d25db415b776', 'not relevant for the key'); // thirdResult = 1534252159271
 *
 * @param func      the function for which the return values should be cached
 * @param resolver  if provided gets called for each function call with the exact same set of parameters as the
 *                  original function, the resolver function should provide the memoization key.
 * @param timeout   timeout for cached values in milliseconds
 */
const sizeof = require('object-sizeof');

function memoize(func, resolver, timeout) {
    //Cache the function result and timeout.
    let cacheStore, primaryCache = {}, secondaryCache = {}, normalCache = {};
    const productionMode = false, maxObjectCache = 20000000;
    //Get System current time
    function getNow() {
        return Date.now();
    }

    function setCacheStore() {
        //TODO: Select cache store upon memorized function calling frequency based on cache key
        if (sizeof(primaryCache) < maxObjectCache) {
            console.log('primary....');
            cacheStore = primaryCache;
        } else if (sizeof(secondaryCache) < maxObjectCache) {
            cacheStore = secondaryCache;
        } else {
            cacheStore = normalCache;
        }
        //TODO: If all stores full of memory then delete some cache from cache stores upon requirements like method call frequency, rapidly fill up store and etc.
    }

    //Track previous system time
    let previousTime = getNow();
    //After every 10 seconds check if system time Jumps
    if (productionMode) {
        setInterval(function () {
            //Calculate time difference between before and after system time execution
            let timeDiff = getNow() - previousTime;
            previousTime = getNow();
            /*
             * If system time jumps backward or forward then invalidate cache.
             * Here upward time consider a 5 seconds buffer;
             * As there might be some delay to place callback function in the engine call stack.
             * */
            if (timeDiff < 0 || timeDiff > 15000) {
                //Invalidate all caches
                cacheStore = {};
                //TODO: if application requirements define that cache will not invalidate even if system time jumps then application need to recalculate timeout cache.
                /*
                 * cache remaining valid time and cacheValidTime
                 * cacheValidTime[cacheKey] = getNow() + remainingValidTime
                 * Please follow draft sce
                 * */
            }
        }, 10000);
    }
    //Check if given timeout valid
    if (typeof timeout === 'undefined' || typeof timeout !== 'number') {
        timeout = 0;
    }
    /*
     * Memoize function implementation upon cache key and timeout
     */
    return function () {
        //TODO: Detect Original/Memorize function calling frequency
        setCacheStore();
        let remainingValidTime = -1;
        let cacheKey;
        //check if provided resolver provided and has same set of parameter as original function.
        if (typeof resolver !== 'undefined' && typeof resolver === 'function') {
            if (func.length == resolver.length) {
                cacheKey = resolver.apply(this, arguments);
            }
        } else {
            //Get first argument of original function as cache key in absence of resolver
            cacheKey = JSON.stringify(arguments[0]);
        }
        let tempCacheStore = Object.assign({}, primaryCache, secondaryCache, normalCache);
        //console.log('tempCacheStore: '+JSON.stringify(tempCacheStore));
        //Calculate remaining valid time.
        const tempCache = tempCacheStore[cacheKey];
        //console.log('tempCache: '+JSON.stringify(tempCache));
        if (tempCache && tempCache.cacheValidTime) {
            remainingValidTime = tempCache.cacheValidTime - getNow();
        }
        //Retrieve value from cache only if value exist in cache for given cache key and if timeout not exceeds.
        if (tempCache && remainingValidTime > 0) {
            console.log('Return from cache ...');
            //TODO: cache remaining valid time in cache object
            return tempCacheStore[cacheKey].value;
        } else {
            //Executing the original function.
            let result = func.apply(this, arguments);
            console.log('Executing function ...');
            //Caching the value if cache key and valid timeout found.
            if (typeof cacheKey !== 'undefined' && timeout > 0) {
                let temp = {};
                temp['value'] = result;
                temp['cacheValidTime'] = getNow() + timeout;
                cacheStore[cacheKey] = temp;
            }
            return result;
        }
    }
}

module.exports = {
    memoize,
};