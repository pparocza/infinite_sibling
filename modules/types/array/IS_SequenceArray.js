import { IS_Array } from "./IS_Array.js";
import { IS_Type } from "../../enums/IS_Type.js";
import { IS_Random } from "../../utilities/IS_Random.js";

export class IS_SequenceArray extends IS_Array
{
    constructor()
    {
        super([], IS_Type.IS_Data.IS_SequenceArray);
    }

    valueSequence(possibleValues = [], length, random = false)
    {
        let valueArray = new IS_Array(possibleValues);

        for(let i = 0; i < length; i++)
        {
            if(random)
            {
                this.value.push(valueArray.random());
            }
            else
            {
                this.value.push(valueArray.value[i % valueArray.length]);
            }
        }
    }

    // TODO: .like(likenessPercent) - takes the existing array, gives back something "like" it based on the percent
    /*
     TODO: general cleanup - sometimes you might want a sequence duration, sometimes you might want a number of sequence items,
     and in any case, the loops and conditions here are pretty messy
     */
    timeSequence
    (
        possibleDurations = [], startTime = 0, includeStart = true,
        speed = 1, drunk = 0,
        density = 1, timeLimit = -1
    )
    {
        let possibleDurationsArray;

        // Ensure that timeBetweenStarts is an IS_Array
        if(possibleDurations.iSType !== undefined && possibleDurations.iSType === IS_Type.IS_Array)
        {
            possibleDurationsArray = possibleDurations;
        }
        else
        {
            possibleDurationsArray = new IS_Array(possibleDurations);
        }

        let speedFactor = 1 / speed;
        let previousTime = startTime;
        let nextTime = 0;

        for (let timeIndex = 0; timeLimit >= 0 && nextTime < timeLimit; timeIndex++)
        {
            if (timeIndex === 0 && includeStart)
            {
                if(IS_Random.CoinToss(density))
                {
                    this.value.push(startTime);
                }
                continue;
            }

            let timeToNext = possibleDurationsArray.random() * speedFactor;
            let drunkAdjustment = timeToNext * IS_Random.Float(-drunk, drunk);

            nextTime = previousTime + timeToNext + drunkAdjustment;

            if (IS_Random.CoinToss(density))
            {
                if(nextTime < timeLimit)
                {
                    this.value.push(nextTime);
                }
            }

            previousTime = nextTime;
        }
    }
}
