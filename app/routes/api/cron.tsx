
import { prisma } from "~/libs";

export async function loader({ req }) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }
  const notifications = await prisma.notificationsUser.create({
    data: {
      userEmail: 'skylerzanth@outlook.com',
      title: 'test worked!',
      content: `yes it did`,
      type: "updates",
    }
  })

  return new Response('Hello Cron, fuk you !') && notifications;
}
