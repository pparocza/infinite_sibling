import { IS_Random } from "../utilities/IS_Random.js";

export class IS_Array
{
    constructor()
    {
        this.value = [];
    }

    print()
    {
        for(let i = 0; i < this.value.length; i++)
        {
            console.log(this.value[i]);
        }
    }

    get length()
    {
        return this.value.length;
    }

    get max()
    {
        return(Math.max(...this.value));
    }

    get min()
    {
        return(Math.min(...this.value));
    }

    push(value)
    {
        this.value.push(value);
    }

    pop()
    {
        this.value.pop();
    }

    remove(value)
    {
        let i = this.value.indexOf(value);
        this.value.splice(i, 1);
    }

    sort(direction)
    {
        switch(direction)
        {
            case "ascending":
            case 0:
                this.value.sort(function(a, b){return b-a});
                break;
            case "descending":
            case 1:
                this.value.sort(function(a, b){return a-b});
                break;
            default:
                break;
        }
    }

    /*
    add specified value to all array values
     */
    add(value)
    {
        for (let i=0; i < this.value.length; i++)
        {
            this.value[i] += value;
        }
    }

    /*
    subtract specified value from all array values
     */
    subtract(value)
    {
        for (let i=0; i<this.value.length; i++)
        {
            this.value[i] -= value;
        }
    }

    /*
    multiply all array values by specified value
     */
    multiply(value)
    {
        for (var i=0; i < this.value.length; i++)
        {
            this.value[i] *= value;
        }
    }

    /*
    divide all array values by specified value
     */
    divide(value)
    {
        for(var i=0; i<this.value.length; i++)
        {
            this.value[i] /= value;
        }
    }

    /*
    return a random value from the array
     */
    random()
    {
        return this.value[IS_Random.randomInt(0, this.value.length)];
    }

    /*
    randomly arrange the values in the array
     */
    shuffle()
    {
        let descendingIndex = this.length;
        let shuffleIndex = 0;
        let valueToShuffle;

        while (descendingIndex--)
        {
            shuffleIndex = Math.floor(Math.random() * (descendingIndex + 1));
            valueToShuffle = this.value[descendingIndex];
            this.value[descendingIndex] = this.value[shuffleIndex];
            this.value[shuffleIndex] = valueToShuffle;
        }
    }

    concat(array, style = "prepend", insertIndex = 0)
    {
        switch(style)
        {
            case("prepend"):
            case(0):
                for(let i= 0; i < array.length; i++)
                {
                    this.value.unshift(array[i]);
                }
                return this.value;
            case("append"):
            case(1):
                for(let i= 0; i < array.length; i++)
                {
                    this.value.push(array[i]);
                }
                break;
            case("insert"):
            case(2):
                /*
                 TODO: splices "array" into "this.array" starting at "insertIndex"
                 */
        }
    }

    /*
    alternate the values of the array with those of another array
     */
    lace(array)
    {
        let currentArray = this.value;
        let newArray = []

        for(let i = 0; i < array; i++)
        {
            newArray[i * 2] = currentArray[i];
            newArray[(i * 2) + 1] = array[i];
        }

        this.value = newArray;
    }

    /*
    return all possible permutations (of a specified length)
    of the array
     */
    permutations(length, repeat = false)
    {

        length = length || this.value.length;

        if(length > this.value.length)
        {
            length = this.value.length;
        }

        const results = [];

        function generatePermutations(array, length, prefix = [])
        {
            if (prefix.length === length)
            {
                results.push(prefix);
            }
            else
            {
                for (let value of this.array)
                {
                    let newPrefix = [...prefix];
                    newPrefix.push(value);

                    let newRest = null;

                    if(repeat)
                    {
                        newRest = this.array;
                    }
                    else
                    {
                        newRest = this.remove(value);
                    }

                    generatePermutations(newRest, length, newPrefix);
                }
            }
            return;
        }
            generatePermutations(this.value, length);

            return results;
    }
}