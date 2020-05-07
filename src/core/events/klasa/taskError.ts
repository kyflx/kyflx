import { Event, ScheduledTask, Task } from "klasa";

export default class EventErrorEvent extends Event {
  public run(_st: ScheduledTask, task: Task, error: Error) {
    return this.client.logger.error({
      prefix: `task (${task.name})`,
      message: error,
    });
  }
}
