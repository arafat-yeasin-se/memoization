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
function memoize(func, resolver, timeout) {
    //Cache the function result.
    let cache = {};
    let cacheValidTime = {};

    function getNow() {
        return Date.now();
    }
    /*
     * Memoize function implementation upon cache key
     */
    return function () {
        let remainingValidTime = -1;
        let cacheKey;
        if (typeof resolver !== 'undefined' && typeof resolver === 'function'){
            cacheKey = resolver.apply(this, arguments);
        }else{
            cacheKey = JSON.stringify(arguments[0]);
        }
        //Calculate if memoize function invokes after timeout exceeds.
        if(cacheValidTime[cacheKey]){
            remainingValidTime = cacheValidTime[cacheKey] - getNow();
        }
        //Retrieve value from cache only if value exist in cache for given cache key and timeout not exceeds.
        if (cache[cacheKey] && remainingValidTime >= 0) {
            console.log("Return from cache ... ");
            return cache[cacheKey];
        } else {
            //Executing the original function
            console.log("Function Executeing ... ");
            let value = func.apply(this, arguments);
            //Caching the value
            cache[cacheKey] = value;
            cacheValidTime[cacheKey] = getNow() + timeout;
            return value;
        }
    }
}

module.exports = {
    memoize,
};