let scaleNum = document.getElementById('scaleNum');
const slider = document.getElementById("switch");
let language = document.getElementById("Languages");

let scale = parseInt(localStorage.getItem("Scale"));
let boxesDone = [], names = [], TlifeLines = [];
let boxOrder;
var Timer;
var multiplier = 1;

let currentTurn;
let number = document.getElementById("timerNum");
let tempNum = localStorage.getItem("timer");

function Node (active, amount){
    this.active = active;
    this.amount = amount;
}
const animatedElement = document.getElementById("logo");

class Stack{
    constructor(){
        this.pages = JSON.parse(localStorage.getItem('pageStack')) || [];
    }
    push(pageName){
        this.pages.push(pageName);
        this.saveStack();

    }
    pop(){
        this.pages.pop();
        this.saveStack();
    }
    peek(){
        return this.pages[this.pages.length-1];
    }
    show(){
        let str = "";
        for (let i = 0; i < this.pages.length; i++){
            str += this.pages[i] + " ";
        }
        console.log(str);
    }
    clearStack(){
        this.pages = [];
        this.saveStack();
    }
    saveStack() {
        localStorage.setItem('pageStack', JSON.stringify(this.pages));
    }
}
class Scores{
    constructor(){
        this.map = JSON.parse(localStorage.getItem('scores')) || {};
    }
    set(team, value){
        this.map[team] = value;
        this.save();
    }
    get(team) {
        return this.map[team];
    }
    save(){
        localStorage.setItem('scores', JSON.stringify(this.map));
    }
    clearScores(){
        this.map = {};
        this.save();
    }
}
//recent page
class Pages{
    constructor(stack) {
        this.stack = stack;
    }
    newPage(Function){
        window.location.href = `${Function}.html`;
        this.stack.push(Function);
    }
    previousPage(){
        this.stack.pop();
        window.location.href = `${this.stack.peek()}.html`;
    }
    //Prerequisets for what needs to be done for the specific page
    pageLoader(){
        console.log(stack.peek());
        switch(stack.peek()){
            case "Settings":
                const settings = {
                    lifeLines: JSON.parse(localStorage.getItem("TlifeLines")),
                    mode: localStorage.getItem("mode"),
                    language: localStorage.getItem("language"),
                    scale: localStorage.getItem("Scale"),
                    timer: localStorage.getItem("timer"),
                    timerBar: localStorage.getItem("timerBar")
                };
                let teamNum = +localStorage.getItem("#ofTeams")
                document.querySelector(`input[name="teamNum"][value="${teamNum}"]`).checked = true;
                slider.querySelector("input").checked = (settings.mode == "masochist");
                language.value = settings.language;
                scaleNum.innerHTML = settings.scale;
                number.innerHTML = settings.timer;
                document.getElementById("timerBar").value = settings.timerBar;
                
                settings.lifeLines[1].forEach((line, i) => {
                    document.getElementById(`LL${i+1}`).checked = line.active;
                });
                break;
            case "TeamPage":
                setNames();
                for(let i = 1; i < 5; i++){
                    document.getElementById(`T${i}Name`).value = names[i];
                }
                break;
            case "BoardSelect":
                resetItems();
                boxOrder = "boards";
                for(let i = 1; i < 10; i++){
                    switch (i) {
                        case 1: {
                            const img1 = new Image();
                            img1.src = 'Images/Sharingan.png';
                            img1.onload = function () {
                                context.drawImage(img1, 525, -550, 100, 100);
                            };
                            break;
                        }
                        case 5: {
                            const img2 = new Image();
                            img2.src = 'Images/Greatsword.jpeg';
                            img2.onload = function () {
                                context.drawImage(img2, 525, -350, 100, 100);
                            };
                            break;
                        }
                    }
                    boxStyles();
                    console.log("got here");
                    i % 3 == 0 ? context.translate(-700, 200): context.translate(350, 0);
                }
                break;
            case "Board":
                setNames();
                boxesDone = JSON.parse(localStorage.getItem("boxesDone"));
                boxOrder = "panel";
                context.font = "14pt Courier New";
                context.fillStyle = "red";
                boardHandler.titleBoxes();
                context.translate(0, 100);
                let valueNum = 0;
                for(let i = 1; i < 26; i++){
                    valueNum++;
                    boxesDone[i] == i ? boxStyles() : makeMoneyBoxes(valueNum);
                    context.translate(0,100);
                    if(i % 5 == 0){
                        valueNum = 0;
                        context.translate(230,-500);
                    }
                }
                //displays team names
                for(let i = 1; i < 5; i++){
                    let name = (names[i] != `noName${i}`) ? names[i] : `Team ${i}`;
                    document.getElementById(`team${i}`).innerHTML = `${name}: ${scores.get(names[i])}`;
                }
                break;
            case "Panel":
                panelLoad();
                break;
        }
    }
}
//settings
class Buttons{
    pauseMenu(input){
        switch (input){
            case "resume":
                pageHandler.previousPage();
                break;
            case "quit":
                if(window.confirm("are you sure you want to quit the game?")){
                    window.location.href = "HomePage.html";
                }
                break;
        }
    }
    reportBug(){
        let problem = document.getElementById("bugInput");
        problem.value != '' ? console.log("BUG REPORT: " + problem.value + "."): console.log("Nothing typed.");
        problem.value = '';
    }
    freePass(){
        currentTurn = localStorage.getItem("currentTurn");
        if(TlifeLines[currentTurn][0].amount > 0){
            setTeamLifeLines(0);
            pageHandler.previousPage();
        }
    }
    Multiply(){
        currentTurn = localStorage.getItem("currentTurn");
        if(TlifeLines[currentTurn][1].amount > 0){
            multiplier = 2;
        }
    }
    Izanagi(){
        currentTurn = localStorage.getItem("currentTurn");
        if(TlifeLines[currentTurn][2].amount > 0){
            setTeamLifeLines(2);
            question(+localStorage.getItem("boxNumOfCol"), +localStorage.getItem("column"));
            clearInterval(Timer);
            timer();
            setTimeout(() => {
                panelLoad();
            }, 300);
        }
    }
    showHint(){
        if(TlifeLines[currentTurn][3].amount > 0){
            document.getElementById("hint").innerHTML = "Hint: " + localStorage.getItem("hint");
        }
    }
    Izanami(){
        clearInterval(Timer);
        timer();
    }
}
class Settings{
    defaultStorer(){
        //sets how many teams there are
        const savedValue = 4;
        localStorage.setItem("#ofTeams", savedValue);
        if (savedValue) {
            const radioToCheck = document.querySelector(`input[name="teamNum"][value="${savedValue}"]`);
            if (radioToCheck) radioToCheck.checked = true;
        }

        TlifeLines = JSON.parse(localStorage.getItem("TlifeLines"));
        localStorage.setItem("Scale", 1);
        localStorage.setItem("mode", "casual");
        for (let r = 0; r < 4; r++) {
            for (let i = 0; i < 9; i++) {
                TlifeLines[r][i].active = false;
                TlifeLines[r][i].amount = 0;
            }
        }
        setTeamLifeLines(-1);
        number = 10;
        localStorage.setItem("timer", number);
        localStorage.setItem("timerBar", 1);
    }

