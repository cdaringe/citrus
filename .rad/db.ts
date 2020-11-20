import type { Tasks } from "./common.ts";
import addMinutes from "https://deno.land/x/date_fns@v2.15.0/addMinutes/index.js";

// db
const containerName = "citrusdb";
const dbname = "citrus";
const dbuser = "citrus";
const composeDevArgs = "-f docker-compose.yml"; // -f docker-compose.dev.yml";

export const tasks: Tasks = {
  db: {
    fn: async ({ sh }) => {
      const down = `docker-compose ${composeDevArgs} down ${containerName} -f`;
      const up = `docker-compose ${composeDevArgs} up ${containerName}`; // --force-recreate
      await sh(down).catch(() => {});
      await sh(up);
    },
  },
  "db:seed": {
    fn: async ({ sh }) => {
      const copyQ = "-c '\\copy sensor_stats from STDIN with(format csv)'";
      await sh(
        `rad db:emitseeddata | docker exec -i ${containerName} psql -U ${dbname} ${dbuser} ${copyQ}`
      );
    },
  },
  "db:emitseeddata": {
    fn() {
      const now = new Date();
      const degreesToRadians = (deg: number) => (deg / 360) * Math.PI * 2;
      let i = 0; // minutes in a year
      while (i < 525_600) {
        const vals: any[] = Array.from(Array(14)).map(() =>
          Math.sin(degreesToRadians(i))
        );
        // timestamp
        vals[9] = addMinutes(now, i).toISOString();
        console.log(`${vals.join(",")}`);
        ++i;
      }
    },
  },
  psql: `psql -h 127.0.0.1 -U ${dbname} ${dbuser}`,
};
