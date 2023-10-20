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

import backendUrl from './global';
import loadPage, { sidebarSelect } from '../loader';
import $ from 'jquery';
import { ipcRenderer } from 'electron';
import { loadAcarsPage } from './acars';
import getResource from '../get';
import { internationalize } from '../inten';
import { loadFlightBook } from "./flightbook";

export const loadBookings = () => {
    const container = document.getElementById('books-container');
    const currentActiveFlight = localStorage.getItem('uniacars-active-acars-bid');
    const bookButton = document.getElementById('book-flight-page');
    if (!container || !bookButton) return;
    container.innerHTML = "";
    bookButton.onclick = function () {
        loadPage('book-flight', loadFlightBook);
    }
    getResource(`${localStorage.getItem('uniacars-req-url')}${backendUrl}bids&sid=${localStorage.getItem('uniacars-session')}`)
        .then(data => {
            if (data == 'null') return;
            const books = JSON.parse(data);
            const length = books.length;
            books.forEach((book: any, index: number) => {
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
                deleteBtn.innerText = "DELETE"
                deleteBtn.classList.add('btn', 'btn-outline-danger');
                deleteBtn.setAttribute('data-bs-toggle', 'modal');
                deleteBtn.setAttribute('data-bs-target', '#modal-danger');
                deleteBtn.onclick = () => {
                    $("#modal-danger-title").text(`Are you sure you want to debid flight ${book.code}${book.flightnum}?`);
                    $("#modal-danger-body").text("This operation is not reversable.");
                    $('#modal-danger-confirm').text("Delete right away");
                    $("#modal-danger-confirm").on('click', () => {
                        container.innerHTML = "";
                        getResource(`${localStorage.getItem('uniacars-req-url')}${backendUrl}debid&sid=${localStorage.getItem('uniacars-session')}&bidid=${book.bidid}`).then(result => {
                            loadPage('bookings', loadBookings);
                        });
                    });
                    return;
                }
                const startBtn = document.createElement('button');
                if (index === 0) {
                    startBtn.innerText = "START"
                } else {
                    startBtn.innerText = "COMPLETE PREVIOUS FLIGHT"
                    startBtn.setAttribute('disabled', '');
                }
                startBtn.classList.add('btn', 'btn-primary');

                if (currentActiveFlight !== null) {
                    startBtn.setAttribute('disabled', '');
                    if (currentActiveFlight === book.bidid) {
                        startBtn.innerText = "In progress";
                    } else {
                        startBtn.innerText = "You have in-progress flight!";
                    }
                }
                const routeField = document.createElement('textarea');
                routeField.classList.add('form-control');
                routeField.setAttribute('readonly', '');
                const cachedRoute = localStorage.getItem('uniacars-active-route');
                if (localStorage.getItem('uniacars-active-acars-bid') == book.bidid && cachedRoute !== null) {
                    routeField.innerText = cachedRoute;
                } else {
                    routeField.innerText = book.route;
                }
                startBtn.onclick = () => {
                    localStorage.setItem('uniacars-active-acars-bid', book.bidid);
                    const enableVoiceHelper = localStorage.getItem('uniacars-enable-voice-service');
                    const autoRefresh = localStorage.getItem('uniacars-log-auto-refresh');
                    const soundpackName = localStorage.getItem("uniacars-soundpack-name");
                    const forceSyncTime = localStorage.getItem('uniacars-force-sync-time');
                    const enableVoiceRecog = localStorage.getItem('uniacars-enable-voice-recog');
                    localStorage.setItem('uniacars-active-route', (routeField as any).value);
                    ipcRenderer.invoke('start-background-service', [
                        book.bidid,
                        enableVoiceHelper == null ? 0 : enableVoiceHelper,
                        localStorage.getItem('uniacars-req-url') + backendUrl,
                        autoRefresh == null ? 0 : 1,
                        `"${(routeField as any).value}"`,
                        (soundpackName !== null && enableVoiceHelper !== null) ? soundpackName : 'default',
                        (forceSyncTime == null || forceSyncTime == "0") ? 0 : 1,
                        (enableVoiceRecog == '1') ? 1 : 0]);
                    console.log([
                        book.bidid,
                        enableVoiceHelper == null ? 0 : enableVoiceHelper,
                        localStorage.getItem('uniacars-req-url') + backendUrl,
                        autoRefresh == null ? 0 : 1,
                        `"${(routeField as any).value}"`,
                        (soundpackName !== null && enableVoiceHelper !== null) ? soundpackName : 'default',
                        (forceSyncTime == null || forceSyncTime == "0") ? 0 : 1,
                        (enableVoiceRecog == '1') ? 1 : 0]);
                    loadPage("acars", loadAcarsPage);
                    sidebarSelect(2);
                }
                const routeEditBtn = document.createElement('button');
                routeEditBtn.innerText = "Edit Route";
                routeEditBtn.classList.add('btn', 'btn-outline-primary');
                routeEditBtn.onclick = () => {
                    if (routeField.getAttribute('readonly') !== null) {
                        routeField.removeAttribute('readonly');
                        routeEditBtn.innerText = "Save Changes";
                        if (localStorage.getItem('uniacars-active-acars-bid') !== null && localStorage.getItem('uniacars-active-acars-bid') == book.bidid) {
                            localStorage.setItem('uniacars-active-route', (routeField as any).value);
                        }
                    } else {
                        routeField.setAttribute('readonly', '');
                        routeEditBtn.innerText = "Edit Route";
                    }
                }
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
                        ipcRenderer.invoke('stop-background-service');
                        loadPage('bookings', loadBookings);
                    }
                    btns.appendChild(cancelBtn);
                }
                btns.appendChild(routeField);
                body.appendChild(btns);
                card.appendChild(body);
                container.appendChild(card);
            });
        });
    internationalize();
}