import { IS_SequenceItem } from "./IS_SequenceItem.js";

/**
 * Arrange IS_Schedules in time
 */
export class IS_Sequence
{
    constructor(sequence = [])
    {
        this.sequence = [];
        this.stopTime = -1;
    }

    addSchedule(schedule, startTime, shouldCancel = true, overlap = 0)
    {
        let sequenceItem = new IS_SequenceItem(schedule, startTime);
        this.sequence.push(sequenceItem);
    }

    schedule()
    {
        let sequenceLength = this.sequence.length;
        let isLastInSequence = false;
        let nextSequenceItem;

        for (let sequenceIndex = 0; sequenceIndex < sequenceLength; sequenceIndex++)
        {
            isLastInSequence = sequenceIndex === sequenceLength - 1;

            let sequenceItem = this.sequence[sequenceIndex];
            let sequenceItemStartTime = sequenceItem.startTime;
            let sequenceItemSchedule = sequenceItem.schedule;

            sequenceItemSchedule.offset += sequenceItemStartTime;

            if (!isLastInSequence)
            {
                nextSequenceItem = this.sequence[sequenceIndex + 1];

                if (nextSequenceItem.stopPrevious)
                {
                    let nextStart = nextSequenceItem.startTime;
                    let nextOverlap = nextSequenceItem.overlap;

                    sequenceItemSchedule.duration = nextStart + nextOverlap;
                }
            }
            else if (this.stopTime > 0)
            {
                sequenceItemSchedule.duration = this.stopTime - sequenceItem.startTime;
            }

            sequenceItemSchedule.schedule();
        }
    }
}