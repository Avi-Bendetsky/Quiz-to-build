"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionEvaluator = void 0;
var common_1 = require("@nestjs/common");
var ConditionEvaluator = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ConditionEvaluator = _classThis = /** @class */ (function () {
        function ConditionEvaluator_1() {
        }
        /**
         * Evaluate a single condition or nested conditions
         */
        ConditionEvaluator_1.prototype.evaluate = function (condition, responses) {
            // Handle nested conditions
            if (condition.nested && condition.nested.length > 0) {
                return this.evaluateNested(condition.nested, condition.logicalOp || 'AND', responses);
            }
            // Evaluate single condition
            if (!condition.field || !condition.operator) {
                return true; // No condition means always true
            }
            var value = responses.get(condition.field);
            return this.evaluateOperator(condition.operator, value, condition.value);
        };
        /**
         * Evaluate nested conditions with logical operator
         */
        ConditionEvaluator_1.prototype.evaluateNested = function (conditions, operator, responses) {
            var _this = this;
            var results = conditions.map(function (c) { return _this.evaluate(c, responses); });
            if (operator === 'AND') {
                return results.every(function (r) { return r; });
            }
            else {
                return results.some(function (r) { return r; });
            }
        };
        /**
         * Evaluate a single operator
         */
        ConditionEvaluator_1.prototype.evaluateOperator = function (operator, actualValue, expectedValue) {
            switch (operator) {
                case 'equals':
                case 'eq':
                    return this.equals(actualValue, expectedValue);
                case 'not_equals':
                case 'ne':
                    return !this.equals(actualValue, expectedValue);
                case 'includes':
                case 'contains':
                    return this.includes(actualValue, expectedValue);
                case 'not_includes':
                case 'not_contains':
                    return !this.includes(actualValue, expectedValue);
                case 'in':
                    return this.isIn(actualValue, expectedValue);
                case 'not_in':
                    return !this.isIn(actualValue, expectedValue);
                case 'greater_than':
                case 'gt':
                    return this.greaterThan(actualValue, expectedValue);
                case 'less_than':
                case 'lt':
                    return this.lessThan(actualValue, expectedValue);
                case 'greater_than_or_equal':
                case 'gte':
                    return this.greaterThanOrEqual(actualValue, expectedValue);
                case 'less_than_or_equal':
                case 'lte':
                    return this.lessThanOrEqual(actualValue, expectedValue);
                case 'between':
                    return this.between(actualValue, expectedValue);
                case 'is_empty':
                    return this.isEmpty(actualValue);
                case 'is_not_empty':
                    return !this.isEmpty(actualValue);
                case 'starts_with':
                    return this.startsWith(actualValue, expectedValue);
                case 'ends_with':
                    return this.endsWith(actualValue, expectedValue);
                case 'matches':
                    return this.matches(actualValue, expectedValue);
                default:
                    return false;
            }
        };
        /**
         * Check equality (handles various types)
         */
        ConditionEvaluator_1.prototype.equals = function (actual, expected) {
            if (actual === expected) {
                return true;
            }
            // Handle object comparison for response values
            if (typeof actual === 'object' && actual !== null) {
                var actualObj = actual;
                // Check common response value patterns
                if ('selectedOptionId' in actualObj) {
                    return actualObj.selectedOptionId === expected;
                }
                if ('text' in actualObj) {
                    return actualObj.text === expected;
                }
                if ('number' in actualObj) {
                    return actualObj.number === expected;
                }
                if ('rating' in actualObj) {
                    return actualObj.rating === expected;
                }
            }
            return JSON.stringify(actual) === JSON.stringify(expected);
        };
        /**
         * Check if array includes value or if value contains substring
         */
        ConditionEvaluator_1.prototype.includes = function (actual, expected) {
            // Handle response objects
            if (typeof actual === 'object' && actual !== null) {
                var actualObj = actual;
                // Multi-choice responses
                if ('selectedOptionIds' in actualObj && Array.isArray(actualObj.selectedOptionIds)) {
                    return actualObj.selectedOptionIds.includes(expected);
                }
                // Text contains
                if ('text' in actualObj && typeof actualObj.text === 'string') {
                    return actualObj.text.includes(String(expected));
                }
            }
            // Array includes
            if (Array.isArray(actual)) {
                return actual.includes(expected);
            }
            // String contains
            if (typeof actual === 'string' && typeof expected === 'string') {
                return actual.includes(expected);
            }
            return false;
        };
        /**
         * Check if value is in an array of expected values
         */
        ConditionEvaluator_1.prototype.isIn = function (actual, expected) {
            if (!Array.isArray(expected)) {
                return false;
            }
            // Handle response objects
            if (typeof actual === 'object' && actual !== null) {
                var actualObj = actual;
                if ('selectedOptionId' in actualObj) {
                    return expected.includes(actualObj.selectedOptionId);
                }
                if ('text' in actualObj) {
                    return expected.includes(actualObj.text);
                }
                if ('number' in actualObj) {
                    return expected.includes(actualObj.number);
                }
            }
            return expected.includes(actual);
        };
        /**
         * Numeric comparison: greater than
         */
        ConditionEvaluator_1.prototype.greaterThan = function (actual, expected) {
            var actualNum = this.extractNumber(actual);
            var expectedNum = this.extractNumber(expected);
            if (actualNum === null || expectedNum === null) {
                return false;
            }
            return actualNum > expectedNum;
        };
        /**
         * Numeric comparison: less than
         */
        ConditionEvaluator_1.prototype.lessThan = function (actual, expected) {
            var actualNum = this.extractNumber(actual);
            var expectedNum = this.extractNumber(expected);
            if (actualNum === null || expectedNum === null) {
                return false;
            }
            return actualNum < expectedNum;
        };
        /**
         * Numeric comparison: greater than or equal
         */
        ConditionEvaluator_1.prototype.greaterThanOrEqual = function (actual, expected) {
            var actualNum = this.extractNumber(actual);
            var expectedNum = this.extractNumber(expected);
            if (actualNum === null || expectedNum === null) {
                return false;
            }
            return actualNum >= expectedNum;
        };
        /**
         * Numeric comparison: less than or equal
         */
        ConditionEvaluator_1.prototype.lessThanOrEqual = function (actual, expected) {
            var actualNum = this.extractNumber(actual);
            var expectedNum = this.extractNumber(expected);
            if (actualNum === null || expectedNum === null) {
                return false;
            }
            return actualNum <= expectedNum;
        };
        /**
         * Range check: value is between min and max
         */
        ConditionEvaluator_1.prototype.between = function (actual, expected) {
            var _this = this;
            if (!Array.isArray(expected) || expected.length !== 2) {
                return false;
            }
            var actualNum = this.extractNumber(actual);
            var _a = expected.map(function (v) { return _this.extractNumber(v); }), min = _a[0], max = _a[1];
            if (actualNum === null || min === null || max === null) {
                return false;
            }
            return actualNum >= min && actualNum <= max;
        };
        /**
         * Check if value is empty
         */
        ConditionEvaluator_1.prototype.isEmpty = function (actual) {
            if (actual === null || actual === undefined) {
                return true;
            }
            if (typeof actual === 'string' && actual.trim() === '') {
                return true;
            }
            if (Array.isArray(actual) && actual.length === 0) {
                return true;
            }
            if (typeof actual === 'object') {
                var obj = actual;
                // Check response objects
                if ('text' in obj && (obj.text === '' || obj.text === null)) {
                    return true;
                }
                if ('selectedOptionId' in obj && obj.selectedOptionId === null) {
                    return true;
                }
                if ('selectedOptionIds' in obj && Array.isArray(obj.selectedOptionIds) && obj.selectedOptionIds.length === 0) {
                    return true;
                }
            }
            return false;
        };
        /**
         * String starts with
         */
        ConditionEvaluator_1.prototype.startsWith = function (actual, expected) {
            var actualStr = this.extractString(actual);
            var expectedStr = this.extractString(expected);
            if (actualStr === null || expectedStr === null) {
                return false;
            }
            return actualStr.startsWith(expectedStr);
        };
        /**
         * String ends with
         */
        ConditionEvaluator_1.prototype.endsWith = function (actual, expected) {
            var actualStr = this.extractString(actual);
            var expectedStr = this.extractString(expected);
            if (actualStr === null || expectedStr === null) {
                return false;
            }
            return actualStr.endsWith(expectedStr);
        };
        /**
         * Regex match
         */
        ConditionEvaluator_1.prototype.matches = function (actual, expected) {
            var actualStr = this.extractString(actual);
            if (actualStr === null || typeof expected !== 'string') {
                return false;
            }
            try {
                var regex = new RegExp(expected);
                return regex.test(actualStr);
            }
            catch (_a) {
                return false;
            }
        };
        /**
         * Extract number from various value types
         */
        ConditionEvaluator_1.prototype.extractNumber = function (value) {
            if (typeof value === 'number') {
                return value;
            }
            if (typeof value === 'string') {
                var parsed = parseFloat(value);
                return isNaN(parsed) ? null : parsed;
            }
            if (typeof value === 'object' && value !== null) {
                var obj = value;
                if ('number' in obj && typeof obj.number === 'number') {
                    return obj.number;
                }
                if ('rating' in obj && typeof obj.rating === 'number') {
                    return obj.rating;
                }
            }
            return null;
        };
        /**
         * Extract string from various value types
         */
        ConditionEvaluator_1.prototype.extractString = function (value) {
            if (typeof value === 'string') {
                return value;
            }
            if (typeof value === 'object' && value !== null) {
                var obj = value;
                if ('text' in obj && typeof obj.text === 'string') {
                    return obj.text;
                }
                if ('selectedOptionId' in obj && typeof obj.selectedOptionId === 'string') {
                    return obj.selectedOptionId;
                }
            }
            return null;
        };
        return ConditionEvaluator_1;
    }());
    __setFunctionName(_classThis, "ConditionEvaluator");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConditionEvaluator = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConditionEvaluator = _classThis;
}();
exports.ConditionEvaluator = ConditionEvaluator;
var ConditionEvaluator = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ConditionEvaluator = _classThis = /** @class */ (function () {
        function ConditionEvaluator_2() {
        }
        /**
         * Evaluate a single condition or nested conditions
         */
        ConditionEvaluator_2.prototype.evaluate = function (condition, responses) {
            // Handle nested conditions
            if (condition.nested && condition.nested.length > 0) {
                return this.evaluateNested(condition.nested, condition.logicalOp || 'AND', responses);
            }
            // Evaluate single condition
            if (!condition.field || !condition.operator) {
                return true; // No condition means always true
            }
            var value = responses.get(condition.field);
            return this.evaluateOperator(condition.operator, value, condition.value);
        };
        /**
         * Evaluate nested conditions with logical operator
         */
        ConditionEvaluator_2.prototype.evaluateNested = function (conditions, operator, responses) {
            var _this = this;
            var results = conditions.map(function (c) { return _this.evaluate(c, responses); });
            if (operator === 'AND') {
                return results.every(function (r) { return r; });
            }
            else {
                return results.some(function (r) { return r; });
            }
        };
        /**
         * Evaluate a single operator
         */
        ConditionEvaluator_2.prototype.evaluateOperator = function (operator, actualValue, expectedValue) {
            switch (operator) {
                case 'equals':
                case 'eq':
                    return this.equals(actualValue, expectedValue);
                case 'not_equals':
                case 'ne':
                    return !this.equals(actualValue, expectedValue);
                case 'includes':
                case 'contains':
                    return this.includes(actualValue, expectedValue);
                case 'not_includes':
                case 'not_contains':
                    return !this.includes(actualValue, expectedValue);
                case 'in':
                    return this.isIn(actualValue, expectedValue);
                case 'not_in':
                    return !this.isIn(actualValue, expectedValue);
                case 'greater_than':
                case 'gt':
                    return this.greaterThan(actualValue, expectedValue);
                case 'less_than':
                case 'lt':
                    return this.lessThan(actualValue, expectedValue);
                case 'greater_than_or_equal':
                case 'gte':
                    return this.greaterThanOrEqual(actualValue, expectedValue);
                case 'less_than_or_equal':
                case 'lte':
                    return this.lessThanOrEqual(actualValue, expectedValue);
                case 'between':
                    return this.between(actualValue, expectedValue);
                case 'is_empty':
                    return this.isEmpty(actualValue);
                case 'is_not_empty':
                    return !this.isEmpty(actualValue);
                case 'starts_with':
                    return this.startsWith(actualValue, expectedValue);
                case 'ends_with':
                    return this.endsWith(actualValue, expectedValue);
                case 'matches':
                    return this.matches(actualValue, expectedValue);
                default:
                    return false;
            }
        };
        /**
         * Check equality (handles various types)
         */
        ConditionEvaluator_2.prototype.equals = function (actual, expected) {
            if (actual === expected) {
                return true;
            }
            // Handle object comparison for response values
            if (typeof actual === 'object' && actual !== null) {
                var actualObj = actual;
                // Check common response value patterns
                if ('selectedOptionId' in actualObj) {
                    return actualObj.selectedOptionId === expected;
                }
                if ('text' in actualObj) {
                    return actualObj.text === expected;
                }
                if ('number' in actualObj) {
                    return actualObj.number === expected;
                }
                if ('rating' in actualObj) {
                    return actualObj.rating === expected;
                }
            }
            return JSON.stringify(actual) === JSON.stringify(expected);
        };
        /**
         * Check if array includes value or if value contains substring
         */
        ConditionEvaluator_2.prototype.includes = function (actual, expected) {
            // Handle response objects
            if (typeof actual === 'object' && actual !== null) {
                var actualObj = actual;
                // Multi-choice responses
                if ('selectedOptionIds' in actualObj && Array.isArray(actualObj.selectedOptionIds)) {
                    return actualObj.selectedOptionIds.includes(expected);
                }
                // Text contains
                if ('text' in actualObj && typeof actualObj.text === 'string') {
                    return actualObj.text.includes(String(expected));
                }
            }
            // Array includes
            if (Array.isArray(actual)) {
                return actual.includes(expected);
            }
            // String contains
            if (typeof actual === 'string' && typeof expected === 'string') {
                return actual.includes(expected);
            }
            return false;
        };
        /**
         * Check if value is in an array of expected values
         */
        ConditionEvaluator_2.prototype.isIn = function (actual, expected) {
            if (!Array.isArray(expected)) {
                return false;
            }
            // Handle response objects
            if (typeof actual === 'object' && actual !== null) {
                var actualObj = actual;
                if ('selectedOptionId' in actualObj) {
                    return expected.includes(actualObj.selectedOptionId);
                }
                if ('text' in actualObj) {
                    return expected.includes(actualObj.text);
                }
                if ('number' in actualObj) {
                    return expected.includes(actualObj.number);
                }
            }
            return expected.includes(actual);
        };
        /**
         * Numeric comparison: greater than
         */
        ConditionEvaluator_2.prototype.greaterThan = function (actual, expected) {
            var actualNum = this.extractNumber(actual);
            var expectedNum = this.extractNumber(expected);
            if (actualNum === null || expectedNum === null) {
                return false;
            }
            return actualNum > expectedNum;
        };
        /**
         * Numeric comparison: less than
         */
        ConditionEvaluator_2.prototype.lessThan = function (actual, expected) {
            var actualNum = this.extractNumber(actual);
            var expectedNum = this.extractNumber(expected);
            if (actualNum === null || expectedNum === null) {
                return false;
            }
            return actualNum < expectedNum;
        };
        /**
         * Numeric comparison: greater than or equal
         */
        ConditionEvaluator_2.prototype.greaterThanOrEqual = function (actual, expected) {
            var actualNum = this.extractNumber(actual);
            var expectedNum = this.extractNumber(expected);
            if (actualNum === null || expectedNum === null) {
                return false;
            }
            return actualNum >= expectedNum;
        };
        /**
         * Numeric comparison: less than or equal
         */
        ConditionEvaluator_2.prototype.lessThanOrEqual = function (actual, expected) {
            var actualNum = this.extractNumber(actual);
            var expectedNum = this.extractNumber(expected);
            if (actualNum === null || expectedNum === null) {
                return false;
            }
            return actualNum <= expectedNum;
        };
        /**
         * Range check: value is between min and max
         */
        ConditionEvaluator_2.prototype.between = function (actual, expected) {
            var _this = this;
            if (!Array.isArray(expected) || expected.length !== 2) {
                return false;
            }
            var actualNum = this.extractNumber(actual);
            var _a = expected.map(function (v) { return _this.extractNumber(v); }), min = _a[0], max = _a[1];
            if (actualNum === null || min === null || max === null) {
                return false;
            }
            return actualNum >= min && actualNum <= max;
        };
        /**
         * Check if value is empty
         */
        ConditionEvaluator_2.prototype.isEmpty = function (actual) {
            if (actual === null || actual === undefined) {
                return true;
            }
            if (typeof actual === 'string' && actual.trim() === '') {
                return true;
            }
            if (Array.isArray(actual) && actual.length === 0) {
                return true;
            }
            if (typeof actual === 'object') {
                var obj = actual;
                // Check response objects
                if ('text' in obj && (obj.text === '' || obj.text === null)) {
                    return true;
                }
                if ('selectedOptionId' in obj && obj.selectedOptionId === null) {
                    return true;
                }
                if ('selectedOptionIds' in obj && Array.isArray(obj.selectedOptionIds) && obj.selectedOptionIds.length === 0) {
                    return true;
                }
            }
            return false;
        };
        /**
         * String starts with
         */
        ConditionEvaluator_2.prototype.startsWith = function (actual, expected) {
            var actualStr = this.extractString(actual);
            var expectedStr = this.extractString(expected);
            if (actualStr === null || expectedStr === null) {
                return false;
            }
            return actualStr.startsWith(expectedStr);
        };
        /**
         * String ends with
         */
        ConditionEvaluator_2.prototype.endsWith = function (actual, expected) {
            var actualStr = this.extractString(actual);
            var expectedStr = this.extractString(expected);
            if (actualStr === null || expectedStr === null) {
                return false;
            }
            return actualStr.endsWith(expectedStr);
        };
        /**
         * Regex match
         */
        ConditionEvaluator_2.prototype.matches = function (actual, expected) {
            var actualStr = this.extractString(actual);
            if (actualStr === null || typeof expected !== 'string') {
                return false;
            }
            try {
                var regex = new RegExp(expected);
                return regex.test(actualStr);
            }
            catch (_a) {
                return false;
            }
        };
        /**
         * Extract number from various value types
         */
        ConditionEvaluator_2.prototype.extractNumber = function (value) {
            if (typeof value === 'number') {
                return value;
            }
            if (typeof value === 'string') {
                var parsed = parseFloat(value);
                return isNaN(parsed) ? null : parsed;
            }
            if (typeof value === 'object' && value !== null) {
                var obj = value;
                if ('number' in obj && typeof obj.number === 'number') {
                    return obj.number;
                }
                if ('rating' in obj && typeof obj.rating === 'number') {
                    return obj.rating;
                }
            }
            return null;
        };
        /**
         * Extract string from various value types
         */
        ConditionEvaluator_2.prototype.extractString = function (value) {
            if (typeof value === 'string') {
                return value;
            }
            if (typeof value === 'object' && value !== null) {
                var obj = value;
                if ('text' in obj && typeof obj.text === 'string') {
                    return obj.text;
                }
                if ('selectedOptionId' in obj && typeof obj.selectedOptionId === 'string') {
                    return obj.selectedOptionId;
                }
            }
            return null;
        };
        return ConditionEvaluator_2;
    }());
    __setFunctionName(_classThis, "ConditionEvaluator");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConditionEvaluator = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConditionEvaluator = _classThis;
}();
exports.ConditionEvaluator = ConditionEvaluator;
