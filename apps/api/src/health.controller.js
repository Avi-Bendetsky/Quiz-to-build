"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var throttler_1 = require("@nestjs/throttler");
var HealthController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('health'), (0, common_1.Controller)('health'), (0, throttler_1.SkipThrottle)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _check_decorators;
    var _ready_decorators;
    var _live_decorators;
    var HealthController = _classThis = /** @class */ (function () {
        function HealthController_1() {
            __runInitializers(this, _instanceExtraInitializers);
        }
        HealthController_1.prototype.check = function () {
            return {
                status: 'ok',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development',
            };
        };
        HealthController_1.prototype.ready = function () {
            return { ready: true };
        };
        HealthController_1.prototype.live = function () {
            return { alive: true };
        };
        return HealthController_1;
    }());
    __setFunctionName(_classThis, "HealthController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _check_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' })];
        _ready_decorators = [(0, common_1.Get)('ready'), (0, swagger_1.ApiOperation)({ summary: 'Readiness check endpoint' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is ready' })];
        _live_decorators = [(0, common_1.Get)('live'), (0, swagger_1.ApiOperation)({ summary: 'Liveness check endpoint' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is alive' })];
        __esDecorate(_classThis, null, _check_decorators, { kind: "method", name: "check", static: false, private: false, access: { has: function (obj) { return "check" in obj; }, get: function (obj) { return obj.check; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _ready_decorators, { kind: "method", name: "ready", static: false, private: false, access: { has: function (obj) { return "ready" in obj; }, get: function (obj) { return obj.ready; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _live_decorators, { kind: "method", name: "live", static: false, private: false, access: { has: function (obj) { return "live" in obj; }, get: function (obj) { return obj.live; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HealthController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HealthController = _classThis;
}();
exports.HealthController = HealthController;
var HealthController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('health'), (0, common_1.Controller)('health'), (0, throttler_1.SkipThrottle)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _check_decorators;
    var _ready_decorators;
    var _live_decorators;
    var HealthController = _classThis = /** @class */ (function () {
        function HealthController_2() {
            __runInitializers(this, _instanceExtraInitializers);
        }
        HealthController_2.prototype.check = function () {
            return {
                status: 'ok',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development',
            };
        };
        HealthController_2.prototype.ready = function () {
            return { ready: true };
        };
        HealthController_2.prototype.live = function () {
            return { alive: true };
        };
        return HealthController_2;
    }());
    __setFunctionName(_classThis, "HealthController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _check_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Health check endpoint' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' })];
        _ready_decorators = [(0, common_1.Get)('ready'), (0, swagger_1.ApiOperation)({ summary: 'Readiness check endpoint' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is ready' })];
        _live_decorators = [(0, common_1.Get)('live'), (0, swagger_1.ApiOperation)({ summary: 'Liveness check endpoint' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is alive' })];
        __esDecorate(_classThis, null, _check_decorators, { kind: "method", name: "check", static: false, private: false, access: { has: function (obj) { return "check" in obj; }, get: function (obj) { return obj.check; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _ready_decorators, { kind: "method", name: "ready", static: false, private: false, access: { has: function (obj) { return "ready" in obj; }, get: function (obj) { return obj.ready; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _live_decorators, { kind: "method", name: "live", static: false, private: false, access: { has: function (obj) { return "live" in obj; }, get: function (obj) { return obj.live; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HealthController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HealthController = _classThis;
}();
exports.HealthController = HealthController;
