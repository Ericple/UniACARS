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

import backendUrl from "./global";
import loadPage from "../loader";
import $ from 'jquery';
import {loadBookings} from "./bookings";
import getResource from "../get";
import {internationalize} from "../inten";
import List from 'list.js';
import {Modal} from "bootstrap";

export const loadFlightBook = () => {
    const backButton=document.getElementById('bookings-page');
    const sid = localStorage.getItem('uniacars-session');
    const table = document.getElementById('table-flight-book');
    const acList = document.getElementById('modal-choose-ac-list');
    const filter = document.getElementById('flight-filter');
    const confirmButton = document.getElementById('modal-choose-ac-confirm');
    if(!backButton || !sid || !table || !acList || !confirmButton || !filter)return;
    backButton.onclick=function () {
        loadPage('bookings', loadBookings);
    }
    filter.oninput = () => {
        const filterWord = (filter as any).value;
        const nodes = document.getElementsByClassName('flight-to-book');
        const flights = [...nodes];
        flights.forEach(flightElement => {
            flightElement.classList.remove('d-none');
        });
        flights.forEach(flightElement => {
            const flightNum = flightElement.getAttribute('fn');
            const arrival = flightElement.getAttribute('arr');
            const ac = flightElement.getAttribute('ac');
            if(flightNum?.indexOf(filterWord.toUpperCase()) == -1 && arrival?.indexOf(filterWord.toUpperCase())==-1 && ac?.indexOf(filterWord.toUpperCase())==-1) {
                flightElement.classList.add('d-none');
            }
        })
    }
    getResource(`${localStorage.getItem('uniacars-req-url')}${backendUrl}findschedule&sid=${sid}`)
        .then(result=>{
            const schedules = JSON.parse(result);
            schedules.forEach((schedule: any) => {
                if(schedule.enabled !== "1" || schedule.bidid !== "0") return;
                const el = document.createElement('tr');
                el.classList.add('flight-to-book');
                const fn = document.createElement('td');
                fn.classList.add('sort-flightNum');
                fn.innerText=schedule.code+schedule.flightnum;
                el.appendChild(fn);
                const dep = document.createElement('td');
                dep.classList.add('sort-departure');
                dep.innerText=schedule.depicao;
                el.appendChild(dep);
                const arr=document.createElement('td');
                arr.classList.add('sort-arrival');
                arr.innerText=schedule.arricao;
                el.appendChild(arr);
                const ac = document.createElement('td');
                ac.classList.add('sort-aircraft');
                ac.innerText=schedule.aircrafticao;
                el.appendChild(ac);
                const fl = document.createElement('td');
                fl.classList.add('sort-level');
                fl.innerText=schedule.flightlevel;
                el.appendChild(fl);
                const dis=document.createElement('td');
                dis.classList.add('sort-distance');
                dis.innerText=schedule.distance;
                el.appendChild(dis);
                const depT=document.createElement('td');
                depT.classList.add('sort-depTime');
                depT.innerText=schedule.deptime;
                el.appendChild(depT);
                const arrT=document.createElement('td');
                arrT.classList.add('sort-arrTime');
                arrT.innerText=schedule.arrtime;
                el.appendChild(arrT);
                el.setAttribute('fn',schedule.code+schedule.flightnum);
                el.setAttribute('arr',schedule.arricao);
                el.setAttribute('ac',schedule.aircrafticao);
                const operation = document.createElement('td');
                const bookButton = document.createElement('button');
                bookButton.classList.add('btn','btn-outlined', 'btn-sm');
                bookButton.setAttribute('data-bs-toggle','modal');
                bookButton.setAttribute('data-bs-target','#modal-choose');
                bookButton.onclick=  () => {
                    getResource(`${localStorage.getItem('uniacars-req-url')}${backendUrl}getac&sid=${sid}&icao=${schedule.aircrafticao}`)
                        .then(result => {
                            const list = document.getElementById('modal-choose-ac-list');
                            if(!list)return;
                            const aircrafts=JSON.parse(result);
                            confirmButton.setAttribute('disabled','');
                            list.innerHTML='';
                            aircrafts.forEach((aircraft: any) => {
                                if (aircraft.bidcode !== null) return;
                                confirmButton.removeAttribute('disabled');
                                const op = document.createElement('option');
                                op.setAttribute('value',aircraft.registration);
                                op.innerText=aircraft.registration+" - "+schedule.aircrafticao+" - "+schedule.aircraft;
                                list.appendChild(op);
                            });
                            confirmButton.onclick=() => {
                                const reg = (acList as any).value;
                                getResource(`${localStorage.getItem('uniacars-req-url')}${backendUrl}addbid&sid=${sid}&rid=${schedule.id}&reg=${reg}`)
                                    .then(result => {
                                        if(result == "1") {
                                            loadPage('bookings', loadBookings);
                                        }
                                    });
                            }
                        });
                }
                bookButton.innerText="Book";
                operation.classList.add('sort-operation')
                operation.appendChild(bookButton);
                el.appendChild(operation);
                table.appendChild(el);
            });
            const list = new List('list-flight-book', {
                sortClass: 'table-sort',
                listClass: 'table-tbody',
                valueNames: ['sort-flightNum','sort-departure','sort-arrival','sort-aircraft',
                'sort-level','sort-distance','sort-depTime','sort-arrTime']
            });
        });
    internationalize();
}