var mKG; var mKDG; var mKF;
var eLMG; var eLMDG;
var sKG; var sKDG; var sKLDG; var sKF; var sKF2; var sKF3;
var nTG; var nTDG; var nTLDG;
var bLG; var bLDG; var bLFXG; var bLF; var bLF2;
var fXYG; var fXYDG; var fXYLDG;
var mKYG; var mKYDG; var mKYLDG;
var tRG; var tRDG; var tRLDG;
var rD; var rDG;
var lD; var lDG;

// MIXER

function mixerInit(){

	// FX
	rD = new MyStereoDelay(0.25, 0.125, 0.1, 1);
	rDG = new MyGain(1);

	lD = new MyStereoDelay(0.25*2, 0.125*3, 0.2, 1);
	lDG = new MyGain(1);

	rD.connect(rDG);
	rDG.connect(masterGain);

	lD.connect(lDG);
	lDG.connect(masterGain);

	// MAIN KEY
	mKG = new MyGain(1);
	mKDG = new MyGain(0);
	mKF = new MyBiquad("lowshelf", 200, 1);
	mKF.biquad.gain.value = 0;

	mKG.connect(mKF);

	mKF.connect(mKDG)
	mKDG.connect(rD);

	mKG.connect(masterGain);

	// ELINE
	eLMG = new MyGain(1.75);
	eLMDG = new MyGain(0.5);

	eLMG.connect(eLMDG)
	eLMDG.connect(rDG);

	eLMG.connect(masterGain);

	// SAW PAD
	sKG = new MyGain(1.8);
	sKLDG = new MyGain(0.15);
	sKF = new MyBiquad("lowpass", 22000, 1);
	sKF2 = new MyBiquad("peaking", 1527, 1);
	sKF2.biquad.gain.value = -4.01;
	sKF3 = new MyBiquad("peaking", 679, 1);

	sKG.connect(sKF);

	sKF.connect(sKLDG);
	sKLDG.connect(lD);

	sKF.connect(masterGain);

	// NOISE SYNTH
	nTG = new MyGain(1.3);
	nTLDG = new MyGain(0.2);

	nTG.connect(nTLDG);
	nTLDG.connect(lD);

	nTG.connect(masterGain);

	// BASS LINE
	bLG = new MyGain(1.775);
	bLFXG = new MyGain(0.4);
	bLDG = new MyGain(0.05);
	bLF = new MyBiquad("highshelf", 2000, 1);
	bLF.biquad.gain.value = -3;
	bLF2 = new MyBiquad("lowpass", 1000, 1);

	bLG.connect(bLF);
	bLF.connect(bLF2);

	bLF2.connect(bLDG);
	bLDG.connect(rD);

	bLF.connect(masterGain);
	bLFXG.connect(masterGain);

	// FLUTTER XYLOPHONE
	fXYG = new MyGain(1.5);
	fXYDG = new MyGain(0.2);
	fXYLDG = new MyGain(0.2);

	fXYG.connect(fXYDG);
	fXYG.connect(fXYLDG);
	fXYDG.connect(rD);
	fXYLDG.connect(lD);

	fXYG.connect(masterGain);

	// MALLET KEY
	mKYG = new MyGain(0.5);
	mKYDG = new MyGain(0.2);
	mKYLDG = new MyGain(0.1);

	var mKYF = new MyBiquad("highshelf", 3000, 1);
	mKYF.biquad.gain.value = -3;

	mKYG.connect(mKYF);

	mKYF.connect(mKYDG);
	mKYDG.connect(rD);
	mKYF.connect(mKYLDG);
	mKYLDG.connect(lD);

	mKYF.connect(masterGain);

	// TONE RIBBON
	tRG = new MyGain(1.25);
	tRDG = new MyGain(0.2);
	tRLDG = new MyGain(0.3);

	tRG.connect(tRDG);
	tRG.connect(tRLDG);
	tRDG.connect(rD);
	tRLDG.connect(lD);

	tRG.connect(masterGain);

}

