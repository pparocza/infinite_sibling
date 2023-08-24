var globalBufferList;
var bufferLoader;

loadBuffers();

function loadBuffers(){

	bufferLoader = new bufferLoader(
		audioCtx,
		[

			// impulse responses
				//OpenAir (0-2)
				"https://dl.dropboxusercontent.com/s/4cf31eptope447j/1st_baptist_nashville_far_wide.wav",

		],
		finishedLoading
		);

		bufferLoader.load();
	}

function finishedLoading(bufferList){
	globalBufferList = bufferList; /* store the buffer list in a global variable so it can be accessed
									  by all other functions */

	bufferLoaded();
}