    default(){
        if(stack.peek() == "Settings"){
            this.defaultStorer();
            slider.querySelector("input").checked = false;
        }
        if(stack.peek() == "TeamPage"){
            for(let i = 1; i < 5; i++){
                names[i] = `noName${i}`;
            }
            localStorage.setItem("teamNames", JSON.stringify(names));
        }
        pageHandler.previousPage();
    }

    save(){
        if(stack.peek() == "Settings"){
            TlifeLines = JSON.parse(localStorage.getItem("TlifeLines"));
            slider.querySelector("input").checked ? localStorage.setItem("mode", "masochist") : localStorage.setItem("mode", "casual");
            localStorage.setItem("Scale", scale);
            for (let r = 0; r < 4; r++) {
                for (let i = 0; i < 9; i++) {
                    const checkbox = document.getElementById(`LL${i+1}`);
        
                    TlifeLines[r][i].active = checkbox.checked;
                    TlifeLines[r][i].amount = (checkbox.checked) ? 2 : 0;
                }
            }
            localStorage.setItem("#ofTeams", +document.querySelector('input[name="teamNum"]:checked').value);
            setTeamLifeLines(-1);
            
            localStorage.setItem("timer", tempNum);
            localStorage.setItem("timerBar", JSON.parse(document.getElementById("timerBar").value));
        }
        if(stack.peek() == "TeamPage"){
            for(let i = 1; i < 5; i++){
                let name = document.getElementById(`T${i}Name`).value;
                names[i] = (name == '' || name == "undefined") ? `noName${i}`: name;
            }
            localStorage.setItem("teamNames", JSON.stringify(names));
        }
        pageHandler.previousPage();
        
    }

