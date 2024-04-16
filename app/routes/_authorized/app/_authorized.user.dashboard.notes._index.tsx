import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import {
  AvatarAuto,
  ButtonLink,
  Layout,
  PageHeader,
  RemixLink,
} from "~/components";
import { model } from "~/models";
import {
  createCacheHeaders,
  createMetaData,
  createSitemap,
  formatPluralItems,
  formatRelativeTime,
} from "~/utils";
import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { InfoEmpty, SubmitDocument, Plus } from "~/icons";

import type { z } from "zod";

import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import Route2 from "~/routes/_authorized/internal/user.notes._index";
import Route3 from "~/routes/_authorized/internal/user.notes.new._index";

export const handle = createSitemap("/notes", 0.8);

export const meta = createMetaData({
  title: "Notes",
  description: "Public notes created by the community.",
});


export async function action({ request }: ActionArgs) {
  const { userSession, user } = await requireUserSession(request);

  const formData = await request.formData();
  const submission = parse(formData, { schema: schemaNoteNew });
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission);
  }

  try {
    const newNote = await model.userNote.mutation.create({
      user: userSession,
      note: submission.value,
      files: [],
    });
    if (!newNote) {
      return badRequest(submission);
    }
    return null
  } catch (error) {
    console.error(error);
    return serverError(submission);
  }
}
export async function loader({ request, params }: LoaderFunctionArgs) {
  const notes = await model.note.query.getAll();
  const notesCount = notes.length;
  return json({ notes, notesCount }, { headers: createCacheHeaders(request) });
}
const TabsDemo = () => (
  <Tabs.Root
    className="flex flex-col"
    defaultValue="tab1"
  >
    <Tabs.List className="shrink-0 flex border-b border-mauve6" aria-label="Manage your account">
      <Tabs.Trigger
        className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
        value="tab1"
      >
        All Notes
      </Tabs.Trigger>
      <Tabs.Trigger
        className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
        value="tab2"
      >
        Edit / Delete
      </Tabs.Trigger>
      <Tabs.Trigger
        className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
        value="tab3"
      >
        Create
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
      value="tab1"
    >
      <Route1 />

    </Tabs.Content>
    <Tabs.Content value="tab2" className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black" >
      <Route2 />
    </Tabs.Content>
    <Tabs.Content value="tab3" className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black" >
      <Route3 />
    </Tabs.Content>
  </Tabs.Root>
);

export default TabsDemo;

export function Route1() {
  const { notes, notesCount } = useLoaderData<typeof loader>();

  return (
    <Layout
      isSpaced
      variant="sm"
      layoutHeader={
        <PageHeader size="xs">
          <div className="contain-sm stack">
            <div>
              <h1>All {formatPluralItems("note", notesCount)}</h1>
              <p>
                Published notes from the users. Frequently changed or reset for
                this example demo.
              </p>
            </div>
            <div className="queue-center">
              <ButtonLink to="/new" size="sm">
                <Plus className="size-sm" />
                <span>Add Note</span>
              </ButtonLink>
            </div>
          </div>
        </PageHeader>
      }
    >
      <section>
        <ul className="stack">
          {notes.map((note) => {
            return (
              <li key={note.slug}>
                <RemixLink
                  prefetch="intent"
                  to={`/notes/${note.slug}`}
                  className="card hover:card-hover stack-sm h-full"
                >
                  <h3>{note.title}</h3>
                  <p>{note.description}</p>
                  {/* <p className="dim">{truncateText(note.content, 70)}</p> */}
                  <div className="queue-center-sm dim">
                    <AvatarAuto user={note.user} className="size-md" />
                    <span>{note.user.name}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(note.updatedAt)}</span>
                  </div>
                </RemixLink>
              </li>
            );
          })}
        </ul>
      </section>
    </Layout>
  );
}
