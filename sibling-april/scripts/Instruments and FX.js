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

function Instrument(){

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();
	this.startArray = [];

}

Instrument.prototype = {

	input: this.input,
	output: this.output,
	startArray: this.startArray,

	instrumentMethod: function(){
		this.startArray = [];
	},

	lineShape: function(rate, sequenceLength){

		this.rate = rate;
		this.sequenceLength = sequenceLength;

		this.vArray = new Sequence();
		this.tArray = new Sequence();
		this.eArray = new Sequence();

		// presets
		this.vArray.loop(this.sequenceLength, [1, 0]);
		this.tArray.random(this.sequenceLength, [0.1, 0.05, 0.025, 0.2]);
		this.eArray.random(this.sequenceLength, [2, 4, 3, 0.5, 0.25, 0.125]);

		this.lArray = arrayLace(this.vArray.sequence, this.tArray.sequence);

		this.line = new BreakPoint(this.lArray, this.eArray.sequence);
		this.line.loop = true;
		this.line.playbackRate = this.rate;

		this.w = new MyWaveShaper();
		this.w.makeFm(201, 4000, 1); // 20, 101, 1
		this.wG = new MyGain(0.4);

		this.f1 = new MyBiquad("highpass", 80, 0);
		this.f2 = new MyBiquad("lowshelf", 300, 0);
		this.f2.biquad.gain.value = -5;

		this.line.connect(this.wG);
		this.wG.connect(this.w);
		this.w.connect(this.f1);
		this.f1.connect(this.f2);
		this.f2.connect(this.output);

		this.startArray = [this.line];

	},

	filterTick: function(rate, type, freq, Q){

		this.rate = rate;
		this.type = type;
		this.freq = freq;
		this.Q = Q;

		this.o = new LFO(0, 1, rate);
		this.o.buffer.makeSawtooth(1);
		this.oF = new MyBiquad(this.type, this.freq, this.Q);

		this.o.connect(this.oF);
		this.oF.connect(this.output);

		this.startArray = [this.o];

	},

	toneRamp: function(fund, rate, oAmF1, oAmF2, oAmD1, oAmD2, panVal){

		this.fund = fund;
		this.rate = rate;
		this.oAmF1 = oAmF1;
		this.oAmF2 = oAmF2;
		this.oAmD1 = oAmD1;
		this.oAmD2 = oAmD2;
		this.panVal = panVal;

		this.s = new MyOsc("sine", this.fund);

		this.l = new LFO(0, 1, this.rate);
		this.l.buffer.makeInverseSawtooth(4);
		this.lF = new MyBiquad("lowpass", 20, 0);
		this.aG = new MyGain(0);

		this.oAm = new OffsetSquareAM2(this.oAmF1, this.oAmF2, this.oAmD1, this.oAmD2);
		this.oAm.smoothingFilter.biquad.frequency.value = 20;

		this.w = new MyWaveShaper();
		this.w.makeAm(20, 11, 1);
		this.wG = new MyGain(0.01);

		this.w2 = new MyWaveShaper();
		this.w2.makeFm(randomFloat(5, 8.1), randomFloat(0.1, 0.31), 1);
		this.wG2 = new MyGain(0.03);

		this.f = new MyBiquad("highpass", 80, 1);

		this.pan = new MyPanner2(this.panVal);

		this.l.connect(this.lF);

		this.s.connect(this.aG); this.lF.connect(this.aG.gain.gain);
		this.aG.connect(this.oAm);
		this.oAm.connect(this.wG);
		this.wG.connect(this.w);
		this.w.connect(this.wG2);
		this.wG2.connect(this.w2);
		this.w2.connect(this.f);
		this.f.connect(this.pan);
		this.pan.connect(this.output);

		this.startArray = [this.s, this.oAm, this.l];

	},

	noiseSynth: function(fund, Q, eArray){

		this.fund = fund;
		this.Q = Q;
		this.eArray = eArray;

		this.s = new NoiseTone(fund, Q);
		this.e = new Envelope(eArray);
		this.eG = new MyGain(0);

		this.s.connect(this.eG); this.e.connect(this.eG.gain.gain);
		this.eG.connect(this.output);

		this.startArray = [this.s];
		this.playArray = [this.e];

	},

	start: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].start();
		}
	},


	stop: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stop();
		}
	},

	play: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.playArray[i].start();
		}
	},

	playAtTime: function(time){

		this.time = time;

		for(var i=0; i<this.startArray.length; i++){
			this.playArray[i].startAtTime(this.time);
		}

	},

	startAtTime: function(time){

		this.time = time;

		for(var i=0; i<this.startArray.length; i++){
				this.startArray[i].startAtTime(this.time);
		}

	},

	stopAtTime: function(time){

		this.time = time;

		for(var i=0; i<this.startArray.length; i++){
				this.startArray[i].stopAtTime(this.time);
		}

	},

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

