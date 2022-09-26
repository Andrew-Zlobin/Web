function login(e){
    //e.preventDefault();
    let name = document.getElementById("name").value;
    console.log(name);
    
    localStorage.setItem("currentPlayer", name);
}

document.getElementById("name").value = localStorage.getItem("currentPlayer");
document.getElementById("usr").addEventListener("submit", login);