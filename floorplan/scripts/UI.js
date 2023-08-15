var startButton = document.querySelector('.start');
var onlineButton = document.querySelector('.online');
var gainSlider = document.querySelector('.gain-slider');
var gainDisplay = document.querySelector('.gain');
var volume = gainSlider.value;
var displayVolume;

onlineButton.onclick = function(){

	if(onlineButton.innerHTML=="online"){
		onlineButton.innerHTML = "offline";
	}

	else if(onlineButton.innerHTML=="offline"){
		onlineButton.innerHTML = "online";
	}

}

startButton.onclick = function(){
	if(startButton.innerHTML=="load" && onlineButton.innerHTML=="online"){
		startButton.disabled = true;
		startButton.innerHTML = "...loading";
		init();
	}
	if(startButton.innerHTML=="load" && onlineButton.innerHTML=="offline"){
		startButton.disabled = true;
		startButton.innerHTML = "...loading";
		initOffline();
	}
	if (startButton.innerHTML == "start" && onlineButton.innerHTML=="online"){
		startButton.innerHTML = "stop";
		runPatch();
		setTimeout(function(){stopPatch();}, pieceLength*1000);
	}
	else if (startButton.innerHTML == "start" && onlineButton.innerHTML=="offline"){
		startButton.innerHTML = "stop";
		offlineBuffer.start();
		setTimeout(function(){stopPatch();}, pieceLength*1000);
	}
	else if(startButton.innerHTML == "reset"){
		location.reload();
	}
	else if(startButton.innerHTML == "stop"){
		stopPatch();
	}
}

gainSlider.oninput = function(){
	volume = gainSlider.value;
	gainDisplay.innerHTML = parseInt(volume*100) + "%";
	masterGain.gain.value = volume;
}