function Effect(){

	this.input = audioCtx.createGain();
	this.filterFade = new FilterFade(0);
	this.output = audioCtx.createGain();
	this.startArray = [];

	this.input.connect(this.filterFade.input);

}

Effect.prototype = {

	input: this.input,
	output: this.output,
	filterFade: this.filterFade,
	startArray: this.startArray,

	effectMethod: function(){
		this.startArray = [];
	},

	thru: function(){

		this.filterFade.connect(this.output);

	},

	thru2: function(){

		this.filterFade.connect(this.output);
		this.output.gain.value = 0;

	},

	filterPan: function(){

		this.pan = new MyPanner2(randomFloat(-1, 1));

		this.filterFade.connect(this.pan);
		this.pan.connect(this.output);

	},

	echo: function(){

		this.dly = new MyStereoDelay(randomFloat(0.35, 0.6), randomFloat(0.35, 0.6), randomFloat(0, 0.2), 1);

		this.filterFade.connect(this.dly);
		this.dly.connect(this.output);

	},

	delayLine2: function(rate, sequenceLength){

		this.rate = rate;
		this.sequenceLength = sequenceLength;

		this.vArray = new Sequence();
		this.tArray = new Sequence();
		this.eArray = new Sequence();

		this.vArray.loop(this.sequenceLength, [1, 0]);
		this.tArray.loop(this.sequenceLength, [0.1, 0.05, 0.025, 0.2]);
		this.eArray.loop(this.sequenceLength, [2, 4, 3, 0.5, 0.25, 0.125]);

		this.lArray = arrayLace(this.vArray.sequence, this.tArray.sequence);

		this.line = new BreakPoint(this.lArray, this.eArray.sequence);
		this.line.loop = true;
		this.line.playbackRate = this.rate;

		this.aG = new MyGain(0);
		this.dly = new MyStereoDelay(0.1, 0.01, 0.1, 1);
		this.f = new MyBiquad("highpass", 3000, 0);

		this.w = new MyWaveShaper();
		this.w.makeFm(120, 12, 1);
		this.wG = new MyGain(0.05);

		this.g1 = new MyGain(0.1);
		this.g2 = new MyGain(0.2);

		this.filterFade.connect(this.aG); this.line.connect(this.aG.gain.gain);
		this.aG.connect(this.dly);
		this.dly.connect(this.f);
		this.f.connect(this.g1);
		this.g1.connect(this.output);

		this.f.connect(this.wG);
		this.wG.connect(this.w);
		this.w.connect(this.g2);
		this.g2.connect(this.output);

		this.startArray = [this.line];

	},

	shortDelay: function(){

		this.dly = new MyStereoDelay(randomFloat(0.01, 0.035), randomFloat(0.01, 0.035), randomFloat(0, 0.1), 1);

		this.filterFade.connect(this.dly);
		this.dly.connect(this.output);

	},

	shortDelay2: function(){

		this.dly = new MyStereoDelay(randomFloat(0.01, 0.035), randomFloat(0.01, 0.035), randomFloat(0, 0.1), 1);

		this.filterFade.connect(this.dly);
		this.dly.connect(this.output);

	},

	powerSequenceDelay: function(nDelays, base, eArray, fbArray){

		this.nDelays = nDelays;
		this.base = base;
		this.eArray = eArray;
		this.fbArray = fbArray;

		this.dLS = new Sequence();
		this.dRS = new Sequence();

		this.dLS.randomPowers(this.nDelays, this.base, this.eArray);
		this.dRS.randomPowers(this.nDelays, this.base, this.eArray);

		this.dLS = this.dLS.sequence;
		this.dRS = this.dRS.sequence;

		this.delay = new MultiStereoDelay(this.dLS, this.dRS, this.fbArray);

		this.filterFade.connect(this.delay);
		this.delay.connectAll(this.output);

	},

	switch: function(switchVal){

		var switchVal = switchVal;

		this.filterFade.start(switchVal, 30);

	},

	switchAtTime: function(switchVal, time){

		this.switchVal = switchVal;
		this.time = time;

		this.filterFade.startAtTime(this.switchVal, 20, this.time);

	},

	switchSequence: function(valueSequence, timeSequence){

			var filterFade = this.filterFade;
			var valueSequence = valueSequence;
			var timeSequence = timeSequence;
			var v;
			var j=0;

			for(var i=0; i<timeSequence.length; i++){

				setTimeout(function(){

					v = valueSequence[j%valueSequence.length];
					filterFade.start(v, 20);
					j++;

				}, timeSequence[i]*1000);

			}

		},

	on: function(){

		this.filterFade.start(1, 30);

	},

	off: function(){

		this.filterFade.start(0, 20);

	},

	onAtTime: function(time){

		var filterFade = this.filterFade;

		setTimeout(function(){filterFade.start(1, 20);}, time*1000);

	},

	offAtTime: function(time){

		var filterFade = this.filterFade;

		setTimeout(function(){filterFade.start(0, 20);}, time*1000);

	},

	start: function(){

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].start();
		}

	},

	stop: function(){

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stop();
		}

	},

	startAtTime: function(startTime){

		var startArray = this.startArray;
		var startTime = startTime;

		setTimeout(function(){
			for(var i=0; i<startArray.length; i++){
				startArray[i].start();
			}
		}, startTime*1000);

	},

	stopAtTime: function(stopTime){

		var startArray = this.startArray;
		var stopTime = stopTime;

		setTimeout(function(){
			for(var i=0; i<startArray.length; i++){
				startArray[i].stop();
			}
		}, startTime*1000);

	},

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

