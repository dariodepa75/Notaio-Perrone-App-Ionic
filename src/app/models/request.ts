export class RequestModel {
    constructor(
        public id: number,
        public time: string,
        public form_id: number,
        public submission_id: number,
        public source_url: string,
        public user_agent: string,
        public ip: string,
        public status: string,
        public trash: boolean,

        public nome: string,
        public email: string,
        public quesito: string,
        public modalita: string,
        public telefono: string,
        public contatto_skype: string,
        public data_desiderata: string,
        public ora_desiderata: string,

        public msg_status: string,
        public chr_status: string,

        public amount: string,
        public email_content: string,
        public email_time: string,

        public calendarId: string,
        public eventId: string,

        public payment_time: string,
        public payment_amount: string,
        public payment_intent: string
    ) {}
  }
