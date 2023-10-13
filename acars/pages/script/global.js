"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeMarker = exports.ipcPath = exports.markerUrl = exports.acarsUrl = exports.backendUrl = void 0;
exports.backendUrl = `/core/UniACARS/handler.php?action=`;
exports.acarsUrl = `/action.php/acars/data`;
exports.markerUrl = `/lib/images/inair`;
exports.ipcPath = "\\\\.\\pipe\\unipipe_get";
const makeMarker = (baseUrl, heading) => {
    return `${baseUrl}${exports.markerUrl}/${heading}.png`;
};
exports.makeMarker = makeMarker;
exports.default = exports.backendUrl;
