import { redirect } from "@remix-run/node";

import type { LoaderArgs } from "@remix-run/node";

export async function loader({ request, params }: LoaderFunctionArgs) {
  return redirect("https://uptime.mhaidarhanif.com");
}
