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
        "computerKey":"A".charCodeAt(),
        "file":"audio/c.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"D",
        "computerKey":"S".charCodeAt(),
        "file":"audio/d.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"E",
        "computerKey":"D".charCodeAt(),
        "file":"audio/e.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"F",
        "computerKey":"F".charCodeAt(),
        "file":"audio/f.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"G",
        "computerKey":"G".charCodeAt(),
        "file":"audio/g.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"A",
        "computerKey":"H".charCodeAt(),
        "file":"audio/a.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"B",
        "computerKey":"J".charCodeAt(),
        "file":"audio/b.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"C1",
        "computerKey":"K".charCodeAt(),
        "file":"audio/c1.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"D1",
        "computerKey":"L".charCodeAt(),
        "file":"audio/d1.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"E1",
        "computerKey":186,
        "file":"audio/e1.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"F1",
        "computerKey":222,
        "file":"audio/f1.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"G1",
        "computerKey":13,
        "file":"audio/g1.mp3",
        "keyColour":"white"
    },
    {
        "pianoKey":"C#",
        "computerKey":"W".charCodeAt(),
        "file":"audio/cs.mp3",
        "keyColour":"black"
    },
    {
        "pianoKey":"D#",
        "computerKey":"E".charCodeAt(),
        "file":"audio/ds.mp3",
        "keyColour":"black"
    },
    {
        "keyColour":"blank"
    },
    {
        "pianoKey":"F#",
        "computerKey":"T".charCodeAt(),
        "file":"audio/fs.mp3",
        "keyColour":"black"
    },
    {
        "pianoKey":"G#",
        "computerKey":"Y".charCodeAt(),
        "file":"audio/gs.mp3",
        "keyColour":"black"
    }
];
    
var noteTiming = 500; //in ms

var keyboardDisabled = false;
var browserProperties = {};

function pageInit(){	
    //Ensure keyCodes are properly set
    browserProperties = findBrowserProperties();
    
	if(browserProperties["OSName"] == "Windows"){
        notes[10]["computerKey"] = 192;
    }
    
    //Create keyboard dynamically
    var keyboardHolder = document.getElementById("keyboardHolder");
    var whiteKeyWidth = 55;
    var blackKeyWidth = 22;
    var out = '';
    
    for(var i=0;i<notes.length;i++){
        keyboardKey = document.createElement("div");
        
        if(notes[i]["keyColour"]=="white"){
            keyboardKey.className = "whiteKey";
            keyboardKey.style.left = i*(whiteKeyWidth+1)+"px";
            
            keyboardKey.addEventListener("mouseover",pianoKeyPress);
            keyboardKey.addEventListener("mouseout",pianoKeyRelease);
            keyboardKey.addEventListener("keydown",function(e){ if(e.keyCode == notes[i]["keyboardKey"]) pianoKeyPress(e);});
            keyboardKey.addEventListener("keyup",function(e){ if(e.keyCode == notes[i]["keyboardKey"]) pianoKeyRelease(e);});
            
        }
        else if(notes[i]["keyColour"]=="black"){
            keyboardKey.className = "blackKey";
            keyboardKey.style.left = parseInt((i-11)*(whiteKeyWidth+1)-blackKeyWidth/2)+"px";
        }
        else{ //blank
            continue;
        }
        
        keyboardHolder.appendChild(keyboardKey);
    }    
}

function pianoKeyPress(e){
    console.log(this);
    console.log(e);
}

function pianoKeyRelease(e){
    
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