// MIXER AUTOMATION

function mixerAutomation(now){

	var now = now;

	// MAIN KEY

	mKG.gain.gain.setValueAtTime(0.85, now+16);
	mKDG.gain.gain.setValueAtTime(0.075, now+16);

	mKG.gain.gain.setValueAtTime(0.6, now+32);
	mKF.biquad.gain.setValueAtTime(-10, now+32);

	mKG.gain.gain.setValueAtTime(0.425, now+48);
	mKDG.gain.gain.setValueAtTime(0.1, now+58);

	mKDG.gain.gain.setValueAtTime(0.2, now+64);

	mKG.gain.gain.setValueAtTime(0.7, now+80);
	mKDG.gain.gain.setValueAtTime(0.3, now+80);

	mKF.biquad.gain.setValueAtTime(1.5, now+80);

	// NOISE TONE
	nTG.gain.gain.setValueAtTime(1.1, now+112);
	nTLDG.gain.gain.setValueAtTime(0.3, now+112);

	// SAW PAD
	sKG.gain.gain.setValueAtTime(1.4, now+48);

	sKF.biquad.frequency.setValueAtTime(22000, now+54);

	sKG.gain.gain.setValueAtTime(1.1, now+80);
	sKLDG.gain.gain.setValueAtTime(0.25, now+80);
	sKF.biquad.frequency.setValueAtTime(3000, now+80);

	sKG.gain.gain.setValueAtTime(1.1, now+96);
	sKF3.biquad.gain.setValueAtTime(-4.42, now+96);

	sKG.gain.gain.setValueAtTime(1, now+112);
	sKLDG.gain.gain.setValueAtTime(0.4, now+112);
	sKF.biquad.frequency.setValueAtTime(1000, now+112);

	// BASS LINE
	bLG.gain.gain.setValueAtTime(1.5, now+64);
	bLDG.gain.gain.setValueAtTime(0.3, now+64);
	bLF2.biquad.frequency.setValueAtTime(22000, now+64);

	bLG.gain.gain.setValueAtTime(0, now+80);
	bLFXG.gain.gain.setValueAtTime(0, now+80);

}

//--------------------------------------------------------------

// MAIN KEY

//--------------------------------------------------------------

var mmKey1;
var mmKey2;
var mmKeyFade;
var dR1;
var dR2;
var dR3;
var dR4;
var dR5;
var dR6;
var dR7;
var dR8;

function initMainKey(){

	var output = audioCtx.createGain();
	output.gain.value = 0.5;

	mmKey1 = new MoogXylophone();
	mmKey1.trXylophone();

	var f = new MyBiquad("highpass", 500, 1);
	var f2 = new MyBiquad("highpass", 80, 1);

	var dly = new MyStereoDelay(0.25, 0.125, 0.3, 1);
	var dG = new MyGain(0.4);

	var wG = new MyGain(0.175);
	var w = new MyWaveShaper();
	w.makeFm(5, 0.09, 1);
	var wOG = new MyGain(0.1);

	dR1 = new LFO(0, 1, 0.25);
	dR1.buffer.makeInverseSawtooth(2);
	var dRF1 = new MyBiquad("lowpass", 1000, 0);
	var dRG1 = new MyGain(0);

	dR2 = new LFO(0, 1, 0.3);
	dR2.buffer.makeSawtooth(8);
	var dRF2 = new MyBiquad("lowpass", 1000, 0);
	var dRG2 = new MyGain(0);

	mmKeyFade = new FilterFade(0.01);

	mmKey1.connect(f);
	f.connect(mmKeyFade);

	dR1.connect(dRF1);
	dR2.connect(dRF2);

	f.connect(dRG1); dRF1.connect(dRG1.gain.gain);
	dRG1.connect(dG);
	dG.connect(dly);
	dly.connect(wG);

	f.connect(dRG2); dRF2.connect(dRG2.gain.gain);
	dRG2.connect(dG);
	dG.connect(dly);
	dly.connect(wG);

	wG.connect(w);
	w.connect(wOG);
	wOG.connect(f2);
	f2.connect(output);

	// TO MIXER
	output.connect(mKG.input);

}

