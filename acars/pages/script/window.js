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

const electron = require('electron');
const closeButton = document.getElementById('app-close');
const maxresButton = document.getElementById('app-maxres');
const miniButton = document.getElementById('app-minimize');
const siger = electron.ipcRenderer;
const maxresIcon = document.getElementById('icon-maxres');
const wident = document.getElementById('window-ident');
closeButton.onclick = function() {
    localStorage.removeItem('uniacars-active-acars-bid');
    siger.invoke('app-quit', wident.getAttribute('wident'));
}
maxresButton.onclick = function() {
    siger.invoke('app-maxres', wident.getAttribute('wident'));
}
miniButton.onclick = function() {
    siger.invoke('app-minimize', wident.getAttribute('wident'));
}
siger.on('maximized', () => {
    maxresIcon.classList.remove('codicon-chromee-maximize');
    maxresIcon.classList.add('codicon-chrome-restore');
})
siger.on('restored', () => {
    maxresIcon.classList.remove('codicon-chrome-restore');
    maxresIcon.classList.add('codicon-chrome-maximize');
})