export class UserModel {
    constructor(
        public provider: string,
        public id: string,
        public email: string,
        public name: string,
        public photoUrl: string,
        public firstName: string,
        public lastName: string,
        public authToken: string,
        public idToken: string,
        public authorizationCode: string,
        public response: any,
    ){}
}