//--------------------------------------------------------------

// ELINES

//--------------------------------------------------------------

var eL1;
var eL2;
var eL3;
var eS;
var eD;
var eVS1;
var eTS1;

//--------------------------------------------------------------

function initELines(){

	var output = audioCtx.createGain();
	output.gain.value = 0.375;

	var rate = 0.03125;
	var sL = 14;

	// INSTRUMENTS

	var eLG = new MyGain(1);

	eL1 = new ELine3(rate, sL, 1);
	eL2 = new ELine3(rate, sL, 1);
	eL3 = new ELine3(rate, sL, 1);

	// EFFECTS

	var dL = new Effect();
	dL.delayLine2(rate*2, sL*2);
	dL.on();

	eD = new Effect();
	eD.shortDelay();

	//

	// LINES TO FX GAIN
		eL1.connect(dL, eLG);
		eL2.connect(dL, eLG);
		eL3.connect(dL, eLG);

	// LINES TO FX

		eLG.connect(eD);

	// SEQUENCES

	var sL = 2000;

	//
		eVS1 = new Sequence();
		eTS1 = new Sequence();
		eVS1 = eVS1.randomSelect(sL, [1, 0]);
		eTS1 = eTS1.additivePowers(sL, 2, [-2, -3, -4]);

	// FX TO OUTPUT

		var f = new MyBiquad("bandpass", 8000, 8);
		var f2 = new MyBiquad("bandpass", 300, 4);
		var p = new MyPanner2(0.0735368890972049);
		var p2 = new MyPanner2(-0.34451749391552067);
		var wG = new MyGain(0.05);
		var w = new MyWaveShaper();
		w.makeAm(10, 200, 1);

		var f3 = new MyBiquad("highpass", 31, 1);
		var f4 = new MyBiquad("lowshelf", 800, 1);
		f4.biquad.gain.value = -16;

		eD.connect(f);

		f.connect(p);
		f2.connect(p2);

		p.connect(wG);
		p2.connect(wG);
		wG.connect(w);

		w.connect(f3);
		f3.connect(f4);
		f4.connect(output);

		// TO MIXER
		output.connect(eLMG.input);


}

//--------------------------------------------------------------

// SK PAD

//--------------------------------------------------------------

var sK2;
var dCG2;
var mPG2ain2;
var sKFF2;
var mPG2;
var mPGG2;
var fx;
var fx2;
var f;
var dE;

var oG1;
var oG2;
var oG3;

var oAmG1;
var oAmG2;

