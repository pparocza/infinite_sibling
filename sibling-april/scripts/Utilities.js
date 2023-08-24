// ------------------------- UTILITIES ------------------------------

function shuffle(myArray){
	var i = myArray.length;
	var j = 0;
	var temp;

		while (i--) {
			j = Math.floor(Math.random() * (i+1));
			temp = myArray[i];
			myArray[i] = myArray[j];
			myArray[j] = temp;
			}
	return myArray;
}

function permutations(arr, len, repeat = false) {

  len = len || arr.length;
  if(len > arr.length) len = arr.length;
  const results = [];

	function eliminate(el, arr) {
		let i = arr.indexOf(el);
		arr.splice(i, 1);
		return arr;
	}

	function perms(arr, len, prefix = []) {
		if (prefix.length === len) {
			results.push(prefix);
		} else {
			for (let elem of arr) {
				let newPrefix = [...prefix];
				newPrefix.push(elem);

        let newRest = null;

        if(repeat){
          newRest = arr;
        }else{
          newRest = eliminate(elem, [...arr]);
        }

	 perms(newRest, len, newPrefix);
	}
 }
		return;
	}
	perms(arr, len);

	return results;
}


// ----------------------------- MTOF -------------------------------

function mtof(midiPitchNumber){
	var freq = 440 * Math.pow(2, (midiPitchNumber-69)/12);
	return freq;
}

// ---------------------------- TUNER -------------------------------

function tuner(modeIdx, tonicIdx){

	var tonics = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

	var major = [0, 2, 4, 5, 7, 9, 11, 12];
	var minor = [0, 2, 3, 5, 7, 8, 10, 12];
	var dorian = [0, 2, 3, 5, 7, 9, 10, 12];
	var phrygian = [0, 1, 3, 5, 7, 8, 10, 12];
	var lydian = [0, 2, 4, 6, 7, 9, 11, 12];
	var mixolydian = [0, 2, 4, 5, 7, 9, 10, 12];

	var modes = [major, minor, dorian, phrygian, lydian, mixolydian];

	var theTonic = tonics[tonicIdx];
	var theMode = modes[modeIdx];

	var scale = [];

	for (tunerIdx = 0 ; tunerIdx < theMode.length ; tunerIdx++){
		scale[tunerIdx] = theMode[tunerIdx] + theTonic;
	}

	return scale;
}

// ---------------------------- RANDOMS -------------------------------

function randomFloat(min, max){
	return Math.random() * (max-min) + min;
}

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomEnvelope(nPoints, gainRange, durationRange, divRange){

	var array = [];

	var nPoints =  nPoints;
	var gainRange = gainRange;
	var durationRange = durationRange;
	var divRange = divRange;

	for(var i=0; i<nPoints; i++){
		array.push(randomFloat(gainRange[0], gainRange[1]), randomInt(durationRange[0], durationRange[1])/(Math.pow(10, randomInt(divRange[0], divRange[1]))));
	}

	array.push(0, randomInt(durationRange[0], durationRange[1])/(Math.pow(10, randomInt(divRange[0], divRange[1]))));

	return array;

}

function randomArrayValue(array){

	var v = array[randomInt(0, array.length)];
	return v;

}

//--------------------------------------------------------------

function Sequence(){

	this.sequence = [];

}

