import { IS } from "../script.js";

IS.onLoad(test);

function test()
{
	let osc = IS.createOscillator("sine", 440);

	console.log(osc.frequency.value);

	osc.connectToMainOutput();
	osc.scheduleStart(0);
}