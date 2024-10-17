var mainMenu;
var credits;
var leaderBoard;
var gameOver;
var startButton;
var creditsButton;
var leaderBoardButton;
var backButton1;
var backButton2;
var backButton3;

function MainMenuSetup(onStart) {
    //cargamos todos los elementos del menu que vamos a utilizar
    mainMenu = document.getElementById("mainMenu");
    credits = document.getElementById("credits");
    startButton = document.getElementById("startButton");
    creditsButton = document.getElementById("creditsButton");
    backButton1 = document.getElementById("backButton1");
    backButton3 = document.getElementById("backButton3");
    leaderBoardButton = document.getElementById("leaderButton");
    leaderBoard = document.getElementById("leaderBoard");
    gameOver = document.getElementById("gameOver")

    ShowMenu();
    
    startButton.onclick = () => {
        sounds.click.audio.play();
        mainMenu.setAttribute('style', 'top: 720px');
        if (typeof(onStart) !== 'undefined') {
            onStart();
        }
    }

    creditsButton.onclick = () => {
        sounds.click.audio.play();
        ShowCredits();
    }

    leaderBoardButton.onclick = () => {                     //funcionamiento de los botones del menú
        sounds.click.audio.play();
        ShowLeaderBoard();
    }

    backButton1.onclick = () => {
        sounds.click.audio.play();
        ShowMenu();
    }

    backButton3.onclick = () => {
        sounds.click.audio.play();
        SaveScore();
    }
}

function ShowMenu(){
    mainMenu.setAttribute('style', 'top: 0px');
    credits.setAttribute('style', 'top: 720px');
    leaderBoard.setAttribute('style', 'left: 1280px');
    gameOver.setAttribute('style', 'top: -720px')
}

function ShowCredits(){
    mainMenu.setAttribute('style', 'top: -720px');
    credits.setAttribute('style', 'top: 0px');
}

function ShowLeaderBoard(){
    mainMenu.setAttribute('style', 'left: -1280px');                //se cambian los "paneles" en funcion de que parte del menu queremos enseñar
    leaderBoard.setAttribute('style', 'left: 0px');
    GetScores();
}

function ShowGameOver() {
    gameOver.setAttribute('style', 'top: 0px');
}

function SaveScore() { //se llama a la fucnion saveTask que hemos creado de FireStore para guardar la puntuacion junto a un nombre
    const playerNameInput = document.getElementById('playerName');
    const playerName = playerNameInput.value.trim();
    
    if (playerName.length !== 5) {
        alert('Please enter a 5-letter name.'); //solo se permiten nombres de 5 letras
    }else{
        saveTask(playerName,savePunt);
        playerNameInput.value = "";   //se resetea para la siguienet partida salga el cuadro en blanco
        ShowMenu();
    }

    
}

function GetScores() { //se llama a la fucnion getTask que hemos creado de FireStore para obtener los datos de la Leaderboard
    getTask().then((querySnapshot) => {
        const leaderboardContent = document.querySelector(".leaderBoard-content");
        
        // Limpiar cualquier contenido previo en la tabla de líderes
        leaderboardContent .innerHTML = "";
    
        // Crear un array para almacenar los datos de la leaderboard
        const leaderboardData = [];
    
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const playerName = data.name;
            const playerPoints = data.points;
    
            // Agregar los datos a la array de la leaderboard
            leaderboardData.push({ name: playerName, points: playerPoints });
        });
    
        // Ordenar los datos según los puntos en orden descendente
        leaderboardData.sort((a, b) => b.points - a.points);
    
        // Limitar los datos a los 5 mejores
        const top5Data = leaderboardData.slice(0, 5);
    
        // Crear un elemento para cada uno de los 5 mejores jugadores y agregarlos al leaderboard
        top5Data.forEach((playerData, index) => {
            const playerInfo = document.createElement("h2");
            playerInfo.textContent = `${index + 1}. ${playerData.name}: ${playerData.points}`;
            leaderboardContent.appendChild(playerInfo);
        });
    
        // Crear el botón "Back"
        const backButton = document.createElement("div");
        backButton.classList.add("menuButton");
        backButton.id = "backButton2";
        backButton.textContent = "Back";
    
        // Agregar el botón "Back" al leaderboard
        leaderboardContent.appendChild(backButton);
    
        backButton.onclick = () => {
            sounds.click.audio.play();
            ShowMenu();
        };
    
    }).catch((error) => {
        console.error('Error al obtener los datos:', error);
    });
}
