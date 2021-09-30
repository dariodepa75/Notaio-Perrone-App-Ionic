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

export function detectIsMobile(platform) {
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
    platform.ready().then(() => {
        if (platform.is('android')) {
            console.log("running on Android device!");
            isMobile = true;
        }
        if (platform.is('cordova')) {
            console.log("running in a browser on cordova!");
            isMobile = true;
        }
        if (platform.is('ios')) {
            console.log("running on iOS device!");
            isMobile = true;
        }
        if (platform.is('ipad')) {
            console.log("running in a browser on ipad!");
            isMobile = true;
        }
        if (platform.is('iphone')) {
            console.log("running in a browser on iphone!");
            isMobile = true;
        }
        if (platform.is('tablet')) {
            console.log("running in a browser on tablet!");
            isMobile = true;
        }
        if (platform.is('electron')) {
            console.log("running in a browser on electron!");
            isMobile = true;
        }
        if (platform.is('pwa')) {
            console.log("running in a browser on pwa!");
            isMobile = true;
        }
        if (platform.is('mobile')) {
            console.log("running in a browser on mobile!");
            isMobile = true;
        }
        if (platform.is('mobileweb')) {
            console.log("running in a browser on mobileweb!");
            isMobile = true;
        }
        if (platform.is('desktop')) {
            console.log("running in a browser on desktop!");
            isMobile = false;
        }
        if (platform.is('hybrid')) {
            console.log("running in a browser on hybrid!");
            isMobile = true;
        }
        if (!platform.is('cordova')) {
            console.log('Probably Browser');
            isMobile = false;
        }
    });
    return isMobile;
}