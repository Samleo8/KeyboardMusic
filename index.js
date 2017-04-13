//Keyboard Music Web App

var domReady = function (callback) {
    // Mozilla, Opera and WebKit
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", callback, false);
        // If Internet Explorer, the event model is used
    } else if (document.attachEvent) {
        document.attachEvent("onreadystatechange", function() {
            if (document.readyState === "complete" ) {
                callback();
            }
        });
        // A fallback to window.onload, that will always work
    } else {
        var oldOnload = window.onload;
        window.onload = function () {
            oldOnload && oldOnload();
            callback();
        }
    }
};

domReady(function(){
    pageInit();
});

var notes = [
    {
        "pianoKey":"C",
        "computerKeyCode":"A".charCodeAt(),
        "file":"audio/c.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"D",
        "computerKeyCode":"S".charCodeAt(),
        "file":"audio/d.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"E",
        "computerKeyCode":"D".charCodeAt(),
        "file":"audio/e.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"F",
        "computerKeyCode":"F".charCodeAt(),
        "file":"audio/f.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"G",
        "computerKeyCode":"G".charCodeAt(),
        "file":"audio/g.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"A",
        "computerKeyCode":"H".charCodeAt(),
        "file":"audio/a.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"B",
        "computerKeyCode":"J".charCodeAt(),
        "file":"audio/b.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"C1",
        "computerKeyCode":"K".charCodeAt(),
        "file":"audio/c1.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"D1",
        "computerKeyCode":"L".charCodeAt(),
        "file":"audio/d1.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"E1",
        "computerKey":";",
        "computerKeyCode":186,
        "file":"audio/e1.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"F1",
        "computerKey":"'",
        "computerKeyCode":222,
        "file":"audio/f1.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"G1",
        "computerKey":"Enter",
        "computerKeyCode":13,
        "file":"audio/g1.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"C#",
        "computerKeyCode":"W".charCodeAt(),
        "file":"audio/cs.mp3",
        "keyColour":"black"
    },
    {
        "pianoKey":"D#",
        "computerKeyCode":"E".charCodeAt(),
        "file":"audio/ds.mp3",
        "keyColour":"black"
    },
    {
        "keyColour":"blank"
    },
    {
        "pianoKey":"F#",
        "computerKeyCode":"T".charCodeAt(),
        "file":"audio/fs.mp3",
        "keyColour":"black"
    },
    {
        "pianoKey":"G#",
        "computerKeyCode":"Y".charCodeAt(),
        "file":"audio/gs.mp3",
        "keyColour":"black"
    }
];

var notes_pianoKey = {};

var audio = [];
    
var noteTiming = 500; //in ms

var keyboardDisabled = false;
var browserProperties = {};

function pageInit(){	
    //Ensure keyCodes are properly set
    browserProperties = findBrowserProperties();
    
	if(browserProperties["OSName"] == "Windows"){
        notes[10]["computerKeyCode"] = 192;
    }        
    
    //Load notes
    loadNotes();
    
    //Create keyboard dynamically
    createKeyboard();
}

function loadNotes(){
    var audioHolder = document.getElementById("audioHolder");
    
    for(var i=0;i<notes.length;i++){        
        if(notes[i]["keyColour"]=="blank") continue;
        
        noteAudio = new Audio(notes[i]["file"]);
        if(typeof noteAudio.loop == 'boolean') {
            noteAudio.loop = false;
        }
        
        audio.push({
            "audio":noteAudio,
            "audioPlaying":false
        });
        
        notes_pianoKey[notes[i]["pianoKey"]] = i;
    }    
} 

