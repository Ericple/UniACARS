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

import * as cheerio from "cheerio";
import getResource from "./get";

export const getMETAR = (icao: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        getResource(`http://xmairavt7.xiamenair.com/WarningPage/AirportInfo?arp4code=${icao.toUpperCase()}`)
            .then(result => {
                const $ = cheerio.load(result);
                $("p").each((index, element) => {
                    if(index===6){
                        resolve($(element).text());
                    }
                });
            }).catch(e => {
                reject(e);
        });
    });
}

export const getTAF = (icao: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        getResource(`http://xmairavt7.xiamenair.com/WarningPage/AirportInfo?arp4code=${icao.toUpperCase()}`)
            .then(result => {
                const $ = cheerio.load(result);
                $("p").each((index, element) => {
                    if(index===5){
                        resolve($(element).text());
                    }
                });
            }).catch(e => {
            reject(e);
        });
    });
}

export default {
    getMETAR, getTAF
}