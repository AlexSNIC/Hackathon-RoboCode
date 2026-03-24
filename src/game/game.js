const levels = [null];

let level = {};
let player = {};
let collectables = [];
let actionQueue = [];
let gameInterval = null;

window.settings = {
  gameSpeed: 70,
  animationSpeed: 60,

  currentLevel: 0, // n - 1
  actionQueue: actionQueue,

  gameRunning: false,
  gameIntermission: undefined,
}

function setupGame(){
  for(let i = 1; i < levelsProperties.length; i++){
    const { map, diamonds, startPoz, endPoz } = levelsProperties[i]; 
    levels.push(new Level(i, levelsProperties[i].map, assets.maps));
    levels[i].map = map.map(arr => [...arr]);
    levels[i].diamonds = diamonds.map(poz => ({...poz}));
    levels[i].startPoz = {...startPoz}
    levels[i].endPoz = {...endPoz}
  };
  if(localStorage.getItem("PF__CURRENT__LEVEL") !== null)
    window.settings.currentLevel = Number(localStorage.getItem("PF__CURRENT__LEVEL"));

  gameInterval = setInterval(gameLoop, settings.gameSpeed);
  buildNextLevel();
}

function gameLoop(){
  drawPalette();
  updateAnimations();

  if(!settings.gameRunning) {
    return;
  }
  if(player.bumped){
    setTimeout(() => {
      endGame();
    }, 6 * settings.animationSpeed);
    return;
  }
  // if(actionQueue.length === 0){
  //   endGame();
  // }
  checks();
  if(player.actions === 0)
    actionQueue = updateQueue(actionQueue, level);

  if(level?.finished){
    settings.gameRunning = false;
    buildNextLevel();
    return;
  }
}

function buildNextLevel(){
  settings.currentLevel++;
  if(settings.currentLevel === 11) settings.currentLevel = 1;
  localStorage.setItem("PF__CURRENT__LEVEL", String(settings.currentLevel - 1));
  if(settings.gameIntermission === undefined){
    settings.gameIntermission = true;
    buildLevel();
    player.enter();
    
    setTimeout(() => {
      settings.gameIntermission = false;
    }, 16 * settings.animationSpeed);
    return;
  }
  
  
  settings.gameIntermission = true;
  
  // setBlackout(24);
  player.exit();
  
  setTimeout(() => {
    buildLevel();
    player.enter();
    console.log(player.enter)

    setTimeout(() => {
      settings.gameIntermission = false;
    }, 16 * settings.animationSpeed);
  }, 8 * settings.animationSpeed);
}
function buildLevel(){
  level = levels[settings.currentLevel];
  level.finished = false;

  level.startDoor = new Door(assets.door, level, "start");
  level.endDoor = new Door(assets.door, level, "end");
  collectables = [];
  level.diamonds.forEach(diamond => {
    collectables.push(new Diamond(diamond.x, diamond.y, assets.diamond, level));
  });
  level.collectables = collectables;
  player = new Player(level.startPoz.x, level.startPoz.y, assets.player, level);
  level.player = player;
}
function endGame(){
  settings.gameRunning = false;
  buildLevel();
}

function compiledCode(){
  const code = codeDOM.value;
  return compile(code);
}
function startGame(){
  if(settings.gameRunning) return;
  if(settings.gameIntermission) return;
  settings.gameRunning = true;
  actionQueue = compiledCode();
  console.log("Queue:");
  actionQueue.forEach(act => console.log(act));
}

function drawPalette(){
  // template
  ctx.fillStyle = "rgb(63, 56, 81)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // background
  level.drawBackground();
  
  // foreground  
  level.drawForeground();
  level.endDoor.draw();
  level.startDoor.draw();
  
  // objects
  collectables.forEach(collectable => collectable.draw());
  player.draw();

  // HUD
  drawText(level);
  // exit
  ctx.fillStyle = `rgba(63, 56, 81, ${blackout.opacity})`;
}
function checks(){
  collectables.forEach(collectable => {collectable.checkCollect()});
  if(!level.endDoor.isOpen && collectables.length === 0) {
      level.endDoor.open();
  }
}
function updateAnimations(){
  player.update();
  level.startDoor.update();
  level.endDoor.update();
  collectables.forEach((collectable) => collectable.update());
}

function updateQueue(actionQueue, level){
  let player = level.player;
  if(actionQueue === null){
    endGame();
    return;
  }

  if(!actionQueue || actionQueue.length === 0) return;
  const action = actionQueue.shift();

  switch(action.command){
    case "moveRight": {
      let moveBy = action.moveBy;

      player.moveRight(moveBy);
      break }
    case "moveLeft": {
      let moveBy = action.moveBy;

      player.moveLeft(moveBy);
      break }
    
    case "turn": {
      let direction = action.direction;

      player.turn(direction);
      break }
    
    case "jump": {
      let direction = action.direction;
      
      player.jump(direction);
      break }
    case "attack": {

      player.attack();
      break;
    }
    case "end":{

      let success = player.exit();
      if(success === null)
        endGame();

      break;
    }
    case "compound": {
      let actions = action.actions;
      actionQueue.unshift(...actions);
      break;
    }
    case "if":{
      let args = action.args;

      let completeNextAction = getIfStatementValue(args, level);
      if(completeNextAction) actionQueue = updateQueue(actionQueue, level);
      else actionQueue.shift();
      break;
    }
    case "while":{
      let args = action.args;

      let completeNextAction = getIfStatementValue(args, level);
      if(completeNextAction){
        actionQueue.unshift(action);
        actionQueue.unshift(actionQueue[1]);
      }
      else{
        actionQueue.shift();
      }
      break;
    }
  }
  
  return actionQueue;
}

const assets = {};
getAssets().then((loadedAssets) => {
  Object.assign(assets, loadedAssets);
  
  function checkDOMLoaded() {
    if(window.settings.DOMLoaded === true) {
      setupGame();      
    }
    else {
      setTimeout(() => checkDOMLoaded(), 100);
    }
  }
  checkDOMLoaded();
});