function initSKPad(fund){

	output = audioCtx.createGain();
	output.gain.value = 1.25;

	var fund = fund;

	var nNodes = 5;

	var rateArray = new Sequence();
	rateArray.randomFloats(nNodes, 0.125, 0.25);
	rateArray.multiply(1);
	rateArray = rateArray.sequence;

	var sawSines = new SawSines(nNodes, cArray[0], rateArray);
	var multiPan = new MyGain(1);

	var inArray = [0.2, 0.2, 0.2, 0.2, 0.2]
	var outArray = [0.01, 0.01, 0.01, 0.01, 0.01];

	var sB2 = new ShaperBank(nNodes, inArray, outArray);
	sB2.on.gain.gain.value = 1;

	for(var i=0; i<nNodes; i++){

		sawSines.connectOutput(sB2.onGain[i].gain, i);
		sB2.connectOutput(multiPan, i);

	}

	var mPG2C2 = new BufferConstant(1);
	mPG2ain2 = new MyGain(1);
	var mPG2F = new MyBiquad("lowpass", 10, 0);
	mPG2 = new Effect();
	mPG2.thru2();
	mPG2.on();

	mPG2C2.connect(mPG2ain2);
	mPG2ain2.connect(mPG2F);

	multiPan.connect(mPG2); mPG2F.connect(mPG2.output.gain);

	// oAm

	var oAm1 = new OffsetSquareAM2(randomFloat(0.25, 1), randomFloat(0.25, 1), randomFloat(0.1, 0.8), randomFloat(0.5, 0.8));
	var oAm2 = new OffsetSquareAM2(randomFloat(0.1, 0.3), randomFloat(0.2, 0.5), randomFloat(0.1, 0.8), randomFloat(0.5, 0.8));
	var oAm3 = new OffsetSquareAM2(randomFloat(0.1, 0.3), randomFloat(0.2, 0.5), randomFloat(0.1, 0.8), randomFloat(0.5, 0.8));

	oAm1.smoothingFilter.biquad.frequency.value = randomInt(2, 11);
	oAm2.smoothingFilter.biquad.frequency.value = randomInt(2, 11);
	oAm3.smoothingFilter.biquad.frequency.value = randomInt(2, 11);

	// fx

	var dly = new MyStereoDelay(0.25, 0.11, 0.2, 1);
	var dly2 = new MyStereoDelay(0.4, 0.55, 0.25, 1);
	var dC = new BufferConstant(1);
	dCG2 = new MyGain(0);
	var dCF = new MyBiquad("lowpass", 10, 0);
	var dG = new MyGain(0);

	f = new MyBiquad("lowshelf", 500, 0);
	f.biquad.gain.value = -12;
	var f2 = new MyBiquad("highpass", 51, 0);
	var f3 = new MyBiquad("lowpass", 6300, 0);

	dE = new Envelope([0, 10, 0, 100]);
	var dEG = new MyGain(0);

	dE.connect(dEG.gain.gain);

	dC.connect(dCG2);
	dCG2.connect(dCF);

	oAmG1 = new MyGain(1);
	oAmG2 = new MyGain(0);

	mPG2.connect(oAm1);
	oAm1.connect(oAm2);
	oAm1.connect(oAm3);

	oAm2.connect(oAmG1);
	oAm3.connect(oAmG1);

	oAm2.connect(oAmG2);
	oAm3.connect(oAmG2);

	oAmG1.connect(dly);
	oAmG2.connect(f);

	dly.connect(dG); dCF.connect(dG.gain.gain);
	dG.connect(f); dG.connect(dly2);
	dly2.connect(dEG);
	dEG.connect(f);
	f.connect(f2);
	f2.connect(f3);
	f3.connect(output);

	mPGG2 = new FilterFade(0);

	mPG2.connect(mPGG2);
	mPGG2.connect(output);

	//

	sKFF2 = new FilterFade(0);
	oG1 = new MyGain(0);

	output.connect(sKFF2.input);
	sKFF2.connect(oG1);

	sK2 = sawSines;

	mPG2C2.start();
	dC.start();
	oAm1.start();
	oAm2.start();
	oAm3.start();

	//-----------------------------------

	var nFX = 4;
	var fxG = new MyGain(1);
	var fxG2 = new MyGain(1);

	sKFF2.connect(fxG);
	sKFF2.connect(fxG2);
	oG2 = new MyGain(1);
	oG3 = new MyGain(1);

	fx = new MultiEffect(nFX);
	fx.effects[0].effect.shortDelay();
	fx.effects[1].effect.shortDelay();
	fx.effects[2].effect.shortDelay();
	fx.effects[3].effect.shortDelay();


	for(var i=0; i<nFX; i++){
		fxG.connect(fx.effects[i].effect);
		fx.effects[i].effect.output.gain.value = 1/nFX;
		fx.effects[i].effect.connect(oG2);
	}

	//-----------------------------------

	var nFX2 = 4;

	fx2 = new MultiEffect(nFX2);
	fx2.effects[0].effect.echo();
	fx2.effects[1].effect.echo();
	fx2.effects[2].effect.echo();
	fx2.effects[3].effect.echo();


	for(var i=0; i<nFX; i++){
		fxG2.connect(fx2.effects[i].effect);
		fx2.effects[i].effect.output.gain.value = 1/nFX2;
		fx2.effects[i].effect.connect(oG3);
	}

	//-----------------------------------

	oG1.gain.gain.value = 0;
	oG2.gain.gain.value = 1;
	oG3.gain.gain.value = 1;

	// TO MIXER
	oG1.connect(sKG);
	oG2.connect(sKG);
	oG3.connect(sKG);

}

