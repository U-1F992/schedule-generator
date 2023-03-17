import { renderResult } from "./render";
import { resolveSchedule, Schedule } from "./schedule";

const params = new URLSearchParams(window.location.search);
const s = params.get("s");

if (s === null) {
    throw new Error("s is null");
}

const schedule = JSON.parse(decodeURIComponent(s)) as Schedule;
console.log(schedule);

const events = resolveSchedule(schedule);
console.log(events);

document.querySelector(".markdown-body")?.appendChild(renderResult(events));
