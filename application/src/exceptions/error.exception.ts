export class ErrorException<T> extends Error {
    constructor(public message: string, public data?: T) {
        super(message);
        this.data = data;
    }
}