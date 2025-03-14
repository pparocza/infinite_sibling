export const IS_Random =
{
    /**
     * return a random integer within the specified range
     * @param min
     * @param max
     * @returns {number}
     */
    int: function(min, max)
    {
        let roundedMin = Math.ceil(min);
        let roundedMax = Math.floor(max);
        return Math.floor(Math.random() * (roundedMax - roundedMin)) + roundedMin;
    },

    /**
     * return a random floating point number within the specified range
     * @param min
     * @param max
     * @returns {*}
     */
    float: function(min, max)
    {
        return Math.random() * (max-min) + min;
    },

    select: function(...values)
    {
        return values[this.randomInt(0, values.length)];
    },

    /**
     *
     * @param probabilityOfTrue
     * @returns {boolean}
     */
    coinToss: function(probabilityOfTrue = 0.5)
    {
        return Math.random() > (1 - probabilityOfTrue);
    },

    envelope: function
    (
        nPoints = 3,
        gainRange = [0, 1], durationRange = [1, 1], divRange = [0.25, 0.25]
    )
    {
        let envelopeArray = [];

        for(let i= 0; i < nPoints; i++)
        {
            envelopeArray.push
            (
                this.randomFloat(gainRange[0], gainRange[1]),
                this.randomInt(durationRange[0], durationRange[1])/this.randomInt(divRange[0],
                    divRange[1])
            );
        }

        envelopeArray.push
        (
            0,
            this.randomInt(durationRange[0], durationRange[1])
            / (Math.pow(10, this.randomInt(divRange[0], divRange[1])))
        );

        return envelopeArray;
    }
}
