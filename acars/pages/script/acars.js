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
exports.loadAcarsPage = void 0;
const electron_1 = require("electron");
const loader_1 = __importStar(require("../loader"));
const bookings_1 = require("./bookings");
const global_1 = __importDefault(require("./global"));
const get_1 = __importDefault(require("../get"));
const jquery_1 = __importDefault(require("jquery"));
const bootstrap_1 = require("bootstrap");
const inten_1 = require("../inten");
const loadAcarsPage = () => {
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
        (0, loader_1.default)('bookings', bookings_1.loadBookings);
        (0, loader_1.sidebarSelect)(1);
        return;
    }
    cancelBtn.onclick = function () {
        (0, jquery_1.default)("#modal-danger-title").text(`Are you sure you want to cancel this flight?`);
        (0, jquery_1.default)("#modal-danger-confirm").text("Cancel any away");
        (0, jquery_1.default)("#modal-danger-confirm").on('click', () => {
            localStorage.removeItem('uniacars-active-acars-bid');
            electron_1.ipcRenderer.invoke('stop-background-service');
            (0, loader_1.default)('bookings', bookings_1.loadBookings);
            (0, loader_1.sidebarSelect)(1);
        });
        new bootstrap_1.Modal(dangerModal).show();
    };
    (0, get_1.default)(`${localStorage.getItem('uniacars-req-url')}${global_1.default}fInfo&bidid=${bidId}`).then(result => {
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
    });
    if (!logContainer)
        return;
    const autoRefresh = localStorage.getItem('uniacars-log-auto-refresh');
    if (autoRefresh == null) {
        electron_1.ipcRenderer.on('log-clear', () => {
            logCache = '';
        });
        electron_1.ipcRenderer.on('log-add', (e, log) => {
            logCache += log + "\n";
        });
        electron_1.ipcRenderer.on('log-end', () => {
            if (logContainer.innerHTML !== logCache)
                logContainer.innerHTML = logCache;
            logCache = '';
        });
    }
    else {
        electron_1.ipcRenderer.on('log-add', (e, log) => {
            logContainer.innerHTML += log + "\n";
        });
    }
    electron_1.ipcRenderer.on('log-info', (e, info) => {
        const flightInfo = JSON.parse(info);
        const useImperial = localStorage.getItem('uniacars-imperial-unit');
        if (useImperial === null || useImperial === '0') {
            altitude.innerText = flightInfo.Altitude.Metric.toFixed(1) + 'm';
            groundSpd.innerText = flightInfo.GroundSpeed.Metric.toFixed(1) + 'm/s';
            airSpd.innerText = flightInfo.AirSpeed.Metric.toFixed(1) + 'm/s';
            longitude.innerText = flightInfo.Longitude.DMSValue;
            latitude.innerText = flightInfo.Latitude.DMSValue;
        }
        else {
            altitude.innerText = flightInfo.Altitude.Imperial.toFixed(0) + 'ft';
            groundSpd.innerText = flightInfo.GroundSpeed.Imperial.toFixed(1) + 'kts';
            airSpd.innerText = flightInfo.AirSpeed.Imperial.toFixed(1) + 'kts';
            longitude.innerText = flightInfo.Longitude.DecimalValue.toFixed(3);
            latitude.innerText = flightInfo.Latitude.DecimalValue.toFixed(3);
        }
        heading.innerText = flightInfo.Heading.toFixed(1);
        pitch.innerText = flightInfo.Pitch.toFixed(1);
        roll.innerText = flightInfo.Roll.toFixed(1);
        gForce.innerText = flightInfo.GForce.toFixed(1);
        aircraftType.innerText = flightInfo.AircraftType == 'null' ? 'Unknown' : flightInfo.AircraftType;
    });
    electron_1.ipcRenderer.on('flight-end', (e, result) => {
        localStorage.removeItem('uniacars-active-acars-bid');
        resultTitle.innerText = 'Pirep submited';
        reusltBody.innerText = `Your pirep has been submited: ${result}`;
        (0, jquery_1.default)("#modal-simple-close").on('click', () => {
            (0, loader_1.default)('bookings', bookings_1.loadBookings);
            (0, loader_1.sidebarSelect)(1);
        });
        new bootstrap_1.Modal(resultModal).show();
    });
    (0, inten_1.internationalize)();
};
exports.loadAcarsPage = loadAcarsPage;
