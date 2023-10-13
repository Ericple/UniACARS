import getResource from '../get';
import { getCurrentLanguage, internationalize } from '../inten';
import backendUrl from './global';
export const dashboardFunc = (): void => {
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
    if (!pilotRankField||!newsPosterField || !newsTitleField || !newsBodyField || !flightHourField || !pirepsField || !milesField || !ldgrateField || !pilotNameField || !noticeContainer) return;
    getResource(`${localStorage.getItem('uniacars-req-url')}${backendUrl}info&sid=${localStorage.getItem('uniacars-session')}`).then(data => {
        const result = JSON.parse(data);
        flightHourField.innerText = result.totalhours.replace('.', ':');
        pirepsField.innerText = result.totalflights;
        milesField.innerText = result.totalMiles + ' nm';
        ldgrateField.innerText = <number><unknown>result.tdavg.toFixed(2) + ' fpm';
        pilotNameField.innerText = result.firstname + " " + result.lastname;
        pilotRankField.innerText=result.rank;
    });
    getResource(`${localStorage.getItem('uniacars-req-url')}${backendUrl}notice&sid=${localStorage.getItem('uniacars-session')}`).then(data => {
        const result = JSON.parse(data);
        if (result === null || result.length === 0) {
            const root = document.createElement('div');
            root.classList.add('col-12', 'animate__animated', 'animate__fadeInRight');
            const noNotice = document.createElement('div');
            noNotice.classList.add('alert', 'alert-info');
            noNotice.innerText = "There's no notice for your company.";
            root.appendChild(noNotice);
            noticeContainer.appendChild(root);
        } else {
            result.forEach((notice: any) => {
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
    getResource(`${localStorage.getItem('uniacars-req-url')}${backendUrl}news`).then(data => {
        const news = JSON.parse(data);
        newsTitleField.innerText = news.subject;
        newsPosterField.innerText = news.postdate + " by " + news.postedby;
        newsBodyField.innerHTML = news.body
    });
    const date = new Date();
    const hour = date.getHours();
    const greetword = document.getElementById('greet-word');
    if (!greetword) return;
    if (hour > 7 && hour <= 11) {
        greetword.setAttribute('i-slot','greet-word-morning');
    } else if (hour > 11 && hour <= 13) {
        greetword.setAttribute('i-slot','greet-word-noon');
    } else if (hour > 13 && hour <= 17) {
        greetword.setAttribute('i-slot','greet-word-afternoon');
    } else {
        greetword.setAttribute('i-slot','greet-word-hi');
    }
    internationalize();
}

export default dashboardFunc;