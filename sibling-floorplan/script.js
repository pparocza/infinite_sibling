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

		// here is where if you did an actual frequency modulation and modulated 
		// the modulation gain (modulate modulate modulate), you could get a more 
		// active contour of brightness (can't since you can't fm the convolution)
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

		sc = new SchwaBox("i");
		sc.output.gain = 0.00625;

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

		delay.connect(sc);
		// sc.connect(masterGain)

		reverb = new MyConvolver()
		rBuf = new MyBuffer2(2, 1, audioCtx.sampleRate);
		rBuf.noise().fill(0); rBuf.noise().fill(1);
		rBuf.inverseSawtooth(3).multiply(0); rBuf.inverseSawtooth(3).multiply(1);
		reverb.setBuffer(rBuf.buffer);
		reverb.output.gain = 0.1;

		sc.connect(reverb);
		// reverb.connect(masterGain);
		
		squareSc = new SchwaBox("ae");
		sqB = new MyBuffer2(1, 1, audioCtx.sampleRate);
		sqB.floatingCycleSquare(0.1, 0.3).add(0); sqB.floatingCycleSquare(0.6, 0.8).add(0);
		sqB.playbackRate = 0.25;
		sqB.loop = true;
		sqG = new MyGain(0);

		rampGain.connect(squareSc); 
		squareSc.connect(sqG); sqB.connect(sqG.gain.gain);
		// sqG.connect(delay);
		// sqG.connect(reverb);

		invSaw = new MyBuffer2(1, 1, audioCtx.sampleRate);
		invSaw.sine(440).fill(0);
		invSaw.inverseSawtooth(4).multiply(0);
		invSaw.loop = true;
		invSaw.playbackRate = 10;
		// invSaw.connect(masterGain);

		buffer.start();
		lfo.start();
		rampLFO.start();
		sqB.start();
		invSaw.start();
}

// STRUCTURE - effects fade in - chord change? - fuzz blips

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
