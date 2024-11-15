export class IS_SequenceItem
{
    constructor(schedule, startTime, stopPrevious = true)
    {
        this.schedule = schedule;
        this.startTime = startTime;
        this.stopPrevious = stopPrevious;

        // TODO: Implement these
        this.duration = null;
        this.overlap = null;
    }
}