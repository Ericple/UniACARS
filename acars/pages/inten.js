"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentLanguage = exports.internationalize = exports.p_internationalize = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const electron_1 = require("electron");
const p_internationalize = (pluinName) => {
    const intenElments = document.getElementsByTagName('itn');
    const otherElments = document.getElementsByName("itn");
    const otArray = [...otherElments];
    const intenArray = [...intenElments];
    const __lang = localStorage.getItem('uniacars-lang');
    const lang = __lang == null ? "English" : __lang;
    let langPath = path_1.default.join(__dirname, '..', '..', '..', '..', pluinName, 'languages', lang + '.json');
    if (!fs_1.default.existsSync(langPath))
        langPath = path_1.default.join(__dirname, '..', '..', '..', '..', pluinName, 'languages', 'english.json');
    const __temp_lang = fs_1.default.readFileSync(langPath, 'utf-8');
    const langPool = JSON.parse(__temp_lang);
    if (!langPool) {
        electron_1.ipcRenderer.invoke('language-err');
        return;
    }
    intenArray.forEach(intenElement => {
        const __word_key = intenElement.getAttribute("i-slot");
        if (__word_key == null)
            return;
        const __word = langPool[__word_key];
        if (__word == undefined)
            return;
        intenElement.innerHTML = __word;
    });
    otArray.forEach(otEl => {
        const __word_key = otEl.getAttribute("i-slot");
        if (__word_key == null)
            return;
        const __word = langPool[__word_key];
        if (__word == undefined)
            return;
        otEl.innerHTML = __word;
    });
};
exports.p_internationalize = p_internationalize;
const internationalize = () => {
    const intenElments = document.getElementsByTagName('itn');
    const otherElments = document.getElementsByName("itn");
    const otArray = [...otherElments];
    const intenArray = [...intenElments];
    const __lang = localStorage.getItem('uniacars-lang');
    const lang = __lang == null ? "English" : __lang;
    const langPath = path_1.default.join(__dirname, '..', '..', '..', '..', 'languages', lang, "lang.json");
    const __temp_lang = fs_1.default.readFileSync(langPath, 'utf-8');
    const langPool = JSON.parse(__temp_lang);
    if (!langPool) {
        electron_1.ipcRenderer.invoke('language-err');
        return;
    }
    intenArray.forEach(intenElement => {
        const __word_key = intenElement.getAttribute("i-slot");
        if (__word_key == null)
            return;
        const __word = langPool[__word_key];
        if (__word == undefined)
            return;
        intenElement.innerHTML = __word;
    });
    otArray.forEach(otEl => {
        const __word_key = otEl.getAttribute("i-slot");
        if (__word_key == null)
            return;
        const __word = langPool[__word_key];
        if (__word == undefined)
            return;
        otEl.innerHTML = __word;
    });
};
exports.internationalize = internationalize;
const getCurrentLanguage = () => {
    const __lang = localStorage.getItem('uniacars-lang');
    const lang = __lang == null ? "English" : __lang;
    return lang;
};
exports.getCurrentLanguage = getCurrentLanguage;
