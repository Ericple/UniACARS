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
import http from 'http';

export const getResource = (url: string) => {
    if (url.lastIndexOf('https://') == -1) {
        return new Promise<string>((resolve, reject) => {
            http.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
                res.on('error', (err) => {
                    reject(err);
                });
            });
        });
    } else {
        return new Promise<string>((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
                res.on('error', (err) => {
                    reject(err);
                });
            });
        });
    }

}

export const postData = (url: string, body?: string, port?: number, contentType?: string) => {
    if (url.lastIndexOf('https://') == -1) {
        return new Promise<any>((resolve, reject) => {
            http.request({
                hostname: url,
                port: port,
                method: 'POST',
                headers: {
                    'Content-Type': contentType ?? "application/json",
                    'Content-Length': body?.length ?? 0
                }
            }, res => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
                res.on('error', (err) => {
                    reject(err);
                });
            });
        });
    } else {
        return new Promise<any>((resolve, reject) => {
            https.request({
                hostname: url,
                port: 443,
                method: 'POST',
                headers: {
                    'Content-Type': contentType ?? "application/json",
                    'Content-Length': body?.length ?? 0
                }
            }, res => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
                res.on('error', (err) => {
                    reject(err);
                });
            });
        });
    }
}

export default getResource;