    change(input){
        switch(input){
            case "decrease":
                scale = (scale > 1) ? scale - 1 : 3;
                break;
            case "increase":
                scale = (scale < 3) ? scale + 1 : 1;
                break;
        }
        scaleNum.innerHTML = scale;
    }
    timerSlider(){
        let x = JSON.parse(document.getElementById("timerBar").value);
        tempNum = (x*((7*Math.pow(x,4)) - (95*Math.pow(x,3)) + (455*Math.pow(x,2)) - (865*x) + 738))/24;
        if(x == 0){
            tempNum = "None";
        }
        number.innerHTML = tempNum;
    }
}
class BoardRelations{
    //determings which game mode you click
    whichGame(canvasBoard, event){
        let rect = canvasBoard.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        //console.log("x position: " + x + " y position: " + y);
    
        if(x >= 450 && x <= 700){
            switch(true){
                case y >= 30 && y <= 180:
                    localStorage.setItem("game", "Anime");
                    break;
                case y >= 230 && y <= 380:
                    console.log("found it!");
                    localStorage.setItem("game", "FromSoft");
                    break;
                case y >= 430 && y <= 580:
                    localStorage.setItem("game", "Anime_Recent");
                    break;
                default:
                    break;
            }
        }
        pageHandler.newPage("Board");
    }
    
    //figures out the mouse cordinates
    getMousePosition(canvasBoard, event) {
        let rect = canvasBoard.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        let colPicked = 0;
        
        //if first column boxes are clicked
        if(y >= 10 && y <= 90){
            window.location.href = "Board.html";
        }
        else{
            //calculates the column
            colPicked = Math.floor((x - 5) / 230) + 1;
            localStorage.setItem("column", colPicked);
            if(colPicked >= 1 && colPicked <= 5 && (x - 5) % 230 <= 200){
                //calculates the position in column
                let boxNumOfCol = Math.floor((y - 10) / 100);
                localStorage.setItem("boxNumOfCol", boxNumOfCol);
                //verifies its position
                if ((y - 10) % 100 <= 75 && boxNumOfCol >= 1 && boxNumOfCol <= 5) {
                    this.sendUp(boxNumOfCol, colPicked);
                } else {
                    window.location.href = "Board.html";
                }
            }
        }
    }
    
    sendUp(boxNumOfCol, colPicked){
        const boxID = boxNumOfCol+((colPicked-1)*5);
        if(boxesDone[boxID] !== boxID){
            question(boxNumOfCol, colPicked);
            setTimeout(() => {
                pageHandler.newPage("Panel");
            }, 300);
        }
    }

    async titleBoxes(){
        let game = localStorage.getItem("game");
        for(let i = 0; i < 5; i ++){
            boxStyles();
                context.save();
                const info = await getData(`${game}Titles`);
                context.restore();
                const titles = info[`${game}Titles`];
                let texts = titles[i];
                texts.forEach(([text, x, y]) => {
                    context.fillText(text, x, y);
                });
                context.translate(230, 0);
            
            if(game == "video games"){
                switch(i){
                    case 1:
                        context.fillText("Geography", 50, 50);
                        break;
                    case 2:
                        context.fillText("Music", 70, 50);
                        break;
                    case 3:
                        context.fillText("Hall of Fame", 40, 50);
                        break;
                    case 4:
                        context.fillText("Vocabulary", 45, 50);
                        break;
                    case 5:
                        context.fillText("Items", 70, 50);
                        break;
                }
                context.translate(230,0);
            }
        }
    }
}

//handlers
const stack = new Stack;
const settingHandler = new Settings;
const pageHandler = new Pages(stack);
const buttonHandler = new Buttons;
const scores = new Scores;
const boardHandler = new BoardRelations;

