export const BufferPrint =
{
	configure()
	{
		if (!window.console || !window.console.log)
		{
			return;
		}

		window.console.bufferPrint = this.print;
	},

	print(buffer)
	{
		let canvas;
		let	context;

		canvas = document.createElement('canvas');
		context = canvas.getContext('2d');
		context.lineWidth = 1;
		context.strokeStyle = "rgb(0, 0, 0)";

		context.beginPath();

		let sliceWidth = canvas.width / buffer.length;
		let x = 0;

		for (let i = 0; i < buffer.length; i++)
		{
			let v = buffer[i] / 128.0;
			let y = v * canvas.height / 2;

			if (i === 0)
			{
				context.moveTo(x, y);
			}
			else
			{
				context.lineTo(x, y);
			}
			x += sliceWidth;
		}

		context.lineTo(canvas.width, canvas.height / 2);
		context.stroke();

		this.toConsole(canvas.toDataURL());
	},

	toConsole(imageURL)
	{
		console.log
		(
			'%c ', '' +
			'font-size: 0;' +
			'padding-left: ' + 299 + 'px;' +
			'padding-bottom: ' + 100 + 'px;' +
			'background: url("' + imageURL + '"),' +
			'-webkit-linear-gradient(#fff, #fff);' +
			''
		);
	}
}
