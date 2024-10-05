import { IS_ScheduleAction } from "../../enums/IS_ScheduleAction.js";
import { IS_ScheduleItem } from "./IS_ScheduleItem.js";

/**
 * Schedule starts and stops of Startable Nodes
 */
export class IS_Schedule
{
    constructor()
    {
        this.schedule = [];
        this.offset = 0;
        this.duration = 0;
    }

    /**
     * Create an IS_ScheduleItem to schedule the playback of an IS_StartableNode
     * @param startableNode
     * @param startTime
     * @param duration
     */
    scheduleStart(startableNode, startTime = 0, duration = -1)
    {
        let scheduleItem = new IS_ScheduleItem
        (
            startableNode, IS_ScheduleAction.Start, startTime, duration
        );

        this.schedule.push(scheduleItem);
    }

    scheduleStop(startableNode, stopTime)
    {
        let scheduleItem = new IS_ScheduleItem
        (
            startableNode, IS_ScheduleAction.Stop, stopTime
        );

        this.schedule.push(scheduleItem);
    }

    schedule()
    {
        for (let scheduleIndex = 0; scheduleIndex < this.schedule.length; scheduleIndex++)
        {
            this.schedule[scheduleIndex].schedule(this.offset, this.duration);
        }
    }

    stop()
    {
        for (let scheduleIndex = 0; scheduleIndex < this.schedule.length; scheduleIndex++)
        {
            this.schedule[scheduleIndex].stop();
        }
    }
}