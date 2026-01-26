"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVisibilityRuleDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var create_visibility_rule_dto_1 = require("./create-visibility-rule.dto");
var UpdateVisibilityRuleDto = /** @class */ (function (_super) {
    __extends(UpdateVisibilityRuleDto, _super);
    function UpdateVisibilityRuleDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdateVisibilityRuleDto;
}((0, swagger_1.PartialType)(create_visibility_rule_dto_1.CreateVisibilityRuleDto)));
exports.UpdateVisibilityRuleDto = UpdateVisibilityRuleDto;
