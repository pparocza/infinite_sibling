
//--------------------------------------------------------------

// PARTS

//--------------------------------------------------------------

//--------------------------------------------------------------
// PART TEMPLATE
//--------------------------------------------------------------

var partInstArray = [];
var partGain;

function loadPart(){

}

function initInst(gainVal){

	var gainVal = gainVal;

	var output = new MyGain(gainVal);

	output.connect(partGain);

}

function playInst(idx, startTime){

	var idx = idx;
	var startTime = startTime;

	partInstArray[idx].startAtTime(startTime);

}

//--------------------------------------------------------------
// LOAD PARTS
//--------------------------------------------------------------

function loadParts(){

}

//--------------------------------------------------------------
// MIXER
//--------------------------------------------------------------

function initMixer(){


}

//--------------------------------------------------------------

// SECTIONS

//--------------------------------------------------------------

function section(startTime, now){

  var sectionStart = startTime+now;

  var sTV0 = sectionStart+0;

  playInst(idx, sTV0);

}

//--------------------------------------------------------------

// INSTRUMENTS

//--------------------------------------------------------------

function InstrumentConstructorTemplate(){

	this.output = audioCtx.createGain();

}

InstrumentConstructorTemplate.prototype = {

	output: this.output,

	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	},

}

//--------------------------------------------------------------