//essentials
function setNames(){
    names = JSON.parse(localStorage.getItem("teamNames"));
}
//takes away one lifeline use
function setTeamLifeLines(x){
    if(x != -1){
        TlifeLines[currentTurn][x].amount--;
    }
    localStorage.setItem("TlifeLines", JSON.stringify(TlifeLines));
}

//Home Page code
function startUp(){
    animatedElement.addEventListener('animationend', () => {
        localStorage.setItem("bootUp", "needed");
        for (let row = 0; row < 4; row++) { //rows
            TlifeLines[row] = [];
            for (let column = 0; column < 9; column++) { //columns
                TlifeLines[row].push(new Node(false, 0));
            }
        }
        setTeamLifeLines(-1)
        window.location.href = "HomePage.HTML";
    });
    localStorage.clear();
    for(let i = 1; i < 5; i++){
        names[i] = `noName${i}`;
    }
    localStorage.setItem("teamNames", JSON.stringify(names));

}

function titleLoad() {
    const animatedElement2 = document.getElementById("homeBackground");
    animatedElement2.addEventListener('animationstart', () => {
    if(localStorage.getItem("bootUp") == "notNeeded"){
        animatedElement2.style.animation = 'none';
        animatedElement2.style.opacity = 1;
    }
    });
    animatedElement2.addEventListener('animationend', () => {
        localStorage.setItem("bootUp", "notNeeded");
        settingHandler.defaultStorer();
    });
    stack.clearStack();
    stack.push("HomePage");
}

function resetItems(){
    setNames();
    for(let i = 0; i < 26; i++){
        boxesDone[i] = -1;
    }
    console.log("Got here");
    for(let i = 1; i < 5; i++){
        scores.set(names[i], 0);
        scores.get(names[i])
    };
    localStorage.setItem("currentTurn", 1);
    localStorage.setItem("boxesDone", JSON.stringify(boxesDone));
}

function timer(){
    let count = localStorage.getItem("timer");
    let realTimer = document.getElementById("realTimer");
    Timer = setInterval(function(){
        realTimer.innerHTML = count;
        count--;
        if (count < 0) {
            clearInterval(timer);
            rightOrWrong("wrong");
        }
    }, 1000);
}

//loads a specific panel that was clicked on 
function panelLoad(){
    console.log(localStorage.getItem("Question"));
    const timerSetting = localStorage.getItem("timer");
    const timerElement = document.getElementById("realTimer");
    const picElement = document.getElementById('pic');
    const mp3PlayerElement = document.getElementById('mp3Player');
    const questionElement = document.getElementById('q');
    const answerElement = document.getElementById('a');

    timerSetting != "None" ? timer(): timerElement.innerHTML = "Take your Time";

    let Question = localStorage.getItem("Question");
    let Answer = localStorage.getItem("Answer");
    let Column = parseInt(localStorage.getItem("column"));

    //currentTurn = localStorage.getItem("currentTurn");
    TlifeLines = JSON.parse(localStorage.getItem("TlifeLines"));

    if(Column == 1 || Column == 5){
        picElement.src = Question;
        mp3PlayerElement.style.visibility = 'hidden';
    }
    else{
        picElement.style.visibility = 'hidden';
        if (Column === 2) {
            mp3PlayerElement.src = Question;
        } else {
            mp3PlayerElement.style.visibility = 'hidden';
            questionElement.innerHTML += Question;
        }
    }
    answerElement.innerHTML = "Answer: " + Answer;
    for(i = 1; i <= 9; i++){
        document.getElementById(`LLB${i}`).style.visibility = (TlifeLines[1][i-1].active) ? "visible": "hidden";
    }
}

function reveal(){
    document.getElementById('a').style.visibility = 'visible';
}

//selects the Q and A
async function question(boxNumOfCol, colPicked){
    console.log("colPicked type: ", typeof colPicked); 
    const boxID = boxNumOfCol+((colPicked-1)*5);
    boxesDone[boxID] = boxID; 
    localStorage.setItem("boxesDone", JSON.stringify(boxesDone));

    let randomNum = Math.floor(Math.random() * 3);
    let [Question, Answer] = await setQuestionsE(randomNum, boxNumOfCol, colPicked); //formula for box ID
    localStorage.setItem("boxPicked", boxNumOfCol);
    localStorage.setItem("Question", Question);
    localStorage.setItem("Answer", Answer);
}

