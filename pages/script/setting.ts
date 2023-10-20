// Copyright (C) 2023  Guo Tingjin

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { ipcRenderer } from "electron";
import loadPage, { sidebarSelect } from "../loader";
import { ofpFunc } from "./ofp";
import $ from 'jquery';
import fs from 'fs';
import path from 'path';
import { getCurrentLanguage, internationalize } from "../inten";

export const loadSetting = () => {
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
    if (!languageSelect || !enableVoiceRecognition || !logOut || !themeSelect || !darkOption || !lightOption || !resetSoftware || !selectSoundPack || !enablePA || !useImperial || !resetSimbrief || !autoRefreshSet) return;
    const simbriefIdent = localStorage.getItem('uniacars-simb-ident');
    const imperialUnit = localStorage.getItem('uniacars-imperial-unit');
    const autoRefresh = localStorage.getItem('uniacars-log-auto-refresh');
    const PAenabled = localStorage.getItem('uniacars-enable-voice-service');
    const activeSoundPack = localStorage.getItem('uniacars-soundpack-name');
    const bidId = localStorage.getItem('uniacars-active-acars-bid');
    const soundpacks = fs.readdirSync(path.join(__dirname, '..', '..', '..', '..', '..', 'soundpack'));
    const languagePacks = fs.readdirSync(path.join(__dirname, '..', '..', '..', '..', '..', 'languages'));
    soundpacks.forEach(soundpack => {
        selectSoundPack.innerHTML += `<option value="${soundpack}" ${soundpack == activeSoundPack ? "selected" : ""}>${soundpack.toUpperCase()}</option>`;
    });
    languagePacks.forEach(languagePack => {
        const lang = getCurrentLanguage();
        if (languagePack == lang) {
            languageSelect.innerHTML += `<option value="${languagePack}" selected>${languagePack.toUpperCase()}</option>`;
        } else {
            languageSelect.innerHTML += `<option value="${languagePack}">${languagePack.toUpperCase()}</option>`;
        }
    })
    if (PAenabled !== null) {
        enablePA.setAttribute('checked', '');
        selectSoundPack.removeAttribute('disabled');
    }
    if (bidId !== null) {
        enablePA.setAttribute('disabled', '');
        selectSoundPack.setAttribute('disabled', '');
    }
    if (autoRefresh != null) autoRefreshSet?.setAttribute('checked', '');
    if (imperialUnit == '1') useImperial.setAttribute('checked', '');
    const enableRecog = localStorage.getItem('uniacars-enable-voice-recog');
    if (enableRecog == '1') enableVoiceRecognition.setAttribute('checked', '');
    if (simbriefIdent == null) resetSimbrief.setAttribute('disabled', '');
    if (activeSoundPack == null || activeSoundPack == 'default') (selectSoundPack as any).value = 'default';
    resetSimbrief.onclick = function () {
        localStorage.removeItem('uniacars-simb-ident');
        loadPage('sbofp', ofpFunc);
        sidebarSelect(3);
    }
    useImperial.onchange = function () {
        if ((useImperial as any).checked) {
            localStorage.setItem('uniacars-imperial-unit', '1');
        } else {
            localStorage.setItem('uniacars-imperial-unit', '0');
        }
    }
    enableVoiceRecognition.onchange = function () {
        if ((enableVoiceRecognition as any).checked) {
            localStorage.setItem('uniacars-enable-voice-recog', '1');
        } else {
            localStorage.setItem('uniacars-enable-voice-recog', '0');
        }
    }
    enablePA.onchange = function () {
        if ((enablePA as any).checked) {
            localStorage.setItem('uniacars-enable-voice-service', '1');
            selectSoundPack.removeAttribute('disabled');
            (selectSoundPack as any).value = 'default';
        } else {
            selectSoundPack.setAttribute('disabled', '');
            localStorage.removeItem('uniacars-enable-voice-service');
            localStorage.removeItem('uniacars-soundpack-name');
        }
    }
    selectSoundPack.onchange = function () {
        localStorage.setItem('uniacars-soundpack-name', (selectSoundPack as any).value);
    }
    languageSelect.onchange = function () {
        localStorage.setItem('uniacars-lang', (languageSelect as any).value);
        internationalize();
    }
    logOut.onclick = function () {
        localStorage.removeItem('uniacars-password');
        ipcRenderer.invoke('app-log-out');
    }
    autoRefreshSet.onchange = function () {
        if ((autoRefreshSet as any).checked) {
            localStorage.setItem('uniacars-log-auto-refresh', '1');
        } else {
            localStorage.removeItem('uniacars-log-auto-refresh');
        }
    }
    resetSoftware.onclick = function () {
        $("#modal-danger-title").text(`WARNING`);
        $("#modal-danger-body").text("YOU SHOULD NOT TOUCH THIS BUTTON UNLESS YOU ARE DEVELOPER");
        $("#modal-danger-confirm").text("Reset all data");
        $("#modal-danger-confirm").on('click', () => {
            localStorage.clear();
            ipcRenderer.invoke('app-log-out');
        });
    }
    const localTheme = localStorage.getItem('uniacars-theme');
    if (localTheme == null || localTheme == 'light') lightOption.setAttribute('selected', '');
    if (localTheme == 'dark') darkOption.setAttribute('selected', '');
    themeSelect.onchange = function () {
        localStorage.setItem('uniacars-theme', (themeSelect as any).value);
        if ((themeSelect as any).value == 'light') {
            document.body.classList.remove('theme-dark');
        } else {
            document.body.classList.add('theme-dark');
        }
    }
    internationalize();
}