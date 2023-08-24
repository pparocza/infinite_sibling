//--------------------------------------------------------------

// MAIN KEY

//--------------------------------------------------------------

function playMainKey(startTime, now, mmKey, octave, possOnsetDurations){

	var startTime = startTime;
	var now = now;
	var mmKey = mmKey;
	var possOnsetDurations = possOnsetDurations;
	var octave = octave;

	var fund = octave*432*(P5);

	var sequenceLength = 8;
	var mC1 = new MyArray([1/M2, M2, P5, M6]);
	var mC2 = new MyArray([1, 1/P5, 1/P4, 1/m3]);
	mC1.multiply(fund);
	mC1 = mC1.array;
	mC2.multiply(fund);
	mC2 = mC2.array;

	var cArray = [mC1, mC2];

	var onsetSequence = new Sequence();
	onsetSequence.additive(sequenceLength, possOnsetDurations);
	onsetSequence.add(startTime+now);
	onsetSequence = onsetSequence.sequence;
	var pitchSequence = new Sequence();
	pitchSequence.randomSelect(sequenceLength, mC1);

	for(var k=0; k<14; k++){
		mmChordPlayer(k, cArray[k%2], onsetSequence, mmKey)
	}

	mmKeyFade.startAtTime(1, 2, startTime+now);

	dR1.startAtTime(startTime+now);
	dR2.startAtTime(startTime+now);

	// STOP
	mmKey.stopAtTime(48+32+32+now+startTime);

}

//--------------------------------------------------------------

function playMainKeyOffline(startTime, now, mmKey, octave, possOnsetDurations){

	var startTime = startTime;
	var now = now;
	var mmKey = mmKey;
	var possOnsetDurations = possOnsetDurations;
	var octave = octave;

	var fund = octave*432*(P5);

	var sequenceLength = 8;
	var mC1 = new MyArray([1/M2, M2, P5, M6]);
	var mC2 = new MyArray([1, 1/P5, 1/P4, 1/m3]);
	mC1.multiply(fund);
	mC1 = mC1.array;
	mC2.multiply(fund);
	mC2 = mC2.array;

	var cArray = [mC1, mC2];

	var onsetSequence = new Sequence();
	onsetSequence.additive(sequenceLength, possOnsetDurations);
	onsetSequence.add(startTime+now);
	onsetSequence = onsetSequence.sequence;
	var pitchSequence = new Sequence();
	pitchSequence.randomSelect(sequenceLength, mC1);

	for(var k=0; k<14; k++){
		mmChordPlayerOffline(k, cArray[k%2], onsetSequence, mmKey)
	}

	mmKeyFade.startAtTime(1, 2, startTime+now);

	dR1.startAtTime(startTime+now);
	dR2.startAtTime(startTime+now);

	// STOP
	mmKey.stopAtTime(48+32+32+now+startTime);

}

//--------------------------------------------------------------

function mmChordPlayer(idx, chord, onsetSequence, key){

		var idx = idx;
		var chord = chord;
		var onsetSequence = onsetSequence;
		var key = key;

		setTimeout(function(){
			for(var j=0; j<16; j++){
				for(var i=0; i<onsetSequence.length; i++){
					key.playAtTime(chord[i%chord.length]/(randomInt(1, 3)), (idx*8)+(j/2)+onsetSequence[i]);
				}
			}
		}, (8*idx)*1000);

}

//--------------------------------------------------------------

function mmChordPlayerOffline(idx, chord, onsetSequence, key){

		var idx = idx;
		var chord = chord;
		var onsetSequence = onsetSequence;
		var key = key;

			for(var j=0; j<16; j++){
				for(var i=0; i<onsetSequence.length; i++){
					key.playAtTime(chord[i%chord.length]/(randomInt(1, 3)), (idx*8)+(j/2)+onsetSequence[i]);
				}
			}

}

//--------------------------------------------------------------

// ELINES

//--------------------------------------------------------------

