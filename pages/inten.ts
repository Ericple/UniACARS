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

import path from 'path';
import fs from 'fs';
import { ipcRenderer } from 'electron';
export const p_internationalize = (pluinName: string) => {
    const intenElments = document.getElementsByTagName('itn');
    const otherElments = document.getElementsByName("itn");
    const otArray = [...otherElments];
    const intenArray = [...intenElments];
    const __lang = localStorage.getItem('uniacars-lang');
    const lang = __lang == null ? "English" : __lang;
    let langPath = path.join(__dirname, '..', '..', '..', '..',pluinName, 'languages', lang+'.json');
    if (!fs.existsSync(langPath)) langPath=path.join(__dirname, '..', '..', '..', '..',pluinName, 'languages', 'english.json');
    const __temp_lang = fs.readFileSync(langPath, 'utf-8');
    const langPool = JSON.parse(__temp_lang);

    if (!langPool) {
        ipcRenderer.invoke('language-err');
        return;
    }

    intenArray.forEach(intenElement => {
        const __word_key = intenElement.getAttribute("i-slot");
        if (__word_key == null) return;
        const __word = langPool[__word_key];
        if (__word == undefined) return;
        intenElement.innerHTML = __word;
    });
    otArray.forEach(otEl => {
        const __word_key = otEl.getAttribute("i-slot");
        if (__word_key == null) return;
        const __word = langPool[__word_key];
        if (__word == undefined) return;
        otEl.innerHTML = __word;
    });
}
export const internationalize = () => {
    const intenElments = document.getElementsByTagName('itn');
    const otherElments = document.getElementsByName("itn");
    const otArray = [...otherElments];
    const intenArray = [...intenElments];
    const __lang = localStorage.getItem('uniacars-lang');
    const lang = __lang == null ? "English" : __lang;
    const langPath = path.join(__dirname, '..', '..', '..', '..', 'languages', lang, "lang.json");
    const __temp_lang = fs.readFileSync(langPath, 'utf-8');
    const langPool = JSON.parse(__temp_lang);

    if (!langPool) {
        ipcRenderer.invoke('language-err');
        return;
    }

    intenArray.forEach(intenElement => {
        const __word_key = intenElement.getAttribute("i-slot");
        if (__word_key == null) return;
        const __word = langPool[__word_key];
        if (__word == undefined) return;
        intenElement.innerHTML = __word;
    });
    otArray.forEach(otEl => {
        const __word_key = otEl.getAttribute("i-slot");
        if (__word_key == null) return;
        const __word = langPool[__word_key];
        if (__word == undefined) return;
        otEl.innerHTML = __word;
    });
}
export const getCurrentLanguage = () => {
    const __lang = localStorage.getItem('uniacars-lang');
    const lang = __lang == null ? "English" : __lang;
    return lang;
}