import { Task, Tasks } from "./.rad/common.ts";
import { tasks as dbTasks } from "./.rad/db.ts";

const startDevServer: Task = `npx ts-node src/server.ts`;
const start: Task = {
  async fn({ sh }) {
    const dbT = sh(`rad -l info db`);
    const startDevServerT = sh(`rad -i info startDevServer`);
    await Promise.all([dbT, startDevServerT]);
  },
};
const test: Task = `npx jest`;
export const tasks: Tasks = {
  ...dbTasks,
  ...{ startDevServer, sds: startDevServer },
  ...{ t: test, test, tw: `${test} --watch` },
  clean: `fd -I js src --exec rm {}`,
  start,
};
