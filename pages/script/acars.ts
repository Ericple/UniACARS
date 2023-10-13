import { ipcRenderer } from 'electron';
import loadPage, { sidebarSelect } from '../loader';
import { loadBookings } from './bookings';
import backendUrl from './global';
import getResource from '../get';
import $ from 'jquery';
import { Modal } from 'bootstrap';
import { internationalize } from '../inten';

export const loadAcarsPage = () => {
    const logContainer = document.getElementById('log-container');
    const depIcao = document.getElementById('dep-icao');
    const depName = document.getElementById('dep-name');
    const depTime = document.getElementById('dep-time');
    const fltNum = document.getElementById('flight-num');
    const distance = document.getElementById('flight-distance');
    const aircraft = document.getElementById('flight-aircraft');
    const arrIcao = document.getElementById('arr-icao');
    const arrName = document.getElementById('arr-name');
    const arrTime = document.getElementById('arr-time');
    const resultModal = document.getElementById('modal-simple');
    const resultTitle = document.getElementById('modal-simple-title');
    const reusltBody = document.getElementById('modal-simple-body');
    const cancelBtn = document.getElementById('cancel-acars');
    const bidId = localStorage.getItem('uniacars-active-acars-bid');
    const altitude = document.getElementById('ground-altitude');
    const groundSpd = document.getElementById('ground-speed');
    const airSpd = document.getElementById('air-speed');
    const heading = document.getElementById('heading');
    const latitude = document.getElementById('latitude');
    const longitude = document.getElementById('longitude');
    const pitch = document.getElementById('pitch');
    const roll = document.getElementById('roll');
    const aircraftType = document.getElementById('aircraft-type');
    const dangerModal = document.getElementById('modal-danger');
    const gForce = document.getElementById('g-force');
    let logCache = '';
    if (bidId === null || !dangerModal || !resultTitle || !reusltBody || !resultModal || !pitch || !roll || !aircraftType || !gForce || !altitude || !groundSpd || !airSpd || !heading || !latitude || !longitude || !cancelBtn || !arrIcao || !arrName || !arrTime || !depIcao || !depName || !depTime || !fltNum || !distance || !aircraft) {
        loadPage('bookings', loadBookings);
        sidebarSelect(1);
        return;
    }
    cancelBtn.onclick = function () {
        $("#modal-danger-title").text(`Are you sure you want to cancel this flight?`);
        $("#modal-danger-confirm").text("Cancel any away");
        $("#modal-danger-confirm").on('click', () => {
            localStorage.removeItem('uniacars-active-acars-bid');
            ipcRenderer.invoke('stop-background-service');
            loadPage('bookings', loadBookings);
            sidebarSelect(1);
        });
        new Modal(dangerModal).show();
    }
    getResource(`${localStorage.getItem('uniacars-req-url')}${backendUrl}fInfo&bidid=${bidId}`).then(result => {
        const j = JSON.parse(result);
        depIcao.innerText = j.depicao;
        depName.innerText = j.depname;
        depTime.innerText = "SCHEDULED TIME DEPARTURE: " + j.deptime;
        fltNum.innerText = j.code + j.flightnum;
        distance.innerText = j.distance + " NM - " + j.flighttime.replace('.', 'H') + "MIN";
        aircraft.innerText = j.fullname + " - " + j.registration;
        arrIcao.innerText = j.arricao;
        arrName.innerText = j.arrname;
        arrTime.innerText = "SCHEDULED TIME ARRIVAL: " + j.arrtime;
    })
    if (!logContainer) return;
    const autoRefresh = localStorage.getItem('uniacars-log-auto-refresh');
    if (autoRefresh == null) {
        ipcRenderer.on('log-clear', () => {
            logCache = '';
        });
        ipcRenderer.on('log-add', (e, log) => {
            logCache += log + "\n";
        });
        ipcRenderer.on('log-end', () => {
            if (logContainer.innerHTML !== logCache) logContainer.innerHTML = logCache;
            logCache = '';
        })
    } else {
        ipcRenderer.on('log-add', (e, log) => {
            logContainer.innerHTML += log + "\n";
        });
    }

    ipcRenderer.on('log-info', (e, info) => {
        const flightInfo = JSON.parse(info);
        const useImperial = localStorage.getItem('uniacars-imperial-unit');
        if (useImperial === null || useImperial === '0') {
            altitude.innerText = flightInfo.Altitude.Metric.toFixed(3) + 'm';
            groundSpd.innerText = flightInfo.GroundSpeed.Metric.toFixed(3) + 'm/s';
            airSpd.innerText = flightInfo.AirSpeed.Metric.toFixed(3) + 'm/s';
            longitude.innerText = flightInfo.Longitude.DMSValue;
            latitude.innerText = flightInfo.Latitude.DMSValue;
        } else {
            altitude.innerText = flightInfo.Altitude.Imperial.toFixed(3) + 'ft';
            groundSpd.innerText = flightInfo.GroundSpeed.Imperial.toFixed(3) + 'kts';
            airSpd.innerText = flightInfo.AirSpeed.Imperial.toFixed(3) + 'kts';
            longitude.innerText = flightInfo.Longitude.DecimalValue.toFixed(6);
            latitude.innerText = flightInfo.Latitude.DecimalValue.toFixed(6);
        }
        heading.innerText = flightInfo.Heading;
        pitch.innerText = flightInfo.Pitch;
        roll.innerText = flightInfo.Roll;
        gForce.innerText = flightInfo.GForce;
        aircraftType.innerText = flightInfo.AircraftType == 'null' ? 'Unknown' : flightInfo.AircraftType;
    });
    ipcRenderer.on('flight-end', (e, result) => {
        localStorage.removeItem('uniacars-active-acars-bid')
        resultTitle.innerText = 'Pirep submited';
        reusltBody.innerText = `Your pirep has been submited: ${result}`;
        $("#modal-simple-close").on('click', () => {
            loadPage('bookings', loadBookings);
            sidebarSelect(1);
        })
        new Modal(resultModal).show();
    });
    internationalize();
}