
import { prisma } from "~/libs";
import type { HeadersFunction, LinksFunction, LoaderArgs, V2_MetaDescriptor, V2_MetaFunction, } from "@remix-run/node";
export async function loader({ request }: LoaderArgs) {
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return request.status(401).end('Unauthorized');
  }
  await prisma.notificationsUser.create({
    data: {
      userEmail: 'skylerzanth@outlook.com',
      title: 'test worked!',
      content: `yes it did`,
      type: "updates",
    }
  })

  return new Response('Hello Cron, fuk you !')
}

/*8

*/
