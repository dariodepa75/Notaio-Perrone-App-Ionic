// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  versionApp: 'ver 1.0.13',
  production: false,
  wpJsonUrl: 'https://notaioperrone.it/wp-json',
  googleIdCalendar: 'dt87td23ioa6dhp5k1g0rirtds@group.calendar.google.com',
  urlGoogleCalendar: 'calendar.google.com/calendar/embed?src=dt87td23ioa6dhp5k1g0rirtds%40group.calendar.google.com&ctz=Europe%2FRome',
  APIEndpoint: 'https://app.notaioperrone.it/API/',
  requestsEndpoint: 'https://app.notaioperrone.it/API/requestsJson.php',
  sendMailEndpoint: 'https://app.notaioperrone.it/API/sendMail.php',
  emailTemplateEndpoint: 'https://app.notaioperrone.it/API/emailTemplate.php',
  setQuotationEndpoint: 'https://app.notaioperrone.it/API/setQuotation.php',
  dateRequestsEndpoint: 'https://app.notaioperrone.it/API/dateRequestsJson.php',
  setStatusRequestEndpoint: 'https://app.notaioperrone.it/API/setStatus.php',
  updateRequestEndpoint: 'https://app.notaioperrone.it/API/updateRequest.php',
  googleCalendarEndpoint: 'https://app.notaioperrone.it/googleAPI/',
  pgGoogleCalendarInsert: 'insertEvent.php',
  pgGoogleCalendarDelete: 'deleteEvent.php',
  
  // googleCalendarEndpoint: 'https://www.googleapis.com/calendar/v3/calendars/',
  googleCalendarTokenEndpoint: 'https://app.notaioperrone.it/googleAPI/getToken.php',
  urlPayment: 'https://app.notaioperrone.it/checkout/step1.php',

  googleToken: 'ya29.a0ARrdaM-mlTm11eGPZPfg90yEIF7cq4vr5aCIZjQQbMhDYJyGcA6srAJF3B2_djElxQIR-t18SN8Ee4NiSFtM99s6o2raSNZscy2l1s2YoWzPxLgxnWioq0WXcciST9_PIdSBsyUiQJXwsG1UrqwPijvCdcnv',

 ONESIGNAL_APP_ID: '30fc7d33-aa53-47dc-8209-e4abd86dcece', 
 ANDROID_ID:''
  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
