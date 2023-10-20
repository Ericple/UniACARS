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
exports.loadSetting = void 0;
const electron_1 = require("electron");
const loader_1 = __importStar(require("../loader"));
const ofp_1 = require("./ofp");
const jquery_1 = __importDefault(require("jquery"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const inten_1 = require("../inten");
const loadSetting = () => {
    localStorage.setItem('uniacars-enable-voice-recog', '0');
    const resetSimbrief = document.getElementById('reset-simbrief');
    const useImperial = document.getElementById('use-imperial');
    const enablePA = document.getElementById('enable-pa');
    const selectSoundPack = document.getElementById('sound-pack-select');
    const logOut = document.getElementById('log-out');
    const autoRefreshSet = document.getElementById('log-refresh');
    const resetSoftware = document.getElementById('reset');
    const themeSelect = document.getElementById('theme-style-select');
    const darkOption = document.getElementById('dark-theme-option');
    const lightOption = document.getElementById('light-theme-option');
    const languageSelect = document.getElementById('language-select');
    const enableVoiceRecognition = document.getElementById('enable-vocrec');
    if (!languageSelect || !enableVoiceRecognition || !logOut || !themeSelect || !darkOption || !lightOption || !resetSoftware || !selectSoundPack || !enablePA || !useImperial || !resetSimbrief || !autoRefreshSet)
        return;
    const simbriefIdent = localStorage.getItem('uniacars-simb-ident');
    const imperialUnit = localStorage.getItem('uniacars-imperial-unit');
    const autoRefresh = localStorage.getItem('uniacars-log-auto-refresh');
    const PAenabled = localStorage.getItem('uniacars-enable-voice-service');
    const activeSoundPack = localStorage.getItem('uniacars-soundpack-name');
    const bidId = localStorage.getItem('uniacars-active-acars-bid');
    const soundpacks = fs_1.default.readdirSync(path_1.default.join(__dirname, '..', '..', '..', '..', '..', 'soundpack'));
    const languagePacks = fs_1.default.readdirSync(path_1.default.join(__dirname, '..', '..', '..', '..', '..', 'languages'));
    soundpacks.forEach(soundpack => {
        selectSoundPack.innerHTML += `<option value="${soundpack}" ${soundpack == activeSoundPack ? "selected" : ""}>${soundpack.toUpperCase()}</option>`;
    });
    languagePacks.forEach(languagePack => {
        const lang = (0, inten_1.getCurrentLanguage)();
        if (languagePack == lang) {
            languageSelect.innerHTML += `<option value="${languagePack}" selected>${languagePack.toUpperCase()}</option>`;
        }
        else {
            languageSelect.innerHTML += `<option value="${languagePack}">${languagePack.toUpperCase()}</option>`;
        }
    });
    if (PAenabled !== null) {
        enablePA.setAttribute('checked', '');
        selectSoundPack.removeAttribute('disabled');
    }
    if (bidId !== null) {
        enablePA.setAttribute('disabled', '');
        selectSoundPack.setAttribute('disabled', '');
    }
    if (autoRefresh != null)
        autoRefreshSet === null || autoRefreshSet === void 0 ? void 0 : autoRefreshSet.setAttribute('checked', '');
    if (imperialUnit == '1')
        useImperial.setAttribute('checked', '');
    const enableRecog = localStorage.getItem('uniacars-enable-voice-recog');
    if (enableRecog == '1')
        enableVoiceRecognition.setAttribute('checked', '');
    if (simbriefIdent == null)
        resetSimbrief.setAttribute('disabled', '');
    if (activeSoundPack == null || activeSoundPack == 'default')
        selectSoundPack.value = 'default';
    resetSimbrief.onclick = function () {
        localStorage.removeItem('uniacars-simb-ident');
        (0, loader_1.default)('sbofp', ofp_1.ofpFunc);
        (0, loader_1.sidebarSelect)(3);
    };
    useImperial.onchange = function () {
        if (useImperial.checked) {
            localStorage.setItem('uniacars-imperial-unit', '1');
        }
        else {
            localStorage.setItem('uniacars-imperial-unit', '0');
        }
    };
    enableVoiceRecognition.onchange = function () {
        if (enableVoiceRecognition.checked) {
            localStorage.setItem('uniacars-enable-voice-recog', '1');
        }
        else {
            localStorage.setItem('uniacars-enable-voice-recog', '0');
        }
    };
    enablePA.onchange = function () {
        if (enablePA.checked) {
            localStorage.setItem('uniacars-enable-voice-service', '1');
            selectSoundPack.removeAttribute('disabled');
            selectSoundPack.value = 'default';
        }
        else {
            selectSoundPack.setAttribute('disabled', '');
            localStorage.removeItem('uniacars-enable-voice-service');
            localStorage.removeItem('uniacars-soundpack-name');
        }
    };
    selectSoundPack.onchange = function () {
        localStorage.setItem('uniacars-soundpack-name', selectSoundPack.value);
    };
    languageSelect.onchange = function () {
        localStorage.setItem('uniacars-lang', languageSelect.value);
        (0, inten_1.internationalize)();
    };
    logOut.onclick = function () {
        localStorage.removeItem('uniacars-password');
        electron_1.ipcRenderer.invoke('app-log-out');
    };
    autoRefreshSet.onchange = function () {
        if (autoRefreshSet.checked) {
            localStorage.setItem('uniacars-log-auto-refresh', '1');
        }
        else {
            localStorage.removeItem('uniacars-log-auto-refresh');
        }
    };
    resetSoftware.onclick = function () {
        (0, jquery_1.default)("#modal-danger-title").text(`WARNING`);
        (0, jquery_1.default)("#modal-danger-body").text("YOU SHOULD NOT TOUCH THIS BUTTON UNLESS YOU ARE DEVELOPER");
        (0, jquery_1.default)("#modal-danger-confirm").text("Reset all data");
        (0, jquery_1.default)("#modal-danger-confirm").on('click', () => {
            localStorage.clear();
            electron_1.ipcRenderer.invoke('app-log-out');
        });
    };
    const localTheme = localStorage.getItem('uniacars-theme');
    if (localTheme == null || localTheme == 'light')
        lightOption.setAttribute('selected', '');
    if (localTheme == 'dark')
        darkOption.setAttribute('selected', '');
    themeSelect.onchange = function () {
        localStorage.setItem('uniacars-theme', themeSelect.value);
        if (themeSelect.value == 'light') {
            document.body.classList.remove('theme-dark');
        }
        else {
            document.body.classList.add('theme-dark');
        }
    };
    (0, inten_1.internationalize)();
};
exports.loadSetting = loadSetting;
