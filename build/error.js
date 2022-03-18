export class UnexpectedEof extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class UnmatchedOpeningChar extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
//# sourceMappingURL=error.js.map