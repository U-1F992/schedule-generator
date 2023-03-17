export type ISODateString = string & { __isoDateString: never };
export function parseISODateString(input: unknown): ISODateString {
    if (typeof input !== "string") {
        throw new Error("input is not a string");
    }
    if (Number.isNaN(Date.parse(input))) {
        throw new Error("Cannot parse input");
    }
    return input as ISODateString;
}

export type Integer = number & { __integer: never };
export function parseInteger(input: unknown): Integer {
    if (typeof input !== "number") {
        throw new Error("input is not a number");
    }
    if (!Number.isInteger(input)) {
        throw new Error("input is not a integer");
    }
    return input as Integer;
}
