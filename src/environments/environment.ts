// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  wpJsonUrl: 'https://studio.notaioperrone.it/wp-json',
  googleIdCalendar: 'dt87td23ioa6dhp5k1g0rirtds@group.calendar.google.com',

  requestsEndpoint: 'https://app.notaioperrone.it/API/requestsJson.php',
  sendMailEndpoint: 'https://app.notaioperrone.it/API/sendMail.php',
  emailTemplateEndpoint: 'https://app.notaioperrone.it/API/emailTemplate.php',
  setQuotationEndpoint: 'https://app.notaioperrone.it/API/setQuotation.php',
  dateRequestsEndpoint: 'https://app.notaioperrone.it/API/dateRequestsJson.php',
  setStatusRequestEndpoint: 'https://app.notaioperrone.it/API/setStatus.php',
  updateRequestEndpoint: 'https://app.notaioperrone.it/API/updateRequest.php',
  googleCalendarEndpoint: 'https://www.googleapis.com/calendar/v3/calendars/',
  urlPayment: 'https://app.notaioperrone.it/STRIPE/WIZARD/step1.php'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
