// app/routes/sse.time.ts
import { eventStream, interval } from "remix-utils";

export async function loader({ request }: LoaderArgs) {
  return eventStream(request.signal, function setup(send) {
    async function run() {
      for await (let _ of interval(1000, { signal: request.signal })) {
        send({ event: "time", data: new Date().toISOString() });
      }
    }

    run();
  });
}
