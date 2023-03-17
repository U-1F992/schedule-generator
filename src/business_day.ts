import { Integer, parseInteger } from "./common";

class TimeSpan {

    static get MILLISECOND() { return new TimeSpan(parseInteger(1)); }
    static get SECOND() { return TimeSpan.MILLISECOND.multiply(1000); }
    static get MINUTE() { return TimeSpan.SECOND.multiply(60); }
    static get HOUR() { return TimeSpan.MINUTE.multiply(60); }
    static get DAY() { return TimeSpan.HOUR.multiply(24); }

    #raw: Integer;
    get raw() { return this.#raw; }

    constructor(milliseconds: Integer) {
        this.#raw = milliseconds;
        Object.freeze(this);
    }

    add(ts: TimeSpan) { return new TimeSpan(parseInteger(this.raw + ts.raw)); }
    multiply(num: number) { return new TimeSpan(parseInteger(Math.trunc(this.raw * num))); }
    negate() { return this.multiply(-1); }
    subtract(ts: TimeSpan) { return this.add(ts.negate()); }
    divide(num: number) { return new TimeSpan(parseInteger(Math.trunc(this.raw / num))); }

    resolve(date: Date) { return new Date(date.getTime() + this.raw); }
}

const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
const isSecondFriday = (date: Date) => date.getDay() === 5 && date.getDate() >= 8 && date.getDate() <= 14;
const nationalHolidays = Object.keys(await fetch("https://holidays-jp.github.io/api/v1/datetime.json").then(res => res.json()))
    .map(key => new Date(parseInt(key) * 1000));
const isHoliday = (date: Date) => nationalHolidays
    .map(date => date.toLocaleDateString())
    .includes(date.toLocaleDateString());

export type ClosedDayRuleTag = "gihyo" | "weekdays" | "none";
type ClosedDayRule = {
    tag?: ClosedDayRuleTag;
    conditions: ((date: Date) => boolean)[];
}

export const neverClosed: ClosedDayRule = { tag: "none", conditions: [] };
export const onlyWeekdays: ClosedDayRule = { tag: "weekdays", conditions: [isWeekend, isHoliday] };
export const onlyGihyoBusinessDays: ClosedDayRule = { tag: "gihyo", conditions: [isWeekend, isHoliday, isSecondFriday] };

export class BusinessDay {

    #days: Integer;
    #rule: ClosedDayRule;

    constructor(days: Integer, closedDayRule: ClosedDayRule = { conditions: [] }) {
        this.#days = days;
        this.#rule = closedDayRule;
        Object.freeze(this);
    }

    resolve(date: Date) {
        if (0 < this.#days) {
            return this.#resolveForward(date);
        } else if (this.#days < 0) {
            return this.#resolveBackward(date);
        } else {
            return new Date(date.getTime());
        }
    }

    #isClosedDay(date: Date) { return this.#rule.conditions.some(cond => cond(date)); }

    #resolveForward(date: Date): Date {
        const tomorrow = TimeSpan.DAY.resolve(date);
        if (this.#isClosedDay(tomorrow)) {
            return this.#resolveForward(tomorrow);
        } else {
            if (this.#days !== 0) {
                return new BusinessDay(parseInteger(this.#days - 1), this.#rule).#resolveForward(tomorrow);
            } else {
                return new Date(date.getTime());
            }
        }
    }

    #resolveBackward(date: Date): Date {
        const yesterday = TimeSpan.DAY.negate().resolve(date);
        if (this.#isClosedDay(yesterday)) {
            return this.#resolveBackward(yesterday);
        } else {
            if (this.#days !== 0) {
                return new BusinessDay(parseInteger(this.#days + 1), this.#rule).#resolveBackward(yesterday);
            } else {
                return new Date(date.getTime());
            }
        }
    }
}
