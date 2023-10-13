import getResource from '../get';
import L from 'leaflet';
import { acarsUrl, makeMarker } from './global';
import { internationalize } from '../inten';

export const loadingMap = () => {
    const mapContainer = document.getElementById('flight-map');
    const baseUrl = localStorage.getItem('uniacars-req-url');
    if (!mapContainer || !baseUrl) return;
    mapContainer.style.height = document.body.offsetHeight - 144 + 'px';
    window.onresize = function () {
        mapContainer.style.height = document.body.offsetHeight - 144 + 'px';
    }
    const flightMap = L.map('flight-map', {
        center: [28.15, 115.14],
        zoom: 6
    });
    const localTheme = localStorage.getItem('uniacars-theme') ?? "light";
    if (localTheme == 'light') {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
            {
                attribution: "UNIACARS FLIGHT MAP"
            }).addTo(flightMap);
    } else {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            {
                attribution: "UNIACARS FLIGHT MAP"
            }).addTo(flightMap);
    }

    flightMap.zoomControl.remove();
    console.log(baseUrl);
    getResource(`${baseUrl}${acarsUrl}`).then(result => {
        const acarsData = JSON.parse(result);
        acarsData.forEach((fdr: any) => {
            const marker = L.icon({
                iconUrl: makeMarker(baseUrl, fdr.heading),
                iconAnchor: [0, 0]
            })
            L.marker([fdr.lat, fdr.lng], {
                icon: marker
            }).bindPopup(`<h5>${fdr.flightnum}</h5><p>${fdr.pilotname}</p>`).addTo(flightMap);
        });
    });
    internationalize();
}