//creates boxes
function boxStyles() {
    context.fillStyle = "lightblue";

    context.strokeStyle = "black";
    context.lineWidth = 1; 
    boxOrder == "panel" ? boxCreator(5, 10, 200, 75): boxCreator(100, 30, 250, 150);

    context.font = "14pt Courier New";
    context.fillStyle = "red";
}
function boxCreator(x, y, width, height) {
    context.fillRect(x, y, width, height);
    context.strokeRect(x, y, width, height);
}

function makeMoneyBoxes(value){
    boxStyles();
    context.fillText("$" + (value * 100), 75, 50);
}

let canvasBoard = document.getElementById("canvas");
let context = canvasBoard.getContext("2d");

//which canvas version was clicked
canvasBoard.addEventListener("click", function(e){
    if(boxOrder == "panel"){
        console.log("Canvas was clicked");
        boardHandler.getMousePosition(canvasBoard, e);
    }
    if(boxOrder == "boards"){
        boardHandler.whichGame(canvasBoard, e);
    }
})


function rightOrWrong(input) {
    let currentTurn = +localStorage.getItem("currentTurn");
    if(input == "right"){
        let boxPicked = parseInt(localStorage.getItem("boxPicked"));
        let points = boxPicked * 100 * multiplier;
        console.log(multiplier);
        setNames();
        scores.set(names[currentTurn], scores.get(names[currentTurn]) + points);
    }
    else{
        localStorage.setItem("currentTurn", (currentTurn % localStorage.getItem("#ofTeams")) + 1);
    }
    pageHandler.previousPage();
}

//for pulling JSON files
async function getData(request){
    let res = "";
    switch(request){
        case "AnimeTitles":
        case "FromSoftTitles":
        case "Anime_RecentTitles":
            res = await fetch('Category_Titles.json');
            break;
        case "Anime":
            res = await fetch('AnimeQA.json');
            break;
        case "FromSoft":
            res = await fetch('SoulsborneQA.json');
            break;
        default:
            break;
    }
    const data = await res.json();
    return data;
}

async function setQuestionsE(possibility, boxNumOfCol, colPicked){
    const info = await getData(localStorage.getItem("game"));
    const { Question, Answer, Hint } = info[`Column${colPicked}`][0][`Box${boxNumOfCol}`][possibility]; //narrows down through the JSON data
    localStorage.setItem("hint", Hint);
    return [Question, Answer];
}

//for the server connection and such
/*document.getElementById("questionForm").addEventListener("submit", async function (event) {
    event.preventDefault();
  
    const question = document.getElementById("userQuestion").value;
    const answer = document.getElementById("userAnswer").value;
    let hint = "";
    if (document.getElementById("Hint") && document.getElementById("userHint").value.trim() !== "") {
        hint = document.getElementById("Hint").value;
    }
  
    const response = await fetch("http://localhost:3000/add-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, hint}),
    });
  
    if (response.ok) {
        alert("Question submitted!");
        loadQuestions();
    }
  
    async function loadQuestions() {
      const res = await fetch("http://localhost:3000/get-questions");
      const data = await res.json();
      console.log("Response from server:", data);
      //document.getElementById("questionList").innerHTML = data.map(q => `<li>${q.question} - ${q.answer} - ${q.hint}</li>`).join("");
    }
  }); */

    async function submitQuestions(){
        console.log("button clicked");
        //event.preventDefault();
  
        const question = document.getElementById("userQuestion").value;
        const answer = document.getElementById("userAnswer").value;
        let hint = "";
        if (document.getElementById("Hint") && document.getElementById("userHint").value.trim() !== "") {
            hint = document.getElementById("Hint").value;
        }
    
        const response = await fetch("http://localhost:3000/add-question", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, answer, hint}),
        });
    
        if (response.ok) {
            alert("Question submitted!");
            loadQuestions();
        }
    
        async function loadQuestions() {
        const res = await fetch("http://localhost:3000/get-questions");
        const data = await res.json();
        console.log("Response from server:", data);
        }
    }