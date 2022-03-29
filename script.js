let video = document.getElementById("video");
let model;
let canvas = document.getElementById("canvas");
let heading = document.getElementById("head");
console.log(heading);
let ctx = canvas.getContext("2d");

let number_of_warnings = 0;
var audio = new Audio('alert.wav');

// for warning purpose
function sleep(miliseconds) {
    var currentTime = new Date().getTime();
    audio.play();
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
}

//camera spin up function
const CameraSpin = () => {
    console.log("camera started running ");
    navigator.mediaDevices.getUserMedia({
        video:{width: 600 , height: 400},
        audio : false,
    }).then(stream=>{
        video.srcObject = stream;
    });
};
//this function is respinsible for handling tensorflowJs
const detectFaces = async () => {
    const prediction = await model.estimateFaces(video,false)
    
    console.log(prediction);
    let number_of_people= prediction.length;
    console.log("there are "+number_of_people+" number of people ") 
    if(number_of_people>1)
    {
        console.log("caught cheating");
        number_of_warnings=number_of_warnings+1;
        if(number_of_warnings==1)
        heading.innerHTML="Theres someone else around Caution please !";
        if(number_of_warnings==2)
        heading.innerHTML="Second time 😃";
        if(number_of_warnings==3)
        heading.innerHTML="3rd time noticed unfair means";
        if(number_of_warnings==4)
        heading.innerHTML="Last Warning ! 😡";
        sleep(2000);
        if(number_of_warnings==5)
        {
            heading.innerHTML="##--Caught Cheating Procedure Stopped--##";
            
        }
        
    }
    // console.log("this is the actual prediction of test data")
    ctx.drawImage(video,0,0,600,400);
    prediction.forEach(element => {
        ctx.beginPath();
        ctx.lineWidth="4";
        ctx.strokeStyle = "blue";
        ctx.rect(
            element.topLeft[0],
            element.topLeft[1],
            element.bottomRight[0]-element.topLeft[0],
            element.bottomRight[1]-element.topLeft[1]
        );
        ctx.stroke();
        ctx.fillStyle = "red";
        element.landmarks.forEach((landmark)=> {
            ctx.fillRect(landmark[0],landmark[1],5,5);
        })
    });
}

//this function spins up the fron camera 
CameraSpin();
video.addEventListener("loadeddata", async() => {

    model =await blazeface.load();
    setInterval(detectFaces,200);
    
    detectFaces();
})