function eLines(startTime, now){

	var startTime = startTime;
	var now = now;

	eL1.startAtTime(startTime+now);
	eL2.startAtTime(startTime+now);
	eL3.startAtTime(startTime+now);

	eL1.stopAtTime(startTime+now+16);
	eL2.stopAtTime(startTime+now+16);
	eL3.stopAtTime(startTime+now+16);

	eD.switchSequence(eVS1, eTS1);

}

//--------------------------------------------------------------

// SK PAD

//--------------------------------------------------------------

var sKFund = 0.25*432*(P5);

var c1 = new MyArray([1/M2, M2*2, P5, M6, P5*2]);
var c2 = new MyArray([1, P5, P4, 1/m3, P4*2]);
c1 = c1.multiply(sKFund);
c2 = c2.multiply(sKFund);

var cArray = [c1, c2];

function playSKPad(startTime, now){

		var startTime = startTime;
		var now = now;

		var output = audioCtx.createGain();

		var dly = new MyStereoDelay(0.25, 0.11, 0.2, 1);

		output.connect(dly.input);
		dly.connect(masterGain);

		dCG2.gain.gain.value = 1;

		var filterFade = sKFF2;

		sK2.startAtTime(startTime+now);
		filterFade.startAtTime(1, 10, startTime+now);
		dE.startAtTime(startTime+now);

		// PLAY CHORDS

		// A
		for(var i=0; i<18; i++){
			if(i%2==0){
				sK2.setFreqsAtTime(cArray[0], startTime+now+(i*8));
			}
			else if(i%2==1){
				sK2.setFreqsAtTime(cArray[1], startTime+now+(i*8));
			}
		}

		// FX SEQUENCES

			// FX-S 1

			var sL = 750;

			var oSeq = new Sequence();
			var divArray = new MyArray([0.4, 0.2, 0.155]);

				for(var i=0; i<fx.nEffects; i++){
					// create a new onset sequence
					oSeq.additive(sL, divArray.array);

					for(var j=0; j<sL; j++){
						// implement onset sequence
						fx.effects[i].effect.switchAtTime(randomInt(0, 2), startTime+now+oSeq.sequence[j]);
					}
				}

			// FX-S 2

			var sL2 = 285;

			var oSeq2 = new Sequence();
			var divArray2 = new MyArray([0.4, 0.2, 0.155]);

				for(var i=0; i<fx2.nEffects; i++){
					// create a new onset sequence
					oSeq2.additive(sL2, divArray2.array);

					for(var j=0; j<sL2; j++){
						// implement onset sequence
						fx2.effects[i].effect.switchAtTime(randomInt(0, 2), 72+startTime+now+oSeq2.sequence[j]);
					}
				}

		// STOP
		sK2.stopAtTime(startTime+now+48+32+16); //48+32+32

}

//--------------------------------------------------------------

// NOISE SYNTH

//--------------------------------------------------------------

function playNoiseTone(startTime, now, fund){

	var startTime = startTime;
	var now = now;
	var fund = fund;

	nT.startAtTime(startTime+now);

	// SEQUENCES
	var sL = 50;

	// ONSET SEQUENCE
	var oSeq = new Sequence();
	oSeq.additiveMultiples(sL, 3, [2.5, 2, 1.5]);
	oSeq.add(startTime+now);
	oSeq = oSeq.sequence;

	// FREQUENCY SEQUENCE
	var fSeq = new Sequence();
	fSeq.randomSelect(sL, [1, M2, M3, P4, P5, M6]);
	fSeq.multiply(fund);
	fSeq = fSeq.sequence;

	var j = 0;

	for(var i=0; i<oSeq.length; i++){
		nT.playAtTime(oSeq[i]);
		nT.s.filter.biquad.frequency.setValueAtTime(fSeq[j], oSeq[i]);
		nT.s.filter.biquad.Q.setValueAtTime(fSeq[j], oSeq[i]);
		nTP.setPositionAtTime(randomFloat(-0.7, 0.7), oSeq[i]);
		j++;
	}

	// OFF
	nT.stopAtTime(startTime+now+48+32+16);

}

