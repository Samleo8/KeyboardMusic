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

var song;
var audio = [];

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
    
    song = new Song();
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
        keyboardKey.addEventListener("mousedown",function(e){
            if(!keyboardDisabled) pianoKeyPress(this);
        });
        keyboardKey.addEventListener("mouseup",function(e){
            if(!keyboardDisabled) pianoKeyRelease(this);
        });
        
        keyboardKey.addEventListener("touchstart",function(e){
            if(!keyboardDisabled) pianoKeyPress(this);
        });
        keyboardKey.addEventListener("touchend",function(e){
            if(!keyboardDisabled) pianoKeyRelease(this);
        });
        
        //Append divs to holder
        keyboardHolder.appendChild(keyboardKey);
        keyboardKey.appendChild(keyboardKeyHelp);
        keyboardKey.appendChild(pianoKeyHelp);
    }    
    
    //Add event listeners
    window.addEventListener("keydown",keyboard_press);
    window.addEventListener("keyup",keyboard_release);
}

function setKeyboardState(state){
    keyboardDisabled = state;
}

/*-----------------MUSIC PLAYING---------------------*/
var Song = function(_args){
    var args = (_args==null)?{}:_args;
    
    if(args["index"] == null) args["index"] = 0;
    if(args["notes"] == null) args["notes"] = [];
    if(args["noteTiming"] == null) args["noteTiming"] = [];
    
    this.index = args["index"];
    this.notes = args["notes"];
    this.noteTiming = args["noteTiming"];
    
    this.songTimer;
    
    this.load = function(mus_str){
        var str = (mus_str!=null && mus_str!=undefined)?mus_str:document.getElementById("music").value;
        
        var splitStr = document.getElementById("splitType").value;

        console.log(this);
        var m = splitStr.match(new RegExp("[a-g1]","gi"));
        if(m!=null && m.length>0){
            error("Split method cannot correspond with that of the piano keys");
            return;
        }
        
        this.notes = str.split(splitStr);
    
        if(splitStr==""){
            //Take care of finding the special notes like "C#" and "D1"
            var specialNotesArr = str.allIndexOf("[c-g](1|#)","gi");
            
            for(var i=0;i<specialNotesArr.length;i++){
                var ind = specialNotesArr[i];
                
                this.notes[ind] = this.notes[ind]+""+this.notes[ind+1];
            }
            
            for(var i=specialNotesArr.length-1;i>=0;i--){
                this.notes.splice(specialNotesArr[i]+1,1);
            }
        }

        this.index = 0;
        
        return this.notes;
    };
    
    this.play = function(){
        
        
        if(this.notes.length<this.index) this.index++;
        else{ //stop the play
            
        }
    }
};

function playNote(i,id_method){
    if(id_method==null) id_method = "index";
    
    if(id_method=="index"){}
    else if(id_method=="note" || id_method=="letter" || id_method.split("-").join("").split("_").join("").toLowerCase()=="pianokey"){
        i = notes_pianoKey[i.toUpperCase()];
    }
    else error("Cannot identify note");
    
    if(audio[i]["playing"]==true) return;
    
    audio[i]["audio"].currentTime = 0;
    audio[i]["audio"].play();
    audio[i]["playing"] = true;
}

function stopNote(i,id_method){
    if(id_method==null) id_method = "index";
    
    if(id_method=="index"){}
    else if(id_method=="note" || id_method=="letter" || id_method.split("-").join("").split("_").join("").toLowerCase()=="pianokey"){
        i = notes_pianoKey[i.toUpperCase()];
    }
    else error("Cannot identify note");
    
    audio[i]["playing"] = false;
}

/*-----------------EVENT LISTENERS---------------------*/
function keyboard_press(e){
    if(keyboardDisabled) return;
    
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
    if(keyboardDisabled) return;
    
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

/*------------MESSAGES AND ERRORS--------------*/
function message(msg){
    console.log(msg);
    
}

function error(msg){
    console.error(msg);
    
}

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

String.prototype.allIndexOf = function(find,regexProp){
    var regexp = (typeof find == "object")?find:(new RegExp(find.toString(),(regexProp==null)?"gi":regexProp));
    
    var match, matches = [];

    while ((match = regexp.exec(this)) != null) {
        matches.push(match.index);
    }
    
    return matches;
}