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