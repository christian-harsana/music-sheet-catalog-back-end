export class HttpError extends Error {
    constructor(
        public statusCode: number,
        message: string,

    ) {
        super(message);
        Object.setPrototypeOf(this, HttpError.prototype)
    }
}