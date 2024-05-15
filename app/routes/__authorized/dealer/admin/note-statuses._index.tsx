import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Alert, Debug } from "~/components";
import { createSitemap } from "~/utils";

import type { LoaderArgs } from "@remix-run/node";

export const handle = createSitemap();

export async function loader({ request, params }: LoaderFunctionArgs) {
  const noteStatuses: string[] = [];
  return json({ noteStatuses });
}

export default function Route() {
  const { noteStatuses } = useLoaderData<typeof loader>();

  return (
    <div className='max-w-xl  stack mx-auto justify-center text-[#fafafa]'>

      <Alert variant="warning">Under development</Alert>

      <header>
        <span>All Note Statuses</span>
      </header>

      {noteStatuses.length <= 0 && <span>No note statuses. Please add.</span>}

      <Debug name="noteStatuses">{noteStatuses}</Debug>
    </div>
  );
}