//--------------------------------------------------------------

// NOISE SYNTH

//--------------------------------------------------------------

var nT;
var nTP;

function initNoiseSynth(){

	var output = audioCtx.createGain();
	output.gain.value = 1.2;

	var fund = 432;
	var eArray = [1, 1, 0.1, 1.5, 0, 0.6];

	// INSTRUMENTS
	nT = new Instrument();
	nT.noiseSynth(fund, fund, eArray);

	nTP = new MyPanner2(0);
	var w = new MyWaveShaper();
	w.makeSigmoid(20);

	// CONNECTIONS

	nT.connect(nTP);
	nTP.connect(w);
	w.connect(output);

	// TO MIXER
	output.connect(nTG.input);

}

//--------------------------------------------------------------

// BASS

//--------------------------------------------------------------

var eB;
var eBFX1A;

function initBassFX(){

	var output =  audioCtx.createGain();
	output.gain.value = 0.4;

	// FX TAPS

	var nFX = 2;

	eBFX1A = new MultiEffect(nFX);
	eBFX1A.effects[0].effect.shortDelay2();
	eBFX1A.effects[1].effect.shortDelay2();

	for(var i=0; i<nFX; i++){

		eBFX1A.effects[i].effect.output.gain.value = 1/nFX;
		eBFX1A.effects[i].effect.connect(output);

	}

	// TO MIXER
	output.connect(bLFXG.input);

}

//--------------------------------------------------------------

function initBass(){

	var output = audioCtx.createGain();
	output.gain.value = 0.125;

	// SOURCE

	eB = new EPBass([6, 5, 5], [26, 25, 21]);
	eB.output.gain.value = 0.4;
	eB.start();

	var f = new MyBiquad("highpass", 80, 0);

	var fxG = new MyGain(1);

	eB.connect(f);
	f.connect(output);

	// FX CONNECTIONS

	f.connect(fxG);

	for(var i=0; i<eBFX1A.nEffects; i++){
		fxG.connect(eBFX1A.effects[i].effect);
	}

	// TO MIXER
	output.connect(bLG.input);

}


function bassSequence(startTime, now, inst, sequenceLength, fund, iArray, onsetBase, onsetExpArray, durationBase, durationExpArray, timbreMin, timbreMax){

	var startTime = startTime;
	var now = now;

	var inst = inst;

	// write sequences

	var fund = fund;
	var iArray = iArray;
	var sL = sequenceLength;

	var onsetBase = onsetBase;
	var onsetExpArray = onsetExpArray;

	var durationBase = durationBase;
	var durationExpArray = durationExpArray;

	var timbreMin = timbreMin;
	var timbreMax = timbreMax;

	var oSeq = new Sequence();
	var pSeq = new Sequence();
	var octSeq = new Sequence();
	var dSeq = new Sequence();
	var tSeq = new Sequence();

	oSeq.additivePowers(sL, onsetBase, onsetExpArray);
	pSeq.randomSelect(sL, iArray);
	pSeq.multiply(fund);
	octSeq.randomPowers(sL, 2, [-1, -2]);
	dSeq.randomPowers(sL, durationBase, durationExpArray);
	tSeq.randomFloats(sL, timbreMin, timbreMax);

	oSeq = oSeq.sequence;
	octSeq = octSeq.sequence;
	pSeq = pSeq.sequence;
	dSeq = dSeq.sequence;
	tSeq = tSeq.sequence;

	// play

	for(var i=0; i<sL; i++){
		inst.timbreGain.gain.gain.value = tSeq[i];
		inst.playAtTime(startTime+now+oSeq[i], pSeq[i]*octSeq[i], dSeq[i]);
	}

}