function SawSines(nNodes, freqArray, rateArray){

	this.freqArray = freqArray;
	this.rateArray = rateArray;

	this.nNodes = nNodes;

	this.osc = {};
	this.saw = {};
	this.amFilter = {};
	this.amGain = {};

	for(var i=0; i<this.nNodes; i++){

		this.osc[i] = {osc: new MyOsc("sine", this.freqArray[i])};

		this.saw[i] = {saw: new MyBuffer(1, 1, audioCtx.sampleRate)};
		this.saw[i].saw.makeTriangle();
		this.saw[i].saw.loop = true;
		this.saw[i].saw.playbackRate = this.rateArray[i];

		this.amFilter[i] = {filter: new MyBiquad("lowpass", 10, 1)};

		this.amGain[i] = {gain: new MyGain(0)};

		this.saw[i].saw.connect(this.amFilter[i].filter);

		this.osc[i].osc.connect(this.amGain[i].gain); this.amFilter[i].filter.connect(this.amGain[i].gain.gain.gain);

	}

}

SawSines.prototype = {

	nNodes: this.nNodes,
	osc: this.osc,
	saw: this.saw,
	amFilter: this.amFilter,
	amGain: this.amGain,

	setFreq: function(freq, idx){

		var freq = freq;
		var idx = idx;

		this.osc[idx].osc.osc.frequency.value = freq;

	},

	setFreqs: function(freqArray){

		var freqArray = freqArray;

		for(var i=0; i<this.nNodes; i++){
			this.osc[i].osc.osc.frequency.value = freqArray[i];
		}

	},

	setFreqsAtTime: function(freqArray, time){

		this.freqArray = freqArray;
		this.time = time;

		for(var i=0; i<this.nNodes; i++){
			this.osc[i].osc.osc.frequency.setValueAtTime(this.freqArray[i], this.time);
		}

	},

	start: function(){

		for(var i=0; i<this.nNodes; i++){
			this.osc[i].osc.start();
			this.saw[i].saw.start();
		}

	},

	stop: function(){

		for(var i=0; i<this.nNodes; i++){
			this.osc[i].osc.stop();
			this.saw[i].saw.stop();
		}

	},

	startAtTime: function(time){

		this.time = time;

		for(var i=0; i<this.nNodes; i++){
			this.osc[i].osc.startAtTime(this.time);
			this.saw[i].saw.startAtTime(this.time);
		}

	},

	stopAtTime: function(time){

		this.time = time;

		for(var i=0; i<this.nNodes; i++){
			this.osc[i].osc.stopAtTime(this.time);
			this.saw[i].saw.stopAtTime(this.time);
		}

	},

	connectOutput: function(audioNode, idx){

		var idx = idx;

		if (audioNode.hasOwnProperty('input') == 1){
			this.amGain[idx].gain.connect(audioNode.input);
		}
		else {
			this.amGain[idx].gain.connect(audioNode);
		}

	},

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

function SawSines2(nNodes, freqArray, rateArray){

	this.freqArray = freqArray;
	this.rateArray = rateArray;

	this.nNodes = nNodes;

	this.osc = {};
	this.saw = {};
	this.amFilter = {};
	this.amGain = {};

	for(var i=0; i<this.nNodes; i++){

		this.osc[i] = {osc: new MyOsc("sine", this.freqArray[i])};

		this.saw[i] = {saw: new MyBuffer(1, 1, audioCtx.sampleRate)};
		this.saw[i].saw.makeInverseSawtooth(4);
		this.saw[i].saw.loop = true;
		this.saw[i].saw.playbackRate = this.rateArray[i];

		this.amFilter[i] = {filter: new MyBiquad("lowpass", 500, 0)};

		this.amGain[i] = {gain: new MyGain(0)};

		this.saw[i].saw.connect(this.amFilter[i].filter);

		this.osc[i].osc.connect(this.amGain[i].gain); this.amFilter[i].filter.connect(this.amGain[i].gain.gain.gain);

	}

}

SawSines2.prototype = {

	nNodes: this.nNodes,
	osc: this.osc,
	saw: this.saw,
	amFilter: this.amFilter,
	amGain: this.amGain,

	setFreq: function(freq, idx){

		var freq = freq;
		var idx = idx;

		this.osc[idx].osc.osc.frequency.value = freq;

	},

	setFreqs: function(freqArray){

		var freqArray = freqArray;

		for(var i=0; i<this.nNodes; i++){
			this.osc[i].osc.osc.frequency.value = freqArray[i];
		}

	},

	setFreqsAtTime: function(freqArray, time){

		this.freqArray = freqArray;
		this.time = time;

		for(var i=0; i<this.nNodes; i++){
			this.osc[i].osc.osc.frequency.setValueAtTime(this.freqArray[i], this.time);
		}

	},

	start: function(){

		for(var i=0; i<this.nNodes; i++){
			this.osc[i].osc.start();
			this.saw[i].saw.start();
		}

	},

	stop: function(){

		for(var i=0; i<this.nNodes; i++){
			this.osc[i].osc.stop();
			this.saw[i].saw.stop();
		}

	},

	startAtTime: function(time){

		this.time = time;

		for(var i=0; i<this.nNodes; i++){
			this.osc[i].osc.startAtTime(this.time);
			this.saw[i].saw.startAtTime(this.time);
		}

	},

	stopAtTime: function(time){

		this.time = time;

		for(var i=0; i<this.nNodes; i++){
			this.osc[i].osc.stopAtTime(this.time);
			this.saw[i].saw.stopAtTime(this.time);
		}

	},

	connectOutput: function(audioNode, idx){

		var idx = idx;

		if (audioNode.hasOwnProperty('input') == 1){
			this.amGain[idx].gain.connect(audioNode.input);
		}
		else {
			this.amGain[idx].gain.connect(audioNode);
		}

	},

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

function ShaperBank(nShapers, inGainArray, outGainArray){

	this.inGainArray = inGainArray;
	this.outGainArray = outGainArray;

	this.nShapers = nShapers;

	this.onGain = {};
	this.onConstant = new BufferConstant(1);
	this.on = new MyGain(0);
	this.onFilter = new MyBiquad("lowpass", 100, 0);

	this.inGain = {};
	this.shaper = {};
	this.outGain = {};

	this.cFreq;
	this.mFreq;

	for(var i=0; i<this.nShapers; i++){

		this.onGain[i] = {gain: new MyGain(0)};

		this.inGain[i] = {gain: new MyGain(this.inGainArray[i])};
		this.shaper[i] = {shaper: new MyWaveShaper()};
		this.shaper[i].shaper.makeFm(randomFloat(5, 7.1), randomFloat(0.1, 0.31), 1);
		this.outGain[i] = {gain: new MyGain(this.outGainArray[i])};

		this.onConstant.connect(this.on);
		this.on.connect(this.onFilter);
		this.onGain[i].gain.connect(this.inGain[i].gain); this.onFilter.connect(this.onGain[i].gain.gain.gain);
		this.inGain[i].gain.connect(this.shaper[i].shaper);
		this.shaper[i].shaper.connect(this.outGain[i].gain);

	}

	this.onConstant.start();

}

ShaperBank.prototype = {

	outGain: this.outGain,
	shaper: this.shaper,
	on: this.on,

	nShapers: this.nShapers,

	connectOutput: function(audioNode, idx){

		var idx = idx;

		if (audioNode.hasOwnProperty('input') == 1){
			this.outGain[idx].gain.connect(audioNode.input);
		}
		else {
			this.outGain[idx].gain.connect(audioNode);
		}

	},

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

function ELine3(rate, sequenceLength, gainVal){

	this.rate = rate;
	this.sL = sequenceLength;
	this.gainVal = gainVal;

	this.output = audioCtx.createGain();
	this.output.gain.value = this.gainVal;

	// shape line
	this.line = new Instrument();
	this.line.lineShape(this.rate, this.sL);

	// gains
	this.lG = new MyGain(0.2);

	this.line.connect(this.lG);

	this.nFX = 2;
	this.fxG = new MyGain(0.25);

	this.lG.connect(this.fxG);

	this.fx = new MultiEffect(this.nFX);
	this.fx.effects[0].effect.shortDelay();
	this.fx.effects[1].effect.shortDelay();

	for(var i=0; i<this.nFX; i++){
		this.fxG.connect(this.fx.effects[i].effect);
		this.fx.effects[i].effect.connect(this.output);
	}

	this.fxSL = 240;

	this.oSeqArray = [];
	this.divArray = new MyArray([0.8, 0.4, 0.31]);
	this.divArray.multiply(0.25);

	for(var i=0; i<this.fx.nEffects; i++){
		// create a new onset sequence
		this.oSeqArray[i] = new Sequence();
		this.oSeqArray[i].additive(this.fxSL, this.divArray.array);
	}

}

ELine3.prototype = {

	output: this.output,
	line: this.line,
	dL: this.dL,
	dL2: this.dL2,
	fx: this.fx,
	fxG: this.fxG,
	fxSL: this.fxSL,
	oSeqArray: this.oSeqArray,

	start: function(){

		this.line.start();

		for(var i=0; i<this.fx.nEffects; i++){
			for(var j=0; j<this.fxSL; j++){
				// implement onset sequence
				this.fx.effects[i].effect.switchAtTime(randomInt(0, 2), this.oSeqArray[i].sequence[j]);
			}
		}

	},

	stop: function(){

		this.line.stop();

	},

	startAtTime: function(time){

		this.time = time;

		this.line.startAtTime(this.time);

		for(var i=0; i<this.fx.nEffects; i++){
			for(var j=0; j<this.fxSL; j++){
				// implement onset sequence
				this.fx.effects[i].effect.switchAtTime(randomInt(0, 2), this.time+this.oSeqArray[i].sequence[j]);
			}
		}

	},

	stopAtTime: function(time){

		this.time = time;

		this.line.stopAtTime(this.time);

	},

	connect: function(audioNode1, audioNode2){
		if (audioNode1.hasOwnProperty('input') == 1 && audioNode2.hasOwnProperty('input') == 1){

			this.line.connect(audioNode1.input);
			audioNode1.connect(this.fxG);

			this.output.connect(audioNode2.input);
		}
		else {

			this.line.connect(audioNode1);
			audioNode1.connect(this.fxG.input);

			this.output.connect(audioNode2);

		}
	},

}

//--------------------------------------------------------------
