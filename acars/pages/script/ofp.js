"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ofpFunc = void 0;
const https_1 = __importDefault(require("https"));
const inten_1 = require("../inten");
const ofpFunc = () => {
    const ofpView = document.getElementById('ofp-view');
    const infoReqView = document.getElementById('info-req-view');
    const simbIdent = localStorage.getItem('uniacars-simb-ident');
    const ofpContainer = document.getElementById('ofp-container');
    const simbIdentButton = document.getElementById('set-simb-ident');
    const simbIdentInput = document.getElementById('simb-ident');
    const loader = document.getElementById('loader');
    if (!ofpView || !infoReqView || !ofpContainer || !simbIdentButton || !simbIdentInput || !loader)
        throw new Error("Element is null");
    const decodeXml = (data) => {
        return new Promise((resolve, reject) => {
            const decoder = new DOMParser();
            const xmlResult = decoder.parseFromString(data, 'text/xml');
            const resultStatus = xmlResult.getElementsByTagName('fetch')[0].getElementsByTagName('status')[0].innerHTML;
            resolve({
                result: xmlResult,
                status: resultStatus
            });
        });
    };
    const switchToIRV = () => {
        ofpView.classList.remove('animate__fadeInUp');
        ofpView.classList.add('animate__fadeOutRight');
        setTimeout(() => {
            ofpView.classList.add('d-none');
        }, 100);
        infoReqView.classList.add('animate__fadeInRight');
        infoReqView.classList.remove('animate__fadeOutLeft', 'd-none');
    };
    const switchToOFPV = () => {
        infoReqView.classList.remove('animate__fadeInRight');
        infoReqView.classList.add('animate__fadeOutRight');
        setTimeout(() => {
            infoReqView.classList.add('d-none');
        }, 100);
        ofpView.classList.add('animate__fadeInUp');
        ofpView.classList.remove('animate__fadeOutRight', 'd-none');
    };
    ofpContainer.onload = function () {
        ofpContainer.style.height = document.body.offsetHeight - 144 + 'px';
    };
    window.onresize = function () {
        ofpContainer.style.height = document.body.offsetHeight - 144 + 'px';
    };
    simbIdentButton.onclick = function () {
        simbIdentButton.setAttribute('disabled', '');
        const simbIdent = simbIdentInput.value;
        https_1.default.get(`https://www.simbrief.com/api/xml.fetcher.php?username=${simbIdent}`, (res) => {
            let read = '';
            res.on('data', (chunk) => {
                read += chunk;
            });
            res.on('end', () => {
                decodeXml(read).then(res => {
                    if (res.status.toLowerCase() !== 'success') {
                        alert(res.status);
                        simbIdentButton.removeAttribute('disabled');
                    }
                    else {
                        localStorage.setItem('uniacars-simb-ident', simbIdent !== null && simbIdent !== void 0 ? simbIdent : "");
                        loader.classList.remove('d-none');
                        https_1.default.get(`https://www.simbrief.com/api/xml.fetcher.php?username=${simbIdent}`, (res) => {
                            let read = '';
                            res.on('data', (chunk) => {
                                read += chunk;
                            });
                            res.on('end', () => {
                                decodeXml(read).then(res => {
                                    if (res.status.toLowerCase() !== 'success') {
                                        alert(res.status);
                                    }
                                    else {
                                        const dir = res.result.getElementsByTagName('files')[0].getElementsByTagName('directory')[0].innerHTML + res.result.getElementsByTagName('files')[0].getElementsByTagName('pdf')[0].getElementsByTagName('link')[0].innerHTML;
                                        ofpContainer.setAttribute('src', dir);
                                        loader.classList.add('animate__fadeOut');
                                        setTimeout(() => {
                                            switchToOFPV();
                                            loader.classList.add('d-none');
                                        }, 100);
                                    }
                                });
                            });
                        });
                    }
                });
            });
        });
    };
    if (!simbIdent) {
        switchToIRV();
        loader.classList.add('d-none');
    }
    else {
        https_1.default.get(`https://www.simbrief.com/api/xml.fetcher.php?username=${simbIdent}`, (res) => {
            let read = '';
            res.on('data', (chunk) => {
                read += chunk;
            });
            res.on('end', () => {
                decodeXml(read).then(res => {
                    if (res.status.toLowerCase() !== 'success') {
                        alert(res.status);
                    }
                    else {
                        const dir = res.result.getElementsByTagName('files')[0].getElementsByTagName('directory')[0].innerHTML + res.result.getElementsByTagName('files')[0].getElementsByTagName('pdf')[0].getElementsByTagName('link')[0].innerHTML;
                        ofpContainer.setAttribute('src', dir);
                        loader.classList.add('animate__fadeOut');
                        setTimeout(() => {
                            switchToOFPV();
                            loader.classList.add('d-none');
                        }, 100);
                    }
                });
            });
        });
    }
    (0, inten_1.internationalize)();
};
exports.ofpFunc = ofpFunc;
