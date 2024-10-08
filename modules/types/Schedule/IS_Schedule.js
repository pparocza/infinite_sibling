import { IS_ScheduleAction } from "../../enums/IS_ScheduleAction.js";
import { IS_ScheduleItem } from "./IS_ScheduleItem.js";

/**
 * Schedule starts and stops of Startable Nodes
 */
export class IS_Schedule
{
    constructor()
    {
        this.scheduleItems = [];
        this.offset = 0;
        this.duration = -1;
    }

    generateSchedule()
    {
        // TODO: procedural parameters for schedule generation
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

        this.scheduleItems.push(scheduleItem);
    }

    scheduleStop(startableNode, stopTime)
    {
        let scheduleItem = new IS_ScheduleItem
        (
            startableNode, IS_ScheduleAction.Stop, stopTime
        );

        this.scheduleItems.push(scheduleItem);
    }

    schedule()
    {
        for (let scheduleItemIndex = 0; scheduleItemIndex < this.scheduleItems.length; scheduleItemIndex++)
        {
            let scheduleItem = this.scheduleItems[scheduleItemIndex];

            if (this.duration >= 0)
            {
                scheduleItem.duration = Math.max(this.duration - scheduleItem.startTime, 0);
            }

            scheduleItem.startTime = this.offset + scheduleItem.startTime;

            this.scheduleItems[scheduleItemIndex].schedule(this.offset, this.duration);
        }
    }

    stop()
    {
        for (let scheduleItemIndex = 0; scheduleItemIndex < this.scheduleItems.length; scheduleItemIndex++)
        {
            this.scheduleItems[scheduleItemIndex].stop();
        }
    }
}