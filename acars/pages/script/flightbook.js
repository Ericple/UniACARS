"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadFlightBook = void 0;
const global_1 = __importDefault(require("./global"));
const loader_1 = __importDefault(require("../loader"));
const bookings_1 = require("./bookings");
const get_1 = __importDefault(require("../get"));
const inten_1 = require("../inten");
const list_js_1 = __importDefault(require("list.js"));
const loadFlightBook = () => {
    const backButton = document.getElementById('bookings-page');
    const sid = localStorage.getItem('uniacars-session');
    const table = document.getElementById('table-flight-book');
    const acList = document.getElementById('modal-choose-ac-list');
    const filter = document.getElementById('flight-filter');
    const confirmButton = document.getElementById('modal-choose-ac-confirm');
    if (!backButton || !sid || !table || !acList || !confirmButton || !filter)
        return;
    backButton.onclick = function () {
        (0, loader_1.default)('bookings', bookings_1.loadBookings);
    };
    filter.oninput = () => {
        const filterWord = filter.value;
        const nodes = document.getElementsByClassName('flight-to-book');
        const flights = [...nodes];
        flights.forEach(flightElement => {
            flightElement.classList.remove('d-none');
        });
        flights.forEach(flightElement => {
            const flightNum = flightElement.getAttribute('fn');
            const arrival = flightElement.getAttribute('arr');
            const ac = flightElement.getAttribute('ac');
            if ((flightNum === null || flightNum === void 0 ? void 0 : flightNum.indexOf(filterWord.toUpperCase())) == -1 && (arrival === null || arrival === void 0 ? void 0 : arrival.indexOf(filterWord.toUpperCase())) == -1 && (ac === null || ac === void 0 ? void 0 : ac.indexOf(filterWord.toUpperCase())) == -1) {
                flightElement.classList.add('d-none');
            }
        });
    };
    (0, get_1.default)(`${localStorage.getItem('uniacars-req-url')}${global_1.default}findschedule&sid=${sid}`)
        .then(result => {
        const schedules = JSON.parse(result);
        schedules.forEach((schedule) => {
            if (schedule.enabled !== "1" || schedule.bidid !== "0")
                return;
            const el = document.createElement('tr');
            el.classList.add('flight-to-book');
            const fn = document.createElement('td');
            fn.classList.add('sort-flightNum');
            fn.innerText = schedule.code + schedule.flightnum;
            el.appendChild(fn);
            const dep = document.createElement('td');
            dep.classList.add('sort-departure');
            dep.innerText = schedule.depicao;
            el.appendChild(dep);
            const arr = document.createElement('td');
            arr.classList.add('sort-arrival');
            arr.innerText = schedule.arricao;
            el.appendChild(arr);
            const ac = document.createElement('td');
            ac.classList.add('sort-aircraft');
            ac.innerText = schedule.aircrafticao;
            el.appendChild(ac);
            const fl = document.createElement('td');
            fl.classList.add('sort-level');
            fl.innerText = schedule.flightlevel;
            el.appendChild(fl);
            const dis = document.createElement('td');
            dis.classList.add('sort-distance');
            dis.innerText = schedule.distance;
            el.appendChild(dis);
            const depT = document.createElement('td');
            depT.classList.add('sort-depTime');
            depT.innerText = schedule.deptime;
            el.appendChild(depT);
            const arrT = document.createElement('td');
            arrT.classList.add('sort-arrTime');
            arrT.innerText = schedule.arrtime;
            el.appendChild(arrT);
            el.setAttribute('fn', schedule.code + schedule.flightnum);
            el.setAttribute('arr', schedule.arricao);
            el.setAttribute('ac', schedule.aircrafticao);
            const operation = document.createElement('td');
            const bookButton = document.createElement('button');
            bookButton.classList.add('btn', 'btn-outlined', 'btn-sm');
            bookButton.setAttribute('data-bs-toggle', 'modal');
            bookButton.setAttribute('data-bs-target', '#modal-choose');
            bookButton.onclick = () => {
                (0, get_1.default)(`${localStorage.getItem('uniacars-req-url')}${global_1.default}getac&sid=${sid}&icao=${schedule.aircrafticao}`)
                    .then(result => {
                    const list = document.getElementById('modal-choose-ac-list');
                    if (!list)
                        return;
                    const aircrafts = JSON.parse(result);
                    confirmButton.setAttribute('disabled', '');
                    list.innerHTML = '';
                    aircrafts.forEach((aircraft) => {
                        if (aircraft.bidcode !== null)
                            return;
                        confirmButton.removeAttribute('disabled');
                        const op = document.createElement('option');
                        op.setAttribute('value', aircraft.registration);
                        op.innerText = aircraft.registration + " - " + schedule.aircrafticao + " - " + schedule.aircraft;
                        list.appendChild(op);
                    });
                    confirmButton.onclick = () => {
                        const reg = acList.value;
                        (0, get_1.default)(`${localStorage.getItem('uniacars-req-url')}${global_1.default}addbid&sid=${sid}&rid=${schedule.id}&reg=${reg}`)
                            .then(result => {
                            if (result == "1") {
                                (0, loader_1.default)('bookings', bookings_1.loadBookings);
                            }
                        });
                    };
                });
            };
            bookButton.innerText = "Book";
            operation.classList.add('sort-operation');
            operation.appendChild(bookButton);
            el.appendChild(operation);
            table.appendChild(el);
        });
        const list = new list_js_1.default('list-flight-book', {
            sortClass: 'table-sort',
            listClass: 'table-tbody',
            valueNames: ['sort-flightNum', 'sort-departure', 'sort-arrival', 'sort-aircraft',
                'sort-level', 'sort-distance', 'sort-depTime', 'sort-arrTime']
        });
    });
    (0, inten_1.internationalize)();
};
exports.loadFlightBook = loadFlightBook;
