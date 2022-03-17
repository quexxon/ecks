export class UnexpectedEof extends Error {
    constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class UnmatchedOpeningChar extends Error {
    constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
    }
}
