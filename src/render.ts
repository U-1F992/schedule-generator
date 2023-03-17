import { Event } from "./schedule";

export function renderResult(events: Event[]) {
    const table = document.createElement("table");
    table.innerHTML = "<tr><th>開始日</th><th>終了日</th><th>工程</th></tr>";

    events.forEach(event => {
        const row = document.createElement("tr");

        const beginCell = document.createElement("td");
        beginCell.textContent = `${event.beginsAt.getMonth() + 1}/${event.beginsAt.getDate()}`;

        const endCell = document.createElement("td");
        endCell.textContent = `${event.endsAt.getMonth() + 1}/${event.endsAt.getDate()}`;

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = event.description;

        row.appendChild(beginCell);
        row.appendChild(endCell);
        row.appendChild(descriptionCell);
        table.appendChild(row);
    });

    return table;
}