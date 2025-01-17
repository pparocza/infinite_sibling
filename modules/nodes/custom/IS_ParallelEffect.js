import { IS_Effect } from "../core/effect/IS_Effect.js";
import { IS_BiquadFilterArgs } from "../core/effect/IS_BiquadFilter.js";
import { IS_Type } from "../../enums/IS_Type.js";

export class IS_ParallelEffect extends IS_Effect
{
	constructor(siblingContext)
	{
		super(siblingContext);

		this._effects = [];
	}

	connectEffect(audioNode)
	{
		this.configureInput(audioNode);
		this.configureOutput(audioNode);

		this._effects.push(audioNode);
	}

	insertEffect(audioNode)
	{
		this.connectEffect(audioNode);

	}

	createEffect(effectType, ...effectArgs)
	{
		switch (effectType)
		{
			case IS_Type.IS_NodeType.IS_BiquadFilter:
				this.addFilter(effectArgs)
				break;
			default:
				break;
		}
	}

	addFilter(filterArgs)
	{
		let filter = this.siblingContext.createFilter();

		let parameters = new IS_BiquadFilterArgs(filterArgs);

		filter.type = parameters.type;
		filter.frequency = parameters.frequency;
		filter.Q = parameters.Q;
		filter.gain = parameters.gain;
		filter.detune = parameters.detune;

		this.connectEffect(filter);
	}
}