export class IS_BufferFunctionData
{
	constructor(type, ...args)
	{
		this._type = type;
		this._args = args;
	}

	get type() { return this._type; };
	get args() { return this._args; }
}