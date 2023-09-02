// template for an instrument or effect object
function Instrument(){

	this.output = audioCtx.createGain();

}

Instrument.prototype = {

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

// EFFECT

//--------------------------------------------------------------

// object within which to design signal-processing chains, which are
// stored as methods
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

	// effect preset template
	effectMethod: function(){
		this.startArray = [];
	},

	// preset 1
	thru: function(){

		this.filterFade.connect(this.output);

	},

	// preset 2
	stereoDelay: function(delayL, delayR, fb){

		this.delayL = delayL;
		this.delayR = delayR;
		this.fb = fb;

		this.dly = new MyStereoDelay(this.delayL, this.delayR, this.fb, 1);

		this.filterFade.connect(this.dly);
		this.dly.connect(this.output);

	},

	// preset 3
	noiseAM: function(min, max, rate, lpFreq){

		this.min = min;
		this.max = max;
		this.rate = rate;
		this.lpFreq = lpFreq;

		this.l = new LFO(this.min, this.max, this.rate);
		this.l.buffer.makeUnipolarNoise();
		this.lp = new MyBiquad("lowpass", this.lpFreq, 1);
		this.g = new MyGain(0);

		this.filterFade.connect(this.g); this.l.connect(this.g.gain.gain);
		this.g.connect(this.output);

		this.startArray = [this.l];

	},

	// preset 4
	fmShaper: function(cFreq, mFreq, mGain){

		this.cFreq = cFreq;
		this.mFreq = mFreq;
		this.mGain = mGain;

		this.w = new MyWaveShaper();
		this.w.makeFm(this.cFreq, this.mFreq, 1);
		this.wG = new MyGain(this.mGain);

		this.filterFade.connect(this.wG);
		this.wG.connect(this.w);
		this.w.connect(this.output);

	},

	// preset 5
	amShaper: function(cFreq, mFreq, mGain){

		this.cFreq = cFreq;
		this.mFreq = mFreq;
		this.mGain = mGain;

		this.w = new MyWaveShaper();
		this.w.makeAm(this.cFreq, this.mFreq, 1);
		this.wG = new MyGain(this.mGain);

		this.filterFade.connect(this.wG);
		this.wG.connect(this.w);
		this.w.connect(this.output);

	},

	// presett 6
	randomShortDelay: function(){

		this.dly = new MyStereoDelay(randomFloat(0.01, 0.035), randomFloat(0.01, 0.035), randomFloat(0, 0.1), 1);

		this.filterFade.connect(this.dly);
		this.dly.connect(this.output);

	},

	// preset 7
	randomEcho: function(){

		this.dly = new MyStereoDelay(randomFloat(0.35, 0.6), randomFloat(0.35, 0.6), randomFloat(0, 0.2), 1);

		this.filterFade.connect(this.dly);
		this.dly.connect(this.output);

	},

	// preset 8
	randomSampleDelay: function(){

		this.s = 1/audioCtx.sampleRate;

		this.dly = new MyStereoDelay(randomInt(this.s, this.s*100), randomInt(this.s, this.s*100), randomFloat(0.3, 0.4), 1);

		this.filterFade.connect(this.dly);
		this.dly.connect(this.output);

	},

	// preset 9
	filter: function(type, freq, Q){

		this.type = type;
		this.freq = freq;
		this.Q = Q;

		this.f = new MyBiquad(this.type, this.freq, this.Q);
		this.filterFade.connect(this.f);

		this.f.connect(this.output);

	},

	// filterFade to switchVal
	switch: function(switchVal){

		this.switchVal = switchVal;

		this.filterFade.start(this.switchVal, 30);

	},

	// filterFade to switchVal at specified time (in seconds)
	switchAtTime: function(switchVal, time){

		this.switchVal = switchVal;
		this.time = time;

		this.filterFade.startAtTime(this.switchVal, 20, this.time);


	},

	// specify a sequence of values to filterFade to
	switchSequence: function(valueSequence, timeSequence){

		this.valueSequence = valueSequence;
		this.timeSequence = timeSequence;
		this.v;
		this.j=0;

		for(var i=0; i<timeSequence.length; i++){
			this.v = this.valueSequence[this.j%this.valueSequence.length];
			this.filterFade.startAtTime(this.v, 20, this.timeSequence[i]);
			this.j++;
		}

	},

	// turn the effect on immdiately
	on: function(){

		this.filterFade.start(1, 30);

	},

	// turn the effect off immediately
	off: function(){

		this.filterFade.start(0, 20);

	},

	// turn the effect on at the specified time (in seconds)
	onAtTime: function(time){

		this.time = time;

		this.filterFade.startAtTime(1, 20, this.time);

	},

	// turn the effect off at the specified time (in seconds)
	offAtTime: function(time){

		this.time = time;

		this.filterFade.startAtTime(0, 20, this.time);

	},

	// start the effect immediately
	start: function(){

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].start();
		}

	},

	// stop the effect immediately
	stop: function(){

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stop();
		}

	},

	// start the effect at the specified time (in seconds)
	startAtTime: function(time){

		this.time = time;

			for(var i=0; i<startArray.length; i++){
				this.startArray[i].startAtTime(this.time);
			}

	},

	// stop the effect at the specified time (in seconds)
	stopAtTime: function(time){

		this.time = time;

			for(var i=0; i<startArray.length; i++){
				this.startArray[i].stopAtTime(this.time);
			}

	},

	// connect the output node of this object to the input of another
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

// INSTRUMENT

//--------------------------------------------------------------

class InstrumentClass{
	input;
	output;

	constructor(){
		this.input = audioCtx.createGain();
		this.output = audioCtx.createGain();
	}

	connect(audioNode){
		if(audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input)
		}
		else{
			this.output.connect(audioNode);
		}
	}
}

class HeavenRamp extends InstrumentClass{
    buffer;
    lfo;
    rampLFO;
    sqB;
    invSaw;

    constructor(fund){
        super();

        this.buffer = new MyBuffer2(1, 1, audioCtx.sampleRate);
        this.buffer.noise().fill(0);
        this.buffer.loop = true;
        this.buffer.playbackRate = 1;
    
        var lfoRates = [1/*, 2, 4*/] // original: 2
        var rampRates = [0.5, 0.25, 0.125] // original: 0.25
        var rateIndex = 2;
    
        this.lfo = new MyBuffer2(1, 1, audioCtx.sampleRate);
        this.lfo.sine(1, 1).fill(0);
        this.lfo.playbackRate = lfoRates[randomInt(0, lfoRates.length)]
        this.lfo.loop = true;
    
        this.rampLFO = new MyBuffer2(1, 1, audioCtx.sampleRate);
        this.rampLFO.playbackRate = rampRates[randomInt(0, rampRates.length)];
        this.rampLFO.sawtooth(8).fill(0);
        var rampGain = new MyGain(0);
        this.rampLFO.connect(rampGain.gain.gain);
        this.rampLFO.loop = true;
    
        var gain = new MyGain(0)
    
        var inverseGain = new MyGain(-1)
    
        var pan = new MyPanner2(0);
    
        // 442; // randomFloat(400, 475)
    
        // here is where if you did an actual frequency modulation and modulated 
        // the modulation gain (modulate modulate modulate), you could get a more 
        // active contour of brightness (can't since you can't fm the convolution)
        var convolver = new MyConvolver();
        var cBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
        cBuffer.makeFm(fund * 0.5, fund * 0.5 * 0.501, 0.25);
        convolver.setBuffer(cBuffer.buffer);
    
        var convolver2 = new MyConvolver();
        var cBuffer2 = new MyBuffer(1, 1, audioCtx.sampleRate);
        cBuffer2.makeFm(fund * M3, fund * 0.5 * M3, 0.125);
        convolver2.setBuffer(cBuffer2.buffer);
        convolver2.output.gain.gain = 0.125;
    
        var convolver3 = new MyConvolver();
        var cBuffer3 = new MyBuffer(1, 1, audioCtx.sampleRate);
        cBuffer3.makeFm(fund * P5 * 0.5, fund * 0.5 * 0.501 * P5, 0.5);
        convolver3.setBuffer(cBuffer3.buffer);
    
        var convolver4 = new MyConvolver();
        var cBuffer4 = new MyBuffer(1, 1, audioCtx.sampleRate);
        cBuffer4.makeFm(fund * M3 * 0.5, fund * 0.5 * 0.501 * M3, 0.25);
        convolver4.setBuffer(cBuffer4.buffer);
    
        var delay = new MyStereoDelay(0.25, 0.5, 0.25, 0.5);
    
        var sc = new SchwaBox("i");
        sc.output.gain.gain = 0/*0.00625*/;
    
        this.buffer.connect(convolver); this.buffer.connect(convolver2); this.buffer.connect(convolver3); this.buffer.connect(convolver4);
        convolver.connect(gain); convolver2.connect(gain); convolver3.connect(gain); convolver4.connect(gain);
        gain.connect(pan);
        this.lfo.connect(inverseGain); 
        inverseGain.connect(pan.gainR.gain);
        this.lfo.connect(gain.gain.gain); 
        this.lfo.connect(pan.gainL.gain);
        pan.connect(rampGain);
        rampGain.connect(delay);
        delay.connect(masterGain)
    
        delay.connect(sc);
        // sc.connect(masterGain)
    
        var reverb = new MyConvolver()
        var rBuf = new MyBuffer2(2, 1, audioCtx.sampleRate);
        rBuf.noise().fill(0); rBuf.noise().fill(1);
        rBuf.inverseSawtooth(3).multiply(0); rBuf.inverseSawtooth(3).multiply(1);
        reverb.setBuffer(rBuf.buffer);
        reverb.output.gain.gain = 0.1;
    
        delay.connect(reverb);
        // rampGain.connect(reverb);
        // sc.connect(reverb);
        reverb.connect(masterGain);
        
        var squareSc = new SchwaBox("ae");
        this.sqB = new MyBuffer2(1, 1, audioCtx.sampleRate);
        this.sqB.floatingCycleSquare(0.1, 0.3).add(0); this.sqB.floatingCycleSquare(0.6, 0.8).add(0);
        this.sqB.playbackRate = 0.25;
        this.sqB.loop = true;
        var sqG = new MyGain(0);
    
        rampGain.connect(squareSc); 
        // squareSc.connect(sqG); sqB.connect(sqG.gain.gain);
        sqG.connect(delay);
        sqG.connect(reverb);
    
        this.invSaw = new MyBuffer2(1, 1, audioCtx.sampleRate);
        this.invSaw.sine(440).fill(0);
        this.invSaw.inverseSawtooth(4).multiply(0);
        this.invSaw.loop = true;
        this.invSaw.playbackRate = 10;
        // invSaw.connect(masterGain);
    }

    start(startTime){
        this.buffer.startAtTime(startTime);
        this.lfo.startAtTime(startTime);
        this.rampLFO.startAtTime(startTime);
        this.sqB.startAtTime(startTime);
        this.invSaw.startAtTime(startTime);
    }
}

class BasicOsc extends InstrumentClass{
	osc;

	constructor(){
		super();
		this.osc = new MyBuffer2(1, 1, audioCtx.sampleRate);
		this.osc.sine(432, 1).fill(0);
		this.osc.playbackRate = 1;
		this.osc.connect(this.output);
	}

	start(){
		this.osc.start();
	}
}

// object within which to design signal-generating chains, which are
// stored as methods
function Instrument(){
	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();
	this.startArray = [];
}

Instrument.prototype = {

	input: this.input,
	output: this.output,
	startArray: this.startArray,

	// instrument preset template
	instrumentMethod: function(){
		this.startArray = [];
	},

	// preset 1
	bPS: function(rate, tArray, gainVal){

		this.rate = rate;
		this.tArray = tArray;
		this.gainVal = gainVal;

		this.output.gain.value = gainVal;

		// BREAKPOINT ENVELOPE ARRAY

			this.sL = this.tArray.length*2;

			this.tS = new Sequence();
			this.tS.loop(this.sL, this.tArray);
			this.tS.palindrome();
			this.tS.bipolar();
			this.tS.join([0]);

			this.dS = new Sequence();
			this.dS = this.dS.duplicates(this.tS.sequence.length, 1/this.tS.sequence.length,);

			this.eArray = this.tS.lace(this.dS);

		// BREAKPOINT EXPONENT ARRAY

			this.expArray1 = new Sequence();
			this.expArray1.randomInts(this.eArray.length/2, 14, 54);
			this.expArray2 = new Sequence();
			this.expArray2.randomFloats(this.eArray.length/2, 0.1, 0.991);

			this.expArray = this.expArray1.lace(this.expArray2.sequence);

		// BREAKPOINT

			this.bP = new BreakPoint(this.eArray, this.expArray);
			this.bP.loop = true;
			this.bP.playbackRate = this.rate;

		// SHAPER

			this.s = new MyWaveShaper();
			this.s.makeFm(107, 20, 1);
			this.sG = new MyGain(0.1);

		// FILTERS

			this.f1 = new MyBiquad("highshelf", 3000, 1);
			this.f1.biquad.gain.value = -8;
			this.f2 = new MyBiquad("lowpass", 3000, 1);
			this.f3 = new MyBiquad("highpass", 5, 1);

		// SHAPER

			this.w = new MyWaveShaper();
			this.w.makeSigmoid(5);
			this.wD = new MyStereoDelay(randomFloat(0.001, 0.01), randomFloat(0.001, 0.01), 0.1, 1);
			this.wD.output.gain.value = 0.2;

		// CONNECTIONS
			/*
			this.bP.connect(this.sG);

			this.sG.connect(this.s);
			this.s.connect(this.f1);
			this.f1.connect(this.f2);
			this.f2.connect(this.f3);

			this.f2.connect(this.w);
			this.w.connect(this.wD);
			this.wD.connect(this.f3);

			this.f3.connect(this.output);
			*/

			this.bP.connect(this.output);

		// STARTS

			this.startArray = [this.bP];

	},

	// preset 2
	lTone: function(fund){

		this.fund = fund;

		this.d2O = new LFO(0, 1, this.fund);
		this.d2O.buffer.makeUnipolarSine();
		this.d2OF = new MyBiquad("lowpass", 20000, 1);
		this.d2OF.output.gain.value = 0.5;
		this.d2OW = new Effect();
		this.d2OW.fmShaper(this.fund, this.fund*2, 0.0006);
		this.d2OW.on();

		this.p = new MyPanner2(randomFloat(-0.25, 0.25));
		this.p.output.gain.value = 1;

		this.t = new Effect();
		this.t.thru();

		this.dR = new Effect();
		this.dR.randomShortDelay();
		this.dR.output.gain.value = 0.3;
		this.dR.on();

		this.dE = new Effect();
		this.dE.randomEcho();
		this.dE.output.gain.value = 0.3;
		this.dE.on();

		this.d2O.connect(this.d2OF);
		this.d2OF.connect(this.d2OW);
		this.d2OW.connect(this.p);
		this.p.connect(this.t);

		this.t.connect(this.output);

		this.t.connect(this.dR);
		this.dR.connect(this.output);

		this.dR.connect(this.dE);
		this.dE.connect(this.output);

		this.d2O.start();

	},

	// start instrument immediately
	start: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].start();
		}
	},

	// stop instrument immediately
	stop: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stop();
		}
	},

	// start instrument at specified time (in seconds)
	startAtTime: function(time){

		this.time = time;

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].startAtTime(this.time);
		}

	},

	// stop instrument at specified time (in seconds)
	stopAtTime: function(time){

		this.time = time;

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stopAtTime(this.time);
		}

	},

	// connect the output node of this object to the input of another
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

