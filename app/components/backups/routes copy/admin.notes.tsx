import { parse } from "@conform-to/react";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import {
  Button,
  ButtonLink,
  PageAdminHeader,
  RemixForm,
  RemixLink,
} from "~/components";
import { configDev } from "~/configs";
import { requireUserSession } from "~/helpers";
import { Plus, Trash } from "~/icons";
import { model } from "~/models";
import { createSitemap, formatPluralItems } from "~/utils";
import { getSession } from '~/sessions/auth-session.server';
import { prisma } from "~/libs";

import type { ActionArgs } from "@remix-run/node";

export const handle = createSitemap();

export async function loader() {
  const notesCount = await model.adminNote.query.count();
  return json({ notesCount });
}

export async function action({ request }: ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")


  const user = await GetUser(email)
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  if (!user) { return json({ status: 302, redirect: '/login' }); };

  const formData = await request.formData();
  const submission = parse(formData, {});

  if (submission.payload.intent === "admin-delete-all-notes") {
    await model.adminNote.mutation.deleteAll();
    return json(submission);
  }

  return redirect(`.`);
}

export default function Route() {
  const { notesCount } = useLoaderData<typeof loader>();

  return (
    <div className='max-w-xl   mx-auto justify-center text-white'>

      <PageAdminHeader size="xs">
        <RemixLink to=".">
          <h1>Notes</h1>
        </RemixLink>
        <div className="queue">
          <ButtonLink to="new" size="sm">
            <Plus className="size-sm" />
            <span>Add Note</span>
          </ButtonLink>
          {configDev.isDevelopment && (
            <RemixForm method="delete">
              <Button
                size="sm"
                variant="danger"
                name="intent"
                value="admin-delete-all-notes"
                disabled={notesCount <= 0}
              >
                <Trash className="size-sm" />
                <span>Delete All {formatPluralItems("Note", notesCount)}</span>
              </Button>
            </RemixForm>
          )}
        </div>
      </PageAdminHeader>

      <div className="px-layout">
        <Outlet />
      </div>
    </div>
  );
}