function createKeyboard(){
    var keyboardHolder = document.getElementById("keyboardHolder");
    var whiteKeyWidth = 55;
    var blackKeyWidth = 22;
    var helpWidth = 16;
    var out = '';
    
    for(var i=0;i<notes.length;i++){        
        if(notes[i]["keyColour"]=="blank") continue;
        
        keyboardKey = document.createElement("div");
        
        if(notes[i]["keyColour"]=="white"){
            //Create the keys dynamically
            keyboardKey.className = "whiteKey"
            keyboardKey.id = "key_"+i;
            keyboardKey.style.left = i*(whiteKeyWidth+1)+"px";
        }
        else if(notes[i]["keyColour"]=="black"){
            //Create the keys dynamically
            keyboardKey.className = "blackKey";
            keyboardKey.id = "key_"+i;
            keyboardKey.style.left = parseInt((i-11)*(whiteKeyWidth+1)-blackKeyWidth/2)+"px";
        }
        
        //Create the keyboard key helps dynamically
        keyboardKeyHelp = document.createElement("div");
        keyboardKeyHelp.className = "keyboardKeyHelp";

        keyboardKeyHelp.innerHTML = (notes[i]["computerKey"]!=null && notes[i]["computerKey"]!=undefined)?notes[i]["computerKey"]:String.fromCharCode(parseInt(notes[i]["computerKeyCode"]));

        //Create the piano key helps dynamically
        pianoKeyHelp = document.createElement("div");
        pianoKeyHelp.className = "pianoKeyHelp";

        pianoKeyHelp.innerHTML = notes[i]["pianoKey"];

        //Event Listener
        keyboardKey.addEventListener("mouseover",function(e){ pianoKeyPress(this); });
        keyboardKey.addEventListener("mouseout",function(e){ pianoKeyRelease(this); });
        
        keyboardKey.addEventListener("touchstart",function(e){ pianoKeyPress(this); });
        keyboardKey.addEventListener("touchend",function(e){ pianoKeyPress(this); });
        
        //Append divs to holder
        keyboardHolder.appendChild(keyboardKey);
        keyboardKey.appendChild(keyboardKeyHelp);
        keyboardKey.appendChild(pianoKeyHelp);
    }    
    
    //Add event listeners
    window.addEventListener("keydown",keyboard_press);
    window.addEventListener("keyup",keyboard_release);
}

/*-----------------MUSIC PLAYING---------------------*/
function playNote(i){
    if(audio[i]["playing"]==true) return;
    
    audio[i]["audio"].currentTime = 0;
    audio[i]["audio"].play();
    audio[i]["playing"] = true;
}

function stopNote(i){
    //audio[i]["audio"].currentTime = 0;
    //audio[i]["audio"].pause();
    
    audio[i]["playing"] = false;
}

function playMusic(mus_str){
    var str = (mus_str!=null && mus_str!=undefined)?mus_str:document.getElementById("music").value;
    var splitStr = document.getElementById("splitType");
    
    var notesArr = str.split(splitStr);
    
    for(var i=0;i<notesArr.length;i++){
        if()
    }
}

/*-----------------EVENT LISTENERS---------------------*/
function keyboard_press(e){
    for(var i=0;i<notes.length;i++){
        if(notes[i]["keyColour"] == "blank") continue;
        
        if(e.keyCode==notes[i]["computerKeyCode"]){
            var ele = document.getElementById("key_"+i);
            pianoKeyPress(ele);
            
            break;
        }
    }
}

function keyboard_release(e){
    for(var i=0;i<notes.length;i++){
        if(notes[i]["keyColour"] == "blank") continue;
        
        if(e.keyCode==notes[i]["computerKeyCode"]){
            var ele = document.getElementById("key_"+i);
            pianoKeyRelease(ele);
            
            break;
        }
    }
}

function pianoKeyPress(ele){
    ele.className += " active";
    
    playNote(ele.id.split("key_")[1]);
}

function pianoKeyRelease(ele){
    ele.className = ele.className.replaceAll(" active","");
    
    stopNote(ele.id.split("key_")[1]);
}

