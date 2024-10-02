import { IS_ScheduleAction } from "../../enums/IS_ScheduleAction.js";
import { IS_ScheduleItem } from "./IS_ScheduleItem.js";

export class IS_Schedule
{
    constructor()
    {
        this.schedule = [];
        this.offset = 0;
    }

    scheduleStart(startableNode, time = 0, duration = -1)
    {
        let startTime = time + this.offset;

        let scheduleItem = new IS_ScheduleItem
        (
            startableNode, IS_ScheduleAction.Start, startTime, duration
        );

        this.schedule.push(scheduleItem);
    }

    scheduleStop(startableNode, time)
    {
        let stopTime = time + this.offset;

        let scheduleItem = new IS_ScheduleItem
        (
            startableNode, IS_ScheduleAction.Stop, stopTime
        );

        this.schedule.push(scheduleItem);
    }

    start()
    {
        for(let scheduleIndex = 0; scheduleIndex < this.schedule.length; scheduleIndex++)
        {
            this.schedule[scheduleIndex].schedule();
        }
    }
}