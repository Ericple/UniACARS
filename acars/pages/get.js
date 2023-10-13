"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postData = exports.getResource = void 0;
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const getResource = (url) => {
    if (url.lastIndexOf('https://') == -1) {
        return new Promise((resolve, reject) => {
            http_1.default.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
                res.on('error', (err) => {
                    reject(err);
                });
            });
        });
    }
    else {
        return new Promise((resolve, reject) => {
            https_1.default.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
                res.on('error', (err) => {
                    reject(err);
                });
            });
        });
    }
};
exports.getResource = getResource;
const postData = (url, body, port, contentType) => {
    if (url.lastIndexOf('https://') == -1) {
        return new Promise((resolve, reject) => {
            var _a;
            http_1.default.request({
                hostname: url,
                port: port,
                method: 'POST',
                headers: {
                    'Content-Type': contentType !== null && contentType !== void 0 ? contentType : "application/json",
                    'Content-Length': (_a = body === null || body === void 0 ? void 0 : body.length) !== null && _a !== void 0 ? _a : 0
                }
            }, res => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
                res.on('error', (err) => {
                    reject(err);
                });
            });
        });
    }
    else {
        return new Promise((resolve, reject) => {
            var _a;
            https_1.default.request({
                hostname: url,
                port: 443,
                method: 'POST',
                headers: {
                    'Content-Type': contentType !== null && contentType !== void 0 ? contentType : "application/json",
                    'Content-Length': (_a = body === null || body === void 0 ? void 0 : body.length) !== null && _a !== void 0 ? _a : 0
                }
            }, res => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
                res.on('error', (err) => {
                    reject(err);
                });
            });
        });
    }
};
exports.postData = postData;
exports.default = exports.getResource;
