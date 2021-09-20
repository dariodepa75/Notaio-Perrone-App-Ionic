export class RequestModel {
    constructor(
        public id: number,
        public time: string,
        public form_id: number,
        public nome: string,
        public email: string,
        public quesito: string,
        public modalita: string,
        public telefono: string,
        public contatto_skype: string,
        public data_desiderata: string,
        public ora_desiderata: string,
        public source_url: string,
        public user_agent: string,
        public ip: string,
        public status: string
    ) { }
  }
