import { json, type LoaderFunction, type ActionFunction, redirect, LoaderArgs } from '@remix-run/node';
import financeFormSchema from '~/overviewUtils/financeFormSchema';
import { collapsedCookie, layoutCookie } from '~/components/dev/mail/cookies.server';

export async function action({ request, }: ActionFunctionArgs) {
  const formPayload = Object.fromEntries(await request.formData())
  let formData = financeFormSchema.parse(formPayload)
  const intent = formPayload.intent



  const layout = formPayload.layout
  const collapsed = formPayload.collapsed

  const cookieHeader = request.headers.get("Cookie");
  let newLayoutCookie = await layoutCookie.parse(cookieHeader);
  let newCollapsedCookie = await collapsedCookie.parse(cookieHeader);

  if (layout) {
    newLayoutCookie = layout;
  }

  if (collapsed) {
    newCollapsedCookie = collapsed === "true";
  }

  return json('done',
    {
      headers: {
        "Set-Cookie": await layoutCookie.serialize(newLayoutCookie) &&
          collapsedCookie.serialize(newCollapsedCookie),
      },
    }
  );
}


export const loader = async ({ request }: LoaderArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const layout = (await layoutCookie.parse(cookieHeader)) || [33, 67];
  const collapsed = (await collapsedCookie.parse(cookieHeader)) || false;
  return json({ layout, collapsed });
}
