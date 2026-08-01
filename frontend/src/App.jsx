// =======================================
// AI VOICE LOCK - script.js
// =======================================

// Elements
/*=========================================
 AI VOICE LOCK
 Advanced Frontend Animation
=========================================*/

//========================
// Voice Wave Animation
//========================

const bars = document.querySelectorAll(".voice-bars span");

function animateVoiceBars(){

    bars.forEach(bar=>{

        const h = Math.floor(Math.random()*70)+20;

        bar.style.height = h + "px";

    });

}

setInterval(animateVoiceBars,180);


//========================
// AI Accuracy Counter
//========================

const accuracyElement = document.querySelectorAll(".status-item p")[1];

let accuracy = 99.20;

function updateAccuracy(){

    accuracy += Math.random()*0.03;

    if(accuracy>99.99){

        accuracy=99.90;

    }

    accuracyElement.innerHTML=accuracy.toFixed(2)+"%";

}

setInterval(updateAccuracy,1800);


//========================
// Floating Glow Effect
//========================

const blobs=document.querySelectorAll(".blob");

let angle=0;

function moveGlow(){

    angle+=0.003;

    blobs.forEach((blob,index)=>{

        const x=Math.sin(angle+index)*35;

        const y=Math.cos(angle+index)*25;

        blob.style.transform=`translate(${x}px,${y}px)`;

    });

    requestAnimationFrame(moveGlow);

}

moveGlow();


//========================
// Hero Card Hover
//========================

const card=document.querySelector(".glass-card");

card.addEventListener("mousemove",(e)=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;

const y=e.clientY-rect.top;

const rotateX=((y-rect.height/2)/22);

const rotateY=((rect.width/2-x)/22);

card.style.transform=
`perspective(1200px)
rotateX(${rotateX}deg)
rotateY(${rotateY}deg)`;

});

card.addEventListener("mouseleave",()=>{

card.style.transform=
"perspective(1200px) rotateX(0deg) rotateY(0deg)";

});


//========================
// AI Core Pulse
//========================

const shield=document.querySelector(".shield");

let glow=true;

setInterval(()=>{

if(glow){

shield.style.boxShadow="0 0 70px cyan";

}else{

shield.style.boxShadow="0 0 35px #00d9ff";

}

glow=!glow;

},900);


//========================
// Security Scan
//========================

const status=document.querySelector(".online");

const securityText=[

"ACTIVE",

"SCANNING",

"PROTECTED",

"VERIFIED"

];

let current=0;

setInterval(()=>{

status.innerHTML=securityText[current];

current++;

if(current>=securityText.length){

current=0;

}

},2200);


//========================
// Floating Cards
//========================

const cards=document.querySelectorAll(".floating-card");

cards.forEach(card=>{

card.addEventListener("mouseenter",()=>{

card.style.transform="scale(1.08)";

card.style.boxShadow="0 0 35px cyan";

});

card.addEventListener("mouseleave",()=>{

card.style.transform="scale(1)";

card.style.boxShadow="0 0 20px rgba(0,255,255,.2)";

});

});


//========================
// Start Button Animation
//========================

const startButton=document.querySelector(".primary-btn");

startButton.addEventListener("click",()=>{

startButton.innerHTML="Authenticating...";

startButton.disabled=true;

setTimeout(()=>{

startButton.innerHTML="Voice Verified ✓";

startButton.style.background=
"linear-gradient(90deg,#00ff88,#00d9ff)";

},2500);

});


//========================
// Random AI Detection
//========================

const detect=document.querySelector(".top-card strong");

const aiStatus=[

"Listening...",

"Voice Found",

"Analyzing...",

"Matching...",

"Authenticated"

];

setInterval(()=>{

const index=Math.floor(Math.random()*aiStatus.length);

detect.innerHTML=aiStatus[index];

},1700);


//========================
// Voice Match Percentage
//========================

const match=document.querySelector(".bottom-card strong");

setInterval(()=>{

const value=(99.70+Math.random()*0.29).toFixed(2);

match.innerHTML=value+"%";

},1400);


//========================
// Mouse Glow
//========================

document.addEventListener("mousemove",(e)=>{

document.body.style.background=

`radial-gradient(circle at ${e.clientX}px ${e.clientY}px,
rgba(0,229,255,.08),
#050B16 45%)`;

});


