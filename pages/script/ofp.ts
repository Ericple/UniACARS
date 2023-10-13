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

import https from 'https';
import { internationalize } from '../inten';

export const ofpFunc = () => {
    const ofpView = document.getElementById('ofp-view');
    const infoReqView = document.getElementById('info-req-view');
    const simbIdent = localStorage.getItem('uniacars-simb-ident');
    const ofpContainer = document.getElementById('ofp-container');
    const simbIdentButton = document.getElementById('set-simb-ident');
    const simbIdentInput = document.getElementById('simb-ident');
    const loader = document.getElementById('loader');
    if (!ofpView || !infoReqView || !ofpContainer || !simbIdentButton || !simbIdentInput || !loader) throw new Error("Element is null");
    const decodeXml = (data: string): Promise<{ result: Document, status: string }> => {
        return new Promise<{ result: Document, status: string }>((resolve, reject) => {
            const decoder = new DOMParser();
            const xmlResult = decoder.parseFromString(data, 'text/xml');
            const resultStatus = xmlResult.getElementsByTagName('fetch')[0].getElementsByTagName('status')[0].innerHTML;
            resolve({
                result: xmlResult,
                status: resultStatus
            });
        })
    }
    const switchToIRV = () => {
        // close ofpv
        ofpView.classList.remove('animate__fadeInUp')
        ofpView.classList.add('animate__fadeOutRight');
        setTimeout(() => {
            ofpView.classList.add('d-none');
        }, 100);
        // open irv
        infoReqView.classList.add('animate__fadeInRight');
        infoReqView.classList.remove('animate__fadeOutLeft', 'd-none');
    }

    const switchToOFPV = () => {
        // close irv
        infoReqView.classList.remove('animate__fadeInRight');
        infoReqView.classList.add('animate__fadeOutRight');
        setTimeout(() => {
            infoReqView.classList.add('d-none');
        }, 100);
        // open ofpv
        ofpView.classList.add('animate__fadeInUp');
        ofpView.classList.remove('animate__fadeOutRight', 'd-none');
    }
    ofpContainer.onload = function () {
        ofpContainer.style.height = document.body.offsetHeight - 144 + 'px';
    }

    window.onresize = function () {
        ofpContainer.style.height = document.body.offsetHeight - 144 + 'px';
    }
    simbIdentButton.onclick = function () {
        simbIdentButton.setAttribute('disabled', '');
        const simbIdent = (simbIdentInput as any).value;
        https.get(`https://www.simbrief.com/api/xml.fetcher.php?username=${simbIdent}`, (res) => {
            let read = '';
            res.on('data', (chunk) => {
                read += chunk;
            })
            res.on('end', () => {
                decodeXml(read).then(res => {
                    if (res.status.toLowerCase() !== 'success') {
                        alert(res.status);
                        simbIdentButton.removeAttribute('disabled');
                    } else {
                        localStorage.setItem('uniacars-simb-ident', simbIdent ?? "");
                        loader.classList.remove('d-none');
                        https.get(`https://www.simbrief.com/api/xml.fetcher.php?username=${simbIdent}`, (res) => {
                            let read = '';
                            res.on('data', (chunk) => {
                                read += chunk;
                            })
                            res.on('end', () => {
                                decodeXml(read).then(res => {
                                    if (res.status.toLowerCase() !== 'success') {
                                        alert(res.status);
                                    } else {
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
    }
    if (!simbIdent) {
        switchToIRV();
        loader.classList.add('d-none');
    } else {
        https.get(`https://www.simbrief.com/api/xml.fetcher.php?username=${simbIdent}`, (res) => {
            let read = '';
            res.on('data', (chunk) => {
                read += chunk;
            })
            res.on('end', () => {
                decodeXml(read).then(res => {
                    if (res.status.toLowerCase() !== 'success') {
                        alert(res.status);
                    } else {
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
    internationalize();
}