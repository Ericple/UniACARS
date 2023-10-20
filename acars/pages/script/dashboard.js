"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardFunc = void 0;
const get_1 = __importDefault(require("../get"));
const inten_1 = require("../inten");
const global_1 = __importDefault(require("./global"));
const dashboardFunc = () => {
    const flightHourField = document.getElementById('flight-hours');
    const pirepsField = document.getElementById('total-pireps');
    const milesField = document.getElementById('total-miles');
    const ldgrateField = document.getElementById('ldg-rate');
    const pilotNameField = document.getElementById('pilot-name');
    const newsTitleField = document.getElementById('news-title');
    const newsBodyField = document.getElementById('news-body');
    const noticeContainer = document.getElementById('notice-container');
    const newsPosterField = document.getElementById('news-poster');
    const pilotRankField = document.getElementById('pilot-rank');
    if (!pilotRankField || !newsPosterField || !newsTitleField || !newsBodyField || !flightHourField || !pirepsField || !milesField || !ldgrateField || !pilotNameField || !noticeContainer)
        return;
    (0, get_1.default)(`${localStorage.getItem('uniacars-req-url')}${global_1.default}info&sid=${localStorage.getItem('uniacars-session')}`).then(data => {
        const result = JSON.parse(data);
        flightHourField.innerText = result.totalhours.replace('.', ':');
        pirepsField.innerText = result.totalflights;
        milesField.innerText = result.totalMiles + ' nm';
        ldgrateField.innerText = result.tdavg.toFixed(2) + ' fpm';
        pilotNameField.innerText = result.firstname + " " + result.lastname;
        pilotRankField.innerText = result.rank;
    });
    (0, get_1.default)(`${localStorage.getItem('uniacars-req-url')}${global_1.default}notice&sid=${localStorage.getItem('uniacars-session')}`).then(data => {
        const result = JSON.parse(data);
        if (result === null || result.length === 0) {
            const root = document.createElement('div');
            root.classList.add('col-12', 'animate__animated', 'animate__fadeInRight');
            const noNotice = document.createElement('div');
            noNotice.classList.add('alert', 'alert-info');
            noNotice.innerText = "There's no notice for your company.";
            root.appendChild(noNotice);
            noticeContainer.appendChild(root);
        }
        else {
            result.forEach((notice) => {
                const root = document.createElement('div');
                root.classList.add('animate__animated', 'animate__fadeInRight');
                const alert = document.createElement('div');
                alert.classList.add('alert', `alert-${notice.level == 'alert' ? 'warning' : notice.level == 'info' ? 'info' : 'danger'}`);
                const title = document.createElement('h2');
                const body = document.createElement('p');
                title.innerText = notice.title;
                body.innerText = notice.message;
                alert.appendChild(title);
                alert.appendChild(body);
                root.appendChild(alert);
                noticeContainer.appendChild(root);
            });
        }
    });
    (0, get_1.default)(`${localStorage.getItem('uniacars-req-url')}${global_1.default}news`).then(data => {
        const news = JSON.parse(data);
        newsTitleField.innerText = news.subject;
        newsPosterField.innerText = news.postdate + " by " + news.postedby;
        newsBodyField.innerHTML = news.body;
    });
    const date = new Date();
    const hour = date.getHours();
    const greetword = document.getElementById('greet-word');
    if (!greetword)
        return;
    if (hour > 7 && hour <= 11) {
        greetword.setAttribute('i-slot', 'greet-word-morning');
    }
    else if (hour > 11 && hour <= 13) {
        greetword.setAttribute('i-slot', 'greet-word-noon');
    }
    else if (hour > 13 && hour <= 17) {
        greetword.setAttribute('i-slot', 'greet-word-afternoon');
    }
    else {
        greetword.setAttribute('i-slot', 'greet-word-hi');
    }
    (0, inten_1.internationalize)();
};
exports.dashboardFunc = dashboardFunc;
exports.default = exports.dashboardFunc;
