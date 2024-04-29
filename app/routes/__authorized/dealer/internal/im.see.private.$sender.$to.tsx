import type { LoaderArgs } from "@remix-run/node";
import { eventStream } from "remix-utils";

import { emitter } from "~/services/emitter";

export function loader({ request, params }: LoaderArgs) {
  return eventStream(request.signal, function setup(send) {
    function listener(value: string) {
      send({ data: value });
    }
    const { sender, to } = params;
    // emitter.on(`private`, listener);
    const sortedIdentifiers = [sender, to].sort();
    const eventName = `private:${sortedIdentifiers[0]}:${sortedIdentifiers[1]}`;
    emitter.on(eventName, listener);

    return function cleanup() {
      emitter.off(`private`, listener);
    };
  });
}
