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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestGenerationDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var RequestGenerationDto = function () {
    var _a;
    var _sessionId_decorators;
    var _sessionId_initializers = [];
    var _sessionId_extraInitializers = [];
    var _documentTypeId_decorators;
    var _documentTypeId_initializers = [];
    var _documentTypeId_extraInitializers = [];
    var _format_decorators;
    var _format_initializers = [];
    var _format_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RequestGenerationDto() {
                this.sessionId = __runInitializers(this, _sessionId_initializers, void 0);
                this.documentTypeId = (__runInitializers(this, _sessionId_extraInitializers), __runInitializers(this, _documentTypeId_initializers, void 0));
                this.format = (__runInitializers(this, _documentTypeId_extraInitializers), __runInitializers(this, _format_initializers, 'DOCX'));
                __runInitializers(this, _format_extraInitializers);
            }
            return RequestGenerationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _sessionId_decorators = [(0, swagger_1.ApiProperty)({
                    example: '123e4567-e89b-12d3-a456-426614174000',
                    description: 'Session ID to generate document from',
                }), (0, class_validator_1.IsUUID)()];
            _documentTypeId_decorators = [(0, swagger_1.ApiProperty)({
                    example: '123e4567-e89b-12d3-a456-426614174000',
                    description: 'Document type ID to generate',
                }), (0, class_validator_1.IsUUID)()];
            _format_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'DOCX',
                    description: 'Output format (only DOCX supported)',
                    default: 'DOCX',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['DOCX'])];
            __esDecorate(null, null, _sessionId_decorators, { kind: "field", name: "sessionId", static: false, private: false, access: { has: function (obj) { return "sessionId" in obj; }, get: function (obj) { return obj.sessionId; }, set: function (obj, value) { obj.sessionId = value; } }, metadata: _metadata }, _sessionId_initializers, _sessionId_extraInitializers);
            __esDecorate(null, null, _documentTypeId_decorators, { kind: "field", name: "documentTypeId", static: false, private: false, access: { has: function (obj) { return "documentTypeId" in obj; }, get: function (obj) { return obj.documentTypeId; }, set: function (obj, value) { obj.documentTypeId = value; } }, metadata: _metadata }, _documentTypeId_initializers, _documentTypeId_extraInitializers);
            __esDecorate(null, null, _format_decorators, { kind: "field", name: "format", static: false, private: false, access: { has: function (obj) { return "format" in obj; }, get: function (obj) { return obj.format; }, set: function (obj, value) { obj.format = value; } }, metadata: _metadata }, _format_initializers, _format_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RequestGenerationDto = RequestGenerationDto;