//========================
// Welcome Message
//========================

window.addEventListener("load",()=>{

console.log("AI Voice Lock Initialized");

console.log("Security Modules Loaded");

console.log("Neural Voice Engine Active");

});
const voiceBtn = document.getElementById("voiceBtn");
const micStatus = document.getElementById("micStatus");
const permission = document.getElementById("permission");
const match = document.getElementById("match");
const confidenceBar = document.getElementById("confidenceBar");
const confidenceText = document.getElementById("confidenceText");
const themeBtn = document.getElementById("themeBtn");

// =======================================
// Theme Toggle
// =======================================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
        themeBtn.textContent = "☀️";
    } else {
        themeBtn.textContent = "🌙";
    }

});
const hexagon = document.querySelector(".hexagon");

hexagon.addEventListener("mouseenter",()=>{

    hexagon.style.transform="scale(1.08) rotate(5deg)";

    hexagon.style.transition=".4s";

});

hexagon.addEventListener("mouseleave",()=>{

    hexagon.style.transform="scale(1) rotate(0deg)";

});
const links = document.querySelectorAll(".navbar a");

links.forEach(link=>{

    link.addEventListener("click",function(){

        links.forEach(item=>item.classList.remove("active"));

        this.classList.add("active");

    });

});

// =======================================
// Check Browser Microphone Permission
// =======================================

async function checkPermission() {

    if (!navigator.mediaDevices) {

        permission.textContent = "Unsupported";

        return;
    }

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        permission.textContent = "Granted";
        micStatus.textContent = "Microphone Ready";

        stream.getTracks().forEach(track => track.stop());

    } catch (error) {

        permission.textContent = "Denied";
        micStatus.textContent = "Microphone Blocked";

    }
}

checkPermission();

// =======================================
// Animate Progress Bar
// =======================================

function animateConfidence(value) {

    confidenceBar.style.width = value + "%";

    confidenceText.textContent = value + "%";
}

// =======================================
// Animate Match Percentage
// =======================================

function animateMatch(target) {

    let current = 0;

    const interval = setInterval(() => {

        current++;

        match.textContent = current + "%";

        if (current >= target) {
            clearInterval(interval);
        }

    }, 25);
}

// =======================================
// Voice Authentication Simulation
// =======================================

voiceBtn.addEventListener("click", async () => {

    voiceBtn.disabled = true;

    voiceBtn.textContent = "Listening...";

    micStatus.textContent = "Capturing Voice";

    animateConfidence(0);
    match.textContent = "0%";

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        setTimeout(() => {

            const confidence =
                Math.floor(
                    Math.random() * 20
                ) + 80;

            const matchScore =
                Math.floor(
                    Math.random() * 15
                ) + 85;

            animateConfidence(confidence);

            animateMatch(matchScore);

            micStatus.textContent =
                "Voice Verified";

            voiceBtn.textContent =
                "Authentication Successful";

            stream.getTracks().forEach(track => track.stop());

        }, 3000);

    } catch (error) {

        micStatus.textContent =
            "Microphone Access Required";

        permission.textContent =
            "Denied";

        voiceBtn.textContent =
            "Try Again";

    }

    setTimeout(() => {

        voiceBtn.disabled = false;

        if (
            voiceBtn.textContent !==
            "Authentication Successful"
        ) {
            voiceBtn.textContent =
                "Start Voice Authentication";
        }

    }, 3500);

});

// =======================================
// Welcome Animation
// =======================================

window.addEventListener("load", () => {

    setTimeout(() => {

        animateConfidence(35);

    }, 500);

});
// ===============================================
// AI VOICE LOCK
// enroll.js
// ===============================================

// Buttons
const startBtn = document.getElementById("startEnrollment");
const saveBtn = document.getElementById("saveVoice");

// Progress
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

// Cards
const sampleCount = document.getElementById("sampleCount");
const micCalibration = document.getElementById("micCalibration");
const noiseLevel = document.getElementById("noiseLevel");
const emotion = document.getElementById("emotion");
const health = document.getElementById("health");
const speed = document.getElementById("speed");

// Voiceprint Bars
const voiceBars = document.querySelectorAll(".voice-grid span");

