var masterGain;
var fadeFilter;
var dE;
var offlineBuffer;

setTimeout(function(){bufferLoaded();}, 1000);

var fund;
var sKFund;

var c1 = new MyArray([1/M2, M2*2, P5, M6, P5*2]);
var c2 = new MyArray([1, P5, P4, 1/m3, P4*2]);

var cArray;

function initFund()
{
	fund = randomFloat(432*P4, 432*m6);
	sKFund = 0.25 * fund;

	c1 = c1.multiply(sKFund);
	c2 = c2.multiply(sKFund);

	cArray = [c1, c2];
}

function bufferLoaded(){

	initFund();

	var gain = audioCtx.createGain();
	gain.gain.value = 5;

	fadeFilter = new FilterFade(0);

	// EFFECTS
	var pSD = new Effect();
	var nDelays = 4;
	var fbArray = new Sequence();
	fbArray.randomFloats(nDelays, 0.1, 0.2);
	fbArray = fbArray.sequence;
	pSD.powerSequenceDelay(nDelays, 2, [-1, -2, -3, -1.1, -1.2], fbArray);
	pSD.on();
	pSD.output.gain.value = 1/(4*nDelays);
	dE = new Envelope([1, 30, 1, (54+129-30)]);
	var dEG = new MyGain(0);

	var f = new MyBiquad("highpass", 50, 1);

	masterGain = audioCtx.createGain();
	masterGain.connect(gain);

	gain.connect(dEG.input); dE.connect(dEG.gain.gain);
	dEG.connect(pSD);
	pSD.connect(fadeFilter);

	gain.connect(fadeFilter.input);
	fadeFilter.connect(f);
	f.connect(audioCtx.destination);

	mixerInit();

	initMainKey();
	initELines();
	initSKPad();
	initNoiseSynth();
	initBassFX();
	initBass();
	initFlutterXylophone();
	initMalletKeys();
	initMMRibbons();

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

	if(onlineButton.innerHTML == "online"){
		runPatchOnline();
	}

	else if(onlineButton.innerHTML == "offline"){
		runPatchOffline();
	}

}

//--------------------------------------------------------------

function runPatchOnline(){

	var now = audioCtx.currentTime;

	mixerAutomation(now);

	// KEY
	playMainKey(0, now, mmKey1, fund, 1, [0.125, 0.25]);

	// ELINE NOISE
	eLines(16, now);

	// KEY PAD
	playSKPad(32, now);

	// NOISE SYNTH
	playNoiseTone(32, now, fund/P5);

	// BASS LINE
	bassLineSection(fund, 48, now);

	// FLUTTER XYLOPHONE
	setTimeout(function(){playFlutterXylophone(80, fund, now);}, 80*1000);

	// KEY MALLETS
	playMalletKeys(80, 32, fund, now);

	// KEY RIBBON
	setTimeout(function(){playMMRibbons(80, now, mmKey2, fund, 2, [0.0625]);}, 80*1000);

	// DELAY FADE
	dE.startAtTime(20+now);

}

//--------------------------------------------------------------

function runPatchOffline(){

	var now = audioCtx.currentTime;

	mixerAutomation(now);

	// KEY
	playMainKeyOffline(0, now, mmKey1, fund, 1, [0.125, 0.25]);

	// ELINE NOISE
	eLines(16, now);

	// KEY PAD + NOISE SYNTH
	playSKPad(32, now);
	playNoiseTone(32, now, fund/P5);

	// BASS LINE
	bassLineSection(fund, 48, now);

	// XYLOPHONE
	playFlutterXylophone(80, now);

	// KEY MALLETS
	playMalletKeys(80, 32, now);

	// KEY RIBBON
	playMMRibbons(112, now, mmKey2, 2, [0.0625]);

	// DELAY FADE
	dE.startAtTime(20+now);

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
