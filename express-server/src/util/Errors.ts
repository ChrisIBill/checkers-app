export class BadError extends Error {
    constructor(message: string, options: any) {
        super(message);
    }
}
export class InvalidStateError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class ParameterError extends Error {
    constructor(message: string) {
        super(message);
    }
}
