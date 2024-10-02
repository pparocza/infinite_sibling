import { IS_ScheduleAction } from "../../enums/IS_ScheduleAction.js";
import { IS_ScheduleItem } from "./IS_ScheduleItem.js";

export class IS_Schedule
{
    constructor()
    {
        this.schedule = [];
    }

    scheduleStart(startableNode, time = 0, duration = -1)
    {
        let scheduleItem = new IS_ScheduleItem(startableNode, IS_ScheduleAction.Start, time, duration);
        this.schedule.push(scheduleItem);
    }

    scheduleStop(startableNode, time)
    {
        let scheduleItem = new IS_ScheduleItem(startableNode, IS_ScheduleAction.Stop, time);
        this.schedule.push(scheduleItem);
    }

    start(timeOffset = 0)
    {
        for(let scheduleIndex = 0; scheduleIndex < this.schedule.length; scheduleIndex++)
        {
            this.schedule[scheduleIndex].schedule();
        }
    }
}