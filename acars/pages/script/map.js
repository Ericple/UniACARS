"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadingMap = void 0;
const get_1 = __importDefault(require("../get"));
const leaflet_1 = __importDefault(require("leaflet"));
const global_1 = require("./global");
const inten_1 = require("../inten");
const loadingMap = () => {
    var _a;
    const mapContainer = document.getElementById('flight-map');
    const baseUrl = localStorage.getItem('uniacars-req-url');
    if (!mapContainer || !baseUrl)
        return;
    mapContainer.style.height = document.body.offsetHeight - 144 + 'px';
    window.onresize = function () {
        mapContainer.style.height = document.body.offsetHeight - 144 + 'px';
    };
    const flightMap = leaflet_1.default.map('flight-map', {
        center: [28.15, 115.14],
        zoom: 6
    });
    const localTheme = (_a = localStorage.getItem('uniacars-theme')) !== null && _a !== void 0 ? _a : "light";
    if (localTheme == 'light') {
        leaflet_1.default.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: "UNIACARS FLIGHT MAP"
        }).addTo(flightMap);
    }
    else {
        leaflet_1.default.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: "UNIACARS FLIGHT MAP"
        }).addTo(flightMap);
    }
    flightMap.zoomControl.remove();
    console.log(baseUrl);
    (0, get_1.default)(`${baseUrl}${global_1.acarsUrl}`).then(result => {
        const acarsData = JSON.parse(result);
        acarsData.forEach((fdr) => {
            const marker = leaflet_1.default.icon({
                iconUrl: (0, global_1.makeMarker)(baseUrl, fdr.heading),
                iconAnchor: [0, 0]
            });
            leaflet_1.default.marker([fdr.lat, fdr.lng], {
                icon: marker
            }).bindPopup(`<h5>${fdr.flightnum}</h5><p>${fdr.pilotname}</p>`).addTo(flightMap);
        });
    });
    (0, inten_1.internationalize)();
};
exports.loadingMap = loadingMap;
