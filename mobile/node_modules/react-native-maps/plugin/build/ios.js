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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.addMapsCocoapods = exports.removeGoogleMapsAppDelegateInit = exports.addGoogleMapsAppDelegateInit = exports.removeGoogleMapsAppDelegateImport = exports.addGoogleMapsAppDelegateImport = exports.withMapsIOS = exports.MATCH_INIT = void 0;
var ios_plugins_1 = require("@expo/config-plugins/build/plugins/ios-plugins");
var generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
exports.MATCH_INIT = /\bsuper\.application\(\w+?, didFinishLaunchingWithOptions: \w+?\)/g;
var withMapsIOS = function (config, props) {
    // Set in Info.plist
    if (props === null || props === void 0 ? void 0 : props.iosGoogleMapsApiKey) {
        config = (0, ios_plugins_1.withInfoPlist)(config, function (conf) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!conf.ios) {
                    conf.ios = {};
                }
                if (!conf.ios.infoPlist) {
                    conf.ios.infoPlist = {};
                }
                conf.ios.infoPlist.GMSApiKey = props === null || props === void 0 ? void 0 : props.iosGoogleMapsApiKey;
                return [2 /*return*/, conf];
            });
        }); });
    }
    // Technically adds react-native-maps (Apple maps) and google maps.
    config = withMapsCocoaPods(config, {
        useGoogleMaps: !!(props === null || props === void 0 ? void 0 : props.iosGoogleMapsApiKey),
    });
    // Adds/Removes AppDelegate setup for Google Maps API on iOS
    config = withGoogleMapsAppDelegate(config, {
        apiKey: (props === null || props === void 0 ? void 0 : props.iosGoogleMapsApiKey) || null,
    });
    return config;
};
exports.withMapsIOS = withMapsIOS;
function addGoogleMapsAppDelegateImport(src) {
    var newSrc = ['#if canImport(GoogleMaps)', 'import GoogleMaps', '#endif'];
    return (0, generateCode_1.mergeContents)({
        tag: 'react-native-maps-import',
        src: src,
        newSrc: newSrc.join('\n'),
        anchor: /@UIApplicationMain/,
        offset: 0,
        comment: '//',
    });
}
exports.addGoogleMapsAppDelegateImport = addGoogleMapsAppDelegateImport;
function removeGoogleMapsAppDelegateImport(src) {
    return (0, generateCode_1.removeContents)({
        tag: 'react-native-maps-import',
        src: src,
    });
}
exports.removeGoogleMapsAppDelegateImport = removeGoogleMapsAppDelegateImport;
function addGoogleMapsAppDelegateInit(src, apiKey) {
    var newSrc = [
        '#if canImport(GoogleMaps)',
        "GMSServices.provideAPIKey(\"".concat(apiKey, "\")"),
        '#endif',
    ];
    return (0, generateCode_1.mergeContents)({
        tag: 'react-native-maps-init',
        src: src,
        newSrc: newSrc.join('\n'),
        anchor: exports.MATCH_INIT,
        offset: 0,
        comment: '//',
    });
}
exports.addGoogleMapsAppDelegateInit = addGoogleMapsAppDelegateInit;
function removeGoogleMapsAppDelegateInit(src) {
    return (0, generateCode_1.removeContents)({
        tag: 'react-native-maps-init',
        src: src,
    });
}
exports.removeGoogleMapsAppDelegateInit = removeGoogleMapsAppDelegateInit;
/**
 * @param src The contents of the Podfile.
 * @param useGoogleMaps if GoogleMaps for iOS is used
 * @returns Podfile with react-native-maps integration configured.
 */
function addMapsCocoapods(src, useGoogleMaps) {
    var newSrc = '  rn_maps_path = File.dirname(`node --print "require.resolve(\'react-native-maps/package.json\')"`) \n';
    if (useGoogleMaps) {
        newSrc += "  pod 'react-native-maps/Google', :path => rn_maps_path \n";
    }
    return (0, generateCode_1.mergeContents)({
        tag: 'react-native-maps',
        src: src,
        newSrc: newSrc,
        anchor: /use_native_modules/,
        offset: 0,
        comment: '#',
    });
}
exports.addMapsCocoapods = addMapsCocoapods;
var withMapsCocoaPods = function (config, _a) {
    var useGoogleMaps = _a.useGoogleMaps;
    return (0, ios_plugins_1.withPodfile)(config, function (conf) { return __awaiter(void 0, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            try {
                results = addMapsCocoapods(conf.modResults.contents, useGoogleMaps);
            }
            catch (error) {
                if (error.code === 'ERR_NO_MATCH') {
                    throw new Error("Cannot add react-native-maps to the project's ios/Podfile because it's malformed. Please report this with a copy of your project Podfile.");
                }
                throw error;
            }
            if (results.didMerge || results.didClear) {
                conf.modResults.contents = results.contents;
            }
            return [2 /*return*/, conf];
        });
    }); });
};
var withGoogleMapsAppDelegate = function (config, _a) {
    var apiKey = _a.apiKey;
    return (0, ios_plugins_1.withAppDelegate)(config, function (conf) {
        if (!apiKey) {
            conf.modResults.contents = removeGoogleMapsAppDelegateImport(conf.modResults.contents).contents;
            conf.modResults.contents = removeGoogleMapsAppDelegateInit(conf.modResults.contents).contents;
            return conf;
        }
        if (conf.modResults.language !== 'swift') {
            throw new Error("Cannot setup Google Maps because the project AppDelegate is not a supported language: ".concat(conf.modResults.language));
        }
        try {
            conf.modResults.contents = addGoogleMapsAppDelegateImport(conf.modResults.contents).contents;
            conf.modResults.contents = addGoogleMapsAppDelegateInit(conf.modResults.contents, apiKey).contents;
        }
        catch (error) {
            if (error.code === 'ERR_NO_MATCH') {
                throw new Error("Cannot add Google Maps to the project's AppDelegate because it's malformed. Please report this with a copy of your project AppDelegate.");
            }
            throw error;
        }
        return conf;
    });
};