// ===============================================
// Variables
// ===============================================

let samples = 0;
let progress = 0;

// ===============================================
// Random Generators
// ===============================================

const emotions = [
    "Neutral",
    "Happy",
    "Confident",
    "Calm",
    "Focused"
];

const noiseLevels = [
    "Excellent",
    "Good",
    "Moderate"
];

const healthLevels = [
    "Healthy",
    "Very Healthy",
    "Stable"
];

// ===============================================
// Voiceprint Animation
// ===============================================

function animateVoiceprint() {

    voiceBars.forEach(bar => {

        const randomHeight =
            Math.floor(Math.random() * 140) + 40;

        bar.style.height = randomHeight + "px";

    });

}

// ===============================================
// Enrollment
// ===============================================

startBtn.addEventListener("click", async () => {

    startBtn.disabled = true;

    startBtn.textContent =
        "Collecting Samples...";

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        micCalibration.textContent =
            "Calibrating...";

        setTimeout(() => {

            micCalibration.textContent =
                "Calibration Complete";

        }, 1200);

        const collect = setInterval(() => {

            samples++;

            progress += 20;

            sampleCount.textContent =
                samples + " / 5";

            progressFill.style.width =
                progress + "%";

            progressText.textContent =
                progress + "% Completed";

            animateVoiceprint();

            noiseLevel.textContent =
                noiseLevels[
                    Math.floor(Math.random() *
                    noiseLevels.length)
                ];

            emotion.textContent =
                emotions[
                    Math.floor(Math.random() *
                    emotions.length)
                ];

            health.textContent =
                healthLevels[
                    Math.floor(Math.random() *
                    healthLevels.length)
                ];

            speed.textContent =
                (110 +
                Math.floor(Math.random()*45))
                + " WPM";

            if(samples >= 5){

                clearInterval(collect);

                stream.getTracks()
                .forEach(track => track.stop());

                startBtn.textContent =
                    "Enrollment Completed";

                saveBtn.disabled = false;

            }

        },1800);

    }

    catch(error){

        alert(
            "Microphone permission is required for enrollment."
        );

        startBtn.disabled = false;

        startBtn.textContent =
            "Start Enrollment";

    }

});

// ===============================================
// Save Voiceprint
// ===============================================

saveBtn.disabled = true;

saveBtn.addEventListener("click",()=>{

    saveBtn.textContent =
        "Saving...";

    setTimeout(()=>{

        saveBtn.textContent =
            "Voiceprint Saved Successfully";

        saveBtn.style.background =
            "linear-gradient(135deg,#00c853,#00e676)";

    },1800);

});

// ===============================================
// Continuous Voice Animation
// ===============================================

setInterval(()=>{

    animateVoiceprint();

},700);

// ===============================================
// Initial Values
// ===============================================

progressFill.style.width="0%";

progressText.textContent="0% Completed";

sampleCount.textContent="0 / 5";

micCalibration.textContent="Waiting...";

noiseLevel.textContent="Not Measured";

emotion.textContent="Unknown";

health.textContent="Pending";

speed.textContent="0 WPM";
// ==========================================
// AI VOICE LOCK
// dashboard.js
// ==========================================

// ==============================
// Elements
// ==============================

const securityScore = document.getElementById("securityScore");
const riskScore = document.getElementById("riskScore");
const deviceStatus = document.getElementById("deviceStatus");
const systemHealth = document.getElementById("systemHealth");

const browserName = document.getElementById("browserName");
const operatingSystem = document.getElementById("operatingSystem");
const platformName = document.getElementById("platformName");
const language = document.getElementById("language");

const successLogin = document.getElementById("successLogin");
const failedLogin = document.getElementById("failedLogin");

// ==============================
// Browser Detection
// ==============================

function detectBrowser(){

    const userAgent = navigator.userAgent;

    if(userAgent.includes("Chrome") && !userAgent.includes("Edg")){

        browserName.textContent = "Google Chrome";

    }

    else if(userAgent.includes("Firefox")){

        browserName.textContent = "Mozilla Firefox";

    }

    else if(userAgent.includes("Safari") && !userAgent.includes("Chrome")){

        browserName.textContent = "Safari";

    }

    else if(userAgent.includes("Edg")){

        browserName.textContent = "Microsoft Edge";

    }

    else{

        browserName.textContent = "Unknown Browser";

    }

}

