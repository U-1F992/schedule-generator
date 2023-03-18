import { renderResult } from "./render";
import { resolveSchedule, Schedule } from "./schedule";

const params = new URLSearchParams(window.location.search);
const encodedURL = params.get("url");
if (encodedURL === null) {
    throw new Error("url is null");
}
const url = decodeURIComponent(encodedURL);
console.log(url);

const json = await fetch(url).then(res => res.json());
const schedule = json as Schedule;
console.log(schedule);

const events = resolveSchedule(schedule);
console.log(events);

document.getElementById("body")?.appendChild(renderResult(events));
