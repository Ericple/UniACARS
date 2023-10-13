"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.page = void 0;
const path_1 = __importDefault(require("path"));
const page = (target) => {
    return path_1.default.join(__dirname, target) + ".html";
};
exports.page = page;