//--------------------------------------------------------------

function fxSequence(startTime, now, mFX, sequenceLength){

	var startTime = startTime;
	var now = now;

	var mFX = mFX;
	var sequenceLength = sequenceLength;

	var oSeqArray = [];
	var divArray = new MyArray([0.8, 0.4, 0.31]);
	divArray.multiply(0.5);
	divArray = divArray.array;

	for(var i=0; i<mFX.nEffects; i++){
		// create a new onset sequence
		oSeqArray[i] = new Sequence();
		oSeqArray[i].additive(sequenceLength, divArray);

		for(var j=0; j<sequenceLength; j++){
			// implement onset sequence
			mFX.effects[i].effect.switchAtTime(randomInt(0, 2), startTime+now+oSeqArray[i].sequence[j]);
		}
	}
}

//--------------------------------------------------------------

// FLUTTER XYLOPHONE

//--------------------------------------------------------------

var mm;

function initFlutterXylophone(){

	var output = audioCtx.createGain();
	output.gain.value = 0.00275;

	mm = new MoogXylophone();
	mm.trXylophone();

	var dly = new MyStereoDelay(0.0625, 0.125, 0.4, 1);
	var f = new MyBiquad("highpass", 500, 0);
	var w = new MyWaveShaper();
	w.makeFm(400, 200, 1);
	var wGain = new MyGain(0.1);

	// oAm

	var oAm = new OffsetSquareAM(0.3, 0.5);
	var oAm2 = new OffsetSquareAM(0.21, 0.7);

	var fade  = new MyBuffer(1, 1, audioCtx.sampleRate);
	fade.playbackRate = 10;
	fade.loop="true";
	fade.makeSawtooth(8);
	var fG = new MyGain(0);
	var fGG = new MyGain(10);

	mm.connect(fG); fade.connect(fG.gain.gain);
	fG.connect(fGG);
	fGG.connect(wGain);

	mm.connect(wGain);
	wGain.connect(w);

	w.connect(dly);
	dly.connect(oAm);
	oAm.connect(oAm2);
	oAm2.connect(output);

	// TO MIXER
	output.connect(fXYG.input);

	// START
	oAm.start();
	oAm2.start();
	fade.start();

}

//--------------------------------------------------------------

// MALLET KEYS

//--------------------------------------------------------------

var mKFXIn;
var mKFXOut;

function initMalletKeys(){

	mKFXIn = audioCtx.createGain();
	mKFXOut = audioCtx.createGain();

	var dly = new MyStereoDelay(0.25, 0.11, 0.1, 1);

	var oAm1 = new OffsetSquareAM(2.11, 10);
	oAm1.smoothingFilter.biquad.frequency.value = 10;
	var oAm2 = new OffsetSquareAM(0.23, 0.51);
	oAm2.smoothingFilter.biquad.frequency.value = 10;
	var oAm3 = new OffsetSquareAM(0.31, 0.27);
	oAm3.smoothingFilter.biquad.frequency.value = 10;

	mKFXIn.connect(oAm1.input);
	oAm1.connect(oAm2);
	oAm2.connect(dly);
	oAm3.connect(dly);
	dly.connect(mKFXOut);

	oAm1.start();
	oAm2.start();
	oAm3.start();

	initMalletKey3();
	initMalletKey4();

}

//--------------------------------------------------------------