// PRESETS (3)
//  - objects for storing commonly used configurations of certain nodes

//--------------------------------------------------------------

// collection of commonly used configurations of MyBuffer
function BufferPreset(){

	this.output = audioCtx.createGain();

	this.playbackRateInlet = new MyGain(1);

}

BufferPreset.prototype = {

	output: this.output,
	myBuffer: this.myBuffer,
	buffer: this.buffer,
	playbackRate: this.playbackRate,
	loop: this.loop,

	playbackRateInlet: this.playbackRateInlet,

	// preset template
	presetTemplate: function(){

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;

	},

	// preset 1
	harmonicSeries: function(nHarmonics){

		this.nHarmonics = nHarmonics;

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;
		this.myBuffer.makeConstant(0);

		for(var i=0; i<this.nHarmonics; i++){
			this.myBuffer.addSine(i+1, 1/(i+1));
		}

		this.myBuffer.normalize(-1, 1);

	},

	// preset 2
	additiveSynth: function(hArray, gArray){

		this.hArray = hArray;
		this.gArray = gArray;

		this.myBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.buffer = this.myBuffer.buffer;
		this.myBuffer.makeConstant(0);

		for(var i=0; i<this.hArray.length; i++){
			this.myBuffer.addSine(this.hArray[i], this.gArray[i]);
		}

		this.myBuffer.normalize(-1, 1);

	},

	// start buffer immediately
	start: function(){
		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.loop = this.loop;
		this.bufferSource.playbackRate.value = this.playbackRate;
		this.bufferSource.buffer = this.buffer;
		this.playbackRateInlet.connect(this.bufferSource.playbackRate);
		this.bufferSource.connect(this.output);
		this.bufferSource.start();
	},

	// stop buffer immediately
	stop: function(){
		this.bufferSource.stop();
	},

	// start buffer at specified time (in seconds)
	startAtTime: function(time){

		this.time = time;

		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.loop = this.loop;
		this.bufferSource.playbackRate.value = this.playbackRate;
		this.bufferSource.buffer = this.buffer;
		this.playbackRateInlet.connect(this.bufferSource.playbackRate);
		this.bufferSource.connect(this.output);
		this.bufferSource.start(this.time);

	},

	// stop buffer at specified time (in  seconds)
	stopAtTime: function(time){

		this.time = time;

		this.bufferSource.stop(this.time);

	},

	// connect the output node of this object to the input of another
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

// collection of commonly used configurations of MyConvolver
function ConvolverPreset(){

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();

}

ConvolverPreset.prototype = {

	input: this.input,
	output: this.output,
	convolver: this.convolver,

	// preset 1
	noiseReverb: function(length, decayExp){

		this.length = length;
		this.decayExp = decayExp;

		this.convolver = new MyConvolver(2, this.length, audioCtx.sampleRate);
		this.convolver.makeNoise();
		this.convolver.applyDecay(this.decayExp);

		this.input.connect(this.convolver.input);
		this.convolver.connect(this.output);

		this.buffer = this.convolver.buffer;

	},

	// preset 2
	preset2: function(){

		this.convolver = new MyConvolver(1, 0.25, audioCtx.sampleRate);
		this.convolver.makeAm(432, 432*2, 1);

		this.input.connect(this.convolver.input);
		this.convolver.connect(this.output);

		this.buffer = this.convolver.buffer;

	},

	// connect the output node of this object to the input of another
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

// collection of commonly used Envelopes
function EnvelopePreset(){

	this.output = audioCtx.createGain();
	this.envelopeBuffer = new EnvelopeBuffer();

}

EnvelopePreset.prototype = {

	output: this.output,
	envelopeBuffer: this.envelopeBuffer,
	loop: this.loop,

	// preset 1
	evenRamp: function(length){

		this.length = length;

		this.envelopeBuffer.makeExpEnvelope(
			[1, this.length*0.5, 0, this.length*0.5],
			[1, 1],
		);

		this.buffer = this.envelopeBuffer.buffer;

	},

	// preset 2
	customRamp: function(length, peakPoint, upExp, downExp){

		this.length = length;
		this.peakPoint = peakPoint;
		this.upExp = upExp;
		this.downExp = downExp;

		this.envelopeBuffer.makeExpEnvelope(
			[1, this.length*this.peakPoint, 0, this.length*(1-this.peakPoint)],
			[this.upExp, this.downExp]
		);

		this.buffer = this.envelopeBuffer.buffer;

	},

	// start envelope immediately
	start: function(){
		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.buffer = this.buffer.buffer;
		this.bufferSource.loop = this.loop;
		this.bufferSource.connect(this.output);
		this.bufferSource.start();
	},

	// stop envelope immediately
	stop: function(){
		this.bufferSource.stop();
	},

	// start envelope at specified time (in seconds)
	startAtTime: function(time){

		this.time = time;

		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.buffer = this.buffer;
		this.bufferSource.loop = this.loop;
		this.bufferSource.connect(this.output);
		this.bufferSource.start(this.time);

	},

	// stop envelope at specified time (in seconds)
	stopAtTime: function(time){

		this.time = time;

		this.bufferSource.stop(this.time);

	},

	// connect the output node of this object to the input of another
	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	},

	// create an envelope with exponential curves applied to each line segment
	makeExpEnvelope: function(eArray, expArray){

		this.eArray,
		this.expArray,

		this.envelopeBuffer.makeExpEnvelope(this.eArray, this.expArray);

		this.buffer = this.envelopeBuffer.buffer;

	},

	// create an envelope
	makeEnvelope: function(eArray){

		this.eArray = eArray;

		this.envelopeBuffer.makeEnvelope(this.eArray);

		this.buffer = this.envelopeBuffer.buffer;

	},

}

//--------------------------------------------------------------

// collection of commonly used percussion sounds
function PercussionPresets(){

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();
	this.startArray = [];

}

PercussionPresets.prototype = {

	input: this.input,
	output: this.output,
	startArray: this.startArray,

	// preset 1
	perc1: function(){

		this.duration = 1;

		this.fund = 432;
		this.rate = 1.5;
		this.cFA = [1];
		this.mFA = [2];
		this.gVA = [1];
		this.mGA = [1];
		this.pPA = [0.0001];
		this.uEA = [256];
		this.dEA = [128];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("percussion preset 1");

	},

	// preset 2
	perc2: function(){

		this.duration = 1;

		this.fund = 432;
		this.rate = 1.5;
		this.cFA = [1, 1,   3,     2];
		this.mFA = [2, 3,   1,     2];
		this.gVA = [1, 0.5, 0.2, 0.3];
		this.mGA = [1, 1, 1, 1];
		this.pPA = [0.0001, 0.0001, 0.0001, 0.0001];
		this.uEA = [256, 256, 256, 256];
		this.dEA = [128, 128, 128, 128];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("percussion preset 2");

	},

	// preset 3
	perc3: function(){

		this.duration = 1;

		this.fund = 432*2;
		this.rate = 8;
		this.cFA = [5,  1 , 5];
		this.mFA = [2,  32, 10];
		this.gVA = [13, 20, 15];
		this.mGA = [1, 1, 1];
		this.pPA = [0.0001, 0.0001, 0.0003];
		this.uEA = [0.01, 0.01, 0.02];
		this.dEA = [128,  64  , 56];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("percussion preset 3")

	},

	// preset 4
	perc4: function(){

		this.duration = 1;

		this.fund = 432*2;
		this.rate = 4;
		this.cFA = [5,  1 , 5];
		this.mFA = [2,  32, 10];
		this.gVA = [13, 20, 15];
		this.mGA = [1, 1, 1];
		this.pPA = [0.0001, 0.0001, 0.0003];
		this.uEA = [0.01, 0.01, 0.02];
		this.dEA = [128,  64  , 56];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("percussion preset 4")

	},

	// preset 5
	perc5: function(){

		this.duration = 1;

		this.fund = 432*2;
		this.rate = 1;
		this.cFA = [5];
		this.mFA = [2];
		this.gVA = [13];
		this.mGA = [1];
		this.pPA = [0.0001];
		this.uEA = [0.01];
		this.dEA = [128];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("percussion preset 5")

	},

	// preset 6
	perc6: function(){

		this.duration = 4;

		this.fund = 432*0.25;
		this.rate = 0.25;
		this.cFA = [5];
		this.mFA = [2];
		this.gVA = [13];
		this.mGA = [1];
		this.pPA = [0.0001];
		this.uEA = [0.01];
		this.dEA = [128];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("percussion preset 6")

	},

	// preset 7
	perc7: function(){

	this.duration = 1;

	this.fund = 432*0.25;
	this.rate = 3;
	this.cFA = [5];
	this.mFA = [2];
	this.gVA = [13];
	this.mGA = [1];
	this.pPA = [0.0001];
	this.uEA = [0.01];
	this.dEA = [128];

	this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
	this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
	this.b1.playbackRate = this.rate;

	for(var i=0; i<this.cFA.length; i++){
		this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
		this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
		this.b2.multiply(this.mGA[i]);

		this.b1.addBuffer(this.b2.buffer);
	}

	this.b1.normalize(-1, 1);

	this.b1.connect(this.output);

	this.startArray = [this.b1];

	console.log("percussion preset 7")

},

	// preset 8
	perc8: function(){

		this.duration = 1;

		this.fund = 432*0.25;
		this.rate = 3;
		this.cFA = [5];
		this.mFA = [200];
		this.gVA = [20];
		this.mGA = [1];
		this.pPA = [0.0001];
		this.uEA = [0.01];
		this.dEA = [128];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("percussion preset 8")

},

	// preset 9 (metal click)
	perc9: function(){

		this.duration = 1;

		this.fund = 432*1;
		this.rate = 2;
		this.cFA = [100];
		this.mFA = [100];
		this.gVA = [2100];
		this.mGA = [1];
		this.pPA = [0.001];
		this.uEA = [0.1];
		this.dEA = [16];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("percussion preset 9");

	},

	// preset 10
	perc10: function(){

		this.duration = 1;

		this.fund = 432*0.125;
		this.rate = 2;
		this.cFA = [100];
		this.mFA = [100];
		this.gVA = [2100];
		this.mGA = [1];
		this.pPA = [0.001];
		this.uEA = [0.1];
		this.dEA = [16];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("percussion preset 10");

	},

	// preset 11 (snare)
	perc11: function(){

		this.duration = 1;

		this.fund = 432*0.03125;
		this.rate = 1.25;
		this.cFA = [100];
		this.mFA = [100];
		this.gVA = [2100];
		this.mGA = [1];
		this.pPA = [0.001];
		this.uEA = [0.1];
		this.dEA = [16];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("percussion preset 11");

	},

	// preset 12 (cyber hat)
	perc12: function(){

		this.duration = 1;

		this.fund = 432*32;
		this.rate = 16;
		this.cFA = [0.1, 0.3, 0.7 , 1.1 , 0.6 ];
		this.mFA = [0.2, 0.2, 0.05, 0.07, 0.77];
		this.gVA = [100, 150, 120,  1   , 20 ];
		this.mGA = [1, 1, 1, 1, 1];
		this.pPA = [0.1, 0.1, 0.2, 0.5, 0.8];
		this.uEA = [0.1, 0.1, 0.2, 1, 3];
		this.dEA = [8, 4, 3, 1, 0.4];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("percussion preset 12");

	},

	// preset 13 ("i" pulse)
	perc13: function(){

		this.duration = 1;

		this.fund = 16;
		this.rate = 32;
		this.cFA = [1, 9.10714286, 10.3571429];
		this.mFA = [1, 9.10714286, 10.3571429];
		this.gVA = [10, 10, 10];
		this.mGA = [1, 0.5, 0.125];
		this.pPA = [0.1, 0.1, 0.1];
		this.uEA = [0.1, 0.1, 0.1];
		this.dEA = [16, 16, 16];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("percussion preset 13");

	},

	// preset 14 (metal "i")
	perc14: function(){

		this.duration = 1;

		this.fund = 280;
		this.rate = 16;
		this.cFA = [1, 9.10714286, 10.3571429];
		this.mFA = [1, 9.10714286, 10.3571429];
		this.gVA = [1, 1, 1];
		this.mGA = [1, 0.025, 0.05];
		this.pPA = [0.1, 0.1, 0.1];
		this.uEA = [0.1, 0.1, 0.1];
		this.dEA = [16, 16, 16];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("percussion preset 14");

	},

	// preset 15 ("i" blip)
	perc15: function(){

		this.duration = 1;

		this.fund = 70;
		this.rate = 16;
		this.cFA = [1, 9.10714286, 10.3571429];
		this.mFA = [1, 9.10714286, 10.3571429];
		this.gVA = [1, 1, 1];
		this.mGA = [1, 0.025, 0.05];
		this.pPA = [0.1, 0.1, 0.1];
		this.uEA = [0.1, 0.1, 0.1];
		this.dEA = [16, 8, 4];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("percussion preset 15");

	},

	// preset 16 (rich bowl)
	perc16: function(){

		this.duration = 4;

		this.fund = 250;
		this.rate = 0.25;
		this.cFA = [1, 3.218181818181818, 4.527272727272727];
		this.mFA = [1, 3.218181818181818, 4.527272727272727];
		this.gVA = [1, 1, 1];
		this.mGA = [1, 1, 1];
		this.pPA = [0.01, 0.01, 0.01];
		this.uEA = [0.1, 0.1, 0.1];
		this.dEA = [16, 16, 16];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("percussion preset 16")

	},

	// preset 17 (rich bowl 2)
	perc17: function(){

		this.duration = 4;

		this.fund = 250;
		this.rate = 0.25;
		this.cFA = [1, 3.218181818181818, 4.527272727272727];
		this.mFA = [10.3571429, 1, 9.10714286];
		this.gVA = [1, 1, 1];
		this.mGA = [1, 1, 1];
		this.pPA = [0.01, 0.01, 0.01];
		this.uEA = [0.1, 0.1, 0.1];
		this.dEA = [16, 16, 16];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("percssion preset 17")

	},

	// preset 18
	perc18: function(){

		this.duration = 1;

		this.fund = 432*0.25;
		this.rate = 2;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.bw = 50;
		this.cA = [1, 4.75, 6.375];

		for(var i=0; i<this.cA.length; i++){

			for(var j=0; j<this.bw; j++){

				this.b2.addSine(j+parseInt(this.fund*this.cA[i]), randomFloat(0.5, 1));

			}

		}

		this.b1.addBuffer(this.b2.buffer);
		this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 4);

		this.b1.connect(this.output);

		this.b1.normalize(-1, 1);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 19
	perc19: function(){

		this.duration = 1;

		this.fund = 432*0.25;
		this.rate = 2;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.bw = 50;
		this.cA = [1, 3.218181818181818, 4.527272727272727];

		for(var i=0; i<this.cA.length; i++){

			for(var j=0; j<this.bw; j++){

				this.b2.addSine(j+parseInt(this.fund*this.cA[i]), randomFloat(0.5, 1));

			}

		}

		this.b1.addBuffer(this.b2.buffer);
		this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 4);

		this.b1.connect(this.output);

		this.b1.normalize(-1, 1);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 20
	perc20: function(){

		this.duration = 1;

		this.fund = 432*0.25;
		this.rate = 2;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.bw = 50;
		this.cA = [1, 3.218181818181818, 4.527272727272727, 1, 9.10714286, 10.3571429];

		for(var i=0; i<this.cA.length; i++){

			for(var j=0; j<this.bw; j++){

				this.b2.addSine(j+parseInt(this.fund*this.cA[i]), randomFloat(0.5, 1));

			}

		}

		this.b1.addBuffer(this.b2.buffer);
		this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 4);

		this.b1.connect(this.output);

		this.b1.normalize(-1, 1);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 21
	perc21: function(){

		this.fund = 432*0.25;
		this.rate = 2;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.bw = 50;
		this.cA = [1, 1.859375, 3.734375];

		for(var i=0; i<this.cA.length; i++){

			for(var j=0; j<this.bw; j++){

				if(j<parseInt(this.bw*0.5)){
					this.b2.addSine(j+(this.fund-parseInt(this.bw*0.5)), randomFloat(1, 1)*(j/(parseInt(this.bw*0.5))));
				};

				if(j>=parseInt(this.bw*0.5)){
					this.b2.addSine(j+this.fund, randomFloat(1, 1)*(this.bw-j)/parseInt(this.bw*0.5));
				};

				this.b2.addSine(j+parseInt(this.fund*this.cA[i]), randomFloat(0.5, 1));

			}

		}

		this.b1.addBuffer(this.b2.buffer);
		this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 4);

		this.b1.connect(this.output);

		this.b1.normalize(-1, 1);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 22
	perc22: function(){

		this.duration = 1;

		this.fund = 432*0.25;
		this.rate = 2;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.bw = 50;
		this.cA = [1, 1.859375, 3.734375];

		for(var i=0; i<this.cA.length; i++){

			for(var j=0; j<this.bw; j++){

				if(j<parseInt(this.bw*0.5)){
					this.b2.addSine(j+(this.fund-parseInt(this.bw*0.5)), randomFloat(0.25, 1)*(j/(parseInt(this.bw*0.5))));
				};

				if(j>=parseInt(this.bw*0.5)){
					this.b2.addSine(j+this.fund, randomFloat(0.25, 1)*(this.bw-j)/parseInt(this.bw*0.5));
				};

				this.b2.addSine(j+parseInt(this.fund*this.cA[i]), randomFloat(0.5, 1));

			}

		}

		this.b1.addBuffer(this.b2.buffer);
		this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 4);

		this.b1.connect(this.output);

		this.b1.normalize(-1, 1);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset23
	perc23: function(){

		this.duration = 1;

		this.fund = 432*0.25;
		this.rate = 2;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.bw = 50;
		this.cA = [1, 1.859375, 3.734375];

		for(var i=0; i<this.cA.length; i++){

			for(var j=0; j<this.bw; j++){

				if(j<parseInt(this.bw*0.5)){
					this.b2.addSine(j+(this.fund-parseInt(this.bw*0.5)), randomFloat(0.25, 1)*(j/(parseInt(this.bw*0.5))));
				};

				if(j>=parseInt(this.bw*0.5)){
					this.b2.addSine(j+this.fund, randomFloat(0.25, 1)*(this.bw-j)/parseInt(this.bw*0.5));
				};

			}

		}

		this.b1.addBuffer(this.b2.buffer);
		this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 4);

		this.b1.connect(this.output);

		this.b1.normalize(-1, 1);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset24 (whisper shake)
	perc24: function(){

		this.duration = 1;

		this.rate = 16;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.cF = 100;
		this.bW = 100;
		this.hB = parseInt(this.bW*0.5);

		for(var i=0; i<this.bW; i++){

			this.b1.addSine(i+(this.cF-this.hB), randomFloat(0.25, 1));

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.5, 0.5, 1, 1);

		this.b1.connect(this.output);


		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 25 (block)
	perc25: function(){

		this.duration = 1;

		this.rate = 8;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.cF = 100;
		this.bW = 100;
		this.hB = parseInt(this.bW*0.5);

		for(var i=0; i<this.bW; i++){

			this.b1.addSine(i+(this.cF-this.hB), randomFloat(0.25, 1));

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.1, 0.2, 0.1, 16);

		this.b1.connect(this.output);


		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 26 (hi tuned tom)
	perc26: function(){

		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.cF = 400;
		this.bW = 200;
		this.hB = parseInt(this.bW*0.5);

		for(var i=0; i<this.bW; i++){

			this.b1.addSine(i+(this.cF-this.hB), 1);

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.1, 0.2, 0.1, 16);

		this.b1.connect(this.output);


		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 27 (muted layer)
	perc27: function(){

		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.cF = 200;
		this.bW = 200;
		this.hB = parseInt(this.bW*0.5);

		for(var i=0; i<this.bW; i++){

			this.b1.addSine(i+(this.cF-this.hB), 1);

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.1, 0.3, 0.1, 8);

		this.b1.connect(this.output);


		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 28 (reso click)
	perc28: function(){

		this.duration = 1;

		this.rate = 2;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.cF = 3000;
		this.bW = 500;
		this.hB = parseInt(this.bW*0.5);

		for(var i=0; i<this.bW; i++){

			this.b1.addSine(i+(this.cF-this.hB), randomFloat(0.25, 1));

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.1, 0.3, 0.1, 8);

		this.b1.connect(this.output);


		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 29 (formant click);
	perc29: function(){

		this.duration = 1;

		this.rate = 2;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.cFA = [3000, 2000];
		this.bW = 500;
		this.hB = parseInt(this.bW*0.5);

		for(var i=0; i<this.cFA.length; i++){

				for(var j=0; j<this.bW; j++){

					this.b1.addSine(j+(this.cFA[i]-this.hB), randomFloat(0.25, 1));

				}

			}

			this.b1.normalize(-1, 1);

			this.b1.applyRamp(0, 1, 0.1, 0.3, 0.1, 8);

			this.b1.connect(this.output);


			this.startArray = [this.b1];

			bufferGraph(this.b1.buffer);

		},

	// perc 30 (sticks)
	perc30: function(){

		this.duration = 1;

		this.rate = 2;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 1000;
		this.iA = [3, 2];
		this.bWA = [100, 100];

		for(var i=0; i<this.iA.length; i++){

			for(var j=0; j<this.bWA[i]; j++){

				this.b1.addSine(j+((this.fund*this.iA[i])-(this.bWA[i]*0.5)), randomFloat(0.25, 1));

			}

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.1, 0.3, 0.1, 8);

		this.b1.connect(this.output);


		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 31
	perc31: function(){

		this.duration = 1;

		this.rate = 2;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 200;
		this.iA = [2, 3, 4, 1];
		this.bWA = [50, 20, 30, 70];

		for(var i=0; i<this.iA.length; i++){

				for(var j=0; j<this.bWA[i]; j++){

					this.b1.addSine(j+((this.fund*this.iA[i])-(this.bWA[i]*0.5)), randomFloat(0.25, 1));

				}

			}

			this.b1.normalize(-1, 1);

			this.b1.applyRamp(0, 1, 0.1, 0.3, 0.1, 8);

			this.b1.connect(this.output);


			this.startArray = [this.b1];

			bufferGraph(this.b1.buffer);

		},

	// preset 32
	perc32: function(){

		this.duration = 1;

		this.rate = 4;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 100;
		this.iA = [1, 9.10714286, 10.3571429];
		this.bWA = [100, 100, 100];

		for(var i=0; i<this.iA.length; i++){

			for(var j=0; j<this.bWA[i]; j++){

				this.b1.addSine(j+((this.fund*this.iA[i])-(this.bWA[i]*0.5)), randomFloat(0.25, 1));

			}

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.1, 0.3, 0.1, 8);

		this.b1.connect(this.output);


		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 33
	perc33: function(){

		this.duration = 1;

		this.rate = 4;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 25;
		this.iA = [1, 9.10714286, 10.3571429, 4.75, 6.375, 3.218181818181818, 4.527272727272727];
		this.bWA = [20, 20, 20, 20, 20, 20, 20];

		for(var i=0; i<this.iA.length; i++){

				for(var j=0; j<this.bWA[i]; j++){

					this.b1.addSine(j+((this.fund*this.iA[i])-(this.bWA[i]*0.5)), randomFloat(0.25, 1));

				}

			}

			this.b1.normalize(-1, 1);

			this.b1.applyRamp(0, 1, 0.1, 0.3, 0.1, 8);

			this.b1.connect(this.output);


			this.startArray = [this.b1];

			bufferGraph(this.b1.buffer);

		},

	// preset 34 (reso tom)
	perc34: function(){

		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 100;
		this.sL = 3;

		this.iS = new Sequence();
		this.iA = [1, 2.405797101449275, 3.608695652173913];
		this.bWS = new Sequence();

		this.iS.urnSelect(this.sL, this.iA);
		this.bWS.randomInts(this.sL, 100, 100);

		this.iS = this.iS.sequence;
		this.bWS = this.bWS.sequence;

		for(var i=0; i<this.iS.length; i++){

			for(var j=0; j<this.bWS[i]; j++){

				this.b1.addSine(j+((this.fund*this.iS[i])-(this.bWS[i]*0.5)), randomFloat(0.5, 1));

			}

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 8);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 35 (knife tom)
	perc35: function(){

		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 40;

		this.iA = [1, 2, 3, 4];
		this.bwA = [6, 8, 10, 20];
		this.gA = [1, 1, 1, 1];

		for(var i=0; i<this.iA.length; i++){

			for(var j=0; j<parseInt(this.bwA[i]); j++){

				this.f = j+((this.fund*this.iA[i])-(parseInt(this.bwA[i]*0.5)));
				this.b1.addSine(this.f, 1);
				this.b1.addSine(this.f*randomFloat(0.99, 1.01), 1);

			}

		}

		this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 4);

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 36 (formant block)
	perc36: function(){

		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 100;

		this.iA = [1, 1.859375, 3.734375, 9.10714286, 10.3571429, 4.75, 6.375, 3.218181818181818, 4.527272727272727, 2.405797101449275, 3.608695652173913];
		this.bwA = [25, 25, 25, 25, 25];
		this.gA = [1, 1, 1, 1, 1];

		for(var i=0; i<this.iA.length; i++){

			this.rBW = randomInt(25, 45);

			for(var j=0; j<this.rBW; j++){

				this.f = j+((this.fund*this.iA[i])-(parseInt(this.rBW*0.5)));
				this.b1.addSine(this.f, 1);
				this.b1.addSine(this.f*randomFloat(0.99, 1.01), 1);

			}

		}

		this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 4);

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// start instrument immediately
	start: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].start();
		}
	},

	// stop instrument immediately
	stop: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stop();
		}
	},

	// start instrument at specified time (in seconds)
	startAtTime: function(time){

		this.time = time;

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].startAtTime(this.time);
		}

	},

	// stop instrument at specified time (in seconds)
	stopAtTime: function(time){

		this.time = time;

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stopAtTime(this.time);
		}

	},

	// connect the output node of this object to the input of another
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

// collection of commonly used pitched sounds
function PitchedPresets(){

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();
	this.startArray = [];

}

PitchedPresets.prototype = {

	input: this.input,
	output: this.output,
	startArray: this.startArray,

	// instrument preset template
	instrumentMethod: function(){
		this.startArray = [];
	},

	// preset 1
	pitch1: function(){

		this.duration = 2;

		this.fund = 432;
		this.rate = 0.5;
		this.cFA = [1];
		this.mFA = [2];
		this.gVA = [1];
		this.mGA = [1];
		this.pPA = [0.0001];
		this.uEA = [0.1];
		this.dEA = [8];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("pitched preset 1");

	},

	// preset 2
	pitch2: function(){

		this.duration = 2;

		this.fund = 432;
		this.rate = 0.5;
		this.cFA = [1, 1, 5];
		this.mFA = [2, 3, 7];
		this.gVA = [1, 1, 0.5];
		this.mGA = [0.5, 1, 0.5];
		this.pPA = [0.0001, 0.001, 0.0002];
		this.uEA = [0.1, 0.1, 0.1];
		this.dEA = [8, 16, 32];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("pitched preset 2");

	},

	// preset 3
	pitch3: function(){

		this.duration = 2;

		this.fund = 432*0.25;
		this.rate = 0.5;
		this.cFA = [1, 1, 5];
		this.mFA = [2, 3, 7];
		this.gVA = [1, 1, 0.5];
		this.mGA = [0.5, 1, 0.5];
		this.pPA = [0.5, 0.6, 0.7];
		this.uEA = [1, 2, 4];
		this.dEA = [1.1, 2.1, 1.7];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("pitched preset 3");

	},

	// preset 4 (bell key)
	pitch4: function(){

		this.duration = 1;

		this.fund = 432*1;
		this.rate = 1.25;
		this.cFA = [100, 1];
		this.mFA = [100, 3];
		this.gVA = [2100, 0.5];
		this.mGA = [0.25, 1];
		this.pPA = [0.001, 0.002];
		this.uEA = [0.1, 0.3];
		this.dEA = [16, 8];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("pitched preset 4");

	},

	// preset 5
	pitch5: function(){

		this.duration = 1;

		this.fund = 432*1;
		this.rate = 1;
		this.cFA = [0.1];
		this.mFA = [0.5];
		this.gVA = [1];
		this.mGA = [1];
		this.pPA = [0.1];
		this.uEA = [0.1];
		this.dEA = [8];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("pitched preset 5");

	},

	// preset 6 (bass)
	pitch6: function(){

		this.duration = 1;

		this.fund = 432*1;
		this.rate = 1;
		this.cFA = [0.1];
		this.mFA = [0.2];
		this.gVA = [1];
		this.mGA = [1];
		this.pPA = [0.1];
		this.uEA = [0.1];
		this.dEA = [8];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("pitched preset 6");

	},

	// preset 7 (pad)
	pitch7: function(){

		this.duration = 8;

		this.fund = 500/M2;
		this.rate = 0.125;
		this.cFA = [1, 3, 5, 4];
		this.mFA = [1, 3, 5, 4];
		this.gVA = [0.3, 0.3, 0.3, 0.3];
		this.mGA = [1, 1, 1, 1];
		this.pPA = [0.5, 0.5, 0.5, 0.5];
		this.uEA = [1, 1, 1, 1];
		this.dEA = [1, 1, 1, 1];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.f = new MyBiquad("lowpass", 5000, 1);

		this.b1.connect(this.f);
		this.f.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

		console.log("pitched preset 7");

	},

	// preset 8 ("i" bell)
	pitch8: function(){

		this.duration = 1;

		this.fund = 500;
		this.rate = 2;
		this.cFA = [1, 9.10714286, 10.3571429];
		this.mFA = [1, 9.10714286, 10.3571429];
		this.gVA = [1, 1, 1];
		this.mGA = [1, 0.025, 0.05];
		this.pPA = [0.01, 0.01, 0.01];
		this.uEA = [0.1, 0.1, 0.1];
		this.dEA = [16, 8, 4];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("pitched preset 8");

	},

	// preset 9 (short key)
	pitch9: function(){

		this.duration = 1;

		this.fund = 500;
		this.rate = 2;
		this.cFA = [1, 4.75, 6.375];
		this.mFA = [1, 9.10714286, 10.3571429];
		this.gVA = [1, 1, 1];
		this.mGA = [1, 0.025, 0.05];
		this.pPA = [0.01, 0.01, 0.01];
		this.uEA = [0.1, 0.1, 0.1];
		this.dEA = [16, 16, 16];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("pitched preset 9");

	},

	// preset 10 ("I" bell)
	pitch10: function(){

		this.duration = 1;

		this.fund = 500;
		this.rate = 1;
		this.cFA = [1, 4.75, 6.375];
		this.mFA = [1, 4.75, 6.375];
		this.gVA = [0.25, 0.25, 0.25];
		this.mGA = [1, 1, 1];
		this.pPA = [0.01, 0.01, 0.01];
		this.uEA = [0.1, 0.1, 0.1];
		this.dEA = [16, 16, 16];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("pitched preset 10")

	},

	// preset 11 (rich bowl)
	pitch11: function(){

		this.duration = 4;

		this.fund = 250;
		this.rate = 0.25;
		this.cFA = [1, 3.218181818181818, 4.527272727272727];
		this.mFA = [10.3571429, 1, 9.10714286];
		this.gVA = [1, 1, 1];
		this.mGA = [1, 1, 1];
		this.pPA = [0.01, 0.01, 0.01];
		this.uEA = [0.1, 0.1, 0.1];
		this.dEA = [16, 16, 16];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("pitched preset 11")

	},

	// preset 12 (fm horn)
	pitch12: function(){

		this.duration = 1;

		this.fund = 432*m2*P4;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = 1;

		this.b2.makeFm(this.fund, this.fund, 1*0.25);
		this.b2.applyRamp(0, 1, 0.1, 0.1, 4, 8);

		this.b1.addBuffer(this.b2.buffer);

		this.b1.connect(this.output);

		bufferGraph(this.b1.buffer);

		this.startArray = [this.b1];

		console.log("pitched preset 12");

	},

	// preset13 (cloud bowl)
	pitch13: function(){

		this.duration = 1;

		this.fund = 432*m2*P4*0.5;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = 1;

		this.b2.addSine(this.fund*4, 1);
		this.b2.applyRamp(0, 1, 0.01, 0.01, 0.1, 8);
		this.b2.multiply(0.125);

		// this.b1.addBuffer(this.b2.buffer);

		this.b2.addSine(this.fund*8, 1);
		this.b2.applyRamp(0, 1, 0.01, 0.01, 0.1, 8);
		this.b2.multiply(0);

		this.b1.addBuffer(this.b2.buffer);

		this.b2.makeFm(this.fund, this.fund, 1*0.25);
		this.b2.applyRamp(0, 1, 0.01, 0.01, 4, 8);

		this.b1.addBuffer(this.b2.buffer);

		this.b2.makeAm(this.fund*1, 10, 1);
		this.b2.applyRamp(0, 1, 0.01, 0.01, 0.1, 16);
		this.b2.multiply(0.125);

		this.b1.addBuffer(this.b2.buffer);

		this.b1.connect(this.output);

		bufferGraph(this.b1.buffer);

		this.startArray = [this.b1];

		console.log("pitched preset 13");

	},

	// preset14 (wave sequence pad)
	pitch14: function(){

		this.duration = 8;

		this.fund = 432*m2*P4*4;
		this.iArray = [1/m2, 1, 1/P4, 1/m6];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = 0.125;
		this.rP;

		for(var i=0; i<this.iArray.length; i++){

			this.rP = randomFloat(0.3, 0.8);

			this.b2.addSine(this.fund*this.iArray[i]*randomArrayValue([1, 2, 4]), 1);
			this.b2.applyRamp(0, 1, this.rP, this.rP, randomFloat(0.5, 4), randomFloat(0.5, 4));
			this.b2.multiply(randomFloat(0.03125, 0.0625));

			this.b1.addBuffer(this.b2.buffer);

			this.b2.makeFm(this.fund*this.iArray[i], this.fund*this.iArray[i]*randomArrayValue([0.5, 0.25]), 1*randomFloat(0.25, 0.5));
			this.b2.applyRamp(0, 1, this.rP, this.rP, randomFloat(0.5, 4), randomFloat(0.5, 4));
			this.b2.multiply(randomFloat(0.25, 0.35));

			this.b1.addBuffer(this.b2.buffer);

			this.b2.makeAm(this.fund*this.iArray[i], randomInt(5, 20), 1);
			this.b2.applyRamp(0, 1, this.rP, this.rP, randomFloat(0.5, 4), randomFloat(0.5, 4));
			this.b2.multiply(randomFloat(0.5, 1));

			this.b1.addBuffer(this.b2.buffer);

		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		bufferGraph(this.b1.buffer);

		this.startArray = [this.b1];

		console.log("pitched preset 14");

	},

	// preset15 (wave sequence pad 2)
	pitch15: function(fund, iArray){

		this.duration = 8;

		this.fund = 432*m2*P4*4;
		this.iArray = [1/m2, 1, 1/P4, 1/m6];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);

		this.b1.playbackRate = 0.125;

		this.rP;

		for(var i=0; i<this.iArray.length; i++){

			this.rP = randomFloat(0.3, 0.8);

			this.b2.makeFm(this.fund*this.iArray[i]*0.5, this.fund*this.iArray[i]*0.25, 0.5);
			this.b2.applyRamp(0, 1, this.rP, this.rP, randomFloat(0.5, 4), randomFloat(0.5, 4));
			this.b2.multiply(randomFloat(0.25, 0.35));

			this.b1.addBuffer(this.b2.buffer);

			this.b2.makeFm(this.fund*this.iArray[i]*1, this.fund*this.iArray[i]*1, 0.2);
			this.b2.applyRamp(0, 1, this.rP, this.rP, randomFloat(0.5, 4), randomFloat(0.5, 4));
			this.b2.multiply(randomFloat(0.0625, 0.125));

			this.b1.addBuffer(this.b2.buffer);

			this.b2.makeFm(this.fund*this.iArray[i]*1, this.fund*this.iArray[i]*0.5, 0.2);
			this.b2.applyRamp(0, 1, this.rP, this.rP, randomFloat(0.5, 4), randomFloat(0.5, 4));
			this.b2.multiply(randomFloat(0.0625, 0.125));

			this.b1.addBuffer(this.b2.buffer);

			this.b2.makeAm(this.fund*this.iArray[i], randomInt(5, 20), 1);
			this.b2.applyRamp(0, 1, this.rP, this.rP, randomFloat(0.5, 4), randomFloat(0.5, 4));
			this.b2.multiply(randomFloat(0.5, 1));

			this.b1.addBuffer(this.b2.buffer);

		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		bufferGraph(this.b1.buffer);

		this.startArray = [this.b1];

		console.log("pitched preset 14");

	},

	// preset16 (wave sequence pad 3)
	pitch16: function(fund, iArray){

		this.duration = 8;

		this.fund = 432*m2*P4*4;
		this.iArray = [1, M3, P5, 2];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);

		this.b1.playbackRate = 0.125;

		this.rP;

		for(var i=0; i<this.iArray.length; i++){

			this.rP = randomFloat(0.3, 0.8);

			this.b2.makeFm(this.fund*this.iArray[i]*0.5, this.fund*this.iArray[i]*0.25, 0.5);
			this.b2.applyRamp(0, 1, this.rP, this.rP, randomFloat(0.5, 4), randomFloat(0.5, 4));
			this.b2.multiply(randomFloat(0.25, 0.35));

			this.b1.addBuffer(this.b2.buffer);

			this.b2.makeFm(this.fund*this.iArray[i]*1, this.fund*this.iArray[i]*1, 0.2);
			this.b2.applyRamp(0, 1, this.rP, this.rP, randomFloat(0.5, 4), randomFloat(0.5, 4));
			this.b2.multiply(randomFloat(0.0625, 0.125));

			this.b1.addBuffer(this.b2.buffer);

			this.b2.makeFm(this.fund*this.iArray[i]*1, this.fund*this.iArray[i]*0.5, 0.2);
			this.b2.applyRamp(0, 1, this.rP, this.rP, randomFloat(0.5, 4), randomFloat(0.5, 4));
			this.b2.multiply(randomFloat(0.0625, 0.125));

			this.b1.addBuffer(this.b2.buffer);

			this.b2.makeAm(this.fund*this.iArray[i], randomInt(5, 20), 1);
			this.b2.applyRamp(0, 1, this.rP, this.rP, randomFloat(0.5, 4), randomFloat(0.5, 4));
			this.b2.multiply(randomFloat(0.5, 1));

			this.b1.addBuffer(this.b2.buffer);

		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		bufferGraph(this.b1.buffer);

		this.startArray = [this.b1];

		console.log("pitched preset 16");

	},

	// preset17 (steel drum)
	pitch17: function(){

		this.duration = 1;

		this.fund = 432;
		this.rate = 1;
		this.cArray = [1, 2, 4, P5*2];
		this.mArray = [10, 5, 3, 4];
		this.hGArray = [1, 0.5, 0.25, 0.15];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cArray.length; i++){

			this.b2.makeAm(this.fund*this.cArray[i], this.mArray[i], 1);
			this.b2.applyRamp(0, 1, 0.01, 0.01, 0.001, 3);
			this.b2.multiply(this.hGArray[i]);

			this.b1.addBuffer(this.b2.buffer);

		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

		console.log("pitched preset 17");

	},

	// preset18 (fm chord key)
	pitch18: function(){

		this.duration = 1;

		this.fund = 432*0.125;
		this.rate = 1;
		this.cArray = [1, 2, 4, 3, P5, M3];
		this.mArray = [1, 2, 4, 3, P5, M3];
		this.hGArray = [1, 0.5, 0.25, 0.15, 0.2, 0.3];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cArray.length; i++){

			this.b2.makeFm(this.fund*this.cArray[i], this.fund*this.mArray[i], 0.3);
			this.b2.applyRamp(0, 1, 0.01, 0.01, 0.001, 3);
			this.b2.multiply(this.hGArray[i]);

			this.b1.addBuffer(this.b2.buffer);

		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

		console.log("pitched preset 18");

	},

	// preset 19 (noise tone)
	pitch19: function(){

		this.duration = 1;

		this.fund = 432*0.0625;
		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);

		this.b1.playbackRate = this.rate;

		//

		this.cF = 500;
		this.bW = 500;
		this.lF = parseInt(this.cF-(this.bW*0.5));
		this.hF = parseInt(this.cF+(this.bW*0.5));

		for(var i=0; i<this.bW; i++){

			if(i<parseInt(this.bW*0.5)){
				this.b1.addSine(i+this.lF, Math.pow(i/(this.bW*0.5)*randomFloat(0.5, 1), 16));
			}

			else if(i>=parseInt(this.bW*0.5)){
				this.b1.addSine((i-(this.bW*0.5))+this.cF, Math.pow(((this.bW*0.5)-i)/(this.bW*0.5)*randomFloat(0.5, 1), 16));
			}


		}

		this.b1.applyRamp(0, 1, 0.5, 0.5, 1, 1);

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 20 (am chord)
	pitch20: function(){

		this.duration = 1;

		this.fund = 432;
		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);

		this.b1.playbackRate = this.rate;

		this.iArray = [1, M3, P5, 2];

		for(var i=0; i<this.iArray.length; i++){
			this.b1.addSine(this.fund*this.iArray[i], 1);
		}

		for(var i=0; i<this.iArray.length; i++){
			this.b2.addSine(this.fund*this.iArray[i]*randomFloat(0.99, 1.01), 1);
		}

		this.b1.subtractBuffer(this.b2.buffer);

		this.b1.applyRamp(0, 1, 0.5, 0.5, 1, 1);

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 21 (mallet horn)
	pitch21: function(){

		this.duration = 2;

		this.fund = 432*0.5;
		this.rate = 0.5;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b3 = new MyBuffer(1, 1, audioCtx.sampleRate);

		this.b1.playbackRate = this.rate;

		this.iArray = [1, M3, P5, 2];

		for(var i=0; i<this.iArray.length; i++){
			this.b3.makeFm(this.fund*this.iArray[i], this.fund*this.iArray[i], 1);
			this.b1.addBuffer(this.b3.buffer);
		}

		for(var i=0; i<this.iArray.length; i++){
			this.b2.makeAm(this.fund*this.iArray[i]*randomFloat(0.99, 1.01), this.fund*this.iArray[i]*randomFloat(0.99, 1.01), randomFloat(0.25, 0.5));
			this.b2.applyRamp(randomFloat(0, 0.35), randomFloat(0.6, 1), randomFloat(0.35, 0.5), randomFloat(0.5, 0.75), randomFloat(0.5, 3), randomFloat(0.5, 3));
			this.b1.subtractBuffer(this.b2.buffer);
		}

		this.f1 = new MyBiquad("lowpass", 3000, 1);

		this.b1.applyRamp(0, 1, 0.01, 0.02, 3, 8);

		this.b1.normalize(-1, 1);

		this.b1.connect(this.f1);
		this.f1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 22 (fm horn swell)
	pitch22: function(){

		this.duration = 2;

		this.fund = 432*0.5;
		this.rate = 0.5;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b3 = new MyBuffer(1, 1, audioCtx.sampleRate);

		this.b1.playbackRate = this.rate;

		this.iArray = [1, M3, P5, 2];

		for(var i=0; i<this.iArray.length; i++){
			this.b3.makeFm(this.fund*this.iArray[i], this.fund*this.iArray[i], 1);
			this.b1.addBuffer(this.b3.buffer);
		}

		for(var i=0; i<this.iArray.length; i++){
			this.b2.makeAm(this.fund*this.iArray[i]*randomFloat(0.99, 1.01), this.fund*this.iArray[i]*randomFloat(0.99, 1.01), randomFloat(0.25, 0.5));
			this.b2.applyRamp(randomFloat(0, 0.35), randomFloat(0.6, 1), randomFloat(0.35, 0.5), randomFloat(0.5, 0.75), randomFloat(0.5, 3), randomFloat(0.5, 3));
			this.b1.subtractBuffer(this.b2.buffer);
		}

		this.f1 = new MyBiquad("lowpass", 3000, 1);

		this.b1.applyRamp(0, 1, 0.5, 0.5, 1, 1);

		this.b1.normalize(-1, 1);

		this.b1.connect(this.f1);
		this.f1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 23
	pitch23: function(){

		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 40;

		this.intA = [1, 1.5];
		this.nHA =  [1, 4];

		for(var i=0; i<this.intA.length; i++){

				for(var j=0; j<this.nHA[i]+1; j++){

					this.b1.addSine(this.fund*(this.intA[i]*j), 1/j);

				}

			}

			this.b1.normalize(-1, 1);

			this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 8);

			this.b1.connect(this.output);

			this.startArray = [this.b1];

			bufferGraph(this.b1.buffer);

		},

	// preset 24
	pitch24: function(){

		this.duration = 1;

		this.rate = 2;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 100;

		this.intA = [1, 1.7, 3];
		this.nHA =  [1, 10, 11];
		this.gA = [1, 1, 0.5];

		for(var i=0; i<this.intA.length; i++){

			for(var j=0; j<this.nHA[i]+1; j++){

				this.b1.addSine(this.fund*(this.intA[i]*j), this.gA[i]/j);

			}

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 8);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 25
	pitch25: function(){

		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 100;

		this.intA = [1, 1.7];
		this.nHA =  [3, 5];
		this.gA =   [1, 1];

		for(var i=0; i<this.intA.length; i++){

				for(var j=0; j<this.nHA[i]+1; j++){

					this.b1.addSine(this.fund*(this.intA[i]*j), this.gA[i]/j);
					this.b1.addSine(this.fund*(this.intA[i]*j)*randomFloat(0.99, 1.01), this.gA[i]/j);

				}

			}

			this.b1.normalize(-1, 1);

			this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 8);

			this.b1.connect(this.output);

			this.startArray = [this.b1];

			bufferGraph(this.b1.buffer);

		},

	// preset 26 (warm pad)
	pitch26: function(){

		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 100;

		this.intA = [1, 1.7];
		this.nHA =  [3, 5];
		this.gA =   [1, 1];

		for(var i=0; i<this.intA.length; i++){

			for(var j=0; j<this.nHA[i]+1; j++){

				this.b1.addSine(this.fund*(this.intA[i]*j), this.gA[i]/j);
				this.b1.addSine(this.fund*(this.intA[i]*j)*randomFloat(0.99, 1.01), this.gA[i]/j);

			}

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.5, 0.5, 1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 27 (warm pad 2)
	pitch27: function(){

		this.duration = 4;

		this.rate = 0.25;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 400;

		this.intA = [1, 1.5];
		this.nHA =  [3, 5];
		this.gA =   [1, 1];

		for(var i=0; i<this.intA.length; i++){

				for(var j=0; j<this.nHA[i]+1; j++){

					this.b1.addSine(this.fund*(this.intA[i]*j), this.gA[i]/j);
					this.b1.addSine(this.fund*(this.intA[i]*j)*randomFloat(0.99, 1.01), this.gA[i]/j);

				}

			}

			this.b1.normalize(-1, 1);

			this.b1.applyRamp(0, 1, 0.5, 0.5, 1, 1);

			this.b1.connect(this.output);

			this.startArray = [this.b1];

			bufferGraph(this.b1.buffer);

		},

	// preset 28 (nice pad)
	pitch28: function(){

		this.duration = 4;

		this.rate = 0.25;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 400/m2/P5;

		this.intA = [1, 2.405797, 3.608695652173913];
		this.nHA =  [3, 5, 3];
		this.gA =   [1, 1, 1];

		for(var i=0; i<this.intA.length; i++){

				for(var j=0; j<this.nHA[i]+1; j++){

					this.b1.addSine(this.fund*(this.intA[i]*j), this.gA[i]/j);
					this.b1.addSine(this.fund*(this.intA[i]*j)*randomFloat(0.99, 1.01), this.gA[i]/j);

				}

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.5, 0.5, 1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 29 (heaven pad)
	pitch29: function(){

		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 400/m2/P5;

		this.intA = [1, 2.405797, 3.608695652173913];
		this.nHA =  [3, 5, 3];
		this.gA =   [1, 1, 1];

		for(var i=0; i<this.intA.length; i++){

				for(var j=0; j<this.nHA[i]+1; j++){

					this.b1.addSine(this.fund*(this.intA[i]*j), this.gA[i]/j);
					this.b1.addSine(this.fund*(this.intA[i]*j)*randomFloat(0.99, 1.01), this.gA[i]/j);

				}

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.5, 0.5, 1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 30 (sequence shape mallet)
	pitch30: function(){

	this.fund = 400/m2/P5;

	this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
	this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
	this.b1.playbackRate = 1;

	this.b2.addSine(this.fund*4, 1);
	this.b2.applyRamp(0, 1, 0.01, 0.01, 0.1, 8);
	this.b2.multiply(0.125);

	this.b2.addSine(this.fund*8, 1);
	this.b2.applyRamp(0, 1, 0.01, 0.01, 0.1, 8);
	this.b2.multiply(0);

	this.b1.addBuffer(this.b2.buffer);

	this.b2.makeFm(this.fund, this.fund, 1*0.25);
	this.b2.applyRamp(0, 1, 0.01, 0.01, 4, 8);

	this.b1.addBuffer(this.b2.buffer);

	this.b2.makeAm(this.fund*1, randomInt(5, 20), 1);
	this.b2.applyRamp(0, 1, 0.01, 0.01, 0.1, 16);
	this.b2.multiply(0.125);

	this.b1.addBuffer(this.b2.buffer);

	this.w = new Effect();
	this.w.fmShaper(this.fund*1, this.fund*0.5, 0.001);
	this.w.on();
	this.w.output.gain.value = 0.8;

	//

	this.b1.normalize(-1, 1);

	this.b1.connect(this.w);
	this.w.connect(this.output);

	this.startArray = [this.b1];

},

	// preset 31 (sequence shape horn)
	pitch31: function(){

		this.fund = 400/m2/P5;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = 1;

		this.b2.addSine(this.fund*4, 1);
		this.b2.applyRamp(0, 1, 0.075, 0.075, 3, 8);
		this.b2.multiply(0.125);

		this.b2.addSine(this.fund*8, 1);
		this.b2.applyRamp(0, 1, 0.075, 0.075, 4, 8);
		this.b2.multiply(0);

		this.b1.addBuffer(this.b2.buffer);

		this.b2.makeFm(this.fund, this.fund, 1*0.25);
		this.b2.applyRamp(0, 1, 0.075, 0.075, 4, 8);

		this.b1.addBuffer(this.b2.buffer);

		this.b2.makeAm(this.fund*1, randomInt(5, 20), 1);
		this.b2.applyRamp(0, 1, 0.075, 0.075, 2, 16);
		this.b2.multiply(0.125);

		this.b1.addBuffer(this.b2.buffer);

		this.w = new Effect();
		this.w.fmShaper(this.fund*1, this.fund*0.25, 0.00175);
		this.w.on();
		this.w.output.gain.value = 0.5;

		//

		this.b1.normalize(-1, 1);

		this.b1.connect(this.w);
		this.w.connect(this.output);

		this.startArray = [this.b1];

	},

	// preset 32 (ominous low)
	pitch32: function(){

		this.duration = 4;

		this.rate = 0.25;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 400/P4*0.5;

		this.intA = [1];
		this.nHA =  [10];
		this.gA =   [1];

		for(var i=0; i<this.intA.length; i++){

				for(var j=0; j<this.nHA[i]+1; j++){

					this.b1.addSine(this.fund*(this.intA[i]*j), this.gA[i]/j);
					this.b1.applySine(this.fund*(this.intA[i]*j)*randomFloat(0.99, 1.01), this.gA[i]/j);

				}

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.5, 0.5, 1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 33 (struck pluck)
	pitch33: function(){

		this.duration = 4;

		this.rate = 0.25;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 400/P4*2;

		this.intA = [1, 3];
		this.nHA =  [20, 10];
		this.gA =   [1, 0.5];

		for(var i=0; i<this.intA.length; i++){

				for(var j=0; j<this.nHA[i]+1; j++){

					this.b2.makeConstant(0);

					this.b2.addSine(this.fund*(this.intA[i]*j), this.gA[i]/j);
					this.b2.addSine(this.fund*(this.intA[i]*j)*randomFloat(0.99, 1.01), this.gA[i]/j);

					this.b1.addBuffer(this.b2.buffer);

				}

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.01, 0.01, 0.1, 8);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 34 (rich and bright)
	pitch34: function(){

		this.rate = 0.25;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 400/P4*1;

		this.intA = [1, 3, 5];
		this.nHA =  [20, 10, 20];
		this.gA =   [1, 0.5, 0.25];

		for(var i=0; i<this.intA.length; i++){

				for(var j=0; j<this.nHA[i]+1; j++){

					this.b2.makeConstant(0);

					this.b2.addSine(this.fund*(this.intA[i]*j), this.gA[i]/j);
					this.b2.addSine(this.fund*(this.intA[i]*j)*randomFloat(0.99, 1.01), this.gA[i]/j);

					this.b1.addBuffer(this.b2.buffer);

				}

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.01, 0.01, 0.1, 8);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 35 (beautiful rich)
	pitch35: function(){

		this.rate = 0.125;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 400/P4*0.5;

		this.intA = [1, 3, 5];
		this.nHA =  [4, 4, 4];
		this.gA =   [1, 0.5, 0.25];

		for(var i=0; i<this.intA.length; i++){

				for(var j=0; j<this.nHA[i]+1; j++){

					this.b2.makeConstant(0);

					this.b2.addSine(this.fund*(this.intA[i]*j), this.gA[i]/j);
					this.b2.addSine(this.fund*(this.intA[i]*j)*randomFloat(0.99, 1.01), this.gA[i]/j);
					this.b2.applySine(this.fund*(this.intA[i]*j)*randomFloat(0.99, 1.01), this.gA[i]/j);

					this.b1.addBuffer(this.b2.buffer);

				}

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.5, 0.5, 1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 36 (wobble heaven key)
	pitch36: function(){

		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 0.5*400/m2/P5;

		this.intA = [1, 2.405797, 3.608695652173913];
		this.nHA =  [3, 5, 3];
		this.gA =   [1, 1, 1];

		for(var i=0; i<this.intA.length; i++){

				for(var j=0; j<this.nHA[i]+1; j++){

					this.b1.addSine(this.fund*(this.intA[i]*j), this.gA[i]/j);
					this.b1.addSine(this.fund*(this.intA[i]*j)*randomFloat(0.99, 1.01), this.gA[i]/j);

				}

			}

			this.b1.normalize(-1, 1);
			// this.b1.applyRamp(0, 1, 0.5, 0.5, 1, 1);

			this.b2.addSine(5, 1);
			this.b2.applyRamp(0, 1, 0.01, 0.02, 0.1, 6);

			this.b1.multiplyBuffer(this.b2.buffer);

			this.b1.connect(this.output);

			this.startArray = [this.b1];

			bufferGraph(this.b1.buffer);

		},

	// preset 37 (shaky noise key)
	pitch37: function(){

		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1.1, audioCtx.sampleRate);
		this.b3 = new MyBuffer(1, 1.1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 400/m2/P5;

		this.intA = [1, 2.405797, 3.608695652173913];
		this.nHA =  [3, 5, 3];
		this.gA =   [1, 1, 1];

		for(var i=0; i<this.intA.length; i++){

			for(var j=0; j<this.nHA[i]+1; j++){

				this.b1.addSine(this.fund*(this.intA[i]*j), this.gA[i]/j);
				this.b1.addSine(this.fund*(this.intA[i]*j)*randomFloat(0.99, 1.01), this.gA[i]/j);

			}

		}

		this.b1.normalize(-1, 1);

		for(var i=0; i<3; i++){

			this.b2.makeConstant(0);
			this.b2.addSine((this.fund*randomInt(1, 5))/randomFloat(20, 35), 1);
			this.b2.applyRamp(0, 1, randomFloat(0.01, 0.5), randomFloat(0.5, 0.7), randomFloat(0.1, 2), randomFloat(1, 6));

			this.b3.addBuffer(this.b2.buffer);

		}

		this.b1.multiplyBuffer(this.b3.buffer);

		this.b3.makeNoise();
		this.b3.multiply(0.01);

		this.b1.addBuffer(this.b3.buffer);

		this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 6);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 38 (rich dot)
	pitch38: function(){

		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 400;

		this.iA = [1, 2, 3, 4];
		this.bwA = [6, 8, 10, 20];
		this.gA = [1, 1, 1, 1];

		for(var i=0; i<this.iA.length; i++){

			for(var j=0; j<parseInt(this.bwA[i]); j++){

				this.f = j+((this.fund*this.iA[i])-(parseInt(this.bwA[i]*0.5)));
				this.b1.addSine(this.f, this.gA[i]);

			}

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 6);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 39 (formant organ)
	pitch39: function(){

		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 100;

		this.iA = [1, 2, 3, 4];
		this.bwA = [6, 8, 10, 20];
		this.gA = [1, 1, 1, 1];

		for(var i=0; i<this.iA.length; i++){

			for(var j=0; j<parseInt(this.bwA[i]); j++){

				this.f = j+((this.fund*this.iA[i])-(parseInt(this.bwA[i]*0.5)));
				this.b1.addSine(this.f, randomFloat(0.25, 1));
				this.b1.addSine(this.f*randomFloat(0.99, 1.01), randomFloat(0.25, 1));

			}

		}

		this.b1.applyRamp(0, 1, 0.5, 0.5, 2, 2);

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 40 (formant dot)
	pitch40: function(){

		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 200;

		this.iA = [1, 2, 3, 4];
		this.bwA = [6, 8, 10, 20];
		this.gA = [1, 1, 1, 1];

		for(var i=0; i<this.iA.length; i++){

			for(var j=0; j<parseInt(this.bwA[i]); j++){

				this.f = j+((this.fund*this.iA[i])-(parseInt(this.bwA[i]*0.5)));
				this.b1.addSine(this.f, randomFloat(0.25, 1));
				this.b1.addSine(this.f*randomFloat(0.99, 1.01), randomFloat(0.25, 1));

			}

		}

		this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 4);

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 41 (distorted dot)
	pitch41: function(){

		this.duration = 1;

		this.fund = 432*0.25;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = 4;

		this.f = new MyBiquad("notch", this.fund, 5);
		this.f2 = new MyBiquad("lowpass", 800, 1);

		this.w = new MyWaveShaper();
		this.w.makeSigmoid(20);

		this.w2 = new Effect();
		this.w2.fmShaper(this.fund*0.25, this.fund*0.5, 0.0005);
		this.w2.on();

		this.d = new Effect();
		this.d.randomEcho();
		this.d.on();
		this.d.output.gain.value = 0.3;

		this.d2 = new Effect();
		this.d2.randomShortDelay();
		this.d2.on();
		this.d2.output.gain.value = 0.4;

		this.cFA = [1,    1,   , 6.375];
		this.mFA = [4.75, 6.375, 1];
		this.mGA = [0.25, 0.25,  0.5];

		for(var i=0; i<this.cFA.length; i++){

			this.b2.makeFm(this.cFA[i]*this.fund, this.mFA[i]*this.fund, this.mGA[i]);
			this.b2.applyRamp(0, 1, 0.01, 0.02, 0.1, 10);

			this.b1.addBuffer(this.b2.buffer);

		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.f);
		this.f.connect(this.f2);
		this.f2.connect(this.w);
		this.w.connect(this.w2);

		this.w2.connect(this.d);
		this.w2.connect(this.d2);

		this.w2.connect(this.output);
		this.d.connect(this.output);
		this.d2.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 42 (detune key)
	pitch42: function(){

		this.duration = 1;

		this.fund = 300.9734898397411;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
	  this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = 1;

	  this.b1.connect(this.output);

	  this.nH = 10;

	  for(var i=0; i<this.nH; i++){

	    this.b2.addSine(this.fund*randomFloat(0.98, 1.02), 1);

	    this.b1.addBuffer(this.b2.buffer);

	  }

	  this.b1.normalize(-1, 1);

	  this.b1.applyRamp(0, 1, 0.1, 0.15, 0.1, 8);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 43 (detune fm)
	pitch43: function(){

		this.duration = 1;

		this.fund = 300.9734898397411*1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = 1;

		this.b1.connect(this.output);

		this.nH = 10;

		for(var i=0; i<this.nH; i++){

			this.b2.makeFm(this.fund*randomFloat(0.98, 1.02), this.fund*randomFloat(0.98, 1.02), randomFloat(0.5, 2));

			this.b1.addBuffer(this.b2.buffer);

		}

		this.b1.normalize(-1, 1);

  	this.b1.applyRamp(0, 1, 0.1, 0.12, 4, 8);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 44 (detune fm pad)
	pitch44: function(){

		this.duration = 4;

		this.fund = 300.9734898397411*1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = 0.25;

		this.b1.connect(this.output);

		this.cArray = [1, 2, 2*P5, 4];
		this.nH = 10;

		for(var i=0; i<this.cArray.length; i++){

	    for(var j=0; j<this.nH; j++){

	      this.b2.makeConstant(0);
	      this.b2.makeFm(this.fund*this.cArray[i]*randomFloat(0.98, 1.02), this.fund*this.cArray[i]*randomFloat(0.98, 1.02), randomFloat(0.1, 0.5));
	      this.b2.applySine(0.5*randomArrayValue([1, 2, 4]));

	      this.b1.addBuffer(this.b2.buffer);

	    }

	  }

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.5, 0.5, 2, 8);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset45 (sine formants)
	pitch45: function(){

		this.fund = 300.9734898397411*1;

		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.iA = [1, 2, 3];
		// this.bwA = [6, 8, 10, 20];
		this.gA = [1, 1, 1, 1];
		this.rBW;

		for(var i=0; i<this.iA.length; i++){

			this.rBW = 20;

			for(var j=0; j<this.rBW; j++){

				this.f = j+((this.fund*this.iA[i])-(this.rBW*0.5));

				this.b1.addSine(this.f, randomFloat(0.1, 1));
				this.b1.addSine(this.f*randomFloat(0.99, 1.01), 1);

			}

		}

		this.b1.applyRamp(0, 1, 0.5, 0.5, 2, 0.5);
		this.b1.applyRamp(0, 1, 0.5, 0.5, 2, 0.5);

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

	},

	// preset46 (sine formant key)
	pitch46: function(){

		this.fund = 300.9734898397411*1;

		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.iA = [1, 2, 3];
		// this.bwA = [6, 8, 10, 20];
		this.gA = [1, 1, 1, 1];
		this.rBW;

		for(var i=0; i<this.iA.length; i++){

			this.rBW = 20;

			for(var j=0; j<this.rBW; j++){

				this.f = j+((this.fund*this.iA[i])-(this.rBW*0.5));

				this.b1.addSine(this.f, randomFloat(0.1, 1));
				this.b1.addSine(this.f*randomFloat(0.99, 1.01), 1);

			}

		}

		// this.b1.applyRamp(0, 1, 0.5, 0.5, 2, 0.5);
		this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 4);

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

	},

	// start instrument immediately
	start: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].start();
		}
	},

	// stop instrument immediately
	stop: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stop();
		}
	},

	// start instrument at specified time (in seconds)
	startAtTime: function(time){

		this.time = time;

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].startAtTime(this.time);
		}

	},

	// stop instrument at specified time (in seconds)
	stopAtTime: function(time){

		this.time = time;

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stopAtTime(this.time);
		}

	},

	// connect the output node of this object to the input of another
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

// object within which to design signal-generating chains, which are
// stored as methods
function FXPresets(){

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();
	this.startArray = [];

}

FXPresets.prototype = {

	input: this.input,
	output: this.output,
	startArray: this.startArray,

	// instrument preset template
	instrumentMethod: function(){
		this.startArray = [];
	},

	// preset 1
	fx1: function(){

		this.duration = 1;

		this.fund = 432*0.25;
		this.rate = 3;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.n = 1;

		this.fmCFA = [21];
		this.fmMFA = [30];
		this.fmGVA = [10];
		this.fmMGA = [0.01, 0.1, 0.1];

		this.fmPPA = [0.5, 0.5, 0.75];
		this.fmUEA = [1,   1, 2];
		this.fmDEA = [1,   1, 2];

		this.amCFA = [1];
		this.amMFA = [2];
		this.amGVA = [1];
		this.amMGA = [1];

		this.rPPA = [0.2];
		this.rUEA = [32];
		this.rDEA = [32];
		this.rMGA = [0];

		for(var i=0; i<this.fmCFA.length; i++){
			this.b2.makeFm(this.fund*this.fmCFA[i], this.fund*this.fmMFA[i], this.fmGVA[i]);
			this.b2.applyRamp(0, 1, this.fmPPA[i], this.fmPPA[i], this.fmUEA[i], this.fmDEA[i]);
			this.b2.multiply(this.fmMGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 1");

	},

	// preset 2
	fx2: function(){

		this.duration = 1;

		this.fund = 432*0.25;
		this.rate = 3;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.n = 1;

		this.fmCFA = [21];
		this.fmMFA = [30];
		this.fmGVA = [10];
		this.fmMGA = [0.01, 0.1, 0.1];

		this.fmPPA = [0.5, 0.5, 0.75];
		this.fmUEA = [1,   1, 2];
		this.fmDEA = [1,   1, 2];

		this.amCFA = [1];
		this.amMFA = [2];
		this.amGVA = [1];
		this.amMGA = [1];

		this.rPPA = [0.2];
		this.rUEA = [32];
		this.rDEA = [32];
		this.rMGA = [0];

		for(var i=0; i<this.fmCFA.length; i++){
			this.b2.makeFm(this.fund*this.fmCFA[i], this.fund*this.fmMFA[i], this.fmGVA[i]);
			this.b2.applyRamp(0, 1, this.fmPPA[i], this.fmPPA[i], this.fmUEA[i], this.fmDEA[i]);
			this.b2.multiply(this.fmMGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 2");

	},

	// preset 3
	fx3: function(){

		this.duration = 1;

		this.fund = 432*0.25;
		this.rate = 2;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.n = 1;

		this.fmCFA = [11];
		this.fmMFA = [26];
		this.fmGVA = [17];
		this.fmMGA = [0.01];

		this.fmPPA = [0.5,  0.4, 0.9];
		this.fmUEA = [1,    16,  256];
		this.fmDEA = [1,  9,   2];

		this.amCFA = [1];
		this.amMFA = [2];
		this.amGVA = [1];
		this.amMGA = [1];

		this.rPPA = [0.2];
		this.rUEA = [32];
		this.rDEA = [32];
		this.rMGA = [0];

		for(var i=0; i<this.fmCFA.length; i++){
			this.b2.makeFm(this.fund*this.fmCFA[i], this.fund*this.fmMFA[i], this.fmGVA[i]);
			this.b2.applyRamp(0, 1, this.fmPPA[i], this.fmPPA[i], this.fmUEA[i], this.fmDEA[i]);
			this.b2.multiply(this.fmMGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 3");

	},

	// preset 4
	fx4: function(){

		this.duration = 1;

		this.fund = 432*0.125;
		this.rate = 2;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fmCFA = [11, 12, 13, 2];
		this.fmMFA = [26, 27, 28, 1];
		this.fmGVA = [17, 18, 19, 5];
		this.fmMGA = [0.01, 0.01, 0.01, 0.001];

		this.fmPPA = [0.2,  0.4, 0.9, 0.5];
		this.fmUEA = [2,    16,  1,   1];
		this.fmDEA = [256,  9,   2,   1];

		this.amCFA = [1];
		this.amMFA = [2];
		this.amGVA = [1];
		this.amMGA = [1];

		this.rPPA = [0.2];
		this.rUEA = [32];
		this.rDEA = [32];
		this.rMGA = [0];

		for(var i=0; i<this.fmCFA.length; i++){
			this.b2.makeFm(this.fund*this.fmCFA[i], this.fund*this.fmMFA[i], this.fmGVA[i]);
			this.b2.applyRamp(0, 1, this.fmPPA[i], this.fmPPA[i], this.fmUEA[i], this.fmDEA[i]);
			this.b2.multiply(this.fmMGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 4");

	},

	// preset 5
	fx5: function(){

		this.duration = 8;

		this.fund = 432*0.25;
		this.rate = 0.125;
		this.cFA = [5];
		this.mFA = [200];
		this.gVA = [20];
		this.mGA = [1];
		this.pPA = [0.0001];
		this.uEA = [0.01];
		this.dEA = [128];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 5");

	},

	// preset 6
	fx6: function(){

		this.duration = 4;

		this.fund = 432*0.125;
		this.rate = 0.25;
		this.cFA = [1];
		this.mFA = [100];
		this.gVA = [120];
		this.mGA = [1];
		this.pPA = [0.2];
		this.uEA = [1.5];
		this.dEA = [128];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 6");

	},

	// preset 7
	fx7: function(){

		this.duration = 4;

		this.fund = 432*0.125;
		this.rate = 0.25;
		this.cFA = [1];
		this.mFA = [2];
		this.gVA = [4];
		this.mGA = [1];
		this.pPA = [0.2];
		this.uEA = [1.5];
		this.dEA = [128];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 7");

	},

	// preset 8
	fx8: function(){

		this.duration = 4;

		this.fund = 432*0.125;
		this.rate = 0.25;
		this.cFA = [1];
		this.mFA = [2];
		this.gVA = [4];
		this.mGA = [1];
		this.pPA = [0.2];
		this.uEA = [1.5];
		this.dEA = [2];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 8");

	},

	// preset 9
	fx9: function(){

		this.duration = 4;

		this.fund = 432*0.125;
		this.rate = 0.25;
		this.cFA = [1, 2];
		this.mFA = [2, 4];
		this.gVA = [4, 8];
		this.mGA = [1, 0.25];
		this.pPA = [0.2, 0.3];
		this.uEA = [1.5, 2];
		this.dEA = [2, 1.5];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 9");

	},

	// preset 10
	fx10: function(){

		this.duration = 4;

		this.fund = 432*0.125;
		this.rate = 0.25;
		this.cFA = [100];
		this.mFA = [100];
		this.gVA = [100];
		this.mGA = [1];
		this.pPA = [0.4];
		this.uEA = [1];
		this.dEA = [4];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 10");

	},

	// preset 11
	fx11: function(){

		this.duration = 2;

		this.fund = 432*1;
		this.rate = 0.5;
		this.cFA = [200, 100];
		this.mFA = [200, 120];
		this.gVA = [1000, 2000];
		this.mGA = [1, 1];
		this.pPA = [0.002, 0.001];
		this.uEA = [0.1, 0.1];
		this.dEA = [7, 8];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 11");

	},

	// preset 12
	fx12: function(){

		this.duration = 1;

		this.fund = 432*0.25;
		this.rate = 1;
		this.cFA = [1,   1   , 1  ];
		this.mFA = [1.5, 1.25, 2.9];
		this.gVA = [0.2, 0.2, 0.2];
		this.mGA = [1, 1, 1];
		this.pPA = [0.5, 0.5, 0.5];
		this.uEA = [1, 1, 1];
		this.dEA = [1, 1, 1];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.f);
		this.f.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 12")

	},

	// preset 13
	fx13: function(){

		this.duration = 1;

		this.fund = 432*1;
		this.rate = 1;
		this.cFA = [0.7];
		this.mFA = [0.5];
		this.gVA = [1];
		this.mGA = [1];
		this.pPA = [0.5];
		this.uEA = [1];
		this.dEA = [1];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.f);
		this.f.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

		console.log("fx preset 13");

	},

	// preset 14
	fx14: function(){

		this.duration = 1;

		this.fund = 432*1;
		this.rate = 1;
		this.cFA = [0.1, 0.2];
		this.mFA = [0.5, 0.7];
		this.gVA = [1, 1];
		this.mGA = [1, 1];
		this.pPA = [0.1, 0.5];
		this.uEA = [0.01, 1];
		this.dEA = [8, 1];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 14")

	},

	// preset 15
	fx15: function(){

		this.duration = 1;

		this.fund = 432*0.1;
		this.rate = 1;
		this.cFA = [0.1, 0.3];
		this.mFA = [0.2, 0.2];
		this.gVA = [100, 1];
		this.mGA = [1, 1];
		this.pPA = [0.1, 0.1];
		this.uEA = [0.1, 0.1];
		this.dEA = [8, 4];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 15");

	},

	// preset 16 (bird)
	fx16: function(){

		this.duration = 1;

		this.fund = 432*0.01;
		this.rate = 16;
		this.cFA = [0.1, 0.3];
		this.mFA = [0.2, 0.2];
		this.gVA = [100, 150];
		this.mGA = [1, 1];
		this.pPA = [0.1, 0.1];
		this.uEA = [0.1, 0.1];
		this.dEA = [8, 4];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 16");

	},

	// preset 17
	fx17: function(){

		this.duration = 1;

		this.fund = 432*0.01;
		this.rate = 1;
		this.cFA = [0.1, 0.3];
		this.mFA = [0.2, 0.2];
		this.gVA = [100, 150];
		this.mGA = [1, 1];
		this.pPA = [0.1, 0.1];
		this.uEA = [0.1, 0.1];
		this.dEA = [8, 4];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 17");

	},

	// preset 18
	fx18: function(){

		this.duration = 1;

		this.fund = 432*0.1;
		this.rate = 1;
		this.cFA = [0.1, 0.3, 0.7 , 1.1 , 0.6 ];
		this.mFA = [0.2, 0.2, 0.05, 0.07, 0.77];
		this.gVA = [100, 150, 120,  1   , 20 ];
		this.mGA = [1, 1, 1, 1, 1];
		this.pPA = [0.1, 0.1, 0.2, 0.5, 0.8];
		this.uEA = [0.1, 0.1, 0.2, 1, 3];
		this.dEA = [8, 4, 3, 1, 0.4];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 18");

	},

	// preset 19
	fx19: function(){

		this.duration = 1;

		this.fund = 432*1;
		this.rate = 16;
		this.cFA = [0.1, 0.3, 0.7 , 1.1 , 0.6 ];
		this.mFA = [0.2, 0.2, 0.05, 0.07, 0.77];
		this.gVA = [100, 150, 120,  1   , 20 ];
		this.mGA = [1, 1, 1, 1, 1];
		this.pPA = [0.1, 0.1, 0.2, 0.5, 0.8];
		this.uEA = [0.1, 0.1, 0.2, 1, 3];
		this.dEA = [8, 4, 3, 1, 0.4];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 19");

	},

	// preset 20
	fx20: function(){

		this.duration = 1;

		this.fund = 432*16;
		this.rate = 16;
		this.cFA = [0.1, 0.3, 0.7 , 1.1 , 0.6 ];
		this.mFA = [0.2, 0.2, 0.05, 0.07, 0.77];
		this.gVA = [100, 150, 120,  1   , 20 ];
		this.mGA = [1, 1, 1, 1, 1];
		this.pPA = [0.1, 0.1, 0.2, 0.5, 0.8];
		this.uEA = [0.1, 0.1, 0.2, 1, 3];
		this.dEA = [8, 4, 3, 1, 0.4];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 20");

	},

	// preset 21
	fx21: function(){

		this.duration = 1;

		this.fund = 432*16;
		this.rate = 1;
		this.cFA = [0.1, 0.3, 0.7 , 1.1 , 0.6 ];
		this.mFA = [0.2, 0.2, 0.05, 0.07, 0.77];
		this.gVA = [100, 150, 120,  1   , 20 ];
		this.mGA = [1, 1, 1, 1, 1];
		this.pPA = [0.1, 0.1, 0.2, 0.5, 0.8];
		this.uEA = [0.1, 0.1, 0.2, 1, 3];
		this.dEA = [8, 4, 3, 1, 0.4];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 21");

	},

	// preset 22
	fx22: function(){

		this.duration = 1;

		this.fund = 16;
		this.rate = 1;
		this.cFA = [1, 9.10714286, 10.3571429];
		this.mFA = [1, 9.10714286, 10.3571429];
		this.gVA = [10, 10, 10];
		this.mGA = [1, 0.5, 0.125];
		this.pPA = [0.1, 0.1, 0.1];
		this.uEA = [0.1, 0.1, 0.1];
		this.dEA = [16, 16, 16];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 22");

	},

	// preset 23
	fx23: function(){

		this.duration = 4;

		this.fund = 16;
		this.rate = 0.25;
		this.cFA = [1, 9.10714286, 10.3571429];
		this.mFA = [1, 9.10714286, 10.3571429];
		this.gVA = [10, 10, 10];
		this.mGA = [1, 0.5, 0.125];
		this.pPA = [0.1, 0.1, 0.1];
		this.uEA = [0.1, 0.1, 0.1];
		this.dEA = [16, 16, 16];

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.f = new MyBiquad("notch", this.fund, 5);
		this.b1.playbackRate = this.rate;

		for(var i=0; i<this.cFA.length; i++){
			this.b2.makeFm(this.fund*this.cFA[i], this.fund*this.mFA[i], this.gVA[i]);
			this.b2.applyRamp(0, 1, this.pPA[i], this.pPA[i], this.uEA[i], this.dEA[i]);
			this.b2.multiply(this.mGA[i]);

			this.b1.addBuffer(this.b2.buffer);
		}

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		console.log("fx preset 23")

	},

	// preset 24
	fx24: function(){

		this.duration = 1;

		this.fund = 432;
		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);

		this.b1.playbackRate = 1;

		//

		this.b2.makeFm(432, 432, 1);
		this.b2.applyRamp(0, 1, 0.5, 0.5, 1, 1);

		this.b1.addBuffer(this.b2.buffer);

		this.b2.makeFm(432*2, 432, 1);
		this.b2.applyRamp(0, 0.75, 0.25, 0.5, 1, 1);

		bufferGraph(this.b2.buffer);

		this.b1.subtractBuffer(this.b2.buffer);

		this.b2.makeFm(432*0.25, 432*0.1, 1);
		this.b2.applyRamp(0, 1, 0.5, 0.5, 1, 1);
		this.b2.multiply(0.1);

		bufferGraph(this.b2.buffer);

		this.b1.multiplyBuffer(this.b2.buffer);

		this.b1.normalize(-1, 1);

		bufferGraph(this.b1.buffer);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

	},

	// preset 25
	fx25: function(){

		this.duration = 1;

		this.fund = 432*0.25;
		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);

		this.b1.playbackRate = 1;

		//

		this.b2.makeFm(this.fund, this.fund, 1);
		this.b2.applyRamp(0, 1, 0.5, 0.5, 1, 1);

		this.b1.addBuffer(this.b2.buffer);

		this.b2.makeFm(this.fund*2, this.fund, 1);
		this.b2.applyRamp(0, 0.75, 0.25, 0.5, 1, 1);

		bufferGraph(this.b2.buffer);

		this.b1.subtractBuffer(this.b2.buffer);

		this.b2.makeFm(this.fund*0.25, this.fund*0.1, 1);
		this.b2.applyRamp(0, 1, 0.5, 0.5, 1, 1);
		this.b2.multiply(0.1);

		bufferGraph(this.b2.buffer);

		this.b1.multiplyBuffer(this.b2.buffer);

		this.b1.normalize(-1, 1);

		bufferGraph(this.b1.buffer);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

	},

	// preset 26
	fx26: function(){

		this.duration = 1;

		this.fund = 432*0.0625;
		this.rate = 8;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);

		this.b1.playbackRate = this.rate;

		//

		this.b2.makeFm(this.fund, this.fund, 1);
		this.b2.applyRamp(0, 1, 0.5, 0.5, 1, 1);

		this.b1.addBuffer(this.b2.buffer);

		this.b2.makeFm(this.fund*2, this.fund, 1);
		this.b2.applyRamp(0, 1, 0.25, 0.5, 1, 1);

		bufferGraph(this.b2.buffer);

		this.b1.subtractBuffer(this.b2.buffer);

		this.b2.makeFm(this.fund*0.25, this.fund*0.1, 1);
		this.b2.applyRamp(0, 1, 0.5, 0.5, 1, 1);
		this.b2.multiply(0.1);

		bufferGraph(this.b2.buffer);

		this.b1.multiplyBuffer(this.b2.buffer);

		this.b1.normalize(-1, 1);

		bufferGraph(this.b1.buffer);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

	},

	// preset 27
	fx27: function(){

		this.duration = 1;

		this.fund = 432*0.125;
		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.bw = 20;
		this.cA = [1, 9.10714286, 10.3571429];

		for(var i=0; i<this.cA.length; i++){

			for(var j=0; j<this.bw; j++){

				this.b2.addSine(j+parseInt(this.fund*this.cA[i]), randomFloat(0.5, 1));

			}

		}

		this.b1.addBuffer(this.b2.buffer);
		this.b1.applyRamp(0, 1, 0.5, 0.5, 8, 8);

		this.b1.connect(this.output);

		this.b1.normalize(-1, 1);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 28
	fx28: function(){

		this.duration = 1;

		this.fund = 432*0.5;
		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.bw = 50;
		this.cA = [1, 4.75, 6.375];

		for(var i=0; i<this.cA.length; i++){

			for(var j=0; j<this.bw; j++){

				this.b2.addSine(j+parseInt(this.fund*this.cA[i]), randomFloat(0.5, 1));

			}

		}

		this.b1.addBuffer(this.b2.buffer);
		this.b1.applyRamp(0, 1, 0.5, 0.5, 8, 8);

		this.b1.connect(this.output);

		this.b1.normalize(-1, 1);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 29 (bouncing ball)
	fx29: function(){

		this.duration = 1;

		this.fund = 432*0.25;
		this.rate = 2;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.bw = 50;
		this.cA = [1, 1.859375, 3.734375];

		for(var i=0; i<this.cA.length; i++){

			for(var j=0; j<this.bw; j++){

				if(j<parseInt(this.bw*0.5)){
					this.b2.addSine(j+(this.fund-parseInt(this.bw*0.5)), randomFloat(1, 1)*(j/(parseInt(this.bw*0.5))));
				};

				if(j>=parseInt(this.bw*0.5)){
					this.b2.addSine(j+this.fund, randomFloat(1, 1)*(this.bw-j)/parseInt(this.bw*0.5));
				};

				this.b2.addSine(j+parseInt(this.fund*this.cA[i]), randomFloat(0.5, 1));

			}

		}

		this.b1.addBuffer(this.b2.buffer);
		this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 4);

		this.b1.connect(this.output);

		this.b1.normalize(-1, 1);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 30
	fx30: function(){

		this.duration = 1;

		this.fund = 432*0.25;
		this.rate = 2;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.bw = 100;
		this.cA = [1, 3.218181818181818, 4.527272727272727];

		for(var i=0; i<this.cA.length; i++){

			for(var j=0; j<this.bw; j++){

				if(j<parseInt(this.bw*0.5)){
					this.b2.addSine(j+((this.cA[i]*this.fund)-parseInt(this.bw*0.5)), randomFloat(0.125, 1)*(j/(parseInt(this.bw*0.5))));
				};

				if(j>=parseInt(this.bw*0.5)){
					this.b2.addSine(j+(this.cA[i]*this.fund), randomFloat(0.125, 1)*(this.bw-j)/parseInt(this.bw*0.5));
				};

			}

		}

		this.b1.addBuffer(this.b2.buffer);
		this.b1.applyRamp(0, 1, 0.5, 0.5, 1, 1);

		this.b1.connect(this.output);

		this.b1.normalize(-1, 1);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 31
	fx31: function(){

		this.duration = 2;

		this.fund = 432*0.25;
		this.rate = 0.5;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.bw = 100;
		this.cA = [1, 3.218181818181818, 4.527272727272727];

		for(var i=0; i<this.cA.length; i++){

			for(var j=0; j<this.bw; j++){

				if(j<parseInt(this.bw*0.5)){
					this.b2.addSine(j+((this.cA[i]*this.fund)-parseInt(this.bw*0.5)), Math.pow(randomFloat(0.125, 1)*(j/(parseInt(this.bw*0.5))), 8));
				};

				if(j>=parseInt(this.bw*0.5)){
					this.b2.addSine(j+(this.cA[i]*this.fund), Math.pow(randomFloat(0.125, 1)*(this.bw-j)/parseInt(this.bw*0.5), 8));
				};

			}

		}

		this.b1.addBuffer(this.b2.buffer);
		this.b1.applyRamp(0, 1, 0.5, 0.5, 1, 1);

		this.b1.connect(this.output);

		this.b1.normalize(-1, 1);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 32
	fx32: function(){

		this.duration = 2;

		this.fund = 432*0.25;
		this.rate = 0.5;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.bw = 100;
		this.cA = [1, 3.218181818181818, 4.527272727272727, 1, 9.10714286, 10.3571429];

		for(var i=0; i<this.cA.length; i++){

			for(var j=0; j<this.bw; j++){

				if(j<parseInt(this.bw*0.5)){
					this.b2.addSine(j+((this.cA[i]*this.fund)-parseInt(this.bw*0.5)), Math.pow(randomFloat(0.125, 1)*(j/(parseInt(this.bw*0.5))), 8));
				};

				if(j>=parseInt(this.bw*0.5)){
					this.b2.addSine(j+(this.cA[i]*this.fund), Math.pow(randomFloat(0.125, 1)*(this.bw-j)/parseInt(this.bw*0.5), 8));
				};

			}

		}

		this.b1.addBuffer(this.b2.buffer);
		this.b1.applyRamp(0, 1, 0.5, 0.5, 1, 1);

		this.b1.connect(this.output);

		this.b1.normalize(-1, 1);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 33
	fx33: function(){

		this.duration = 2;

		this.fund = 432*0.25;
		this.rate = 0.5;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.bw = 100;
		this.cA = [1, 3.218181818181818, 4.527272727272727, 1, 9.10714286, 10.3571429];

		for(var i=0; i<this.cA.length; i++){

			for(var j=0; j<this.bw; j++){

				if(j<parseInt(this.bw*0.5)){
					this.b2.addSine(j+((this.cA[i]*this.fund)-parseInt(this.bw*0.5)), Math.pow(randomFloat(0.125, 1)*(j/(parseInt(this.bw*0.5))), 0.1));
				};

				if(j>=parseInt(this.bw*0.5)){
					this.b2.addSine(j+(this.cA[i]*this.fund), Math.pow(randomFloat(0.125, 1)*(this.bw-j)/parseInt(this.bw*0.5), 0.1));
				};

			}

		}

		this.b1.addBuffer(this.b2.buffer);
		this.b1.applyRamp(0, 1, 0.5, 0.5, 3, 2);

		this.b1.connect(this.output);

		this.b1.normalize(-1, 1);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 34 (spring)
	fx34: function(){

		this.duration = 1;

		this.fund = 432*0.25;
		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.bw = 100;
		this.cA = [1, 3.218181818181818, 4.527272727272727, 9.10714286, 10.3571429];

		for(var i=0; i<this.cA.length; i++){

			for(var j=0; j<this.bw; j++){

				if(j<parseInt(this.bw*0.5)){
					this.b2.addSine(j+((this.cA[i]*this.fund)-parseInt(this.bw*0.5)), Math.pow(randomFloat(0.125, 1)*(j/(parseInt(this.bw*0.5))), 0.1));
				};

				if(j>=parseInt(this.bw*0.5)){
					this.b2.addSine(j+(this.cA[i]*this.fund), Math.pow(randomFloat(0.125, 1)*(this.bw-j)/parseInt(this.bw*0.5), 0.1));
				};

			}

		}

		this.b1.addBuffer(this.b2.buffer);
		this.b1.applyRamp(0, 1, 0.01, 0.02, 3, 2);

		this.b1.connect(this.output);

		this.b1.normalize(-1, 1);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 35 (pitchy bubbles)
	fx35: function(){

		this.duration = 1;

		this.fund = 432*1;
		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b3 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.n = 40;

		for(var i=0; i<this.n; i++){

			this.b2.makeAm(this.fund*randomArrayValue([1, M2, M3, P4, P5, M6, m7]), this.fund*randomArrayValue([1, M2, M3, P4, P5, M6, m7]), 1);
			this.b2.applyRamp(i/this.n, (i+1)/this.n, 0.25, 0.75, 1, 1);

			bufferGraph(this.b2.buffer);

			this.b1.subtractBuffer(this.b2.buffer);

		}

		this.b1.applyRamp(0, 1, 0.5, 0.5, 2, 3);

		this.b1.connect(this.output);

		this.b1.normalize(-1, 1);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 36 (fm scramble)
	fx36: function(){

		this.duration = 1;

		this.fund = 432*1;
		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b3 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.n = 100;

		for(var i=0; i<this.n; i++){

			this.b2.makeFm(this.fund*randomArrayValue([1, M2, M3, P4, P5, M6, m7]), this.fund*randomArrayValue([1, M2, M3, P4, P5, M6, m7]), randomFloat(0.1, 1));
			this.b2.applyRamp(i/this.n, (i+1)/this.n, 0.25, 0.75, 1, 1);

			this.b1.subtractBuffer(this.b2.buffer);

		}

		this.b1.applyRamp(0, 1, 0.5, 0.5, 2, 3);

		this.b1.connect(this.output);

		this.b1.normalize(-1, 1);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 37 (door)
	fx37: function(){

		this.duration = 1;

		this.fund = 432*1;
		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b3 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.n = 100;

		for(var i=0; i<this.n; i++){

			this.b2.addSine(this.fund*randomArrayValue([1, M2, M3, P4, P5, M6, m7]), 1);
			this.b2.applyRamp(0, 1, randomFloat(0.3, 0.5), randomFloat(0.5, 0.7), 100, 100);

			this.b1.subtractBuffer(this.b2.buffer);

		}

		this.b1.applyRamp(0, 1, 0.5, 0.5, 1, 1);

		this.b1.connect(this.output);

		this.b1.normalize(-1, 1);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 38
	fx38: function(){

		this.duration = 1;

		this.rate = 2;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 200;
		this.iA = [2, 3, 4, 1];
		this.bWA = [50, 20, 30, 70];

		for(var i=0; i<this.iA.length; i++){

				for(var j=0; j<this.bWA[i]; j++){

					this.b1.addSine(j+((this.fund*this.iA[i])-(this.bWA[i]*0.5)), randomFloat(0.25, 1));

				}

			}

			this.b1.normalize(-1, 1);

			this.b1.applyRamp(0, 1, 0.1, 0.3, 0.1, 8);

			this.b1.connect(this.output);


			this.startArray = [this.b1];

			bufferGraph(this.b1.buffer);

		},

	// preset 39 (metal breath)
	fx39: function(){

		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 250;
		this.iA = [1, 9.10714286, 10.3571429, 4.75, 6.375, 3.218181818181818, 4.527272727272727];
		this.bWA = [50, 20, 50, 20, 50, 20, 50];

		for(var i=0; i<this.iA.length; i++){

			for(var j=0; j<this.bWA[i]; j++){

				this.b1.addSine(j+((this.fund*this.iA[i])-(this.bWA[i]*0.5)), randomFloat(0.5, 1));

			}

		}

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.5, 0.5, 1.2, 1.2);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 40 (bounce)
	fx40: function(){

		this.duration = 1;

		this.rate = 1;
		this.cF = 20;
		this.mF = this.cF*1;
		this.nH = 20;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b2 = new MyBuffer(1, 1.1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.b1.makeFm(this.cF, this.mF, this.mF);

		for(var i=0; i<this.nH; i++){

			this.b2.addSine(this.cF+(this.mF*i), randomFloat(0, 1));
			this.b2.addSine(this.cF-(this.mF*i), randomFloat(0, 1));

		}

		this.b1.subtractBuffer(this.b2.buffer);

		this.b1.normalize(-1, 1);

		this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 6);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// preset 41 (coin tone)
	fx41: function(){

		this.duration = 1;

		this.rate = 1;

		this.b1 = new MyBuffer(1, 1, audioCtx.sampleRate);
		this.b1.playbackRate = this.rate;

		this.fund = 1000;

		this.iA = [1, 9.10714286, 10.3571429];
		this.bwA = [10, 20, 30];
		this.gA = [1, 1, 1];

		for(var i=0; i<this.iA.length; i++){

			for(var j=0; j<parseInt(this.bwA[i]); j++){

				this.f = j+((this.fund*this.iA[i])-(parseInt(this.bwA[i]*0.5)));
				this.b1.addSine(this.f, 1);
				this.b1.addSine(this.f*randomFloat(0.99, 1.01), 1);

			}

		}

		this.b1.applyRamp(0, 1, 0.01, 0.02, 0.1, 4);

		this.b1.normalize(-1, 1);

		this.b1.connect(this.output);

		this.startArray = [this.b1];

		bufferGraph(this.b1.buffer);

	},

	// start instrument immediately
	start: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].start();
		}
	},

	// stop instrument immediately
	stop: function(){
		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stop();
		}
	},

	// start instrument at specified time (in seconds)
	startAtTime: function(time){

		this.time = time;

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].startAtTime(this.time);
		}

	},

	// stop instrument at specified time (in seconds)
	stopAtTime: function(time){

		this.time = time;

		for(var i=0; i<this.startArray.length; i++){
			this.startArray[i].stopAtTime(this.time);
		}

	},

	// connect the output node of this object to the input of another
	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	},

}
