"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadBookings = void 0;
const global_1 = __importDefault(require("./global"));
const loader_1 = __importStar(require("../loader"));
const jquery_1 = __importDefault(require("jquery"));
const electron_1 = require("electron");
const acars_1 = require("./acars");
const get_1 = __importDefault(require("../get"));
const inten_1 = require("../inten");
const flightbook_1 = require("./flightbook");
const loadBookings = () => {
    const container = document.getElementById('books-container');
    const currentActiveFlight = localStorage.getItem('uniacars-active-acars-bid');
    const bookButton = document.getElementById('book-flight-page');
    if (!container || !bookButton)
        return;
    container.innerHTML = "";
    bookButton.onclick = function () {
        (0, loader_1.default)('book-flight', flightbook_1.loadFlightBook);
    };
    (0, get_1.default)(`${localStorage.getItem('uniacars-req-url')}${global_1.default}bids&sid=${localStorage.getItem('uniacars-session')}`)
        .then(data => {
        if (data == 'null')
            return;
        const books = JSON.parse(data);
        const length = books.length;
        books.forEach((book, index) => {
            const card = document.createElement('div');
            card.classList.add('card', 'animate__animated', 'animate__fadeInUp');
            if (index !== length - 1) {
                card.classList.add('mb-3');
            }
            const body = document.createElement('div');
            body.classList.add('card-body');
            const info = document.createElement('div');
            info.classList.add('row');
            info.innerHTML = `
            <div class="col-lg-4 col-md-4">
                    <ul class="list-unstyled">
                        <h2>${book.depicao}</h2>
                        <p class="text-muted">${book.depname}</p>
                        <h4>STD: ${book.deptime}</h4>
                    </ul>
                </div>
                <div class="col-lg-4 col-md-4">
                    <ul class="list-unstyled">
                        <h2>${book.code}${book.flightnum}</h2>
                        <h5>${book.distance} NM - ${book.flighttime.replace('.', 'H')}M</h5>
                        <hr style="margin: 10px 0">
                        <h5>AIRCRAFT: ${book.fullname} - ${book.registration}</h5>
                    </ul>
                </div>
                <div class="col-lg-4 col-md-4">
                    <ul class="list-unstyled">
                        <h2>${book.arricao}</h2>
                        <p class="text-muted">${book.arrname}</p>
                        <h4>STA: ${book.arrtime}</h4>
                    </ul>
                </div>
            `;
            const btns = document.createElement('div');
            btns.classList.add('btn-list');
            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = "DELETE";
            deleteBtn.classList.add('btn', 'btn-outline-danger');
            deleteBtn.setAttribute('data-bs-toggle', 'modal');
            deleteBtn.setAttribute('data-bs-target', '#modal-danger');
            deleteBtn.onclick = () => {
                (0, jquery_1.default)("#modal-danger-title").text(`Are you sure you want to debid flight ${book.code}${book.flightnum}?`);
                (0, jquery_1.default)("#modal-danger-body").text("This operation is not reversable.");
                (0, jquery_1.default)('#modal-danger-confirm').text("Delete right away");
                (0, jquery_1.default)("#modal-danger-confirm").on('click', () => {
                    container.innerHTML = "";
                    (0, get_1.default)(`${localStorage.getItem('uniacars-req-url')}${global_1.default}debid&sid=${localStorage.getItem('uniacars-session')}&bidid=${book.bidid}`).then(result => {
                        (0, loader_1.default)('bookings', exports.loadBookings);
                    });
                });
                return;
            };
            const startBtn = document.createElement('button');
            if (index === 0) {
                startBtn.innerText = "START";
            }
            else {
                startBtn.innerText = "COMPLETE PREVIOUS FLIGHT";
                startBtn.setAttribute('disabled', '');
            }
            startBtn.classList.add('btn', 'btn-primary');
            if (currentActiveFlight !== null) {
                startBtn.setAttribute('disabled', '');
                if (currentActiveFlight === book.bidid) {
                    startBtn.innerText = "In progress";
                }
                else {
                    startBtn.innerText = "You have in-progress flight!";
                }
            }
            const routeField = document.createElement('textarea');
            routeField.classList.add('form-control');
            routeField.setAttribute('readonly', '');
            const cachedRoute = localStorage.getItem('uniacars-active-route');
            if (localStorage.getItem('uniacars-active-acars-bid') == book.bidid && cachedRoute !== null) {
                routeField.innerText = cachedRoute;
            }
            else {
                routeField.innerText = book.route;
            }
            startBtn.onclick = () => {
                localStorage.setItem('uniacars-active-acars-bid', book.bidid);
                const enableVoiceHelper = localStorage.getItem('uniacars-enable-voice-service');
                const autoRefresh = localStorage.getItem('uniacars-log-auto-refresh');
                const soundpackName = localStorage.getItem("uniacars-soundpack-name");
                const forceSyncTime = localStorage.getItem('uniacars-force-sync-time');
                const enableVoiceRecog = localStorage.getItem('uniacars-enable-voice-recog');
                localStorage.setItem('uniacars-active-route', routeField.value);
                electron_1.ipcRenderer.invoke('start-background-service', [
                    book.bidid,
                    enableVoiceHelper == null ? 0 : enableVoiceHelper,
                    localStorage.getItem('uniacars-req-url') + global_1.default,
                    autoRefresh == null ? 1 : 0,
                    `"${routeField.value}"`,
                    (soundpackName !== null && enableVoiceHelper !== null) ? soundpackName : 'default',
                    (forceSyncTime == null || forceSyncTime == "0") ? 0 : 1,
                    (enableVoiceRecog == '1') ? 1 : 0
                ]);
                console.log([
                    book.bidid,
                    enableVoiceHelper == null ? 0 : enableVoiceHelper,
                    localStorage.getItem('uniacars-req-url') + global_1.default,
                    autoRefresh == null ? 1 : 0,
                    `"${routeField.value}"`,
                    (soundpackName !== null && enableVoiceHelper !== null) ? soundpackName : 'default',
                    (forceSyncTime == null || forceSyncTime == "0") ? 0 : 1,
                    (enableVoiceRecog == '1') ? 1 : 0
                ]);
                (0, loader_1.default)("acars", acars_1.loadAcarsPage);
                (0, loader_1.sidebarSelect)(2);
            };
            const routeEditBtn = document.createElement('button');
            routeEditBtn.innerText = "Edit Route";
            routeEditBtn.classList.add('btn', 'btn-outline-primary');
            routeEditBtn.onclick = () => {
                if (routeField.getAttribute('readonly') !== null) {
                    routeField.removeAttribute('readonly');
                    routeEditBtn.innerText = "Save Changes";
                    if (localStorage.getItem('uniacars-active-acars-bid') !== null && localStorage.getItem('uniacars-active-acars-bid') == book.bidid) {
                        localStorage.setItem('uniacars-active-route', routeField.value);
                    }
                }
                else {
                    routeField.setAttribute('readonly', '');
                    routeEditBtn.innerText = "Edit Route";
                }
            };
            body.appendChild(info);
            btns.appendChild(startBtn);
            btns.appendChild(deleteBtn);
            btns.appendChild(routeEditBtn);
            if (currentActiveFlight === book.bidid) {
                const cancelBtn = document.createElement('button');
                cancelBtn.classList.add('btn', 'btn-outline-warning');
                cancelBtn.innerText = "Cancel";
                cancelBtn.onclick = () => {
                    localStorage.removeItem('uniacars-active-acars-bid');
                    electron_1.ipcRenderer.invoke('stop-background-service');
                    (0, loader_1.default)('bookings', exports.loadBookings);
                };
                btns.appendChild(cancelBtn);
            }
            btns.appendChild(routeField);
            body.appendChild(btns);
            card.appendChild(body);
            container.appendChild(card);
        });
    });
    (0, inten_1.internationalize)();
};
exports.loadBookings = loadBookings;
