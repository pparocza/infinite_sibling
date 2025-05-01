import { IS_ControlParameter } from "./IS_ControlParameter.js";

export const IS_ControlParameters =
{
	_parameters: [],

	createParametersFromObject(object)
	{
		for(let property in object)
		{
			this.createParameter(property, object[property]);
		}
	},

	createParameter(name, value = null, displayName = null)
	{
		let parameter = new IS_ControlParameter(name, value, displayName);

		Object.defineProperty
		(
			this, name,
			{
				get()
				{
					return parameter.value;
				},
				set(value)
				{
					parameter.value = value;
				},
				enumerable: true,
				configurable: true
			}
		);

		this._parameters.push(parameter);
	},

	get JSON()
	{
		let json = {}

		for(let parameterIndex = 0; parameterIndex < this._parameters.length; parameterIndex++)
		{
			let parameter = this._parameters[parameterIndex];
			json[parameter.displayName] = parameter.value;
		}

		return json;
	}
};
