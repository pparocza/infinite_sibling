var masterGain;
var fadeFilter;
var offlineBuffer;
var globalNow;

setTimeout(function(){bufferLoaded();}, 1000);

function bufferLoaded(){

	var gain = audioCtx.createGain();
	gain.gain.value = 1;

	fadeFilter = new FilterFade(0);

	masterGain = audioCtx.createGain();
	masterGain.connect(gain);
	gain.connect(fadeFilter.input);
	fadeFilter.connect(audioCtx.destination);

	// INITIALIZATIONS

	if(onlineButton.innerHTML == "online"){
		setTimeout(function(){onlineBufferLoaded();}, 1000);
	}

	else if(onlineButton.innerHTML == "offline"){
		offlineBufferLoaded();
	}

}

//--------------------------------------------------------------

function runPatch(){

		fadeFilter.start(1, 50);
		globalNow = audioCtx.currentTime;

		buffer = new MyBuffer2(1, 1, audioCtx.sampleRate);
		buffer.noise().fill(0);
		buffer.loop = true;
		buffer.playbackRate = 1;

		lfo = new MyBuffer2(1, 1, audioCtx.sampleRate);
		lfo.sine(1, 1).fill(0);
		lfo.playbackRate = 2;
		lfo.loop = true;
	
		gain = new MyGain(0)

		inverseGain = new MyGain(-1)

		pan = new MyPanner2(0);

		convolver = new MyConvolver();
		cBuffer = new MyBuffer(1, 1, audioCtx.sampleRate);
		cBuffer.makeFm(442, 221, 0.25);
		convolver.setBuffer(cBuffer.buffer);

		convolver2 = new MyConvolver();
		cBuffer2 = new MyBuffer(1, 1, audioCtx.sampleRate);
		cBuffer2.makeFm(442 * 0.25, 221 * 0.251, 1);
		convolver2.setBuffer(cBuffer2.buffer);

		delay = new MyStereoDelay(0.25, 0.5, 0.25, 0.5);

		rampLFO = new MyBuffer2(1, 1, audioCtx.sampleRate);
		rampLFO.playbackRate = 0.25;
		rampLFO.sawtooth(8).fill(0);
		rampGain = new MyGain(0);
		rampLFO.connect(rampGain.gain.gain);
		rampLFO.loop = true;

		buffer.connect(convolver); buffer.connect(convolver2);
		convolver.connect(gain); convolver2.connect(gain);
		gain.connect(pan);
		lfo.connect(inverseGain); 
		inverseGain.connect(pan.gainR.gain);
		lfo.connect(gain.gain.gain); 
		lfo.connect(pan.gainL.gain)
		pan.connect(rampGain);
		rampGain.connect(delay);
		delay.connect(masterGain)

		buffer.start();
		lfo.start();
		rampLFO.start();
}

//--------------------------------------------------------------

function stopPatch(){

	var now = audioCtx.currentTime;
	fadeFilter.start(0, 20);
	setTimeout(function(){masterGain.disconnect();}, 100);
	startButton.innerHTML = "reset";

	if(onlineButton.innerHTML=="offline"){
		offlineBuffer.stop();
	}

}

//--------------------------------------------------------------

function onlineBufferLoaded(){

	startButton.disabled = false;
	startButton.innerHTML = "start";

}

//--------------------------------------------------------------

function offlineBufferLoaded(){

	runPatch();

	audioCtx.startRendering().then(function(renderedBuffer){

		offlineBuffer = onlineCtx.createBufferSource();
		offlineBuffer.buffer = renderedBuffer

		startButton.disabled = false;
		startButton.innerHTML = "start";

		offlineBuffer.connect(onlineCtx.destination);

	})

}
