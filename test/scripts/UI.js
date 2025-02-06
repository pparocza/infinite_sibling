import * as main from "../script.js";
import { IS } from "../script.js";

const START_BUTTON = document.querySelector('.START_BUTTON');
const START_STRING = "start";
const STOP_STRING = "stop";
const LOAD_STRING = "load";
const LOADING_STRING = "...loading";
const RESET_STRING = "reset";

const ONLINE_BUTTON = document.querySelector('.ONLINE_BUTTON');
const ONLINE_STRING = "online";
const OFFLINE_STRING = "offline";

const VOLUME_SLIDER = document.querySelector('.VOLUME_SLIDER');
const VOLUME_SLIDER_INITIAL_VALUE = 0.7;
const VOLUME_SLIDER_DISPLAY = document.querySelector('.VOLUME_DISPLAY');

const SIBLING_SELECTION_DROPDOWN = document.querySelector('.SIBLING_SELECTION_MENU');
const SIBLING_SCRIPT = document.querySelector('.SIBLING_SCRIPT');
const SCRIPT_SRC = "/sibling.js";

const TITLE_DIV = document.querySelector('.TITLE_DIV');
let TITLE = "";

function initializeUI()
{
	initializeOnlineButton();
	initializeStartButton();
	initializeVolumeSlider()
}

function initializeOnlineButton()
{
	ONLINE_BUTTON.onclick = function()
	{
		ONLINE_BUTTON.innerHTML === ONLINE_STRING ?
			ONLINE_BUTTON.innerHTML = OFFLINE_STRING :
			ONLINE_BUTTON.innerHTML = ONLINE_STRING;
	}
}

function initializeStartButton()
{
	START_BUTTON.onclick = function()
	{
		switch (START_BUTTON.innerHTML)
		{
			case (LOAD_STRING):
				handleLoad();
				break;
			case (START_STRING):
				handleStart();
				break;
			case (RESET_STRING):
				handleReset();
				break;
			case (STOP_STRING):
				handleStop();
				break;
			default:
				break;
		}
	}
}

function initializeVolumeSlider()
{
	VOLUME_SLIDER.value = VOLUME_SLIDER_INITIAL_VALUE;
	setVolume(VOLUME_SLIDER_INITIAL_VALUE);

	VOLUME_SLIDER.oninput = function()
	{
		setVolume(VOLUME_SLIDER.value);
	}
}

function handleLoad()
{
	switch(ONLINE_BUTTON.innerHTML)
	{
		case (ONLINE_STRING):
			loadOnline();
			break;
		case (OFFLINE_STRING):
			loadOffline();
			break;
		default:
			break;
	}
}

function loadOnline()
{
	setStartButton(LOADING_STRING, true);
	IS.onReady(setStartButtonReady);
	setTimeout(() => { main.load() }, 500);
}

function loadOffline()
{
	SIBLING_SELECTION_DROPDOWN.disabled = true;
	SIBLING_SCRIPT.src = SCRIPT_SRC;
	setStartButton(LOADING_STRING, true);
	IS.onReady(setStartButtonReady);
	setTimeout(() => { main.load() }, 500);
}

function handleStart()
{
	switch(ONLINE_BUTTON.innerHTML)
	{
		case (ONLINE_STRING):
			startOnline();
			break;
		case (OFFLINE_STRING):
			startOffline();
			break;
		default:
			break;
	}

	setStartButton(STOP_STRING, false);
}

function startOnline()
{
	setStartButton(STOP_STRING, false);
	main.start();
}

function startOffline()
{
	setStartButton(STOP_STRING, false);
}

function handleReset()
{
	location.reload();
}

function handleStop()
{
	main.stop();
	setStartButton(RESET_STRING, false);
}

function setStartButton(label, disabled)
{
	START_BUTTON.innerHTML = label;
	START_BUTTON.disabled = disabled;
}

function setStartButtonReady()
{
	setStartButton(START_STRING, false);
}

function setVolume(volumeSliderValue)
{
	let amplitudeScaler = Math.pow(volumeSliderValue, 2);
	let amplitudeToDecibels = IS.amplitudeToDecibels(amplitudeScaler);
	IS.outputVolume = amplitudeToDecibels;
	VOLUME_SLIDER_DISPLAY.innerHTML = parseInt(amplitudeToDecibels) + " dB";
}

initializeUI();

