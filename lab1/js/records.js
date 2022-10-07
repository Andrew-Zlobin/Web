function generateTable() {
    const tbl = document.getElementById('recordTable');
    let playersList = getPlayers();
    for (player in playersList) {
        const row = document.createElement("tr");
        console.log(playersList[player]);
        for (p in playersList[player]) {
            const cell = document.createElement("td");
            const cellText = document.createTextNode(playersList[player][p]);
            cell.appendChild(cellText);
            row.appendChild(cell);
        }
        tbl.appendChild(row);
    }
}
function getPlayers() {
    console.log(JSON.parse(localStorage.getItem("listPlayer")));
    return JSON.parse(localStorage.getItem("listPlayer"));
}

generateTable();