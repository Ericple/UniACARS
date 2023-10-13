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

const path = require('path');
const loader = require(path.join(__dirname, 'loader.js'));
const dashboardPage = require(path.join(__dirname, 'script', 'dashboard.js'));
const bookingsPage = require(path.join(__dirname, 'script', 'bookings.js'));
const ofpPage = require(path.join(__dirname, 'script', 'ofp.js'));
const mapPage = require(path.join(__dirname, 'script', 'map.js'));
const acarsPage = require(path.join(__dirname, 'script', 'acars.js'));
const settingPage = require(path.join(__dirname, 'script', 'setting.js'));
const { ipcRenderer } = require('electron');
const fs = require('fs');
const itn = require(path.join(__dirname, 'inten.js'));
const { getResource, postData } = require(path.join(__dirname, 'get.js'));
const weather = require(path.join(__dirname, 'getWeather.js'));

const UNIACARS_API = {
    getCurrentUserName: () => {
        return localStorage.getItem('uniacars-username');
    },
    readSetting: (key) => {
        return localStorage.getItem(key);
    },
    writeSetting: (key, value) => {
        localStorage.setItem(key, value);
    },
    internationalize: itn.p_internationalize,
    postData: postData,
    getResource: getResource,
    getVersion: () => {return `uniAPI ver.1.2.1`},
    activeFlight: () => {
        return localStorage.getItem('uniacars-active-acars-bid');
    },
    msgBox: (title, message, callback) => {
        const titleField=document.getElementById('modal-simple-title');
        const bodyField=document.getElementById('modal-simple-body');
        const callbackField=document.getElementById('modal-simple-close');
        titleField.innerText=title;
        bodyField.innerText=message;
        callbackField.onclick=callback;
    },
    dangerBox: (title, message, callback) => {
        const titleField = document.getElementById('modal-danger-title');
        const bodyField=document.getElementById('modal-danger-body');
        const callbackField=document.getElementById('modal-danger-confirm');
        titleField.innerText=title;
        bodyField.innerText=message;
        callbackField.onclick=callback;
    },
    loadExternalPage: loader.loadExternalPage,
    weatherAPI: weather
}
Object.defineProperty(window, 'UNIACARS_API', {
    value: UNIACARS_API,
    writable: false,
    configurable: false,
    enumerable: false
});

// Load plugins
const navSideBar = document.getElementById('app-side-nav');
const pluginPath = path.join(__dirname, '..', '..', '..', '..', 'plugins');
const pluginList = fs.readdirSync(pluginPath);
pluginList.forEach(pluginName => {
    const pathToPlugin = path.join(pluginPath, pluginName);
    const pluginProps = require(path.join(pathToPlugin, 'entry.js'));
    const pages = pluginProps.pages;
    if (pages === undefined) return;
    if (typeof (pages) !== 'object') return;
    pages.forEach(page => {
        const nav = document.createElement('div');
        nav.id = 'side-bar-' + page.name;
        nav.setAttribute('page', page.name);
        nav.setAttribute('plugin', pluginName);
        nav.classList.add('side-bar-item');
        nav.setAttribute('title', page.tooltip);
        nav.setAttribute('data-bs-toggle', 'tooltip');
        if (page.icon.type === 'fontawesome') {
            const icon = document.createElement('i');
            icon.classList.add('fa', 'fa-' + page.icon.key);
            nav.appendChild(icon);
        } else {
            const icon = document.createElement('img');
            icon.setAttribute('src', path.join(pathToPlugin, page.icon.src));
            icon.setAttribute('width', '22');
            icon.setAttribute('alt', page.name);
            nav.appendChild(icon);
        }
        nav.setAttribute('external', 'true');
        navSideBar.appendChild(nav);
    });
})

const sideBarItemsPrototype = document.getElementsByClassName('side-bar-item');
const sideBarItems = [...sideBarItemsPrototype];

ipcRenderer.on('log-path', (e, arg) => {
    console.log(arg);
});
ipcRenderer.on('started', () => {
    console.log("background service started");
});

const pageMap = new Map();
pageMap.set('dashboard', dashboardPage.dashboardFunc);
pageMap.set('sbofp', ofpPage.ofpFunc);
pageMap.set('bookings', bookingsPage.loadBookings);
pageMap.set('map', mapPage.loadingMap);
pageMap.set('acars', acarsPage.loadAcarsPage);
pageMap.set('setting', settingPage.loadSetting);
sideBarItems.forEach((sideBarItem, index) => {
    const el = document.getElementById(sideBarItem.id);
    if (!el) throw new Error("No element");
    el.onclick = function () {
        sideBarItems.forEach((sideBarItem) => {
            const el = document.getElementById(sideBarItem.id);
            el.classList.remove('active');
        });
        el.classList.add('active');
        const templateName = sideBarItem.attributes.getNamedItem('page')?.value;
        if (!templateName) throw new Error("Invalid templateName, reading: " + templateName);
        const page = document.getElementById('container-page');
        page.classList.remove('animate__fadeInLeft');
        page.classList.add('animate__fadeOutRight');
        setTimeout(() => {
            if (el.hasAttribute('external')) {
                const plugin = el.getAttribute('plugin');
                loader.loadExternalPage(plugin, templateName);
            } else {
                loader.loadPage(templateName, pageMap.get(templateName));
            }
        }, 100);
    }
});
loader.loadPage('dashboard', dashboardPage.dashboardFunc);