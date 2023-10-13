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