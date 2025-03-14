import { IS_Schedule } from "./IS_Schedule.js";
import { IS_Sequence } from "../sequence/IS_Sequence.js";

const INFINITE_SIBLING_SCHEDULE = new IS_Schedule();

export const IS_Scheduler =
{
	get contextSchedule() { return INFINITE_SIBLING_SCHEDULE; },

	_schedules: [],
	_sequences: [],

	start()
	{
		this._scheduleSequences();
		this._startSchedules();
	},

	stop()
	{
		this._stopSchedules();
	},

	createSchedule()
	{
		return new IS_Schedule();
	},

	scheduleStart(schedulable, time = 0, duration = null)
	{
		this.contextSchedule.scheduleStart(schedulable, time, duration);
	},

	scheduleStop(schedulable, time)
	{
		this.contextSchedule.scheduleStop(schedulable, time);
	},

	scheduleValue(schedulable, value, time, transitionTime = null)
	{
		this.contextSchedule.scheduleValue(schedulable, value, time, transitionTime);
	},

	schedule(schedule)
	{
		this._schedules.push(schedule);
	},

	createSequence()
	{
		return new IS_Sequence();
	},

	sequence(sequence)
	{
		this._sequences.push(sequence);
	},

	_scheduleSequences()
	{
		while(this._sequences.length > 0)
		{
			this._sequences.shift().schedule();
		}
	},

	_startSchedules()
	{
		this.contextSchedule.schedule();
	},

	_stopSchedules()
	{
		this.contextSchedule.stop();
	},
}