//--------------------------------------------------------------

// BASS

//--------------------------------------------------------------

var s1 = 0;
var s2 = s1+8;
var s3 = s2+8;
var s4 = s3+8;
var s5 = s4+8
var s6 = s5+8;

function bassLineSection(fund, startTime, now){

	var startTime = startTime;
	var now = now;

	var fund = fund;
	var sL = 64;
	var fxSL = 64;
	var onsetBase = 2;
	var onsetExpArray = [-3, -2];
	var durationBase = 2;
	var durationExpArray = [0, -1, -2, -3];
	var c1 = [M2, P4, M6, P5];
	var c2 = [1, P5, P4, 1/m3, P4*2];

	// inst, sequenceLength, fund, iArray, onsetBase, onsetExpArray, durationBase, durationExpArray, timbreMin, timbreMax

	// inst, sequenceLength, fund, iArray, onsetBase, onsetExpArray, durationBase, durationExpArray, timbreMin, timbreMax

	// A
		bassSequence(startTime, now, eB, sL, fund, c1, onsetBase, onsetExpArray, durationBase, durationExpArray, 0.05, 0.08);
		// fxSequence(startTime+s1, now, eBFX1A, fxSL);


	// B
		bassSequence(startTime+s2, now, eB, sL, fund, c2, onsetBase, onsetExpArray, durationBase, durationExpArray, 0.05, 0.08);
		// fxSequence(startTime+s2, now, eBFX1A, fxSL);


	// A
		bassSequence(startTime+s3, now, eB, sL, fund, c1, onsetBase, onsetExpArray, durationBase, durationExpArray, 0.05, 0.08);
		fxSequence(startTime+s3, now, eBFX1A, fxSL);


	// B
		bassSequence(startTime+s4, now, eB, sL, fund, c2, onsetBase, onsetExpArray, durationBase, durationExpArray, 0.05, 0.08);
		fxSequence(startTime+s4, now, eBFX1A, fxSL);

	// A
		bassSequence(startTime+s5, now, eB, sL, fund/2, c1, onsetBase, onsetExpArray, durationBase, durationExpArray, 0.05, 0.08);
		fxSequence(startTime+s5, now, eBFX1A, fxSL);


	// B
		bassSequence(startTime+s6, now, eB, sL, fund/2, c2, onsetBase, onsetExpArray, durationBase, durationExpArray, 0.05, 0.08);
		fxSequence(startTime+s6, now, eBFX1A, fxSL);

}

//--------------------------------------------------------------

// FLUTTER XYLOPHONE

//--------------------------------------------------------------

function playFlutterXylophone(startTime, now){

	var startTime = startTime;
	var now = now;
	var fund = 0.25*432*P5;

	var scaleArray = [1/M2, M2*2, P5, M6, P5*2];
	var scaleArray2 = [1, P5, P4, 1/m3, P4*2];

	var time = startTime+now;

	for(var k=0; k<4; k++){
		//
		if(k==0){fKChordPlayer(time, k, scaleArray, fund, mm);}
		else if(k==1){fKChordPlayer(time, k, scaleArray2, fund, mm);}
		else if(k==2){fKChordPlayer(time, k, scaleArray, fund, mm);}
		else if(k==3){fKChordPlayer(time, k, scaleArray2, fund, mm);}

	}

	mm.stopAtTime(startTime+now+32);

}

//--------------------------------------------------------------

function fKChordPlayer(time, idx, chord, fund, key){

	var time = time;
	var idx = idx;
	var chord = chord;
	var fund = fund;
	var key = key;
	var r;

		for(var i=0; i<76; i++){
			r = randomInt(0, 2);
			if(r==0){}
			else if(r==1){
					key.playAtTime((randomInt(2, 3)*fund*chord[randomInt(0, chord.length)]), (idx*8)+time+(i/9.6));
			}
		}

}

//--------------------------------------------------------------

