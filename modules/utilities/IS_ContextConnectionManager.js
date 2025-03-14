import { IS_Type } from "../enums/IS_Type.js";

export const IS_ContextConnectionManager =
{
	series(...audioNodes)
	{
		for (let audioNodeIndex = 1; audioNodeIndex < audioNodes.length; audioNodeIndex++)
		{
			let previousNode = audioNodes[audioNodeIndex - 1];
			let audioNode = audioNodes[audioNodeIndex];

			if (audioNode.isISEffect)
			{
				previousNode.connect(audioNode);
			}
			else
			{
				previousNode.connect(audioNode);
			}
		}
	},

	matrix(...matrix)
	{
		for(let matrixRow = 1; matrixRow < matrix.length; matrixRow++)
		{
			let outputRow = matrix[matrixRow - 1];
			let inputRow = matrix[matrixRow];

			for(let outputNodeIndex = 0; outputNodeIndex < outputRow.length; outputNodeIndex++)
			{
				let outputNode = outputRow[outputNodeIndex];

				for(let inputNodeIndex = 0; inputNodeIndex < inputRow.length; inputNodeIndex++)
				{
					outputNode.connect(inputRow[inputNodeIndex])
				}
			}
		}
	},

	toMainOutput(...audioNodes)
	{
		for (let audioNodeIndex = 0; audioNodeIndex < audioNodes.length; audioNodeIndex++)
		{
			let audioNode = audioNodes[audioNodeIndex];

			if (audioNode.isISEffect)
			{
				audioNode.connect(this.output);
			} else
			{
				audioNode.connect(this.output);
			}
		}
	},
}