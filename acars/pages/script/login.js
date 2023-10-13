const path = require('path');
const global = require(path.join(__dirname, 'script', 'global.js'));
const loginButton = document.getElementById('login');
const identInput = document.getElementById('ident');
const passwordInput = document.getElementById('password');
const rememberInput = document.getElementById('remember');
const resource = require(path.join(__dirname, 'get.js'));
const airlineList = document.getElementById('airline-select');
const loginImg = document.getElementById('login-img');
const get = require(path.join(__dirname, 'get.js'));

airlineList.onchange = function () {
    if (airlineList.options[airlineList.selectedIndex].value !== "") {
        loginButton.removeAttribute('disabled');
        loginImg.style.backgroundImage = `url(${airlineList.options[airlineList.selectedIndex].bg})`;
    } else {
        loginButton.setAttribute('disabled', '');
    }
}

resource.getResource('http://openvmsys.cn:9120').then((airlines) => {
    airlines = JSON.parse(airlines);
    let options = [];
    airlines.forEach(airline => {
        const option = document.createElement('option');
        option.value = airline.url;
        option.innerHTML = airline.name;
        option.bg = airline.bg;
        option.setAttribute('forceSyncTime', airline.forceSyncTime);
        if (airline.url == localStorage.getItem('uniacars-req-url')) {
            option.setAttribute('selected', '');
            loginButton.removeAttribute('disabled');
            loginImg.style.backgroundImage = `url(${option.bg})`;
        }
        airlineList.appendChild(option);
        options.push(option);
    });
    identInput.value = localStorage.getItem('uniacars-username');
    passwordInput.value = localStorage.getItem('uniacars-password');

    if (localStorage.getItem('uniacars-username') !== null && localStorage.getItem('uniacars-password') !== null) {
        get.getResource(`${airlineList.options[airlineList.selectedIndex].value}${global.backendUrl}login&ident=${identInput.value}&pass=${passwordInput.value}&remember=${rememberInput.checked ? 1 : 0}`).then(data => {
            loginButton.removeAttribute('disabled');
            if (data !== '-1' && data !== '-2') {
                localStorage.setItem('uniacars-force-sync-time', airlineList.options[airlineList.selectedIndex].getAttribute('forceSyncTime'));
                localStorage.setItem('uniacars-session', JSON.parse(data).session);
                electron.ipcRenderer.invoke('app-login');
            }
        });
    }

    loginButton.onclick = function () {
        loginButton.setAttribute('disabled', '');
        if (rememberInput.checked) {
            localStorage.setItem('uniacars-req-url', airlineList.options[airlineList.selectedIndex].value);
            localStorage.setItem('uniacars-username', identInput.value);
            localStorage.setItem('uniacars-password', passwordInput.value);
        }
        get.getResource(`${airlineList.options[airlineList.selectedIndex].value}${global.backendUrl}login&ident=${identInput.value}&pass=${passwordInput.value}&remember=${rememberInput.checked ? 1 : 0}`).then(data => {
            loginButton.removeAttribute('disabled');
            if (data !== '-1' && data !== '-2') {
                localStorage.setItem('uniacars-req-url', airlineList.options[airlineList.selectedIndex].value);
                localStorage.setItem('uniacars-session', JSON.parse(data).session);
                electron.ipcRenderer.invoke('app-login');
            }
        });
    }
});