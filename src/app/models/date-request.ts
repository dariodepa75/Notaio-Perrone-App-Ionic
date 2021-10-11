export class DateRequestModel {
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
        public telefono: string,
        public sede: string,
        public data_desiderata: string,
        public ora_desiderata: string,

        public msg_status: string,
        public chr_status: string,
    ) {}
  }
