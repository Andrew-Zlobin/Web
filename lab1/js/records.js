function generateTable(data) {
    const tbl = document.createElement("table");
    const tblBody = document.createElement("tbody");

    for (let i = 0; i < 2; i++) {
        const row = document.createElement("tr");
  
        for (let j = 0; j < 2; j++) {
            const cell = document.createElement("td");
            const cellText = document.createTextNode(`cell in row ${i}, column ${j}`);
            cell.appendChild(cellText);
            row.appendChild(cell);
        }
        tblBody.appendChild(row);
    }
    tbl.appendChild(tblBody);
    document.body.appendChild(tbl);
    tbl.setAttribute("border", "2");
}
function getData() {
    
}


let data = getData();
generateTable(data);