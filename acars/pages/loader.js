"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sidebarSelect = exports.loadExternalPage = exports.loadPage = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const loadPage = (template, callback) => {
    if (template === null)
        return;
    const content = fs_1.default.readFileSync(path_1.default.join(__dirname, 'page-template', template + '.html'), 'utf-8');
    const container = document.getElementById('page-container');
    if (!container)
        throw new Error("No container!");
    container.innerHTML = content;
    setTimeout(() => {
        if (callback)
            callback();
    }, 100);
};
exports.loadPage = loadPage;
const loadExternalPage = (pluginName, template) => {
    if (template == null || pluginName == null)
        return;
    const pluginPath = path_1.default.join(__dirname, '..', '..', '..', '..', 'plugins', pluginName);
    const pluginFuncs = require(path_1.default.join(pluginPath, 'entry.js'));
    const pages = pluginFuncs.pages;
    const content = fs_1.default.readFileSync(path_1.default.join(pluginPath, 'template', template + '.html'), 'utf-8');
    const container = document.getElementById('page-container');
    if (!container)
        return;
    container.innerHTML = content;
    setTimeout(() => {
        pages.forEach((navButton) => {
            if (navButton.name == template && navButton.callback)
                navButton.callback();
        });
    }, 100);
};
exports.loadExternalPage = loadExternalPage;
const sidebarSelect = (index) => {
    const el = document.getElementsByClassName('side-bar-item');
    const sidebarItems = [...el];
    sidebarItems.forEach((item, i) => {
        var _a, _b;
        if (index === i) {
            (_a = document.getElementById(item.id)) === null || _a === void 0 ? void 0 : _a.classList.add('active');
        }
        else {
            (_b = document.getElementById(item.id)) === null || _b === void 0 ? void 0 : _b.classList.remove('active');
        }
    });
};
exports.sidebarSelect = sidebarSelect;
exports.default = exports.loadPage;
