import { IS_ScheduleAction } from "../../enums/IS_ScheduleAction.js";

/**
 * Schedule the Start or Stop of an IS_StartableNode
 * - maybe a schedule Item contains individual schedule actions?
 */
export class IS_ScheduleItem
{
    constructor(schedulable, scheduleAction, startTime, duration = null, value = 0)
    {
        this._schedulable = schedulable;
        this.scheduleAction = scheduleAction;
        this.startTime = startTime;
        this.duration = duration;
        this.value = value;
    }

    schedule()
    {
        switch (this.scheduleAction)
        {
            case (IS_ScheduleAction.Start):
                this.scheduleStart();
                break;
            case (IS_ScheduleAction.Stop):
                this.scheduleStop();
                break;
            case (IS_ScheduleAction.SetValue):
                this.scheduleValue();
                break;
            default:
                break;
        }
    }

    scheduleStart()
    {
        this._schedulable.start(this.startTime);

        if (this.duration !== null)
        {
            this._schedulable.stop(this.startTime + this.duration);
        }
    }

    scheduleStop(offset = 0)
    {
        let stopTime = offset + this.startTime;

        this._schedulable.stop(stopTime);
    }

    scheduleValue()
    {
        this._schedulable.setValueAtTime(this.value, this.startTime);
    }

    start()
    {
        this._schedulable.start();
    }

    stop()
    {
        if(this.scheduleAction === IS_ScheduleAction.SetValue)
        {
            return;
        }

        this._schedulable.stop();
    }
}