// MALLET KEYS

//--------------------------------------------------------------

function playMalletKeys(startTime, duration, now){

	var startTime = startTime;
	var duration = duration;
	var now = now;

	var fund = 0.25*432*(P5);

	var c1 = new MyArray([1/M2, M2*2, P5, M6, P5*2]);
	var c2 = new MyArray([1, P5, P4, 1/m3, P4*2]);
	var c3 = new MyArray([1/M2, 1/P4, 1/M2, 1/P4, 1/M2]);
	c1 = c1.multiply(fund);
	c2 = c2.multiply(fund);
	c3 = c3.multiply(fund);

	var cArray = [c1, c2];

	// key 3
	dCG3.gain.gain.value = 3.2;
	// key 4
	dCG4.gain.gain.value = 3.2;

	sK3.startAtTime(startTime+now);
	sK4.startAtTime(startTime+now);

	// PLAY CHORDS

	for(var i=0; i<4; i++){
		if(i%2==0){
			sK3.setFreqsAtTime(c3, startTime+now+(i*8));
			sK4.setFreqsAtTime(c1, startTime+now+(i*8));
		}
		else if(i%2==1){
			sK3.setFreqsAtTime(c2, startTime+now+(i*8));
			sK4.setFreqsAtTime(c2, startTime+now+(i*8));
		}
	}

	// FX SEQUENCE

	var fxSL = 240;

	var oSeqArray = [];
	var divArray = new MyArray([0.8, 0.4, 0.31]);
	divArray.multiply(1);

	for(var i=0; i<fx.nEffects; i++){
		// create a new onset sequence
		oSeqArray[i] = new Sequence();
		oSeqArray[i].additive(fxSL, divArray.array);
		oSeqArray[i] = oSeqArray[i].add(startTime+now);

		for(var j=0; j<fxSL; j++){
			// implement onset sequence
			mK3FX.effects[i].effect.switchAtTime(randomInt(0, 2), oSeqArray[i][j]);
		}
	}

	// STOP

		sK3.stopAtTime(startTime+duration+now);
		sK4.stopAtTime(startTime+duration+now);

}

//--------------------------------------------------------------

// MM RIBBONS

//--------------------------------------------------------------

function playMMRibbons(startTime, now, mmKey, octave, possOnsetDurations){

	var startTime = startTime;
	var now = now;
	var mmKey = mmKey;
	var possOnsetDurations = possOnsetDurations;
	var octave = octave;

	var fund = octave*432*(P5);

	var sequenceLength = 8;
	var c1 = new MyArray([m7, M2*2, P5, M6, P5*2]);
	var c2 = new MyArray([1, P5, P4, 1/m3, P4*2]);
	c1.multiply(fund);
	c1 = c1.array;
	c2.multiply(fund);
	c2 = c2.array;

	var chord = c1;

	var onsetSequence = new Sequence();
	onsetSequence.additive(sequenceLength, possOnsetDurations);
	onsetSequence.add(startTime+now);
	onsetSequence = onsetSequence.sequence;
	var pitchSequence = new Sequence();
	pitchSequence.random(sequenceLength, c1);

	// create a sequence of 40 half-seconds (20 seconds)
	for(var j=0; j<20; j++){
		// within each half-second, create a ribbon of onsets
		for(var i=0; i<onsetSequence.length; i++){
			mmKey.playAtTime(c1[i%c1.length]/(randomInt(1, 3)), (j/2)+onsetSequence[i]);
		}
	}

	for(var j=20; j<40; j++){
		// within each half-second, create a ribbon of onsets
		for(var i=0; i<onsetSequence.length; i++){
			mmKey.playAtTime(c2[i%c2.length]/(randomInt(1, 3)), (j/2)+onsetSequence[i]);
		}
	}

	dR1A.startAtTime(startTime+now);
	dR2A.startAtTime(startTime+now);
	dR3A.startAtTime(startTime+now);

	mmKey.stopAtTime(16+startTime+now);

}
