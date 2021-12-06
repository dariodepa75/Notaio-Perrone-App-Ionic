import * as moment from 'moment/moment';
import 'moment/locale/it.js';
import { LBL_DAY, LBL_NUM_DAY, LBL_MONTH, LBL_YEAR } from './constants';

export function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
        let gt = /&gt;/gi;
        str = str.replace(gt, '>');
        let lt = /&lt;/gi;
        str = str.replace(lt, '<');
        let amp = /&amp;/gi;
        str = str.replace(amp, '&');
        let quot = /&quot;/gi;
        str = str.replace(quot, "'");
        let apos = /&apos;/gi;
        str = str.replace(apos, ',');
        console.log('passa');
    //   str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
    //   str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
    }
    return str;
}

export function htmlEntities(str){
    
    const htmlEntities = {
        "&amp;": '&',
        "&lt;": '<',
        "&gt;": '>',
        "&quot;": '"',
        "&apos;": ','
    };
    // str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
    // str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
    str = str.replaceAll('&amp;', '&'); 
    str = str.replaceAll('&gt;', '>');
    str = str.replaceAll('&lt;', '<'); 
    str = str.replaceAll('&quot;', '"');  
    str = str.replaceAll('&apos;', ',');
    return str;
    // return str.replace(/([&<>\"'])/g, match => htmlEntities[match]);
}

/** */
export function getFormattedDate(date, lbl){
    moment.locale('it');
    // var d = new Date(date);  //this.request.data_desiderata
    var d = moment(date, 'YYYY-MM-DDThh:mmZ');
    let dateTEMP = (moment(d).format('LLLL')).split(" ");
    // console.log('data_richiesta: ', dateTEMP);
    if (lbl == LBL_DAY) return dateTEMP[0];
    if (lbl == LBL_NUM_DAY) return dateTEMP[1];
    if (lbl == LBL_MONTH) return dateTEMP[2];
    if (lbl == LBL_YEAR) return dateTEMP[3];
}

export function formatDate(date, format?, locale?){
    moment.locale('it');
    locale = locale ? locale : 'it';
    format = format ? format : ''; //YYYY-MM-DDTHH:mm:ss
    // var d = new Date(date); 
    var d = moment(date, 'YYYY-MM-DDThh:mmZ');
    var dateRequest = moment(d).format(format);
    return dateRequest;
}

/** */
export function formatFromDateToString(time){
    moment.locale('it');
    // var d = new Date(time); 
    var d = moment(time, 'YYYY-MM-DDThh:mmZ');
    let dateRequest = moment(d).format("D MMM YY");
    let timeRequest = moment(d).format("HH:mm");
    return dateRequest+" ora "+timeRequest;
}

export function creationDate(date, time?, format?, locale?){
    // console.log('data: ', date);
    // console.log('ora: ', time);
    locale = locale ? locale : 'it';
    moment.locale('it');
    format = format ? format : ''; //"YYYY-MM-DDTHH:mm:ss"
    // var  d = new Date(date); 
    var d = moment(date, 'YYYY-MM-DDThh:mmZ');
    var dateRequest = moment(d).format(format);
    if(time){
        let momentTimes    = moment(time, 'HH:mm');
        let momentDate     = moment(d);
        momentDate.set({
            hour:   momentTimes.get('hour'),
            minute: momentTimes.get('minute'),
            second: momentTimes.get('second')
        });
        // console.log('momentDate: ', momentDate);
        dateRequest = moment(momentDate).format(format);
    }
    // console.log('dateRequest: ', dateRequest);
    return dateRequest;
}

export function addTimeToDate(date, format?, d?, h?, m?){
    moment.locale('it');
    format = format ? format : ''; 
    d = d ? d : '0';
    h = h ? h : '0';
    m = m ? m : '0';
    var endate = moment(date).add({'days':d,'hours':h,'minutes':m});
    let returned_endate = endate.format(format);
    // console.log('returned_endate: ', returned_endate);
    return returned_endate;
}

/** */
export function encodeHTML(str) {
    if (str) {
        str = convert(str);
    }
    return str;
}

/** */
export function decodeHTML(str) {
}

/** */
function convert(str) {
    str = str.replace(/&/g, '&amp;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/"/g, '&quot;');
    str = str.replace(/'/g, '&#039;');
    return str;
}

export async function detectIsMobile(platform) {
    /**
    * | android         | on a device running Android.       |
    * | cordova         | on a device running Cordova.       |
    * | ios             | on a device running iOS.           |
    * | ipad            | on an iPad device.                 |
    * | iphone          | on an iPhone device.               |
    * | phablet         | on a phablet device.               |
    * | tablet          | on a tablet device.                |
    * | electron        | in Electron on a desktop device.   |
    * | pwa             | as a PWA app.                      |
    * | mobile          | on a mobile device.                |
    * | mobileweb       | on a mobile device in a browser.   |
    * | desktop         | on a desktop device.               |
    * | hybrid          | is a cordova or capacitor app.
    */
    let isMobile = false;
    return platform.ready()
    .then(() => {
        if (platform.is('android')) {
            console.log("running on Android device!");
            isMobile = true;
            // return true;
        }
        if (platform.is('cordova')) {
            console.log("running in a browser on cordova!");
            isMobile = true;
            // return true;
        }
        if (platform.is('ios')) {
            console.log("running on iOS device!");
            isMobile = true;
            // return true;
        }
        if (platform.is('ipad')) {
            console.log("running in a browser on ipad!");
            isMobile = true;
            // return true;
        }
        if (platform.is('iphone')) {
            console.log("running in a browser on iphone!");
            isMobile = true;
            // return true;
        }
        if (platform.is('tablet')) {
            console.log("running in a browser on tablet!");
            isMobile = true;
            // return true;
        }
        if (platform.is('electron')) {
            console.log("running in a browser on electron!");
            isMobile = true;
            // return true;
        }
        if (platform.is('pwa')) {
            console.log("running in a browser on pwa!");
            isMobile = true;
            // return true;
        }
        if (platform.is('mobile')) {
            console.log("running in a browser on mobile!");
            isMobile = true;
            // return true;
        }
        if (platform.is('mobileweb')) {
            console.log("running in a browser on mobileweb!");
            isMobile = false;
            // return false;
        }
        if (platform.is('desktop')) {
            console.log("running in a browser on desktop!");
            isMobile = false;
            // return false;
        }
        if (platform.is('hybrid')) {
            console.log("running in a browser on hybrid!");
            isMobile = true;
            // return true;
        }
        if (!platform.is('cordova')) {
            console.log('Probably Browser');
            isMobile = false;
            // return false;
        }
        return isMobile;
    });
}