var sK3;
var dCG3;
var mPGain3;
var mK3FX;

function initMalletKey3(){

	output = audioCtx.createGain();

	var fund = 0.25*432*(P5);
	var c1 = new MyArray([1/M2, M2*2, P5, M6, P5*2]);
	c1 = c1.multiply(fund);

	var rateArray = new MyArray([0.125, 0.25, 0.125, 0.25, 0.125]);
	rateArray.multiply(32);
	rateArray = rateArray.array;

	var panArray = [-1, -0.5, 0, -0.5, -1];

	var nNodes = 5;

	var sawSines = new SawSines2(nNodes, c1, rateArray);
	var multiPan = new MultiPan(panArray);

	var inArray = [0.2, 0.2, 0.2, 0.2, 0.2]
	var outArray = [0.01, 0.01, 0.01, 0.01, 0.01];

	var sB3 = new ShaperBank(nNodes, inArray, outArray);
	sB3.on.gain.gain.value = 1;

	for(var i=0; i<nNodes; i++){

		sawSines.connectOutput(sB3.onGain[i].gain, i);
		sB3.connectOutput(multiPan.pans[i].pan, i);

	}

	var mPGC3 = new BufferConstant(1);
	mPGain3 = new MyGain(1);
	var mPGF = new MyBiquad("lowpass", 10, 0);
	var mPG = new MyGain(0);

	mPGC3.connect(mPGain3);
	mPGain3.connect(mPGF);

	multiPan.connectAll(mPG); mPGF.connect(mPG.gain.gain);

	// fx

	var dC = new BufferConstant(1);
	dCG3 = new MyGain(0);
	var dCF = new MyBiquad("lowpass", 10, 0);
	var dG = new MyGain(0);

	var f = new MyBiquad("lowshelf", 2000, 0);
	f.biquad.gain.value = -18;
	var f2 = new MyBiquad("lowpass", 20000, 0);

	dC.connect(dCG3);
	dCG3.connect(dCF);

	mPG.connect(mKFXIn);
	mKFXOut.connect(dG.input); dCF.connect(dG.gain.gain);
	dG.connect(f);
	f.connect(f2);
	f2.connect(output);

	sK3 = sawSines;

	mPGC3.start();
	dC.start();

	// FX TAPS

	var nFX = 8;
	var fxG = new MyGain(1);

	mK3FX = new MultiEffect(nFX);
	mK3FX.effects[0].effect.filterPan();
	mK3FX.effects[1].effect.filterPan();
	mK3FX.effects[2].effect.filterPan();
	mK3FX.effects[3].effect.filterPan();
	mK3FX.effects[4].effect.filterPan();
	mK3FX.effects[5].effect.filterPan();
	mK3FX.effects[6].effect.filterPan();
	mK3FX.effects[7].effect.filterPan();

	f2.connect(fxG);

	for(var i=0; i<nFX; i++){
		fxG.connect(mK3FX.effects[i].effect);
		mK3FX.effects[i].effect.connect(output);
	}

	// TO MIXER
	output.connect(mKYG.input);

}

//--------------------------------------------------------------

var sK4;
var dCG4;
var mPGain4;

