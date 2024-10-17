var canvas = /** @type {HTMLCanvasElement} */(null);
var ctx = /** @type {CanvasRenderingContext2D} */(null);
var requestAnimationFrameID = -1;

var time = 0,
    fps = 0,
    framesAcum = 0,
    acumDelta = 0;
var targetDT = 1/60; // 60 fps
var globalDT;
var savePunt = 0;

var sounds = { //biblioteca de sonidos

    pop: {
        audio: new Audio('./assets/pop.wav'),
    },
    ball: {
        audio: new Audio('./assets/shot.wav'),
    },
    menuMusic: {
        audio: new Audio('./assets/junes_ThemeP4.wav'),
    },
    bouncing: {
        audio: new Audio('./assets/bote.wav'),
    },
    destroy: {
        audio: new Audio('./assets/destroy.wav'),
    },
    click: {
        audio: new Audio('./assets/button.wav'),
    },
};

var assets = { //biblioteca de assets
    ball1: {
        img: null,
        path: "./assets/bola_01.png"
    },
    ball2: {
        img: null,
        path: "./assets/bola_02.png"
    },
    ball3: {
        img: null,
        path: "./assets/bola_03.png"
    },
    ball4: {
        img: null,
        path: "./assets/bola_04.png"
    },
    cannon: {
        img: null,
        path: "./assets/cannons.png"
    },
    cannon2: {
        img: null,
        path: "./assets/cannon_2.png"
    },
    bola: {
        img: null,
        path: "./assets/bola_cannon.png"
    },
    shield: {
        img: null,
        path: "./assets/Shield_spritesheet.png"
    },
    backGround: {
        img: null,
        path: "./assets/fondo_cielo.png"
    },
    ground: {
        img: null,
        path: "./assets/fondo_hierba.png"
    },
    wheel: {
        img: null,
        path: "./assets/rueda.png"
    },
    shield_: {
        img: null,
        path: "./assets/Shield.png"
    },
    bullet_: {
        img: null,
        path: "./assets/flecha.png"
    },
    frame: {
        img: null,
        path: "./assets/cuadrado.png"
    }
}

var gameState = {
    mainMenu: 0,
    game: 1,
    gameOver: 2
}

var currentGameState;
var currentScene = null;

function LoadImages(assets, onloaded) {
    let imagesToLoad = 0;
    
    if (Object.keys(assets).length === 0)
        onloaded();

    const onload = () => --imagesToLoad === 0 && onloaded();

    for (let asset in assets) {
        if (assets.hasOwnProperty(asset)) { //carga todas las imagenes
            imagesToLoad++;

            const img = assets[asset].img = new Image;
            img.src = assets[asset].path;
            img.onload = onload;
        }
     }
    return assets;
}

function Init() {

    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    // input setup
    SetupKeyboardEvents();
    SetupMouseEvents();

    currentGameState = gameState.mainMenu;
    
    // assets loading
    LoadImages(assets, () => {

        // setup main menu
        MainMenuSetup(() => {
            currentGameState = gameState.game;
            currentScene = new Game(assets);
            Start();
            Loop();
        });        
    });
}

function Start() {
    time = performance.now();
    currentScene.Start();
}

function Loop() {
    requestAnimationFrameID = requestAnimationFrame(Loop);
    
    let now = performance.now();

    let deltaTime = (now - time) / 1000;
    globalDT = deltaTime;

    time = now;

    framesAcum++;
    acumDelta += deltaTime;  

    if (acumDelta >= 1) {
        fps = framesAcum; //para contar los fps actuales del juego
        framesAcum = 0;
        acumDelta -= 1;
    }

    if (deltaTime > 1000)
        return;

    
    Update(deltaTime);

    Draw(ctx);

    Input.PostUpdate();
}

function Update(deltaTime) {
    //llama al update de la escena actual
    currentScene.Update(deltaTime);
}

function Draw(ctx) {
    //limpia el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    currentScene.Draw(ctx);

    // draw the fps
    DrawStats(ctx);
}

function DrawStats(ctx) { //se usa para dibujar el estado actual del juego, lo dejo comentado porque no lo necesito en mi proyecto pero biene bien tenerlo de debug
//     ctx.textAlign = "start";
//     ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
//     ctx.fillRect(2, 2, 110, 54);
//     ctx.fillStyle = "white";
//     ctx.font = "12px Comic Sans MS regular";
    
//     ctx.fillText("FPS: " + fps, 6, 14);
//     ctx.fillText("FPS (dt): " + (1 / globalDT).toFixed(2), 6, 32);
//     ctx.fillText("deltaTime: " + (globalDT).toFixed(4), 6, 50);
}

function ChangeScene(nextScene) {  // para cambiar las escenas del juego 
    switch(nextScene) {
        case gameState.mainMenu:
            cancelAnimationFrame(requestAnimationFrameID);
            currentGameState = gameState.mainMenu;
            ShowMenu();
            break;
        case gameState.game:
            currentGameState = gameState.game;
            currentScene = new game(assets);
            currentScene.Start();
            break;
        case gameState.gameOver:
            cancelAnimationFrame(requestAnimationFrameID);
            currentGameState = gameState.gameOver;
            currentScene.destroy;
            ShowGameOver();
            break;
    }
}

window.onload = Init;