"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.StandardsService = void 0;
var common_1 = require("@nestjs/common");
var standard_types_1 = require("./types/standard.types");
var StandardsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var StandardsService = _classThis = /** @class */ (function () {
        function StandardsService_1(prisma) {
            this.prisma = prisma;
        }
        StandardsService_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                var standards;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.engineeringStandard.findMany({
                                where: { isActive: true },
                                orderBy: { category: 'asc' },
                            })];
                        case 1:
                            standards = _a.sent();
                            return [2 /*return*/, standards.map(function (standard) { return _this.mapToResponse(standard); })];
                    }
                });
            });
        };
        StandardsService_1.prototype.findByCategory = function (category) {
            return __awaiter(this, void 0, void 0, function () {
                var standard;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.engineeringStandard.findUnique({
                                where: { category: category },
                            })];
                        case 1:
                            standard = _a.sent();
                            if (!standard) {
                                throw new common_1.NotFoundException("Standard category ".concat(category, " not found"));
                            }
                            return [2 /*return*/, this.mapToResponse(standard)];
                    }
                });
            });
        };
        StandardsService_1.prototype.findWithMappings = function (category) {
            return __awaiter(this, void 0, void 0, function () {
                var standard;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.engineeringStandard.findUnique({
                                where: { category: category },
                                include: {
                                    documentMappings: {
                                        include: {
                                            documentType: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    slug: true,
                                                },
                                            },
                                        },
                                        orderBy: { priority: 'asc' },
                                    },
                                },
                            })];
                        case 1:
                            standard = _a.sent();
                            if (!standard) {
                                throw new common_1.NotFoundException("Standard category ".concat(category, " not found"));
                            }
                            return [2 /*return*/, __assign(__assign({}, this.mapToResponse(standard)), { documentTypes: standard.documentMappings.map(function (mapping) {
                                        var _a;
                                        return ({
                                            id: mapping.documentType.id,
                                            name: mapping.documentType.name,
                                            slug: mapping.documentType.slug,
                                            sectionTitle: (_a = mapping.sectionTitle) !== null && _a !== void 0 ? _a : undefined,
                                            priority: mapping.priority,
                                        });
                                    }) })];
                    }
                });
            });
        };
        StandardsService_1.prototype.getStandardsForDocument = function (documentTypeIdOrSlug) {
            return __awaiter(this, void 0, void 0, function () {
                var documentType;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.documentType.findFirst({
                                where: {
                                    OR: [
                                        { id: documentTypeIdOrSlug },
                                        { slug: documentTypeIdOrSlug },
                                    ],
                                },
                                include: {
                                    standardMappings: {
                                        where: {
                                            standard: {
                                                isActive: true,
                                            },
                                        },
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
                                throw new common_1.NotFoundException("Document type ".concat(documentTypeIdOrSlug, " not found"));
                            }
                            return [2 /*return*/, documentType.standardMappings.map(function (mapping) {
                                    return _this.mapToResponse(mapping.standard);
                                })];
                    }
                });
            });
        };
        StandardsService_1.prototype.generateStandardsSection = function (documentTypeIdOrSlug) {
            return __awaiter(this, void 0, void 0, function () {
                var documentType, standards, markdown;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.documentType.findFirst({
                                where: {
                                    OR: [
                                        { id: documentTypeIdOrSlug },
                                        { slug: documentTypeIdOrSlug },
                                    ],
                                },
                                include: {
                                    standardMappings: {
                                        where: {
                                            standard: {
                                                isActive: true,
                                            },
                                        },
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
                                throw new common_1.NotFoundException("Document type ".concat(documentTypeIdOrSlug, " not found"));
                            }
                            if (documentType.standardMappings.length === 0) {
                                return [2 /*return*/, {
                                        markdown: '',
                                        standards: [],
                                    }];
                            }
                            standards = documentType.standardMappings.map(function (mapping) { return ({
                                category: mapping.standard.category,
                                title: mapping.sectionTitle || standard_types_1.STANDARD_CATEGORY_TITLES[mapping.standard.category],
                                principles: mapping.standard.principles,
                            }); });
                            markdown = this.generateMarkdown(standards);
                            return [2 /*return*/, {
                                    markdown: markdown,
                                    standards: standards,
                                }];
                    }
                });
            });
        };
        StandardsService_1.prototype.generateMarkdown = function (standards) {
            if (standards.length === 0) {
                return '';
            }
            var lines = [
                '## Engineering Standards Applied',
                '',
                'This document adheres to the following engineering standards and best practices:',
                '',
            ];
            for (var _i = 0, standards_1 = standards; _i < standards_1.length; _i++) {
                var standard = standards_1[_i];
                lines.push("### ".concat(standard.title));
                lines.push('');
                for (var _a = 0, _b = standard.principles; _a < _b.length; _a++) {
                    var principle = _b[_a];
                    lines.push("- **".concat(principle.title, "**: ").concat(principle.description));
                }
                lines.push('');
            }
            lines.push('---');
            lines.push('');
            lines.push('*Standards Version: 2026*');
            return lines.join('\n');
        };
        StandardsService_1.prototype.mapToResponse = function (standard) {
            return {
                id: standard.id,
                category: standard.category,
                title: standard.title,
                description: standard.description,
                principles: standard.principles,
                version: standard.version,
                isActive: standard.isActive,
            };
        };
        return StandardsService_1;
    }());
    __setFunctionName(_classThis, "StandardsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StandardsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StandardsService = _classThis;
}();
exports.StandardsService = StandardsService;
var StandardsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var StandardsService = _classThis = /** @class */ (function () {
        function StandardsService_2(prisma) {
            this.prisma = prisma;
        }
        StandardsService_2.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                var standards;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.engineeringStandard.findMany({
                                where: { isActive: true },
                                orderBy: { category: 'asc' },
                            })];
                        case 1:
                            standards = _a.sent();
                            return [2 /*return*/, standards.map(function (standard) { return _this.mapToResponse(standard); })];
                    }
                });
            });
        };
        StandardsService_2.prototype.findByCategory = function (category) {
            return __awaiter(this, void 0, void 0, function () {
                var standard;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.engineeringStandard.findUnique({
                                where: { category: category },
                            })];
                        case 1:
                            standard = _a.sent();
                            if (!standard) {
                                throw new common_1.NotFoundException("Standard category ".concat(category, " not found"));
                            }
                            return [2 /*return*/, this.mapToResponse(standard)];
                    }
                });
            });
        };
        StandardsService_2.prototype.findWithMappings = function (category) {
            return __awaiter(this, void 0, void 0, function () {
                var standard;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.engineeringStandard.findUnique({
                                where: { category: category },
                                include: {
                                    documentMappings: {
                                        include: {
                                            documentType: {
                                                select: {
                                                    id: true,
                                                    name: true,
                                                    slug: true,
                                                },
                                            },
                                        },
                                        orderBy: { priority: 'asc' },
                                    },
                                },
                            })];
                        case 1:
                            standard = _a.sent();
                            if (!standard) {
                                throw new common_1.NotFoundException("Standard category ".concat(category, " not found"));
                            }
                            return [2 /*return*/, __assign(__assign({}, this.mapToResponse(standard)), { documentTypes: standard.documentMappings.map(function (mapping) {
                                        var _a;
                                        return ({
                                            id: mapping.documentType.id,
                                            name: mapping.documentType.name,
                                            slug: mapping.documentType.slug,
                                            sectionTitle: (_a = mapping.sectionTitle) !== null && _a !== void 0 ? _a : undefined,
                                            priority: mapping.priority,
                                        });
                                    }) })];
                    }
                });
            });
        };
        StandardsService_2.prototype.getStandardsForDocument = function (documentTypeIdOrSlug) {
            return __awaiter(this, void 0, void 0, function () {
                var documentType;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.documentType.findFirst({
                                where: {
                                    OR: [
                                        { id: documentTypeIdOrSlug },
                                        { slug: documentTypeIdOrSlug },
                                    ],
                                },
                                include: {
                                    standardMappings: {
                                        where: {
                                            standard: {
                                                isActive: true,
                                            },
                                        },
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
                                throw new common_1.NotFoundException("Document type ".concat(documentTypeIdOrSlug, " not found"));
                            }
                            return [2 /*return*/, documentType.standardMappings.map(function (mapping) {
                                    return _this.mapToResponse(mapping.standard);
                                })];
                    }
                });
            });
        };
        StandardsService_2.prototype.generateStandardsSection = function (documentTypeIdOrSlug) {
            return __awaiter(this, void 0, void 0, function () {
                var documentType, standards, markdown;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.documentType.findFirst({
                                where: {
                                    OR: [
                                        { id: documentTypeIdOrSlug },
                                        { slug: documentTypeIdOrSlug },
                                    ],
                                },
                                include: {
                                    standardMappings: {
                                        where: {
                                            standard: {
                                                isActive: true,
                                            },
                                        },
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
                                throw new common_1.NotFoundException("Document type ".concat(documentTypeIdOrSlug, " not found"));
                            }
                            if (documentType.standardMappings.length === 0) {
                                return [2 /*return*/, {
                                        markdown: '',
                                        standards: [],
                                    }];
                            }
                            standards = documentType.standardMappings.map(function (mapping) { return ({
                                category: mapping.standard.category,
                                title: mapping.sectionTitle || standard_types_1.STANDARD_CATEGORY_TITLES[mapping.standard.category],
                                principles: mapping.standard.principles,
                            }); });
                            markdown = this.generateMarkdown(standards);
                            return [2 /*return*/, {
                                    markdown: markdown,
                                    standards: standards,
                                }];
                    }
                });
            });
        };
        StandardsService_2.prototype.generateMarkdown = function (standards) {
            if (standards.length === 0) {
                return '';
            }
            var lines = [
                '## Engineering Standards Applied',
                '',
                'This document adheres to the following engineering standards and best practices:',
                '',
            ];
            for (var _i = 0, standards_2 = standards; _i < standards_2.length; _i++) {
                var standard = standards_2[_i];
                lines.push("### ".concat(standard.title));
                lines.push('');
                for (var _a = 0, _b = standard.principles; _a < _b.length; _a++) {
                    var principle = _b[_a];
                    lines.push("- **".concat(principle.title, "**: ").concat(principle.description));
                }
                lines.push('');
            }
            lines.push('---');
            lines.push('');
            lines.push('*Standards Version: 2026*');
            return lines.join('\n');
        };
        StandardsService_2.prototype.mapToResponse = function (standard) {
            return {
                id: standard.id,
                category: standard.category,
                title: standard.title,
                description: standard.description,
                principles: standard.principles,
                version: standard.version,
                isActive: standard.isActive,
            };
        };
        return StandardsService_2;
    }());
    __setFunctionName(_classThis, "StandardsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StandardsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StandardsService = _classThis;
}();
exports.StandardsService = StandardsService;
