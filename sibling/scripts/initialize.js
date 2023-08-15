var audioCtx;
var offlineAudioCtx;
var pieceLength = 100;

function init(){

	var AudioContext = window.AudioContext || window.webkitAudioContext;
	audioCtx = new AudioContext();
	audioCtx.latencyHint = "playback";
	onlineButton.disabled = true;

	// initBuffers();
	initInstrumentsAndFX();
	initParts();
	initSections();
	initScript();

};

function initOffline(){

	var AudioContext = window.AudioContext || window.webkitAudioContext;
	onlineCtx = new AudioContext();
	audioCtx = new OfflineAudioContext(2, onlineCtx.sampleRate*pieceLength, onlineCtx.sampleRate);
	audioCtx.latencyHint = "playback";
	onlineButton.disabled = true;

	// initBuffers();
	initInstrumentsAndFX();
	initParts();
	initSections();
	initScript();

};

// INITIALIZE BUFFERS

var includeBufferLoader;
var includeLoadBuffers;

function initBuffers(){

	includeBufferLoader = document.createElement('script');
	includeBufferLoader.src = "scripts/buffer_loader.js"
	document.head.appendChild(includeBufferLoader);

	includeLoadBuffers = document.createElement('script');
	includeLoadBuffers.src = "scripts/load_buffers.js"
	document.head.appendChild(includeLoadBuffers);

}

// INITIALIZE INSTRUMENTS AND EFFECTS

var includeInstrumentsAndFX;

function initInstrumentsAndFX(){

	includeInstrumentsAndFX = document.createElement('script');
	includeInstrumentsAndFX.src = "scripts/instruments_and_fx.js"
	document.head.appendChild(includeInstrumentsAndFX);

	includeInstrumentsAndFX_L = document.createElement('script');
	includeInstrumentsAndFX_L.src = "scripts/instruments_and_fx_library.js"
	document.head.appendChild(includeInstrumentsAndFX_L);

}

// INITIALIZE PARTS

var includeParts;

function initParts(){

	includeParts = document.createElement('script');
	includeParts.src = "scripts/parts.js"
	document.head.appendChild(includeParts);

}

// INITIALIZE SECTIONS

var includeSections;

function initSections(){

	includeSections = document.createElement('script');
	includeSections.src = "scripts/sections.js"
	document.head.appendChild(includeSections);

}

// INITIALIZE SCRIPT

var includeScript;

function initScript(){

	includeScript = document.createElement('script');
	includeScript.src = "script.js"
	document.head.appendChild(includeScript);

}
