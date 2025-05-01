export class IS_ControlParameter
{
	constructor(name, value, displayName = null)
	{
		this._name = name;
		this._value = value;

		this._displayName = displayName !== null ? displayName : name;
	}

	get name() { return this._name; }

	get value() { return this._value; }
	set value(value) { this._value = value; }

	get displayName() { return this._displayName; }
	set displayName(value) { this._displayName = value; }
}