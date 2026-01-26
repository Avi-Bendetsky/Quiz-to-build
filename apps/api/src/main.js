"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@nestjs/core");
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var swagger_1 = require("@nestjs/swagger");
var helmet_1 = require("helmet");
var app_module_1 = require("./app.module");
var http_exception_filter_1 = require("./common/filters/http-exception.filter");
var transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
var logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var logger, app, configService, port, apiPrefix, nodeEnv, config, document_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger = new common_1.Logger('Bootstrap');
                    return [4 /*yield*/, core_1.NestFactory.create(app_module_1.AppModule)];
                case 1:
                    app = _a.sent();
                    configService = app.get(config_1.ConfigService);
                    port = configService.get('PORT', 3000);
                    apiPrefix = configService.get('API_PREFIX', 'api/v1');
                    nodeEnv = configService.get('NODE_ENV', 'development');
                    // Security middleware
                    app.use((0, helmet_1.default)());
                    // CORS configuration
                    app.enableCors({
                        origin: configService.get('CORS_ORIGIN', '*'),
                        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
                        credentials: true,
                    });
                    // Global prefix
                    app.setGlobalPrefix(apiPrefix);
                    // Global pipes
                    app.useGlobalPipes(new common_1.ValidationPipe({
                        whitelist: true,
                        forbidNonWhitelisted: true,
                        transform: true,
                        transformOptions: {
                            enableImplicitConversion: true,
                        },
                    }));
                    // Global filters
                    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
                    // Global interceptors
                    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor(), new logging_interceptor_1.LoggingInterceptor());
                    // Swagger documentation (only in development)
                    if (nodeEnv !== 'production') {
                        config = new swagger_1.DocumentBuilder()
                            .setTitle('Adaptive Questionnaire API')
                            .setDescription('API documentation for the Adaptive Client Questionnaire System')
                            .setVersion('1.0')
                            .addBearerAuth({
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT',
                            name: 'JWT',
                            description: 'Enter JWT token',
                            in: 'header',
                        }, 'JWT-auth')
                            .addTag('auth', 'Authentication endpoints')
                            .addTag('users', 'User management endpoints')
                            .addTag('questionnaires', 'Questionnaire endpoints')
                            .addTag('sessions', 'Session management endpoints')
                            .addTag('health', 'Health check endpoints')
                            .build();
                        document_1 = swagger_1.SwaggerModule.createDocument(app, config);
                        swagger_1.SwaggerModule.setup('docs', app, document_1);
                        logger.log("Swagger documentation available at /docs");
                    }
                    // Graceful shutdown
                    app.enableShutdownHooks();
                    return [4 /*yield*/, app.listen(port)];
                case 2:
                    _a.sent();
                    logger.log("Application is running on: http://localhost:".concat(port, "/").concat(apiPrefix));
                    logger.log("Environment: ".concat(nodeEnv));
                    return [2 /*return*/];
            }
        });
    });
}
bootstrap().catch(function (error) {
    var logger = new common_1.Logger('Bootstrap');
    logger.error('Failed to start application', error);
    process.exit(1);
});
