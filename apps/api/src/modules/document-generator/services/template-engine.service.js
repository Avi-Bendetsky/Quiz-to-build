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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateEngineService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var TemplateEngineService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TemplateEngineService = _classThis = /** @class */ (function () {
        function TemplateEngineService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(TemplateEngineService.name);
        }
        /**
         * Assemble template data from session responses
         */
        TemplateEngineService_1.prototype.assembleTemplateData = function (sessionId, documentTypeSlug) {
            return __awaiter(this, void 0, void 0, function () {
                var documentType, responses, content, standards;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.documentType.findUnique({
                                where: { slug: documentTypeSlug },
                                include: {
                                    standardMappings: {
                                        include: {
                                            standard: true,
                                        },
                                        orderBy: { priority: 'asc' },
                                    },
                                },
                            })];
                        case 1:
                            documentType = _a.sent();
                            if (!documentType) {
                                throw new common_1.NotFoundException("Document type with slug '".concat(documentTypeSlug, "' not found"));
                            }
                            return [4 /*yield*/, this.prisma.response.findMany({
                                    where: {
                                        sessionId: sessionId,
                                        isValid: true,
                                    },
                                    include: {
                                        question: {
                                            select: {
                                                id: true,
                                                text: true,
                                                type: true,
                                                documentMappings: true,
                                                options: true,
                                            },
                                        },
                                    },
                                })];
                        case 2:
                            responses = _a.sent();
                            content = this.mapResponsesToContent(responses, documentTypeSlug);
                            if (documentType.category === client_1.DocumentCategory.CTO &&
                                documentType.standardMappings.length > 0) {
                                standards = this.buildStandardsSections(documentType.standardMappings);
                            }
                            return [2 /*return*/, {
                                    metadata: {
                                        documentType: documentType.name,
                                        category: documentType.category,
                                        generatedAt: new Date(),
                                        version: '1.0',
                                    },
                                    content: content,
                                    standards: standards,
                                }];
                    }
                });
            });
        };
        /**
         * Map responses to nested content object using documentMappings
         */
        TemplateEngineService_1.prototype.mapResponsesToContent = function (responses, documentTypeSlug) {
            var content = {};
            for (var _i = 0, responses_1 = responses; _i < responses_1.length; _i++) {
                var response = responses_1[_i];
                var mappings = response.question.documentMappings;
                if (!mappings || !mappings[documentTypeSlug]) {
                    continue;
                }
                var path = mappings[documentTypeSlug];
                var value = this.extractResponseValue(response);
                this.setNestedValue(content, path, value);
            }
            return content;
        };
        /**
         * Extract the actual value from a response based on question type
         */
        TemplateEngineService_1.prototype.extractResponseValue = function (response) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var value = response.value, question = response.question;
            var responseValue = value;
            switch (question.type) {
                case 'TEXT':
                case 'TEXTAREA':
                case 'EMAIL':
                case 'URL':
                    return (_a = responseValue.text) !== null && _a !== void 0 ? _a : '';
                case 'NUMBER':
                    return (_b = responseValue.number) !== null && _b !== void 0 ? _b : 0;
                case 'DATE':
                    return (_c = responseValue.date) !== null && _c !== void 0 ? _c : null;
                case 'SCALE':
                    return (_d = responseValue.rating) !== null && _d !== void 0 ? _d : 0;
                case 'SINGLE_CHOICE': {
                    var selectedId_1 = responseValue.selectedOptionId;
                    var options = question.options;
                    var selected = options === null || options === void 0 ? void 0 : options.find(function (o) { return o.value === selectedId_1; });
                    return (_e = selected === null || selected === void 0 ? void 0 : selected.label) !== null && _e !== void 0 ? _e : selectedId_1;
                }
                case 'MULTIPLE_CHOICE': {
                    var selectedIds = responseValue.selectedOptionIds;
                    var options_1 = question.options;
                    return ((_f = selectedIds === null || selectedIds === void 0 ? void 0 : selectedIds.map(function (id) {
                        var _a;
                        var option = options_1 === null || options_1 === void 0 ? void 0 : options_1.find(function (o) { return o.value === id; });
                        return (_a = option === null || option === void 0 ? void 0 : option.label) !== null && _a !== void 0 ? _a : id;
                    })) !== null && _f !== void 0 ? _f : []);
                }
                case 'FILE_UPLOAD':
                    return (_g = responseValue.fileUrl) !== null && _g !== void 0 ? _g : null;
                case 'MATRIX':
                    return (_h = responseValue.matrix) !== null && _h !== void 0 ? _h : {};
                default:
                    return value;
            }
        };
        /**
         * Set a value at a nested path using dot notation
         */
        TemplateEngineService_1.prototype.setNestedValue = function (obj, path, value) {
            var parts = path.split('.');
            var current = obj;
            for (var i = 0; i < parts.length - 1; i++) {
                var part = parts[i];
                if (!(part in current)) {
                    current[part] = {};
                }
                current = current[part];
            }
            current[parts[parts.length - 1]] = value;
        };
        /**
         * Build standards sections for CTO documents
         */
        TemplateEngineService_1.prototype.buildStandardsSections = function (mappings) {
            return mappings.map(function (mapping) {
                var _a;
                return ({
                    category: mapping.standard.category,
                    title: (_a = mapping.sectionTitle) !== null && _a !== void 0 ? _a : mapping.standard.title,
                    description: mapping.standard.description,
                    principles: mapping.standard.principles.slice(0, 5), // Limit to top 5 principles per section
                });
            });
        };
        /**
         * Get value from template data using dot notation path
         */
        TemplateEngineService_1.prototype.getValue = function (data, path) {
            var parts = path.split('.');
            var current = data.content;
            for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                var part = parts_1[_i];
                if (current === null || current === undefined) {
                    return undefined;
                }
                current = current[part];
            }
            return current;
        };
        /**
         * Check if all required fields are present in template data
         */
        TemplateEngineService_1.prototype.validateRequiredFields = function (data, requiredPaths) {
            var missingFields = [];
            for (var _i = 0, requiredPaths_1 = requiredPaths; _i < requiredPaths_1.length; _i++) {
                var path = requiredPaths_1[_i];
                var value = this.getValue(data, path);
                if (value === undefined || value === null || value === '') {
                    missingFields.push(path);
                }
            }
            return {
                valid: missingFields.length === 0,
                missingFields: missingFields,
            };
        };
        return TemplateEngineService_1;
    }());
    __setFunctionName(_classThis, "TemplateEngineService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TemplateEngineService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TemplateEngineService = _classThis;
}();
exports.TemplateEngineService = TemplateEngineService;
