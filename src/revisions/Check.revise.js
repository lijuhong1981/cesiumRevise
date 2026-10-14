import { Check, DeveloperError } from "cesium";

/**
 * 扩展 Cesium 的 Check 类，补充数组、整数、实例类型等校验方法。
 * @class Check
 * @see {@link https://cesium.com/learn/cesiumjs/ref-doc/Check.html}
*/

/**
 * 如果 test 不是 Array 类型则抛出异常。
 *
 * @param  {string} name 被检测变量的名称
 * @param  {*} test 待检测的值
 * @exception {DeveloperError} test 必须为 'Array' 类型
 * @memberof Check
 * @static
 */
Check.typeOf.array = function (name, test) {
    if (Array.isArray(test) === false) {
        throw new DeveloperError(Check.getFailedTypeErrorMessage(typeof test, 'array', name));
    }
};

/**
 * 如果 test 不是整数类型则抛出异常。
 *
 * @param {string} name 被检测变量的名称
 * @param {*} test 待检测的值
 * @exception {DeveloperError} test 必须为 'integer' 类型
 * @memberof Check
 * @static
 */
Check.typeOf.integer = function (name, test) {
    if (Number.isSafeInteger(test) === false) {
        throw new DeveloperError(Check.getFailedTypeErrorMessage(typeof test, 'integer', name));
    }
};

/**
 * 如果 test 不是整数类型或不小于 limit 则抛出异常。
 *
 * @param {string} name 被检测变量的名称
 * @param {*} test 待检测的值
 * @param {number} limit 用于比较的上限值
 * @exception {DeveloperError} test 必须为 'integer' 类型且小于 limit
 * @memberof Check
 * @static
 */
Check.typeOf.integer.lessThan = function (name, test, limit) {
    Check.typeOf.integer(name, test);
    if (test >= limit) {
        throw new DeveloperError('Expected ' + name + ' to be less than ' + limit + ', actual value was ' + test);
    }
};

/**
 * 如果 test 不是整数类型或不小于等于 limit 则抛出异常。
 *
 * @param {string} name 被检测变量的名称
 * @param {*} test 待检测的值
 * @param {number} limit 用于比较的上限值
 * @exception {DeveloperError} test 必须为 'integer' 类型且小于等于 limit
 * @memberof Check
 * @static
 */
Check.typeOf.integer.lessThanOrEquals = function (name, test, limit) {
    Check.typeOf.integer(name, test);
    if (test > limit) {
        throw new DeveloperError('Expected ' + name + ' to be less than or equal to ' + limit + ', actual value was ' + test);
    }
};

/**
 * 如果 test 不是整数类型或不大于 limit 则抛出异常。
 *
 * @param {string} name 被检测变量的名称
 * @param {*} test 待检测的值
 * @param {number} limit 用于比较的下限值
 * @exception {DeveloperError} test 必须为 'integer' 类型且大于 limit
 * @memberof Check
 * @static
 */
Check.typeOf.integer.greaterThan = function (name, test, limit) {
    Check.typeOf.integer(name, test);
    if (test <= limit) {
        throw new DeveloperError('Expected ' + name + ' to be greater than ' + limit + ', actual value was ' + test);
    }
};

/**
 * 如果 test 不是整数类型或不大于等于 limit 则抛出异常。
 *
 * @param {string} name 被检测变量的名称
 * @param {*} test 待检测的值
 * @param {number} limit 用于比较的下限值
 * @exception {DeveloperError} test 必须为 'integer' 类型且大于等于 limit
 * @memberof Check
 * @static
 */
Check.typeOf.integer.greaterThanOrEquals = function (name, test, limit) {
    Check.typeOf.integer(name, test);
    if (test < limit) {
        throw new DeveloperError('Expected ' + name + ' to be greater than or equal to' + limit + ', actual value was ' + test);
    }
};

/**
 * 如果 test1 与 test2 不是整数类型或两者值不相等则抛出异常。
 *
 * @param {string} name1 第一个被检测变量的名称
 * @param {string} name2 第二个被检测变量的名称
 * @param {*} test1 待检测的值
 * @param {*} test2 用于比较的值
 * @exception {DeveloperError} test1 与 test2 必须为 'integer' 类型且值相等
 * @memberof Check
 * @static
 */
Check.typeOf.integer.equals = function (name1, name2, test1, test2) {
    Check.typeOf.integer(name1, test1);
    Check.typeOf.integer(name2, test2);
    if (test1 !== test2) {
        throw new DeveloperError(
            name1 + " must be equal to " + name2 + ", the actual values are " + test1 + " and " + test2
        );
    }
};

/**
 * 如果 test 不是 target 的实例则抛出异常。
 *
 * @param {string} name 被检测变量的名称
 * @param {*} test 待检测的值
 * @param {*} target instanceof 的目标类型
 * @exception {DeveloperError} test 必须为 target 的实例
 * @memberof Check
 * @static
 */
Check.instanceOf = function (name, test, target) {
    if (test instanceof target === false) {
        throw new DeveloperError(Check.getFailedTypeErrorMessage(false, target.name, name));
    }
};

/**
 * 如果 test1 与 test2 的值不相等则抛出异常。
 *
 * @param {string} name1 第一个被检测变量的名称
 * @param {string} name2 第二个被检测变量的名称
 * @param {*} test1 第一个待检测的值
 * @param {*} test2 第二个用于比较的值
 * @exception {DeveloperError} test1 与 test2 的值必须相等
 * @memberof Check
 * @static
 */
Check.typeOf.number.equals = function (name1, name2, test1, test2) {
    if (test1 !== test2) {
        throw new DeveloperError(
            `${name1} must be equal to ${name2}, the actual values are ${test1} and ${test2}`,
        );
    }
};

export default Check;
export { Check };
