"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ios_1 = require("./ios");
var android_1 = require("./android");
var withMaps = function (config, props) {
    config = (0, ios_1.withMapsIOS)(config, props);
    config = (0, android_1.default)(config, props);
    return config;
};
exports.default = withMaps;
