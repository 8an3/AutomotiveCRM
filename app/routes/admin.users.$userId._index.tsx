import { parse } from "@conform-to/react";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { serverError } from "remix-utils";
import { getSession, commitSession, destroySession } from '../sessions/auth-session.server'

import {
  Anchor,
  AvatarAuto,
  Badge,
  Button,
  ButtonLink,
  Debug,
  RemixForm,
  RemixLink,
  TooltipAuto,
  Image,
} from "~/components";
import { requireUserRole, requireUserSession } from "~/helpers";
import { EditPencil, Eye, Trash } from "~/icons";
import { model } from "~/models";
import {
  createSitemap,
  formatDateTime,
  formatPluralItems,
  formatRelativeTime,
  invariant,
} from "~/utils";
import { prisma } from "~/libs";
import { getSession as sessionGet, getUserByEmail } from '~/utils/user/get'
import { requireAuthCookie } from '~/utils/misc.user.server';



import type { ActionArgs, LoaderArgs } from "@remix-run/node";

export const handle = createSitemap();

export async function loader({ request, params }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  let user = await model.user.query.getForSession({ email: email });
  user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      subscriptionId: true,
      customerId: true,
      returning: true,
      phone: true,
      role: { select: { symbol: true, name: true } },
      profile: {
        select: {
          id: true,
          headline: true,
          bio: true,
        },
      },
    },
  });
  if (!user) { return json({ status: 302, redirect: '/login' }); };
  const symbol = user.role.symbol
  if (symbol !== 'ADMIN' && symbol !== 'MANAGER' && symbol !== 'EDITOR') {
    return redirect(`/`);
  } else {
    const isActionAllowed = true;
    return isActionAllowed;
  }
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const submission = parse(formData);

  try {
    if (submission.payload.intent === "delete-user") {
      await model.adminUser.mutation.deleteById({
        id: submission.payload.userId,
      });
      return redirect(`..`);
    }
    if (submission.payload.intent === "delete-all-user-images") {
      await model.adminUser.mutation.deleteAllUserImages({
        userId: submission.payload.userId,
      });
      return json(submission);
    }
  } catch (error) {
    console.error(error);
    return serverError(submission);
  }

  return null;
}

export default function Route() {
  const { user, isActionAllowed } = useLoaderData<typeof loader>();

  if (!user) {
    return <span>User not found.</span>;
  }

  const userImagesCount = user.images.length;

  return (
    <div className='max-w-xl  stack-lg m-5 text-white'>
      <header>
        <div className="flex space-x-3">

          <ButtonLink to={`/${user.username}`} variant="outline">
            <span>View on Site</span>
          </ButtonLink>

          {isActionAllowed && (
            <>
              <ButtonLink to="edit" variant="outline">
                <EditPencil className="size-xs" />
                <span>Edit</span>
              </ButtonLink>

              <RemixForm method="delete">
                <input type="hidden" name="userId" value={user.id} />
                <Button
                  variant="outline"
                  name="intent"
                  value="delete-user"
                >
                  <Trash className="size-xs" />
                  <span>Delete</span>
                </Button>
              </RemixForm>
            </>
          )}
        </div>
      </header>

      <section className="card space-y-4">
        <header>
          <div className="queue-center">
            <span>
              ID: <code>{user.id}</code>
            </span>

          </div>
          <span className="queue-center-sm">
            Role: <Badge>{user.role.name}</Badge>
          </span>

          <div className="queue-center text-xs">
            <TooltipAuto content={<b>{formatDateTime(user.createdAt)}</b>}>
              <span>Created at: </span>
              <b>{formatRelativeTime(user.createdAt)}</b>
            </TooltipAuto>
            <span>•</span>
            <TooltipAuto content={<b>{formatDateTime(user.updatedAt)}</b>}>
              <span>Updated at: </span>
              <b>{formatRelativeTime(user.updatedAt)}</b>
            </TooltipAuto>
          </div>
        </header>

        <section className="queue-center">
          <div>
            <h2>
              {user.name} (@{user.username})
            </h2>
            <h3>{user.email}</h3>
          </div>
        </section>

        <article>
          <h4>{user.profile.headline}</h4>
          <p>{user.profile.bio}</p>
        </article>
      </section>

      <section className="stack">
        <header>
          <h5>Notes</h5>
        </header>
        {user.notes.length <= 0 && <span>No user notes yet.</span>}
        {user.notes.length > 0 && (
          <ul className="space-y-1">
            {user.notes.map((note) => {
              return (
                <li key={note.id}>
                  <RemixLink
                    prefetch="intent"
                    to={`/admin/notes/${note.id}`}
                    className="card-sm hover:card-hover"
                  >
                    {note.title}
                  </RemixLink>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="stack">
        <header className="queue-center">
          <h5>Images</h5>
          <RemixForm method="delete">
            <input type="hidden" name="userId" value={user.id} />
            <Button
              size="xs"
              variant="danger"
              name="intent"
              value="delete-all-user-images"
              disabled={userImagesCount <= 0}
            >
              <Trash className="size-xs" />
              <span>
                Delete All {formatPluralItems("Image", userImagesCount)}
              </span>
            </Button>
          </RemixForm>
        </header>
        {userImagesCount <= 0 && <span>No user images yet.</span>}
        {userImagesCount > 0 && (
          <ul className="queue-center">
            {user.images
              .filter((image) => image.url && image.url !== "undefined")
              .map((image) => {
                const imageUrl =
                  image.url +
                  `-/preview/200x200/` +
                  `-/format/auto/` +
                  `-/quality/smart/`;

                return (
                  <li key={image.id}>
                    <Anchor href={imageUrl} className="card hover:card-hover">
                      <Image
                        src={imageUrl}
                        alt={`Image: ${image.url}`}
                        className="max-h-20 max-w-xs object-cover"
                      />
                    </Anchor>
                  </li>
                );
              })}
          </ul>
        )}
      </section>

      <Debug name="user">{user}</Debug>
    </div>
  );
}
