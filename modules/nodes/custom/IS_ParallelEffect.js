import { IS_Effect } from "../core/effect/IS_Effect.js";

export class IS_ParallelEffect extends IS_Effect
{
	constructor(siblingContext)
	{
		super(siblingContext);
	}

	insert(...audioNodes)
	{
		this.configureInput(audioNodes[0]);
		this.configureOutput(audioNodes[audioNodes.length - 1]);

		if(audioNodes.length === 1)
		{
			return;
		}

		for(let nodeIndex = 1; nodeIndex < audioNodes.length; nodeIndex++)
		{
			audioNodes[nodeIndex - 1].connect(audioNodes[nodeIndex]);
		}
	}
}