/*
function setMusic(musicz){
	note=0;
	splitType=document.getElementById("splitType").value;
	song = new Array();
	disableKeyboard(false);
	music = musicz.split(splitType);
	for(a=0;a<music.length;a++){
		music[a] = music[a].toUpperCase();
		if(splitType==""&&(music[a]=="C"||music[a]=="D"||music[a]=="E"||music[a]=="F")&&a!=music.length){
			if(music[a+1]=="1"){	
				music[a]=music[a]+"1";
				for(b=8;b<notes.length;b++){
					if(notes[b]==music[a]){
						song.push(keys[b]);
						break;
					}
				}
				a++; //skip the 1
			}
			else{
			for(b=0;b<notes.length;b++){
					if(notes[b]==music[a]){
						song.push(keys[b]);
						break;
					}
				}
			}
		}
		else{
			for(b=0;b<notes.length;b++){
				if(notes[b]==music[a]){
					song.push(keys[b]);
					break;
				}
			}
		}
	}
	timer = setInterval(playMusic,noteTiming);
}

function playMusic(){
	if(note!=0){
		keyBoardUp(song[note-1]);
	}
	keyBoardDown(song[note]);
	if(note==song.length){
		keyBoardUp(song[note]);
		clearInterval(timer);
	}
	note++;
}

function disableKeyboard(disable){
	keyboardDisabled = disable;
}

function cancelMusic(){
	song = [];
	clearInterval(timer);
	for(a=0;a<keys.length;a++){
		keyBoardUp(keys[a]);
	}
}
*/

/*------------BROWSER PROPERTIES--------------*/
function findBrowserProperties(){
    var _browserProperties = {};
    
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var fullVersion = ''+parseFloat(navigator.appVersion); 
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;

    /* BROWSER NAME */
    
	// In Opera, the true version is after "Opera" or after "Version"
	if((verOffset=nAgt.indexOf("Opera"))!=-1) {
        _browserProperties["browserName"] = "Opera";
        fullVersion = nAgt.substring(verOffset+6);
        if ((verOffset=nAgt.indexOf("Version"))!=-1) 
        fullVersion = nAgt.substring(verOffset+8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if((verOffset=nAgt.indexOf("MSIE"))!=-1) {
        _browserProperties["browserName"] = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset+5);
	}
	// In Chrome, the true version is after "Chrome" 
	else if((verOffset=nAgt.indexOf("Chrome"))!=-1) {
        _browserProperties["browserName"] = "Chrome";
        fullVersion = nAgt.substring(verOffset+7);
	}
	// In Safari, the true version is after "Safari" or after "Version" 
	else if((verOffset=nAgt.indexOf("Safari"))!=-1) {
        _browserProperties["browserName"] = "Safari";
	}
	// In Firefox, the true version is after "Firefox" 
	else if((verOffset=nAgt.indexOf("Firefox"))!=-1) {
        _browserProperties["browserName"] = "Firefox";
	}
	// In most other browsers, "name/version" is at the end of userAgent 
	else if((nameOffset=nAgt.lastIndexOf(' ')+1) < (verOffset=nAgt.lastIndexOf('/'))){
        _browserProperties["browserName"] = nAgt.substring(nameOffset,verOffset);
        if (_browserProperties["browserName"].toLowerCase()==_browserProperties["browserName"].toUpperCase()){
            _browserProperties["browserName"] = navigator.appName;
        }
	}

	if (navigator.appVersion.indexOf("Win")!=-1) _browserProperties["OSName"]="Windows";
	else if (navigator.appVersion.indexOf("Mac")!=-1) _browserProperties["OSName"]="MacOS";
	else if (navigator.appVersion.indexOf("X11")!=-1) _browserProperties["OSName"]="UNIX";
	else if (navigator.appVersion.indexOf("Linux")!=-1) _browserProperties["OSName"]="Linux";
    else _browserProperties["OSName"]="Unknown OS";
    
    return _browserProperties;
}

/*-----------------PROTOTYPES---------------------*/
String.prototype.replaceAll = function(find, replace){
    return this.replace(new RegExp(find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), 'g'), replace);
}

String.prototype.removeAll = function(find){
    return this.replaceAll(find,"");
}