import { BusinessDay, ClosedDayRuleTag, neverClosed, onlyGihyoBusinessDays, onlyWeekdays } from "./business_day";
import { Integer, ISODateString } from "./common";

type ClosedDayRuleTagOrList = ClosedDayRuleTag | ISODateString[];
type Duration = {
    closedDayRule: ClosedDayRuleTagOrList;
    days: Integer;
};
function getRules(tagOrList: ClosedDayRuleTagOrList) {
    switch (tagOrList) {
        case "none":
            return neverClosed;
        case "weekdays":
            return onlyWeekdays;
        case "gihyo":
            return onlyGihyoBusinessDays;
        default:
            return {
                conditions: tagOrList
                    .map(dateString =>
                        (date: Date) => date.toLocaleDateString() === new Date(dateString).toLocaleDateString()
                    )
            };
    }
}
type EventNode = {
    description: string;
    duration: Duration;
    childNodes: EventNode[];
};
export type Event = {
    description: string;
    beginsAt: Date;
    endsAt: Date;
};
export type Schedule = {
    origin: ISODateString;
    events: EventNode[];
};

function getEvents(origin: Date, node: EventNode) {
    const ret: Event[] = [];

    const closerDate = new Date(origin.getTime());
    const closedDayRule = getRules(node.duration.closedDayRule);
    const furtherDate = new BusinessDay(node.duration.days, closedDayRule).resolve(closerDate);

    const isForward = node.duration.days > 0;
    const [beginsAt, endsAt] = isForward ? [closerDate, furtherDate] : [furtherDate, closerDate];

    const event: Event = {
        description: node.description,
        beginsAt: beginsAt,
        endsAt: endsAt
    };

    ret.push(event);
    for (const child of node.childNodes) {
        ret.push(...getEvents(isForward ? event.endsAt : event.beginsAt, child));
    }

    return ret;
}

export function resolveSchedule(schedule: Schedule): Event[] {
    const ret: Event[] = [];

    const origin = new Date(schedule.origin);
    for (const node of schedule.events) {
        ret.push(...getEvents(origin, node));
    }

    ret.sort((a, b) => a.beginsAt.getTime() - b.beginsAt.getTime());
    return ret;
}
