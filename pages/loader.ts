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

import fs from 'fs';
import path from 'path'
export const loadPage = (template: string | null, callback?: () => void):void => {
    if(template === null) return;
    const content = fs.readFileSync(path.join(__dirname, 'page-template', template + '.html'), 'utf-8');
    const container = document.getElementById('page-container');
    if (!container) throw new Error("No container!");
    container.innerHTML = content;
    setTimeout(() => {
        if(callback) callback();
    }, 100);
}
export const loadExternalPage = (pluginName: string | null, template: string | null): void => {
    if(template==null || pluginName==null) return;
    const pluginPath = path.join(__dirname, '..', '..', '..', '..', 'plugins', pluginName);
    const pluginFuncs = require(path.join(pluginPath, 'entry.js'));
    const pages = pluginFuncs.pages;
    const content = fs.readFileSync(path.join(pluginPath, 'template', template+'.html'), 'utf-8');
    const container = document.getElementById('page-container');
    if(!container) return;
    container.innerHTML=content;
    setTimeout(() => {
        pages.forEach((navButton:any) => {
            if(navButton.name == template && navButton.callback) navButton.callback();
        })
    }, 100);
}
export const sidebarSelect = (index: number) => {
    const el = document.getElementsByClassName('side-bar-item');
    const sidebarItems = [...el];
    sidebarItems.forEach((item, i) => {
        if(index === i) {
            document.getElementById(item.id)?.classList.add('active');
        }else{
            document.getElementById(item.id)?.classList.remove('active');
        }
    });
}
export default loadPage;