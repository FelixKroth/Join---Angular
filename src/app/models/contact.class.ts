export class Contact {
    firstName: string;
    lastName: string;
    eMail: string;
    birthDate: number;
    street: string;
    zipCode: number;
    city: string;
    color: string; // Add the color property

    constructor(obj?: any) {
        this.firstName = obj ? obj.firstName : '';
        this.lastName = obj ? obj.lastName : '';
        this.eMail = obj ? obj.eMail : '';
        this.birthDate = obj ? obj.birthDate : '';
        this.street = obj ? obj.street : '';
        this.zipCode = obj ? obj.zipCode : '';
        this.city = obj ? obj.city : '';
        this.color = obj ? obj.color : ''; // Initialize color
    }
}
