import Activity_log from "../api/activity_log/models/activity_log.js";
import { event_description } from "../constants/activity_log.js";

export async function createActivityLog({ UserId, event, transaction }) {
  try {
    console.log("entering createActivityLog");
    console.log(UserId, event);
    const activity_log = await Activity_log.create(
      {
        event,
        UserId,
        description: event_description[event],
      },
      { transaction: transaction }
    );
  } catch (error) {
    console.log(error);
    return { error };
  }
}
