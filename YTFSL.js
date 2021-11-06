// ==UserScript==
// @name         YouTube Time Framed Selective Looping
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Loop a video within a certain time frame.
// @author       GSRHackZ
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// ==/UserScript==
let looping=false;

function YTFSL(){
    if(document.getElementsByClassName("style-scope ytd-video-primary-info-renderer")[0]!==undefined){
        let board = document.getElementsByClassName("style-scope ytd-video-primary-info-renderer")[0],
            box = document.createElement("div"),
            color = decideColor();
        box.innerHTML = `Start Timestamp :<input class="inp-gsr" min=0 type="number" step="0.01"/>Stop Timestamp :<input class="inp-gsr" min=0 type="number" step="0.01"/><button id="submit-gsr">Start</button>`;
        box.style = `margin:10px;height:fit-content;width:fit-content;border:1px solid ${color};border-radius:3px;height:20px;padding:8px;color:${color};font-size:13px;display:flex;flex-direction:row;align-items:center;justify-content:space-around;`;
        board.append(box);
        let inputs = document.getElementsByClassName("inp-gsr");
        let button = document.getElementById("submit-gsr");
        button.style=`width:100px;background:none;color:${color};padding:5px;cursor:pointer;border:none;outline:none;`;
        for(let i=0;i<inputs.length;i++){
            inputs[i].style=`width:100px;outline:none;border:1px solid ${color};border-radius:3px;margin:10px;padding:3px;padding-left:4px;`;
        }
        button.addEventListener("click",()=>{
            if(button.innerText=="Start"){
                let start = inputs[0].value, stop = inputs[1].value,
                    vid = document.getElementsByClassName("video-stream html5-main-video")[0],
                    max = vid.duration;
                if(start.trim().length>0&&stop.trim().length>0){
                    console.log(format(max),start,max)
                    if(format(start,true)[3]>Math.floor(max)||format(stop,true)[3]>Math.floor(max)){
                        alert(`You have entered an incorrect timestamp. The length of this video is ${format(max)[1]} minutes and ${format(max)[2]} seconds. \n[${format(max)[0]}]`);
                    }
                    else if(start==stop){
                        alert("Start & Stop timestamps can't be the same.")
                    }
                    else{
                        if(looping!==false){
                            clearInterval(looping);
                        }
                        loop(vid,format(start,true)[3],format(stop,true)[3]);
                        button.innerText = "Stop";
                    }
                }
            }
            else if(button.innerText=="Stop"){
                if(looping!==false){
                    clearInterval(looping);
                }
                button.innerText = "Start";
            }
        })
        return true;
    }
}
smartExec(YTFSL,100)


function loop(vid,start,stop){
    let skipped = false;
    looping = setInterval(()=>{
        if(!skipped){
            vid.currentTime=start;
            skipped=true;
        }
        if(Math.floor(vid.currentTime)>=stop){
            vid.currentTime=start;
            skipped=false;
        }
    },100)
}

function format(val,opp){
    let mins,secs,dur;
    if(!opp){
        mins = Math.floor(val/60);
        secs = Math.floor(val%60);
        dur = Math.floor(val*60)+secs;
    }
    else if(opp){
        mins = val.split(".")[0];
        secs = val.split(".")[1];
        dur = Number(mins)*60+Number(secs);
    }
    let result = [`${mins}:${secs}`,mins,secs,dur];
    return result;
}

function decideColor(){
    let color = "black"
    let darkMode = document.getElementsByTagName("html")[0].getAttribute("dark");
    if(darkMode){color = "white";}
    return color;
}

function smartExec(func,wait){
    let exec = setInterval(()=>{
        if(func()){
            clearInterval(exec)
        }
    },wait)}