// ==============================
// Operating System
// ==============================

function detectOS(){

    const platform = navigator.platform;

    if(platform.includes("Win")){

        operatingSystem.textContent = "Windows";

    }

    else if(platform.includes("Mac")){

        operatingSystem.textContent = "macOS";

    }

    else if(platform.includes("Linux")){

        operatingSystem.textContent = "Linux";

    }

    else{

        operatingSystem.textContent = "Unknown";

    }

}

// ==============================
// Platform Information
// ==============================

platformName.textContent = navigator.platform;
language.textContent = navigator.language;

// ==============================
// Animated Security Score
// ==============================

function animateSecurityScore(){

    let value = 0;

    const timer = setInterval(()=>{

        value++;

        securityScore.textContent = value + "%";

        if(value >= 98){

            clearInterval(timer);

        }

    },25);

}

// ==============================
// Login Counter Animation
// ==============================

function animateLoginCounter(){

    let success = 0;
    let failed = 0;

    const timer = setInterval(()=>{

        if(success < 152){

            success += 4;

            successLogin.textContent = success;

        }

        if(failed < 3){

            failed++;

            failedLogin.textContent =
                failed.toString().padStart(2,"0");

        }

        if(success >= 152){

            clearInterval(timer);

        }

    },40);

}

// ==============================
// AI Risk Monitor
// ==============================

const riskLevels = [

    "Low",

    "Guarded",

    "Minimal"

];

setInterval(()=>{

    riskScore.textContent =

    riskLevels[
        Math.floor(
            Math.random()*riskLevels.length
        )
    ];

},7000);

// ==============================
// System Health
// ==============================

const healthLevels=[

    "Excellent",

    "Healthy",

    "Optimal"

];

setInterval(()=>{

    systemHealth.textContent=

    healthLevels[
        Math.floor(
            Math.random()*healthLevels.length
        )
    ];

},6000);

// ==============================
// Trusted Device Status
// ==============================

const deviceStates=[

    "Verified",

    "Trusted",

    "Protected"

];

setInterval(()=>{

    deviceStatus.textContent=

    deviceStates[
        Math.floor(
            Math.random()*deviceStates.length
        )
    ];

},5000);

// ==============================
// Online / Offline Monitor
// ==============================

function updateConnection(){

    if(navigator.onLine){

        console.log("Network Connected");

    }

    else{

        console.log("Offline Mode");

    }

}

window.addEventListener(
"online",
updateConnection
);

window.addEventListener(
"offline",
updateConnection
);

// ==============================
// Dashboard Refresh Simulation
// ==============================

setInterval(()=>{

    console.log(

        "Dashboard synchronized."

    );

},10000);

// ==============================
// Initialization
// ==============================

detectBrowser();

detectOS();

animateSecurityScore();

animateLoginCounter();

updateConnection();
// ==============================================
// AI VOICE LOCK
// security.js
// ==============================================

// ===============================
// Elements
// ===============================

const threatLevel = document.getElementById("threatLevel");
const firewallStatus = document.getElementById("firewallStatus");
const encryptionStatus = document.getElementById("encryptionStatus");
const tamperStatus = document.getElementById("tamperStatus");

const deepfake = document.getElementById("deepfake");
const replay = document.getElementById("replay");
const intrusion = document.getElementById("intrusion");
const intel = document.getElementById("intel");

const eventBox = document.querySelector(".event-box");

// ===============================
// Data
// ===============================

const threatLevels = [
    "LOW",
    "LOW",
    "LOW",
    "MEDIUM"
];

const firewallStates = [
    "Active",
    "Protected",
    "Operational"
];

const encryptionStates = [
    "AES-256 Enabled",
    "Encryption Verified",
    "Secure Channel"
];

const tamperStates = [
    "Not Detected",
    "No Changes",
    "Integrity Verified"
];

const deepfakeStates = [
    "No Deepfake Detected",
    "Voice Authentic",
    "AI Scan Passed"
];

const replayStates = [
    "No Replay Attack",
    "Clean Audio Stream",
    "Replay Safe"
];