Sequence.prototype = {

	sequence: this.sequence,

	duplicates: function(length, value){

		this.length = length;
		this.value = value;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = this.value;
		}

		return this.sequence;

	},

	pad: function(padLength, value){

		this.padLength = padLength;
		this.value = value;

		for(var i=0; i<this.padLength; i++){
			this.sequence.push(this.value);
		}

		return this.sequence;

	},

	loop: function(length, valuesArray){

		this.length = length;
		this.valuesArray = valuesArray;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = this.valuesArray[i%this.valuesArray.length];
		}

	},

	additive: function(length, valuesArray){

		this.length = length;
		this.valuesArray = valuesArray;

		this.v = 0;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = this.v;
			this.v += this.valuesArray[randomInt(0, this.valuesArray.length)];
		}

		return this.sequence;

	},

	additiveRandomInt: function(length, min, max){

		this.length = length;
		this.min = min;
		this.max = max;

		this.v = 0;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = this.v;
			this.v += randomInt(this.min, this.max);
		}

		return this.sequence;

	},

	additiveRandomFloat: function(length, min, max){

		this.length = length;
		this.min = min;
		this.max = max;

		this.v = 0;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = this.v;
			this.v += randomFloat(this.min, this.max);
		}

		return this.sequence;

	},

	additivePowers: function(length, base, powArray){

		this.length = length;
		this.base = base;
		this.powArray = powArray;

		this.v = 0;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = this.v;
			this.v += Math.pow(this.base, randomArrayValue(this.powArray));
		}

		return this.sequence;

	},

	additiveMultiples: function(length, base, multArray){

		this.length = length;
		this.base = base;
		this.multArray = multArray;

		this.v = 0;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = this.v;
			this.v += this.base*randomArrayValue(this.multArray);
		}

		return this.sequence;

	},

	randomPowers: function(length, base, powArray){

		this.length = length;
		this.base = base;
		this.powArray = powArray;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = Math.pow(this.base, randomArrayValue(this.powArray));
		}

		return this.sequence;

	},

	randomMultiples: function(length, base, multArray){

		this.length = length;
		this.base = base;
		this.multArray = multArray;

		this.v = 0;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = randomArrayValue(this.multArray);
		}

		return this.sequence;

	},

	evenDiv: function(div){

		this.div = div;

		for(var i=0; i<this.div; i++){
			this.sequence[i] = (i+1)/this.div;
		}

		return this.sequence;

	},

	randomSelect: function(length, valuesArray){

		this.length = length;
		this.valuesArray = valuesArray;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = this.valuesArray[randomInt(0, this.valuesArray.length)];
		}

		return this.sequence;

	},

	randomFloats: function(length, min, max){

		this.length = length;
		this.min = min;
		this.max = max;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = randomFloat(this.min, this.max);
		}

		return this.sequence;

	},

	randomInts: function(length, min, max){

		this.length = length;
		this.min = min;
		this.max = max;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = randomInt(this.min, this.max);
		}

		return this.sequence;

	},

	add: function(value){

		this.value = value;

		for(var i=0; i<this.sequence.length; i++){
			this.sequence[i] += this.value;
		}

		return this.sequence;

	},

	subtract: function(value){

		this.value = value;

		for(var i=0; i<this.sequence.length; i++){
			this.sequence[i] -= this.value;
		}

		return this.sequence;

	},

	multiply: function(value){

		this.value = value;

		for(var i=0; i<this.sequence.length; i++){
			this.sequence[i] *= this.value;
		}

		return this.sequence;

	},

	divide: function(value){

		this.value = value;

		for(var i=0; i<this.sequence.length; i++){
			this.sequence[i] /= this.value;
		}

		return this.sequence;

	},

	lace: function(newSequence){

		this.newSequence = newSequence;
		this.oldSequence = this.sequence;
		this.sequence = [];

		for(var i=0; i<this.newSequence.length; i++){
			this.sequence[i*2] = this.oldSequence[i];
			this.sequence[(i*2)+1] = this.newSequence[i];
		}

		return this.sequence;

	},

	laceAdd: function(newSequence){

		this.newSequence = newSequence;
		this.oldSequence = this.sequence;
		this.sequence = [];

		for(var i=0; i<this.newSequence.length; i++){
			this.sequence[i*2] = this.oldSequence[i];
			this.sequence[(i*2)+1] = this.newSequence[i];
		}

		for(var i=0; i<this.sequence.length; i++){
			if(i!=0){
				this.sequence[i] = this.sequence[i]+this.sequence[i-1];
			}
			else if(i==0){
				this.sequence[i] = this.sequence[i];
			}
		}

		return this.sequence;

	},

	random: function(length, valuesArray){

		this.length = length;
		this.valuesArray = valuesArray;

		for(var i=0; i<this.length; i++){
			this.sequence[i] = this.valuesArray[randomInt(0, this.valuesArray.length)];
		}

	}

}

//--------------------------------------------------------------

function MyArray(array){

	this.array = array;

}

MyArray.prototype = {

	array: this.array,

	add: function(value){

		this.value = value;

		for(var i=0; i<this.array.length; i++){
			this.array[i] += this.value;
		}

		return this.array;

	},

	subtract: function(value){

		this.value = value;

		for(var i=0; i<this.array.length; i++){
			this.array[i] -= this.value;
		}

		return this.array;

	},

	multiply: function(value){

		this.value = value;

		for(var i=0; i<this.array.length; i++){
			this.array[i] *= this.value;
		}

		return this.array;

	},

	divide: function(value){

		this.value = value;

		for(var i=0; i<this.array.length; i++){
			this.array[i] /= this.value;
		}

		return this.array;

	},

	min: function(){

		this.min = Math.min(...this.array);
		return this.min;

	},

	max: function(){

		this.max = Math.max(...this.array);
		return this.max;

	},

	sortUp: function(){

		this.array.sort(function(a, b){return a-b});

	},

	sortDown: function(){

		this.array.sort(function(a, b){return b-a});

	},

	randomValue: function(){

		this.rV = this.array[randomInt(0, this.array.length)];
		return this.rV;

	},

	shuffle: function(){

		shuffle(this.array);

		return this.array;

	},

	append: function(newArray){

		this.newArray = newArray;

		for(var i=0; i<this.newArray.length; i++){
			this.array.push(this.newArray[i]);
		}

		return this.array;

	},

	prepend: function(newArray){

		this.newArray = newArray;

		for(var i=0; i<this.newArray.length; i++){
			this.array.unshift(this.newArray[i]);
		}

		return this.array;

	},

	lace: function(newArray){

		this.newArray = newArray;
		this.oldArray = this.array;
		this.array = [];

		for(var i=0; i<this.newArray.length; i++){
			this.array[i*2] = this.oldArray[i];
			this.array[(i*2)+1] = this.newArray[i];
		}

		return this.array;

	},

}

function arrayLace(a1, a2){

	var a1 = a1;
	var a2 = a2;
	var a = [];

	for(var i=0; i<a1.length; i++){
		a[i*2] = a1[i];
		a[(i*2)+1] = a2[i];
	}

	return a;

}

function arrayJoin(a1, a2){

	var a1 = a1;
	var a2 = a2;
	var a = a1;

	for(var i=0; i<a1.length; i++){
		a.push(a2[i]);
	}

	return a;

}

// ---------------------------- VALUES -------------------------------

var m2 = 25/24;
var M2 = 9/8;
var m3 = 6/5;
var M3 = 5/4;
var P4 = 4/3;
var d5 = 45/32;
var P5 = 3/2;
var m6 = 8/5;
var M6 = 5/3;
var m7 = 9/5;
var M7 = 15/8;
