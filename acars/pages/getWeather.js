"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTAF = exports.getMETAR = void 0;
const cheerio = __importStar(require("cheerio"));
const get_1 = __importDefault(require("./get"));
const getMETAR = (icao) => {
    return new Promise((resolve, reject) => {
        (0, get_1.default)(`http://xmairavt7.xiamenair.com/WarningPage/AirportInfo?arp4code=${icao.toUpperCase()}`)
            .then(result => {
            const $ = cheerio.load(result);
            $("p").each((index, element) => {
                if (index === 6) {
                    resolve($(element).text());
                }
            });
        }).catch(e => {
            reject(e);
        });
    });
};
exports.getMETAR = getMETAR;
const getTAF = (icao) => {
    return new Promise((resolve, reject) => {
        (0, get_1.default)(`http://xmairavt7.xiamenair.com/WarningPage/AirportInfo?arp4code=${icao.toUpperCase()}`)
            .then(result => {
            const $ = cheerio.load(result);
            $("p").each((index, element) => {
                if (index === 5) {
                    resolve($(element).text());
                }
            });
        }).catch(e => {
            reject(e);
        });
    });
};
exports.getTAF = getTAF;
exports.default = {
    getMETAR: exports.getMETAR, getTAF: exports.getTAF
};