const intrusionStates = [
    "Secure",
    "No Intrusion",
    "Protected"
];

const intelStates = [
    "Threat Feed Updated",
    "No New Threats",
    "Monitoring Network"
];

const liveEvents = [

    "Firewall rule verification completed.",

    "Voice encryption key rotated successfully.",

    "AI anomaly scan completed.",

    "Threat intelligence synchronized.",

    "Voice integrity verification passed.",

    "Security policy validation successful.",

    "Secure communication channel verified.",

    "Authentication logs synchronized."

];

// ===============================
// Helper Function
// ===============================

function randomItem(array){

    return array[
        Math.floor(
            Math.random()*array.length
        )
    ];

}

// ===============================
// Security Status Updates
// ===============================

function updateSecurity(){

    threatLevel.textContent =
        randomItem(threatLevels);

    firewallStatus.textContent =
        randomItem(firewallStates);

    encryptionStatus.textContent =
        randomItem(encryptionStates);

    tamperStatus.textContent =
        randomItem(tamperStates);

}

setInterval(updateSecurity,5000);

// ===============================
// AI Detection Updates
// ===============================

function updateDetection(){

    deepfake.textContent =
        randomItem(deepfakeStates);

    replay.textContent =
        randomItem(replayStates);

    intrusion.textContent =
        randomItem(intrusionStates);

    intel.textContent =
        randomItem(intelStates);

}

setInterval(updateDetection,3500);

// ===============================
// Live Security Events
// ===============================
const eventBox = document.querySelector(".event-box");

const logs = [

"Firewall verification completed.",

"Voice integrity verified.",

"Threat intelligence synchronized.",

"Encryption keys rotated.",

"Deepfake scan completed.",

"Replay attack check completed.",

"System health verified.",

"Voice authentication successful."

];

function addEvent(){

    const event=document.createElement("div");

    event.className="event";

    const dot=document.createElement("span");

    dot.className="status";

    dot.classList.add(Math.random()>0.8 ? "warning":"safe");

    const text=document.createElement("p");

    text.textContent=new Date().toLocaleTimeString()+" - "+logs[Math.floor(Math.random()*logs.length)];

    event.appendChild(dot);

    event.appendChild(text);

    eventBox.prepend(event);

    if(eventBox.children.length>8){

        eventBox.removeChild(eventBox.lastChild);

    }

}

setInterval(addEvent,3000);

addEvent();

function createEvent(message,color){

    const event = document.createElement("div");

    event.className = "event";

    const dot = document.createElement("span");

    dot.className = "status";

    if(color==="warning"){

        dot.classList.add("warning");

    }

    else{

        dot.classList.add("safe");

    }

    const text = document.createElement("p");

    const now = new Date();

    const time = now.toLocaleTimeString();

    text.textContent =
        "[" + time + "] " + message;

    event.appendChild(dot);

    event.appendChild(text);

    eventBox.prepend(event);

    if(eventBox.children.length>8){

        eventBox.removeChild(
            eventBox.lastElementChild
        );

    }

}

setInterval(()=>{

    createEvent(

        randomItem(liveEvents),

        Math.random()>0.85 ? "warning":"safe"

    );

},4000);

// ===============================
// Compliance Monitor
// ===============================

function complianceCheck(){

    console.log(
        "Compliance verification completed."
    );

}

setInterval(complianceCheck,12000);

// ===============================
// Simulated Threat Counter
// ===============================

let scanCount = 0;

setInterval(()=>{

    scanCount++;

    console.log(
        "AI Security Scan #" + scanCount
    );

},6000);

// ===============================
// Threat Color Indicator
// ===============================

function updateThreatColor(){

    switch(threatLevel.textContent){

        case "LOW":

            threatLevel.style.color = "#00e676";

            break;

        case "MEDIUM":

            threatLevel.style.color = "#ffb300";

            break;

        case "HIGH":

            threatLevel.style.color = "#ff5252";

            break;

    }

}

setInterval(updateThreatColor,1000);

// ===============================
// Initialization
// ===============================

updateSecurity();

updateDetection();

updateThreatColor();

createEvent(
    "Security Operations Center initialized.",
    "safe"
);

createEvent(
    "AI Threat Detection Engine started.",
    "safe"
);