function initMalletKey4(){

	output = audioCtx.createGain();

	var fund = 0.5*432*(d5);
	var c1 = [fund*(M6), fund*P5*2, fund*(M6), fund*M2, fund*P4*2];

	var rateArray = new MyArray([0.125, 0.25, 0.125, 0.25, 0.125]);
	rateArray.multiply(32);
	rateArray = rateArray.array;

	var panArray = [-1, -0.5, 0, -0.5, -1];

	var nNodes = 5;

	var sawSines = new SawSines2(nNodes, c1, rateArray);
	var multiPan = new MultiPan(panArray);

	var inArray = [0.2, 0.2, 0.2, 0.2, 0.2]
	var outArray = [0.01, 0.01, 0.01, 0.01, 0.01];

	var sB4 = new ShaperBank(nNodes, inArray, outArray);
	sB4.on.gain.gain.value = 1;

	for(var i=0; i<nNodes; i++){

		sawSines.connectOutput(sB4.onGain[i].gain, i);
		sB4.connectOutput(multiPan.pans[i].pan, i);

	}

	var mPGC4 = new BufferConstant(1);
	mPGain4 = new MyGain(1);
	var mPGF = new MyBiquad("lowpass", 10, 0);
	var mPG = new MyGain(0);

	mPGC4.connect(mPGain4);
	mPGain4.connect(mPGF);

	multiPan.connectAll(mPG); mPGF.connect(mPG.gain.gain);

	// fx

	var dC = new BufferConstant(1);
	dCG4 = new MyGain(0);
	var dCF = new MyBiquad("lowpass", 10, 0);
	var dG = new MyGain(0);

	var f = new MyBiquad("highpass", 500, 0);
	f.biquad.gain.value = -18;
	var f2 = new MyBiquad("lowpass", 8000, 0);

	dC.connect(dCG4);
	dCG4.connect(dCF);

	mPG.connect(mKFXIn);
	mKFXOut.connect(dG.input); dCF.connect(dG.gain.gain);
	dG.connect(f);
	f.connect(f2);
	f2.connect(output);

	sK4 = sawSines;

	//TO MIXER
	output.connect(mKYG.input);

	// START
	mPGC4.start();
	dC.start();

}

//--------------------------------------------------------------

// MM RIBBONS

//--------------------------------------------------------------

var mmKey2;
var mmKeyFade2;
var dR1A;
var dR2A;
var dR3A;

function initMMRibbons(){

	var output = audioCtx.createGain();
	output.gain.value = 3;

	mmKey2 = new MoogXylophone();
	mmKey2.trXylophone();

	var f = new MyBiquad("highpass", 500, 1);
	var f2 = new MyBiquad("highpass", 1000, 1);

	var dly = new MyStereoDelay(0.25, 0.125, 0.3, 1);
	var dG = new MyGain(0.4);
	var dly2 = new MyStereoDelay(0.4, 0.325, 0.3, 1);
	var dG2 = new MyGain(0.4);

	var wG = new MyGain(0.1);
	var w = new MyWaveShaper();
	w.makeFm(5, 0.4, 1);
	var wOG = new MyGain(0.1)

	mmKeyFade2 = new FilterFade(0.01);

	mmKey2.connect(f);

	dR1A = new LFO(0, 1, 0.25);
	dR1A.buffer.makeSawtooth(32);
	var dRF1 = new MyBiquad("lowpass", 5, 0);
	var dRG1 = new MyGain(0);

	dR2A = new LFO(0, 1, 0.13);
	dR2A.buffer.makeSawtooth(16);
	var dRF2 = new MyBiquad("lowpass", 5, 0);
	var dRG2 = new MyGain(0);

	dR3A = new LFO(0, 1, 0.17);
	dR3A.buffer.makeSawtooth(16);
	var dRF3 = new MyBiquad("lowpass", 5, 0);
	var dRG3 = new MyGain(0);

	dR1A.connect(dRF1);
	dR2A.connect(dRF2);
	dR3A.connect(dRF3);

	f.connect(dRG1); dRF1.connect(dRG1.gain.gain);
	dRG1.connect(dG);

	f.connect(dRG2); dRF2.connect(dRG2.gain.gain);
	dRG2.connect(dG);

	f.connect(dRG3); dRF3.connect(dRG3.gain.gain);
	dRG3.connect(dG2);

	dG.connect(dly);
	dly.connect(wG);

	dG2.connect(dly2);
	dly2.connect(wG);

	wG.connect(w);
	w.connect(wOG);
	wOG.connect(f2);
	f2.connect(output);

	// MIXER
	output.connect(tRG.input);

}

//--------------------------------------------------------------
