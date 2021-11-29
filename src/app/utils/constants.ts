// CONSTANTS
export const ARRAY_STATUS = [{ 'code':'0', 'char': 'AP', 'message': 'IN ATTESA DI PREVENTIVO'},
{'code':'100', 'char': 'AP', 'message': 'IN ATTESA DI PAGAMENTO'},
{'code':'200', 'char': 'AC', 'message': 'IN ATTESA DI CONSULENZA'},
{'code':'300', 'char': 'RA', 'message': 'RICHIESTA ARCHIVIATA'},
{'code':'400', 'char': 'RC', 'message': 'RICHIESTA CESTINATA'}];

export const ARRAY_STATUS_DATE_REQUEST = [{ 'code':'0', 'char': 'AC', 'message': 'IN ATTESA DI CONFERMA'},
{'code':'200', 'char': 'AC', 'message': 'AGGIUNTO AL CALENDARIO'},
{'code':'300', 'char': 'RA', 'message': 'RICHIESTA ARCHIVIATA'},
{'code':'400', 'char': 'RC', 'message': 'RICHIESTA CESTINATA'}];


export const STATUS_ERROR = "-1";
export const STATUS_0 = "0";
export const STATUS_100 = "100";
export const STATUS_200 = "200";
export const STATUS_300 = "300";
export const STATUS_400 = "400";
export const TOKEN_KEY = 'token';
export const GOOGLE_TOKEN_KEY = 'googleToken';
export const TIME_MINUTES_APPOINTMENT = 60;


// LABELS //
export const LABEL_TODAY = 'Oggi'; // 'Today'; // 'Oggi';
export const LABEL_TOMORROW = 'Ieri'; // 'Yesterday';
export const LABEL_LAST_ACCESS = 'ultimo accesso'; // 'last access';
export const LBL_CONSULENZE =  'Consulenze';
export const LBL_APPUNTAMENTI =  'Appuntamenti';
export const LBL_DAY = 'day';
export const LBL_NUM_DAY = 'num day';
export const LBL_MONTH = 'month';
export const LBL_YEAR = 'year';
export const LBL_RICHIESTA_DEL = "RICHIESTA DEL";
export const LBL_MODIFICA_IMPORTO = "Modifica importo";
export const LBL_MODELLO_RISPOSTA = "Modello risposta";
export const LBL_INVIA_MESSAGGIO = "Invia messaggio";
export const LBL_PREVENTIVO = "Preventivo";
export const LBL_ANNULLA = 'Annulla';
export const LBL_CONFERMA = 'Conferma';


// MESSAGES //
export const MSG_AUTH_OK = 'Autenticazione google riuscita';
export const MSG_AUTH_KO = 'Autenticazione google NON riuscita';
export const MSG_ADD_EVENT_OK = 'Evento aggiunto al calendario correttamente';
export const MSG_DATE_REQUEST = 'APPUNTAMENTO';
export const MSG_GENERIC_KO  = "Operazione fallita";
export const MSG_GENERIC_OK  = "Operazione conclusa con successo";
export const MSG_EMPTY_REQUESTS =  'NESSUN RISULTATO';
export const MSG_FORMULATE_QUOTE =  'FORMULA UN PREVENTIVO';
export const MSG_ERROR_AMOUNT = 'Importo non valido';


