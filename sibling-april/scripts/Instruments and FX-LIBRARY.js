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

function MyWaveShaper(){

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();

	this.waveShaper = audioCtx.createWaveShaper();

	this.input.connect(this.waveShaper);
	this.waveShaper.connect(this.output);

}

MyWaveShaper.prototype = {

	input: this.input,
	output: this.output,
	waveShaper: this.waveShaper,

	makeConstant: function(value){

		this.nSamples = audioCtx.sampleRate;
		this.curve = new Float32Array(this.nSamples);

		for (var i=0 ; i < this.nSamples; ++i ) {

			this.curve[i] = value;

		}

		this.waveShaper.curve = this.curve;
	},

	makeNoise: function(rangeMin, rangeMax){

		this.nSamples = audioCtx.sampleRate;
		this.curve = new Float32Array(this.nSamples);
		var rangeMin = rangeMin;
		var rangeMax = rangeMax;

		for (var i=0 ; i < this.nSamples; ++i ) {

			this.curve[i] = randomFloat(rangeMin, rangeMax);

		}

		this.waveShaper.curve = this.curve;
	},

	makeSawtooth: function(exp){

		this.exp = exp;
		this.nSamples = audioCtx.sampleRate;
		this.curve = new Float32Array(this.nSamples);

		for (var i=0 ; i < this.nSamples; ++i ) {

			this.curve[i] = Math.pow((i/this.nSamples), this.exp);

		}

		this.waveShaper.curve = this.curve;

	},

	makeInverseSawtooth: function(exp){

		this.exp = exp;
		this.nSamples = audioCtx.sampleRate;
		this.curve = new Float32Array(this.nSamples);

		for (var i=0 ; i < this.nSamples; ++i ) {

			this.curve[i] = Math.pow((1-(i/this.nSamples)), this.exp);

		}

		this.waveShaper.curve = this.curve;
	},

	makeSquare: function(dutyCycle){

		this.nSamples = audioCtx.sampleRate;
		this.curve = new Float32Array(this.nSamples);
		this.dutyCycle = dutyCycle;

		for (var i=0 ; i < this.nSamples; ++i ) {

			if(i<this.nSamples*this.dutyCycle){
				this.curve[i] = 1;
			}

			else if(i>this.nSamples*this.dutyCycle){
				this.curve[i] = 0;
			}

		}

		this.waveShaper.curve = this.curve;
	},

	makeTriangle: function(){

		this.nSamples = audioCtx.sampleRate;
		this.curve = new Float32Array(this.nSamples);

		for (var i=0 ; i < this.nSamples; ++i ) {

			if(i<=this.nSamples/2){
				this.curve[i] = i/(this.nSamples/2);
			}

			else if(i>this.nSamples/2){
				this.curve[i] = 1-((i-this.nSamples/2)/this.nSamples/2);
			}

		}

		this.waveShaper.curve = this.curve;
	},

	makeSine: function(){

		this.nSamples = audioCtx.sampleRate;
		this.curve = new Float32Array(this.nSamples);
		this.twoPi = 2*Math.PI;
		this.v;

		for (var i=0 ; i < this.nSamples; ++i ) {

			this.v = Math.sin(this.twoPi*(i/this.nSamples));

			if(Math.abs(this.v)>=0.0001308996870648116){
				this.curve[i] = this.v;
			}

			else if(Math.abs(this.v)<0.0001308996870648116){
				this.curve[i] = 0;
			}

			console.log(this.curve[i]);

		}

		this.waveShaper.curve = this.curve;

	},

	makeUnipolarSine: function(){

		this.nSamples = audioCtx.sampleRate;
		this.curve = new Float32Array(this.nSamples);
		this.twoPi = 2*Math.PI;

		for (var i=0 ; i < this.nSamples; ++i ) {

			this.curve[i] = (0.5*(Math.sin(this.twoPi*(i/this.nSamples))))+0.5;

		}

		this.waveShaper.curve = this.curve;

	},

	quantizedWavetable: function(quant, rangeMin, rangeMax){

	    var n_samples = audioCtx.sampleRate;
	    var curve = new Float32Array(n_samples);
	    var mod = n_samples/quant;
	    var modVal;
	    var value;
	    var rangeMin = rangeMin;
	    var rangeMax = rangeMax;

	  for (var i=0 ; i < n_samples; i++ ) {

	  	modVal = i%mod;

	  	if(modVal==0){
	  		value = randomFloat(rangeMin, rangeMax);
	  		}

	  	curve[i] = value;

	  	}

	  	this.waveShaper.curve = curve;

 	},

 	 quantizedArrayWavetable: function(quant, valueArray){

	    var n_samples = audioCtx.sampleRate;
	    var curve = new Float32Array(n_samples);
	    var mod = n_samples/quant;
	    var modVal;
	    var value;
	    var valueArray = valueArray;

	  for (var i=0 ; i < n_samples; i++ ) {

	  	modVal = i%mod;

	  	if(modVal==0){
	  		value = valueArray[randomInt(0, valueArray.length)];
	  		}

	  	curve[i] = value;

	  	}

	  	this.waveShaper.curve = curve;

 	},

 	makeSigmoid: function(amount){

 	var k = amount;
    var n_samples = audioCtx.sampleRate;
    var curve = new Float32Array(n_samples);
    var deg = Math.PI / 180;
    var x;

	  for (var i=0; i<n_samples; i++) {
	    x = i * 2 / n_samples - 1;
	    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
	  }

	  	this.waveShaper.curve = curve;

 	},

	makeRamp: function(rampStart, rampEnd){

		this.nSamples = audioCtx.sampleRate;
		this.curve = new Float32Array(this.nSamples);
		this.m = rampEnd-rampStart;
		this.b = rampStart;

		for (var i=0 ; i < this.nSamples; ++i ) {

			this.curve[i] = (this.m*(i/this.nSamples))+this.b;

		}

		this.waveShaper.curve = this.curve;
	},

	additiveBlend: function(ratioArray, ampArray){

		this.nSamples = audioCtx.sampleRate;
		this.curve = new Float32Array(this.nSamples);
		this.twoPi = 2*Math.PI;
		this.ratioArray = ratioArray;
		this.ampArray = ampArray;
		this.arrayLength = ratioArray.length;
		this.idx;

		for (this.idx=0; this.idx<this.arrayLength; this.idx++){

			for (var i=0 ; i <this.nSamples; ++i ) {

			this.curve[i] = ((this.curve[i]+((this.ampArray[this.idx])*((Math.cos((this.ratioArray[this.idx])*(this.twoPi*(i/this.nSamples)))))))/this.arrayLength);

			}

		}

		this.waveShaper.curve = this.curve;

	},

	makeFm: function(cFreq, mFreq, mGain){

		this.twoPi = Math.PI*2;
		this.p;
		this.v;
		this.t;
		this.cFreq = cFreq;
		this.mFreq = mFreq;
		this.mGain = mGain;

		this.nSamples = audioCtx.sampleRate;
		this.curve = new Float32Array(this.nSamples);

		for (var i=0 ; i < this.nSamples; ++i){
				this.p = i/this.nSamples;
				this.t = this.p*this.twoPi
				this.a2 = this.mGain*(Math.sin(this.mFreq*this.t));
				this.v = Math.sin((this.cFreq+this.a2)*this.t);
				if(Math.abs(this.v) <= 0.0001308996870648116){
					this.curve[i] = 0;
				}
				else if(Math.abs(this.v) > 0.0001308996870648116){
					this.curve[i] = this.v
				}
			}

		this.waveShaper.curve = this.curve;

	},

	makeAm: function(cFreq, mFreq, mGain){

		this.twoPi = Math.PI*2;
		this.p;
		this.v;
		this.t;
		this.cFreq = cFreq;
		this.mFreq = mFreq;
		this.mGain = mGain;

		this.nSamples = audioCtx.sampleRate;
		this.curve = new Float32Array(this.nSamples);

		for (var i=0 ; i < this.nSamples; ++i){
				this.p = i/this.nSamples;
				this.t = this.p*this.twoPi
				this.a2 = this.mGain*(Math.sin(this.mFreq*this.t));
				this.v = this.a2*Math.sin(this.cFreq*this.t);
				if(Math.abs(this.v) <= 0.00013089969352576765){
					this.curve[i] = 0;
				}
				else if(Math.abs(this.v) > 0.00013089969352576765){
					this.curve[i] = this.v
				}
			}

		this.waveShaper.curve = this.curve;

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

function MyDelay(length, feedback){

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();

	this.length = length;
	this.feedback = feedback;

	this.delay = audioCtx.createDelay();
	this.delay.delayTime.value = this.length;

	this.feedbackGain = audioCtx.createGain();
	this.feedbackGain.gain.value = this.feedback;

	this.input.connect(this.delay);
	this.delay.connect(this.feedbackGain);
	this.feedbackGain.connect(this.delay);
	this.delay.connect(this.output);

}

MyDelay.prototype = {

	output: this.output,
	feedbackGain: this.feedbackGain,
	delay: this.delay,

	setFeedback: function(feedback){
		this.feedbackGain.gain.value = feedback;
	},

	setDelayTime: function(delayTime){
		this.delay.delayTime.value = delayTime;
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

function MyStereoDelay(delayTimeL, delayTimeR, feedbackGainValue, dryWetMix){

	this.delayTimeL = delayTimeL;
	this.delayTimeR = delayTimeR;
	this.feedbackGainValue = feedbackGainValue;
	this.dryWetMix = dryWetMix;

	this.delayL = audioCtx.createDelay();
	this.delayL.delayTime.value = this.delayTimeL;
	this.delayR = audioCtx.createDelay();
	this.delayR.delayTime.value = this.delayTimeR;

	this.feedbackGain = audioCtx.createGain();

	this.delayL.connect(this.feedbackGain);
	this.delayR.connect(this.feedbackGain);
	this.feedbackGain.connect(this.delayL);
	this.feedbackGain.connect(this.delayR);
	this.feedbackGain.gain.value = this.feedbackGainValue;

	this.input = audioCtx.createGain();

	this.dryGain = audioCtx.createGain();
	this.wetGainL = audioCtx.createGain();
	this.wetGainR = audioCtx.createGain();

	this.panL = audioCtx.createPanner();
	this.panR = audioCtx.createPanner();
	this.panL.setPosition(-1, 0, 0);
	this.panR.setPosition(1, 0, 0);

	this.input.connect(this.dryGain);
	this.input.connect(this.delayL);
	this.input.connect(this.delayR);
	this.delayL.connect(this.wetGainL);
	this.delayR.connect(this.wetGainR);
	this.wetGainL.connect(this.panL);
	this.wetGainR.connect(this.panR);

	this.dryGain.gain.value = 1-this.dryWetMix;
	this.wetGainL.gain.value = this.dryWetMix;
	this.wetGainR.gain.value = this.dryWetMix;

	this.output = audioCtx.createGain();

	this.dryGain.connect(this.output);
	this.panL.connect(this.output);
	this.panR.connect(this.output);


}

MyStereoDelay.prototype = {
	delay: this.delay,
	feedbackGain: this.feedbackGain,
	input: this.input,
	dryGain: this.dryGain,
	wetGain: this.wetGain,
	output: this.output,

	maxDelayTime: this.maxDelayTime,
	delayTimeL: this.delayTimeL,
	delayTimeR: this.delayTimeR,
	feedbackGainValue: this.feedbackGainValue,
	dryWetMix: this.dryWetMix,

	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	}
}

//--------------------------------------------------------------

function MyPanner2(position){

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();

	this.position = (position+1)/2;

	this.panL = audioCtx.createPanner();
	this.panR = audioCtx.createPanner();
	this.panL.setPosition(-1, 0, 0);
	this.panR.setPosition(1, 0, 0);

	this.gainL = audioCtx.createGain();
	this.gainR = audioCtx.createGain();
	this.gainL.gain.value = 1-this.position;
	this.gainR.gain.value = this.position;

	this.input.connect(this.panL);
	this.input.connect(this.panR);
	this.panL.connect(this.gainL);
	this.panR.connect(this.gainR);
	this.gainL.connect(this.output);
	this.gainR.connect(this.output);

}

MyPanner2.prototype = {

	output: this.output,
	gainL: this.gainL,
	gainR: this.gainR,

	setPosition: function(position){
		this.position = (position+1)/2;
		this.gainL.gain.value = 1-this.position;
		this.gainR.gain.value = this.position;
	},

	setPositionAtTime: function(position, time){

		this.position = (position+1)/2;
		this.time = time;

		this.gainL.gain.setValueAtTime(1-this.position, this.time);
		this.gainR.gain.setValueAtTime(this.position, this.time);

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

function MyOsc(type, frequency){

	this.type = type;
	this.frequency = frequency;

	this.frequencyInlet = audioCtx.createGain();
	this.frequencyInlet.gain.value = 1;

	this.output = audioCtx.createGain();

}

MyOsc.prototype = {

	output: this.output,
	osc: this.osc,
	type: this.type,
	frequency: this.frequency,
	frequencyInlet: this.frequencyInlet,
	detune: this.detune,

	start: function(){
		this.osc = audioCtx.createOscillator();
		this.osc.type = this.type;
		this.osc.frequency.value = this.frequency;
		this.frequencyInlet.connect(this.osc.frequency);
		this.osc.connect(this.output);
		this.osc.start();
	},

	stop: function(){
		this.osc.stop();
	},

	startAtTime: function(time){

		this.time = time;

		this.osc = audioCtx.createOscillator();
		this.osc.type = this.type;
		this.osc.frequency.value = this.frequency;
		this.frequencyInlet.connect(this.osc.frequency);
		this.osc.connect(this.output);
		this.osc.start(this.time);

	},

	stopAtTime: function(time){

		this.time = time;

		this.osc.stop(this.time);

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

function MyGain(gain){

	this.gainVal = gain;

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();
	this.gain = audioCtx.createGain();

	this.gain.gain.value = this.gainVal;

	this.input.connect(this.gain);
	this.gain.connect(this.output);

}

MyGain.prototype = {

	input: this.input,
	output: this.output,
	gain: this.gain,

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

function MyBiquad(type, frequency, Q){

	this.type = type;
	this.frequency = frequency;
	this.Q = Q;

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();

	this.biquad = audioCtx.createBiquadFilter();
	this.biquad.type = this.type;
	this.biquad.frequency.value = this.frequency;
	this.biquad.Q.value = this.Q;

	this.input.connect(this.biquad);
	this.biquad.connect(this.output);

}

MyBiquad.prototype = {

	input: this.input,
	output: this.output,
	biquad: this.biquad,

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

function MyNoise(){

	this.output = audioCtx.createGain();

	this.noise = new MyWaveShaper();
	this.noise.makeNoise(-1, 1);
	this.noiseDriver = new MyOsc("triangle", 0.5);

	this.noiseDriver.connect(this.noise);
	this.noise.connect(this.output);

}

MyNoise.prototype = {

	output: this.output,
	noiseDriver: this.noiseDriver,

	start: function(){
		this.noiseDriver.start();
	},

	stop: function(){
		this.noiseDriver.stop();
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

function BufferConstant(value){

	this.value = value;
	this.output = audioCtx.createGain();

	this.bufferSource = audioCtx.createBufferSource();

	this.buffer = audioCtx.createBuffer(1, audioCtx.sampleRate*1, audioCtx.sampleRate);

		for (this.channel = 0; this.channel<this.buffer.numberOfChannels; this.channel++){
			this.nowBuffering = this.buffer.getChannelData(this.channel);
			for (this.i=0; this.i<this.buffer.length; this.i++){
					this.nowBuffering[this.i] = this.value;
			}
		}
}

BufferConstant.prototype = {

	output: this.output,
	buffer: this.buffer,

	start: function(){
		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.loop = "true";
		this.bufferSource.buffer = this.buffer;
		this.bufferSource.connect(this.output);
		this.bufferSource.start();
	},

	stop: function(){
		this.bufferSource.stop();
	},

	startAtTime: function(time){

		this.time = time;

		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.loop = "true";
		this.bufferSource.buffer = this.buffer;
		this.bufferSource.connect(this.output);
		this.bufferSource.start(this.time);

	},

	stopAtTime: function(time){

		this.time = time;

		this.bufferSource.stop(this.time);

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

function BufferNoise(){

	this.playbackRate = 1;

	this.output = audioCtx.createGain();

	this.buffer = audioCtx.createBuffer(1, audioCtx.sampleRate*1, audioCtx.sampleRate);

		for (this.channel = 0; this.channel<this.buffer.numberOfChannels; this.channel++){
			this.nowBuffering = this.buffer.getChannelData(this.channel);
			for (this.i=0; this.i<this.buffer.length; this.i++){
					this.nowBuffering[this.i] = Math.random() * 2 - 1;
			}
		}

}

BufferNoise.prototype = {

	output: this.output,
	buffer: this.buffer,
	playbackRate: this.playbackRate,

	start: function(){
		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.loop = "true";
		this.bufferSource.buffer = this.buffer;
		this.bufferSource.playbackRate.value = this.playbackRate;
		this.bufferSource.connect(this.output);
		this.bufferSource.start();
	},

	stop: function(){
		this.bufferSource.stop();
	},

	startAtTime: function(time){

		this.time = time;

		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.loop = "true";
		this.bufferSource.buffer = this.buffer;
		this.bufferSource.playbackRate.value = this.playbackRate;
		this.bufferSource.connect(this.output);

		this.bufferSource.start(this.time);

	},

	stopAtTime: function(time){

		this.time = time;
		this.bufferSource.stop(this.time);

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

function NoiseTone(freq, Q){

	this.freq = freq;
	this.Q = Q;

	this.output = audioCtx.createGain();

	this.noise = new BufferNoise();
	this.filter = new MyBiquad("bandpass", this.freq, this.Q);

	this.noise.connect(this.filter);
	this.filter.connect(this.output);

}

NoiseTone.prototype = {

	output: this.output,
	noise: this.noise,
	filter: this.filter,

	start: function(){
		this.noise.start();
	},

	stop: function(){
		this.noise.stop();
	},

	startAtTime: function(time){

		this.time = time;

		this.noise.startAtTime(this.time);

	},

	stopAtTime: function(time){

		this.time = time;

		this.noise.stopAtTime(this.time);

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

function Envelope(envArray){

	this.output = audioCtx.createGain();

	this.envArray = envArray;

	this.length = length;

	this.targetArray = [];
	this.durationArray = [];
	this.segmentArray = [];
	this.ti = 0;
	this.di = 0;

	for(this.i=0; this.i<envArray.length; this.i++){
		if(this.i%2==0){
			this.targetArray[this.ti] = this.envArray[this.i];
			this.ti++;
		}
		else if(this.i%2==1){
			this.length+=this.envArray[this.i];
			this.durationArray[this.di] = audioCtx.sampleRate*this.envArray[this.i];
			if(this.i==1){
				this.segmentArray[this.di] = this.durationArray[this.di];
			}
			else if(this.i!=1){
				this.segmentArray[this.di] = this.durationArray[this.di]+this.segmentArray[this.di-1];
			}
			this.di++;
		}
	}

	this.length = audioCtx.sampleRate*this.length;

	this.buffer = audioCtx.createBuffer(1, this.length, audioCtx.sampleRate);
	this.m = 0;
	this.b = 0;
	this.x = 0;
	this.idxOffset = 0;
	this.idx = 0;

		for (this.channel = 0; this.channel<this.buffer.numberOfChannels; this.channel++){

			this.nowBuffering = this.buffer.getChannelData(this.channel);

			for(this.i=0; this.i<this.segmentArray.length; this.i++){

					if(this.i==0){
						for(this.j=0; this.j<this.durationArray[0]; this.j++){
							this.nowBuffering[this.j] = (this.j/this.segmentArray[this.i])*this.targetArray[this.i];
						}

					}

					else if(this.i!=0){
						this.idxOffset = this.segmentArray[this.i-1];

						for(this.j=0; this.j<this.durationArray[this.i]; this.j++){
							this.idx = this.idxOffset+this.j;
							this.m = this.targetArray[this.i]-this.targetArray[this.i-1];
							this.x = this.j/this.durationArray[this.i];
							this.b = this.targetArray[this.i-1];

							this.nowBuffering[this.idx] = (this.m*this.x)+this.b;

				}
			}
		}
	}
}

Envelope.prototype = {

	output: this.output,
	buffer: this.buffer,
	loop: this.loop,

	start: function(){
		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.buffer = this.buffer;
		this.bufferSource.loop = this.loop;
		this.bufferSource.connect(this.output);
		this.bufferSource.start();
	},

	startAtTime: function(time){

		this.time = time;

		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.buffer = this.buffer;
		this.bufferSource.loop = this.loop;
		this.bufferSource.connect(this.output);
		this.bufferSource.start(this.time);

	},

	stop: function(){
		this.bufferSource.stop();
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

function BreakPoint(envArray, expArray){

	this.output = audioCtx.createGain();

	this.envArray = envArray;
	this.expArray = expArray;

	this.targetArray = [];
	this.durationArray = [];
	this.segmentArray = [];
	this.ti = 0;
	this.di = 0;

	for(this.i=0; this.i<envArray.length; this.i++){
		if(this.i%2==0){
			this.targetArray[this.ti] = this.envArray[this.i];
			this.ti++;
		}
		else if(this.i%2==1){
			this.durationArray[this.di] = audioCtx.sampleRate*this.envArray[this.i];
			if(this.i==1){
				this.segmentArray[this.di] = this.durationArray[this.di];
			}
			else if(this.i!=1){
				this.segmentArray[this.di] = this.durationArray[this.di]+this.segmentArray[this.di-1];
			}
			this.di++;
		}
	}

	this.buffer = audioCtx.createBuffer(1, 1*audioCtx.sampleRate, audioCtx.sampleRate);
	this.m = 0;
	this.b = 0;
	this.x = 0;
	this.idxOffset = 0;
	this.idx = 0;

		for (this.channel = 0; this.channel<this.buffer.numberOfChannels; this.channel++){

			this.nowBuffering = this.buffer.getChannelData(this.channel);

			for(this.i=0; this.i<this.segmentArray.length; this.i++){

					if(this.i==0){
						for(this.j=0; this.j<this.durationArray[0]; this.j++){
							this.nowBuffering[this.j] = Math.pow(((this.j/this.segmentArray[this.i])*this.targetArray[this.i]), this.expArray[this.i%this.expArray.length]);
						}

					}

					else if(this.i!=0){
						this.idxOffset = this.segmentArray[this.i-1];

						for(this.j=0; this.j<this.durationArray[this.i]; this.j++){
							this.idx = this.idxOffset+this.j;
							this.m = this.targetArray[this.i]-this.targetArray[this.i-1];
							this.x = this.j/this.durationArray[this.i];
							this.b = this.targetArray[this.i-1];

							this.nowBuffering[this.idx] = Math.pow(((this.m*this.x)+this.b), this.expArray[this.i%this.expArray.length]);

						}
					}
			}
		}
}

BreakPoint.prototype = {

	output: this.output,
	buffer: this.buffer,
	loop: this.loop,
	playbackRate: this.playbackRate,

	start: function(){
		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.buffer = this.buffer;
		this.bufferSource.playbackRate.value = this.playbackRate;
		this.bufferSource.loop = this.loop;
		this.bufferSource.connect(this.output);
		this.bufferSource.start();
	},

	stop: function(){
		this.bufferSource.stop();
	},

	startAtTime: function(time){

		this.time = time;

		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.buffer = this.buffer;
		this.bufferSource.playbackRate.value = this.playbackRate;
		this.bufferSource.loop = this.loop;
		this.bufferSource.connect(this.output);
		this.bufferSource.start(this.time);

	},

	stopAtTime: function(time){

		this.time = time;

		this.bufferSource.stop(this.time);

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

function RhythmPan(rate, quant){

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();

	this.rate = rate;
	this.quant = quant;

	this.pBR = new MyBuffer(1, 1, audioCtx.sampleRate);
	this.pBR.quantizedArrayBuffer(this.quant, [0, 1]);
	this.pBR.playbackRate = this.rate;

	this.pBL = new MyBuffer(1, 1, audioCtx.sampleRate);
	this.pBL.quantizedArrayBuffer(this.quant, [0, 1]);
	this.pBL.playbackRate = this.rate;

	this.p = new MyPanner2(0);
	this.p.gainL.gain.value = 0;
	this.p.gainR.gain.value = 0;

	this.pBL.connect(this.p.gainL.gain);
	this.pBR.connect(this.p.gainR.gain);

	this.input.connect(this.p.input);
	this.p.connect(this.output);

}

RhythmPan.prototype = {

	input: this.input,
	output: this.output,
	pBR: this.pBR,
	pBL: this.pBL,

	start: function(){
		this.pBR.start();
		this.pBL.start();
	},

	stop: function(){
		this.pBR.stop();
		this.pBL.stop();
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

function OffsetSquareAM(f1, f2){

	this.f1 = f1;
	this.f2 = f2;

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();

	this.shaperOne = new MyWaveShaper();
	this.shaperTwo = new MyWaveShaper();
	this.shaperOne.makeSquare(0.5);
	this.shaperTwo.makeSquare(0.5);

	this.driverOne = new MyOsc("triangle", this.f1*2);
	this.driverTwo = new MyOsc("triangle", this.f2*2);
	this.smoothingFilter = new MyBiquad("lowpass", 22000, 0);

	this.negativeGain = new MyGain(-1);
	this.summationGain = new MyGain(1);
	this.amGain = new MyGain(0);

	this.driverOne.connect(this.shaperOne);
	this.driverTwo.connect(this.shaperTwo);
	this.shaperOne.connect(this.summationGain);
	this.shaperTwo.connect(this.negativeGain);
	this.negativeGain.connect(this.summationGain);
	this.summationGain.connect(this.smoothingFilter);
	this.smoothingFilter.connect(this.amGain.gain.gain);

	this.input.connect(this.amGain.input);
	this.amGain.connect(this.output);

}

OffsetSquareAM.prototype = {

	input: this.input,
	output: this.output,
	driverOne: this.driverOne,
	driverTwo: this.driverTwo,
	smoothingFilter: this.smoothingFilter,

	start: function(){
		this.driverOne.start();
		this.driverTwo.start();
	},

	stop: function(){
		this.driverOne.stop();
		this.driverTwo.stop();
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

//---------------------------------------------------------------------------

function LFO(min, max, rate){

	this.output = audioCtx.createGain();

	this.min = min;
	this.max = max;
	this.range = this.max-this.min;
	this.rate = rate;

	this.buffer = new MyBuffer(1, 1, audioCtx.sampleRate);
	this.buffer.playbackRate = this.rate;
	this.buffer.loop = true;
	this.constant = new BufferConstant(this.min);

	this.bG = new MyGain(this.range);
	this.aG = new MyGain(1);

	this.buffer.connect(this.bG);
	this.bG.connect(this.aG); this.constant.connect(this.aG);
	this.aG.connect(this.output);

}

LFO.prototype = {

	output: this.output,
	buffer: this.buffer,
	rate: this.rate,

	start: function(){
		this.buffer.start();
		this.constant.start();
	},

	stop: function(){
		this.buffer.stop();
		this.constant.stop();
	},

	startAtTime: function(time){

		this.time = time;

		this.buffer.startAtTime(this.time);
		this.constant.startAtTime(this.time);

	},

	stopAtTime: function(time){

		this.time = time;

		this.buffer.stopAtTime(this.time);
		this.constant.stopAtTime(this.time);

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

function Operator(){

	this.output = audioCtx.createGain();

	this.osc = new MyOsc("sine", 0);
	this.osc.start();
	this.envelope = new Envelope([0, 1]);
	this.eG = new MyGain(0);
	this.gain = new MyGain(0);

	this.osc.connect(this.eG); this.envelope.connect(this.eG.gain.gain);
	this.eG.connect(this.gain);
	this.gain.connect(this.output);

}

Operator.prototype = {

	output: this.output,
	type: this.type,
	frequency: this.frequency,
	eArray: this.eArray,
	gainVal: this.gainVal,

	osc: this.osc,
	envelope: this.envelope,
	eG: this.eG,
	gain: this.gain,

	setOp(type, freq, gainVal, eArray){

		this.type = type;
		this.freq = freq;
		this.gainVal = gainVal;
		this.eArray = eArray;

		this.osc.osc.type = this.type;
		this.osc.osc.frequency.value = this.freq;
		this.gain.gain.gain.value = this.gainVal;
		this.envelope.output.disconnect();
		this.envelope = new Envelope(this.eArray);
		this.envelope.connect(this.eG.gain.gain);

	},

	setFrequency(freq){
		this.osc.osc.frequency.value = freq;
	},

	setGain(gainVal){
		this.gain.gain.gain.value = gainVal;
	},

	setType(type){
		this.osc.osc.type = type;
	},

	setEnvelope(eArray){
		this.envelope.output.disconnect();
		this.envelope = new Envelope(eArray);
		this.envelope.connect(this.eG.gain.gain);
	},

	start: function(){
		this.envelope.start();
	},

	stop: function(){
		this.envelope.stop();
	},

	startAtTime: function(time){

		var envelope = this.envelope;

		setTimeout(function(){
			envelope.start();
		}, time*1000);

	},

	stopAtTime: function(time){

		var envelope = this.envelope;

		setTimeout(function(){
			envelope.stop();
		}, time*1000);

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

function MultiOsc(typeArray, freqArray){

	this.typeArray = typeArray;
	this.freqArray = freqArray;

	this.oscs = {};

	for(var i=0; i<this.typeArray.length; i++){
		this.oscs[i] = {osc: new MyOsc(this.typeArray[i], this.freqArray[i])};
	}

}

MultiOsc.prototype = {

	oscs: this.oscs,
	typeArray: this.typeArray,
	freqArray: this.freqArray,

	start: function(oIdx){
		this.oscs[oIdx].osc.start();
	},

	stop: function(oIdx){
		this.oscs[oIdx].osc.stop();
	},

	startAtTime: function(oIndex, time){

		var oscs = this.oscs;

		setTimeout(function(){
			oscs[oIdx].osc.start();
		}, time*1000);

	},

	stopAtTime: function(oIndex, time){

		var oscs = this.oscs;

		setTimeout(function(){
			oscs[oIdx].osc.stop();
		}, time*1000);

	},


	startAll: function(){
		for(var i=0; i<this.typeArray.length; i++){
			this.oscs[i].osc.start();
		}
	},

	stopAll: function(){
		for(var i=0; i<this.typeArray.length; i++){
			this.oscs[i].osc.stop();
		}
	},

	connect: function(audioNode, outputIdx){
		if (audioNode.hasOwnProperty('input') == 1){
			this.oscs[outputIdx].osc.connect(audioNode.input);
		}
		else {
			this.oscs[outputIdx].osc.connect(audioNode);
		}
	},

	connectAll: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			for(var i=0; i<this.typeArray.length; i++){
				this.oscs[i].osc.connect(audioNode.input);
			}
		}
		else {
			for(var i=0; i<this.typeArray.length; i++){
				this.oscs[i].osc.connect(audioNode);
			}
		}
	},

}

//--------------------------------------------------------------

function MultiGain(gainArray){

	this.input = audioCtx.createGain();
	this.gainArray = gainArray;

	this.gains = {};

	for(var i=0; i<this.gainArray.length; i++){
		this.gains[i] = {gain: new MyGain(this.gainArray[i])};

		this.input.connect(this.gains[i].gain.input);
	}

}

MultiGain.prototype = {

	input: this.input,
	gains: this.gains,
	gainArray: this.gainArray,

	connect: function(audioNode, outputIdx){
		if (audioNode.hasOwnProperty('input') == 1){
			this.gains[outputIdx].gain.connect(audioNode.input);
		}
		else {
			this.gains[outputIdx].gain.connect(audioNode);
		}
	},

	connectAll: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			for(var i=0; i<this.gainArray.length; i++){
				this.gains[i].gain.connect(audioNode.input);
			}
		}
		else {
			for(var i=0; i<this.gainArray.length; i++){
				this.gains[i].gain.connect(audioNode);
			}
		}
	},

}

//--------------------------------------------------------------

function MultiPan(panArray){

	this.input = audioCtx.createGain();
	this.panArray = panArray;

	this.pans = {};

	for(var i=0; i<this.panArray.length; i++){
		this.pans[i] = {pan: new MyPanner2(this.panArray[i])};

		this.input.connect(this.pans[i].pan.input);
	}

}

MultiPan.prototype = {

	input: this.input,
	pans: this.pans,
	panArray: this.panArray,

	connect: function(audioNode, outputIdx){
		if (audioNode.hasOwnProperty('input') == 1){
			this.pans[outputIdx].pan.connect(audioNode.input);
		}
		else {
			this.pans[outputIdx].pan.connect(audioNode);
		}
	},

	connectAll: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			for(var i=0; i<this.panArray.length; i++){
				this.pans[i].pan.connect(audioNode.input);
			}
		}
		else {
			for(var i=0; i<this.panArray.length; i++){
				this.pans[i].pan.connect(audioNode);
			}
		}
	},

}

//--------------------------------------------------------------

function MultiDelay(delayArray){

	this.input = audioCtx.createGain();
	this.delayArray = delayArray;

	this.delays = {};

	for(var i=0; i<this.delayArray.length; i++){
		this.delays[i] = {delay: audioCtx.createDelay()};
		this.delays[i].delay.delayTime.value = this.delayArray[i];

		this.input.connect(this.delays[i].delay.input);
	}

}

MultiDelay.prototype = {

	input: this.input,
	delays: this.delays,
	delayArray: this.delayArray,

	connect: function(audioNode, outputIdx){
		if (audioNode.hasOwnProperty('input') == 1){
			this.delays[outputIdx].delay.connect(audioNode.input);
		}
		else {
			this.delays[outputIdx].delay.connect(audioNode);
		}
	},

	connectAll: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			for(var i=0; i<this.delayArray.length; i++){
				this.delays[i].delay.connect(audioNode.input);
			}
		}
		else {
			for(var i=0; i<this.delayArray.length; i++){
				this.delays[i].delay.connect(audioNode);
			}
		}
	},

}

//--------------------------------------------------------------

function MultiPannedDelay(delayArray, panArray){

	this.input = audioCtx.createGain();

	this.delayArray = delayArray;
	this.panArray = panArray;

	this.delays = {};
	this.pans = {};

	for(var i=0; i<this.delayArray.length; i++){
		this.delays[i] = {delay: audioCtx.createDelay()};
		this.delays[i].delay.delayTime.value = this.delayArray[i];
		this.pans[i] = {pan: new MyPanner2(this.panArray[i])};

		this.input.connect(this.delays[i].delay.input);
		this.delays[i].delay.connect(this.pans[i].pan.input);

	}

}

MultiPannedDelay.prototype = {

	input: this.input,
	delays: this.delays,
	pans: this.pans,
	delayArray: this.delayArray,
	panArray: this.panArray,

	connect: function(audioNode, outputIdx){
		if (audioNode.hasOwnProperty('input') == 1){
			this.pans[outputIdx].pan.connect(audioNode.input);
		}
		else {
			this.pans[outputIdx].pan.connect(audioNode);
		}
	},

	connectAll: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			for(var i=0; i<this.panArray.length; i++){
				this.pans[i].pan.connect(audioNode.input);
			}
		}
		else {
			for(var i=0; i<this.panArray.length; i++){
				this.pans[i].pan.connect(audioNode);
			}
		}
	},

}

//--------------------------------------------------------------

function MultiStereoDelay(delayLArray, delayRArray, fbArray){

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();
	this.delayLArray = delayLArray;
	this.delayRArray = delayRArray;
	this.fbArray = fbArray;

	this.nDelays = this.delayLArray.length;

	this.delays = {};

	for(var i=0; i<this.nDelays; i++){
		this.delays[i] = {delay: new MyStereoDelay(this.delayLArray[i], this.delayRArray[i], this.fbArray[i], 1)};

		this.input.connect(this.delays[i].delay.input);
		this.delays[i].delay.connect(this.output);
	}

}

MultiStereoDelay.prototype = {

	input: this.input,
	output: this.output,
	delays: this.delays,
	delayLArray: this.delayLArray,
	delayRArray: this.delayRArray,
	fbArray: this.fbArray,
	nDelays: this.nDelays,

	connect: function(audioNode, outputIdx){
		if (audioNode.hasOwnProperty('input') == 1){
			this.delays[outputIdx].delay.connect(audioNode.input);
		}
		else {
			this.delays[outputIdx].delay.connect(audioNode);
		}
	},

	connectAll: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
				this.output.connect(audioNode.input);
		}
		else {
				this.output.connect(audioNode);
		}
	},

}

//--------------------------------------------------------------

function MultiOperator(nOps){

	this.nOps = nOps;

	this.ops = {};

	for(var i=0; i<this.nOps; i++){
		this.ops[i] = {op: new Operator()};
	}

}

MultiOperator.prototype = {

	ops: this.ops,
	nOps: this.nOps,

	start: function(oIdx){
		this.ops[oIdx].op.start();
	},

	stop: function(oIdx){
		this.ops[oIdx].op.stop();
	},

	startAtTime: function(oIndex, time){

		var ops = this.ops;

		setTimeout(function(){
			ops[oIndex].op.start();
		}, time*1000);

	},

	stopAtTime: function(oIndex, time){

		var ops = this.ops;

		setTimeout(function(){
			ops[oIndex].op.stop();
		}, time*1000);

	},

	startAll: function(){
		for(var i=0; i<this.nOps; i++){
			this.ops[i].op.start();
		}
	},

	stopAll: function(){
		for(var i=0; i<this.nOps; i++){
			this.ops[i].op.stop();
		}
	},

	connect: function(audioNode, outputIdx){
		if (audioNode.hasOwnProperty('input') == 1){
			this.ops[outputIdx].op.connect(audioNode.input);
		}
		else {
			this.ops[outputIdx].op.connect(audioNode);
		}
	},

	connectAll: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			for(var i=0; i<this.nOps; i++){
				this.ops[i].op.connect(audioNode.input);
			}
		}
		else {
			for(var i=0; i<this.nOps; i++){
				this.ops[i].op.connect(audioNode);
			}
		}
	},


}

//--------------------------------------------------------------

function MultiInstrument(nInstruments){

	this.output = audioCtx.createGain();

	this.nInstruments = nInstruments;

	this.instruments = {};

	for(var i=0; i<this.nInstruments; i++){
		this.instruments[i] = {instrument: new Instrument()};
		this.instruments[i].instrument.connect(this.output);
	}

}

MultiInstrument.prototype = {

	output: this.output,
	instrument: this.instruments,
	nInstruments: this.nInstruments,

	start: function(){
		for(var i=0; i<this.nInstruments; i++){
			this.instruments[i].instrument.start();
		}
	},

	stop: function(){
		for(var i=0; i<this.nInstruments; i++){
			this.instruments[i].instrument.stop();
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

function PanDelay(delayLength, feedback, panVal){

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();

	this.delayLength = delayLength;
	this.feedback = feedback;
	this.panVal = panVal;

	this.delay = new MyDelay(this.delayLength, this.feedback);
	this.pan = new MyPanner2(this.panVal);

	this.input.connect(this.delay.input);
	this.delay.connect(this.pan);
	this.pan.connect(this.output);

}

PanDelay.prototype = {

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

function FilterFade(initLevel){

	this.initLevel = initLevel;

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();

	this.fadeConstant = new BufferConstant(1);
	this.fadeConstantGain = new MyGain(this.initLevel);
	this.fadeConstantFilter = new MyBiquad("lowpass", 22000, 1);
	this.fadeGain = new MyGain(0);

	this.fadeConstant.connect(this.fadeConstantGain);
	this.fadeConstantGain.connect(this.fadeConstantFilter);

	this.input.connect(this.fadeGain.input); this.fadeConstantFilter.connect(this.fadeGain.gain.gain);
	this.fadeGain.connect(this.output);

	this.fadeConstant.start();

}

FilterFade.prototype = {

	input: this.input,
	output: this.output,
	fadeConstantGain: this.fadeConstantGain,
	fadeConstantFilter: this.fadeConstantFilter,

	start: function(fadeTarget, filterFreq){

		this.fadeTarget = fadeTarget;
		this.filterFreq = filterFreq;

		this.fadeConstantFilter.biquad.frequency.value = this.filterFreq;
		this.fadeConstantGain.gain.gain.value = this.fadeTarget;

	},

	startAtTime: function(fadeTarget, filterFreq, time){

		this.fadeTarget = fadeTarget;
		this.filterFreq = filterFreq;
		this.time = time;

		this.fadeConstantFilter.biquad.frequency.setValueAtTime(this.filterFreq, this.time);
		this.fadeConstantGain.gain.gain.setValueAtTime(this.fadeTarget, this.time);

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

function FilterEnvelope(type, freq, Q, eArray){

	this.type = type;
	this.freq = freq;
	this.Q = Q;
	this.eArray = eArray;

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();

	this.filter = new MyBiquad(this.type, this.freq, this.Q);
	this.envelope = new Envelope(this.eArray);

	this.input.connect(this.filter.input);
	this.filter.connect(this.output); this.envelope.connect(this.filter.biquad.frequency);

}

FilterEnvelope.prototype = {

	input: this.input,
	output: this.output,
	envelope: this.envelope,

	start: function(){
		this.envelope.start();
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

function MultiEffect(nEffects){

	this.output = audioCtx.createGain();

	this.nEffects = nEffects;

	this.effects = {};

	for(var i=0; i<this.nEffects; i++){
		this.effects[i] = {effect: new Effect()};
		this.effects[i].effect.connect(this.output);
	}

}

MultiEffect.prototype = {

	output: this.output,
	effects: this.effects,
	nEffects: this.nEffects,

	start: function(){
		for(var i=0; i<this.nInstruments; i++){
			this.effects[i].effect.start();
		}
	},

	stop: function(){
		for(var i=0; i<this.nInstruments; i++){
			this.effects[i].effect.stop();
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

function MultiEffect(nEffects){

	this.output = audioCtx.createGain();

	this.nEffects = nEffects;

	this.effects = {};

	for(var i=0; i<this.nEffects; i++){
		this.effects[i] = {effect: new Effect()};
		this.effects[i].effect.connect(this.output);
	}

}

MultiEffect.prototype = {

	output: this.output,
	effects: this.effects,
	nEffects: this.nEffects,

	start: function(){
		for(var i=0; i<this.nInstruments; i++){
			this.effects[i].effect.start();
		}
	},

	stop: function(){
		for(var i=0; i<this.nInstruments; i++){
			this.effects[i].effect.stop();
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

function OffsetSquareAM2(f1, f2, d1, d2){

	this.f1 = f1;
	this.f2 = f2;
	this.d1 = d1;
	this.d2 = d2;

	this.input = audioCtx.createGain();
	this.output = audioCtx.createGain();

	this.shaperOne = new MyWaveShaper();
	this.shaperTwo = new MyWaveShaper();
	this.shaperOne.makeSquare(this.d1);
	this.shaperTwo.makeSquare(this.d2);

	this.driverOne = new MyOsc("triangle", this.f1*2);
	this.driverTwo = new MyOsc("triangle", this.f2*2);
	this.smoothingFilter = new MyBiquad("lowpass", 22000, 0);

	this.negativeGain = new MyGain(-1);
	this.summationGain = new MyGain(1);
	this.amGain = new MyGain(0);

	this.driverOne.connect(this.shaperOne);
	this.driverTwo.connect(this.shaperTwo);
	this.shaperOne.connect(this.summationGain);
	this.shaperTwo.connect(this.negativeGain);
	this.negativeGain.connect(this.summationGain);
	this.summationGain.connect(this.smoothingFilter);
	this.smoothingFilter.connect(this.amGain.gain.gain);

	this.input.connect(this.amGain.input);
	this.amGain.connect(this.output);

}

OffsetSquareAM2.prototype = {

	input: this.input,
	output: this.output,
	driverOne: this.driverOne,
	driverTwo: this.driverTwo,
	smoothingFilter: this.smoothingFilter,

	start: function(){
		this.driverOne.start();
		this.driverTwo.start();
	},

	stop: function(){
		this.driverOne.stop();
		this.driverTwo.stop();
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

function EPBass(cFreqArray, mFreqArray){

	this.output = audioCtx.createGain();

	// src
	this.osc = new MyOsc("sine", 0);

	// envelope
	this.e = new MyBuffer(1, 1, audioCtx.sampleRate);
	this.e.makeInverseSawtooth(4);
	this.e.loop = false;
	this.f = new MyBiquad("lowpass", 500, 0);
	this.eG = new MyGain(0);

	// shapers
	this.s = {};
	this.timbreGain = new MyGain(0.2);
	this.sOG = new MyGain(0.3);

	this.cFreqArray = cFreqArray;
	this.mFreqArray = mFreqArray;

	for(var i=0; i<3; i++){

		this.s[i] = {shaper: new MyWaveShaper()};
		this.s[i].shaper.makeFm(this.cFreqArray[i]+i, this.mFreqArray[i]/100, 1);

		this.timbreGain.connect(this.s[i].shaper);
		this.s[i].shaper.connect(this.sOG);

	}

	// highpass
	this.hp = new MyBiquad("highpass", 20, 0);

	this.e.connect(this.f);

	this.osc.connect(this.eG);	this.f.connect(this.eG.gain.gain);
	this.eG.connect(this.timbreGain);
	this.sOG.connect(this.hp);
	this.hp.connect(this.output);

}

EPBass.prototype = {

	output: this.output,
	osc: this.osc,
	e: this.e,
	eG: this.eG,
	timbreGain: this.timbreGain,

	playAtTime: function(time, freq, duration){

		this.time = time;

		this.freq = freq;
		this.duration = 1/duration;

		this.osc.osc.frequency.setValueAtTime(this.freq, this.time);

		this.e.startAtTime2(this.time, this.duration);

	},

	start: function(){

		this.osc.start();

	},

	stop: function(){

		this.osc.stop();

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

function MoogXylophone(){

	this.output = audioCtx.createGain();

	this.osc1 = new MyOsc("sine", 0);

	this.octave1=1;

	this.gain1 = new MyGain(1);

	this.amplitudeEnvelope = new Envelope([0, 1]);
	this.amplitudeAttack=1;
	this.amplitudeDecay=1;
	this.amplitudeSustain = 1;
	this.amplitudeSustainLevel=0.5;

	this.filterEnvelope = new Envelope([0, 1]);
	this.filterAttack=1;
	this.filterAttackTarget=22000;
	this.filterDecay=1;
	this.filterSustain = 2000;
	this.filterSustainLevel=22000;

	this.filter = new MyBiquad("lowpass", 0, 0);

	this.amplitudeGain = new MyGain(0);

	this.osc1.connect(this.gain1);

	this.gain1.connect(this.filter);

	this.filter.connect(this.amplitudeGain);

	this.amplitudeGain.connect(this.output);

}

MoogXylophone.prototype = {

	output: this.output,

	osc1: this.osc1,

	octave1: this.octave1,

	gain1: this.gain1,

	amplitudeEnvelope: this.amplitudeEnvelope,
	amplitudeAttack: this.amplitudeAttack,
	amplitudeDecay: this.amplitudeDecay,
	amplitudeSustain: this.amplitudeSustain,
	amplitudeSustainLevel: this.amplitudeSustainLevel,

	filterEnvelope: this.filterEnvelope,
	filterAttack: this.filterAttack,
	filterAttackTarget: this.filterAttackTarget,
	filterDecay: this.filterDecay,
	filterSustain: this.filterSustain,
	filterSustainLevel: this.filterSustainLevel,

	filter: this.filter,

	amplitudeGain: this.amplitudeGain,

	playAtTime: function(freq, time){

		this.freq = freq;
		this.time = time;

		this.amplitudeEnvelope.connect(this.amplitudeGain.gain.gain);
		this.filterEnvelope.connect(this.filter.biquad.frequency);

		this.osc1.osc.frequency.setValueAtTime(this.freq*this.octave1, this.time)
		this.amplitudeEnvelope.startAtTime(this.time);
		this.filterEnvelope.startAtTime(this.time);

	},


	stop: function(){

		this.osc1.stop();

	},

	stopAtTime: function(time){

		this.time = time;

		this.osc1.stopAtTime(this.time);

	},

	trXylophone: function(){

		this.osc1.start();

		this.osc1.osc.type = "triangle";

		this.octave1 = 1;

		this.gain1.gain.gain.value = 1;

		this.amplitudeAttack=0.005;
		this.amplitudeDecay=0.6;
		this.amplitudeSustain = 0;
		this.amplitudeSustainLevel=0;

		this.filterAttack=0.005;
		this.filterAttackTarget=80;
		this.filterDecay=0.2;
		this.filterSustain = 0;
		this.filterSustainLevel=0;

		this.filter.biquad.Q.value = 4;

		this.amplitudeEnvelope = new Envelope([
			1, this.amplitudeAttack,
			this.amplitudeSustainLevel, this.amplitudeDecay,
			this.amplitudeSustainLevel, this.amplitudeSustain,
			0, this.amplitudeDecay,
		]);

		this.filterEnvelope = new Envelope([
			this.filterAttackTarget, this.filterAttack,
			this.filterSustainLevel, this.filterDecay,
			this.filterSustainLevel, this.filterSustain,
			0, this.filterDecay,
		]);

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

function MyBuffer(nChannels, length, sRate){

	this.output = audioCtx.createGain();

	this.nChannels = nChannels;
	this.length = length;
	this.sRate = sRate;

	this.buffer = audioCtx.createBuffer(this.nChannels, this.sRate*this.length, this.sRate);

}

MyBuffer.prototype = {

	output: this.output,
	buffer: this.buffer,
	playbackRate: this.playbackRate,
	loop: this.loop,

	start: function(){
		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.loop = this.loop;
		this.bufferSource.playbackRate.value = this.playbackRate;
		this.bufferSource.buffer = this.buffer;
		this.bufferSource.connect(this.output);
		this.bufferSource.start();
	},

	stop: function(){
		this.bufferSource.stop();
	},

	startAtTime: function(time){

		this.time = time;

		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.loop = this.loop;
		this.bufferSource.playbackRate.value = this.playbackRate;
		this.bufferSource.buffer = this.buffer;
		this.bufferSource.connect(this.output);
		this.bufferSource.start(this.time);

	},

	startAtTime2: function(time, playbackRate){

		this.time = time;
		this.playbackRate = playbackRate;

		this.bufferSource = audioCtx.createBufferSource();
		this.bufferSource.loop = this.loop;
		this.bufferSource.buffer = this.buffer;
		this.bufferSource.connect(this.output);
		this.bufferSource.start(this.time);

	},

	stopAtTime: function(time){

		this.time = time;

		this.bufferSource.stop(this.time);

	},

	connect: function(audioNode){
		if (audioNode.hasOwnProperty('input') == 1){
			this.output.connect(audioNode.input);
		}
		else {
			this.output.connect(audioNode);
		}
	},

	makeSine: function(){

		this.twoPi = Math.PI*2;
		this.t;
		this.v;

		for (this.channel = 0; this.channel<this.buffer.numberOfChannels; this.channel++){
			this.nowBuffering = this.buffer.getChannelData(this.channel);
			for (this.i=0; this.i<this.buffer.length; this.i++){
				this.t = this.i/this.buffer.length;
				this.v = Math.sin(this.twoPi*this.t);
				if(Math.abs(this.v) <= 0.00013089969352576765){
					this.nowBuffering[this.i] = 0;
				}
				else if(Math.abs(this.v) > 0.00013089969352576765){
					this.nowBuffering[this.i] = this.v
				}
			}
		}
	},

	makeUnipolarSine: function(){

		this.twoPi = Math.PI*2;
		this.p;
		this.v;

		for (this.channel = 0; this.channel<this.buffer.numberOfChannels; this.channel++){
			this.nowBuffering = this.buffer.getChannelData(this.channel);
			for (this.i=0; this.i<this.buffer.length; this.i++){
				this.p = this.i/this.buffer.length;
				this.v = (0.5*(Math.sin(this.twoPi*(this.p))))+0.5;
				if(Math.abs(this.v) <= 0.00013089969352576765){
					this.nowBuffering[this.i] = 0;
				}
				else if(Math.abs(this.v) > 0.00013089969352576765){
					this.nowBuffering[this.i] = this.v
				}
			}
		}
	},


	additiveSynth: function(overtoneArray, amplitudeArray){

		this.overtoneArray = overtoneArray;
		this.amplitudeArray = amplitudeArray;

		this.twoPi = Math.PI*2;
		this.t;
		this.v;
		this.f;
		this.a;

		for (this.channel = 0; this.channel<this.buffer.numberOfChannels; this.channel++){
			this.nowBuffering = this.buffer.getChannelData(this.channel);
			this.f = this.overtoneArray[this.channel];
			this.a = this.amplitudeArray[this.channel];
			for (this.i=0; this.i<this.buffer.length; this.i++){

				this.t = this.i/this.buffer.length;
				this.v = this.a*(Math.sin(this.twoPi*this.f*this.t));

				if(Math.abs(this.v) <= 0.00013089969352576765){
					this.nowBuffering[this.i] = 0;
				}
				else if(Math.abs(this.v) > 0.00013089969352576765){
					this.nowBuffering[this.i] = this.v
				}

			}
		}
	},

	makeSawtooth: function(exp){

		this.exp = exp;

		for (this.channel = 0; this.channel<this.buffer.numberOfChannels; this.channel++){
			this.nowBuffering = this.buffer.getChannelData(this.channel);
			for (this.i=0; this.i<this.buffer.length; this.i++){
					this.nowBuffering[this.i] = Math.pow((this.i/this.buffer.length), this.exp);
			}
		}
	},

	makeInverseSawtooth: function(exp){

		this.exp = exp;

		for (this.channel = 0; this.channel<this.buffer.numberOfChannels; this.channel++){
			this.nowBuffering = this.buffer.getChannelData(this.channel);
			for (this.i=0; this.i<this.buffer.length; this.i++){
					this.nowBuffering[this.i] = Math.pow(1-(this.i/this.buffer.length), this.exp);
			}
		}
	},

	makeTriangle: function(){

		for (this.channel = 0; this.channel<this.buffer.numberOfChannels; this.channel++){
			this.nowBuffering = this.buffer.getChannelData(this.channel);
			for (this.i=0; this.i<this.buffer.length; this.i++){

				if(this.i<=this.buffer.length/2){
					this.nowBuffering[this.i] = this.i/(this.buffer.length/2);
				}

				else if(this.i>this.buffer.length/2){
					this.nowBuffering[this.i] = 1-((this.i-this.buffer.length/2)/(this.buffer.length/2));
				}

			}
		}
	},

	makeRamp: function(peakPoint, upExp, downExp){

		this.peakPoint = parseInt(this.buffer.length*peakPoint);
		this.upExp = upExp;
		this.downExp = downExp;

		for (this.channel = 0; this.channel<this.buffer.numberOfChannels; this.channel++){
			this.nowBuffering = this.buffer.getChannelData(this.channel);
			for (this.i=0; this.i<this.buffer.length; this.i++){

				if(this.i<=this.peakPoint){
					this.nowBuffering[this.i] = Math.pow(this.i/this.peakPoint, this.upExp);
				}

				else if(this.i>this.peakPoint){
					this.nowBuffering[this.i] = Math.pow(1-((this.i-this.peakPoint)/(this.buffer.length-this.peakPoint)), this.downExp);
				}
			}
		}
	},

	makeNoise: function(){

		for (this.channel = 0; this.channel<this.buffer.numberOfChannels; this.channel++){
			this.nowBuffering = this.buffer.getChannelData(this.channel);
			for (this.i=0; this.i<this.buffer.length; this.i++){
					this.nowBuffering[this.i] = Math.random() * 2 - 1;
			}
		}
	},

	makeUnipolarNoise: function(){

		for (this.channel = 0; this.channel<this.buffer.numberOfChannels; this.channel++){
			this.nowBuffering = this.buffer.getChannelData(this.channel);
			for (this.i=0; this.i<this.buffer.length; this.i++){
					this.nowBuffering[this.i] = Math.random();
			}
		}
	},

	makeConstant: function(value){

		this.value = value;

		for (this.channel = 0; this.channel<this.buffer.numberOfChannels; this.channel++){
			this.nowBuffering = this.buffer.getChannelData(this.channel);
			for (this.i=0; this.i<this.buffer.length; this.i++){
					this.nowBuffering[this.i] = this.value;
			}
		}
	},

	makeSquare: function(dutyCycle){

		this.dutyCycle = dutyCycle;

		for (this.channel = 0; this.channel<this.buffer.numberOfChannels; this.channel++){
			this.nowBuffering = this.buffer.getChannelData(this.channel);
			for (this.i=0; this.i<this.buffer.length; this.i++){

				if(this.i<this.buffer.length*this.dutyCycle){
					this.nowBuffering[this.i] = 1;
				}

				else if(this.i>this.buffer.length*this.dutyCycle){
					this.nowBuffering[this.i] = 0;
				}
			}
		}
	},

	floatingCycleSquare: function(cycleStart, cycleEnd){

		this.cycleStart = cycleStart;
		this.cycleEnd = cycleEnd;

		for (this.channel = 0; this.channel<this.buffer.numberOfChannels; this.channel++){
			this.nowBuffering = this.buffer.getChannelData(this.channel);
			for (this.i=0; this.i<this.buffer.length; this.i++){

				if(this.i>=this.buffer.length*this.cycleStart && this.i<=this.buffer.length*this.cycleEnd){
					this.nowBuffering[this.i] = 1;
				}
				else if(this.i<=this.buffer.length*this.cycleStart || this.i>=this.buffer.length*this.cycleEnd){
					this.nowBuffering[this.i] = 0;
				}
			}
		}
	},

	quantizedArrayBuffer: function(quant, valueArray){

		this.quant = quant;
		this.valueArray = valueArray;

	    this.n_samples = this.buffer.length;
	    this.curve = new Float32Array(this.n_samples);
	    this.mod = this.n_samples/this.quant;
	    this.modVal;
	    this.value;

		for (this.channel = 0; this.channel<this.buffer.numberOfChannels; this.channel++){

			this.nowBuffering = this.buffer.getChannelData(this.channel);

			for (this.i=0; this.i<this.buffer.length; this.i++){

				this.modVal = this.i%this.mod;

				if(this.modVal==0){
	  				this.value = this.valueArray[randomInt(0, this.valueArray.length)];
	  			}

				this.nowBuffering[this.i] = this.value;

			}
		}
 	},
}

//--------------------------------------------------------------
