function settingDescribe(passage){
    let paragraph = document.getElementById("description");
    switch(passage){
        case "teamNums":
            paragraph.innerHTML = "Choose how many players or teams will be playing";
            break;
        case "scale":
            paragraph.innerHTML = "This determines how much the points will be scaled by. EX: x * 100 points will be added";
            break;
        case "punish":
            paragraph.innerHTML = "Points are deducted from a score if an answer is incorrect";
            break;
        case "timer":
            paragraph.innerHTML = "Adjust how long the timer should tick";
            break;
        case "LLSet1":
            paragraph.innerHTML = "Free Pass: Skip the question and choose another <br> Partnership: Get help from another team and split the points <br> Izanagi: Get another question of the same box";
            break;
        default:
            break;
    }
}