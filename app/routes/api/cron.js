

export async function loader({ req }) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }
  const test = await prisma.automations.create({
    data: {
      userEmail: 'skylerzanth@gmail.com',
      pickUp24before: 'yes',
      appt24before: 'yes',
    }
  })

  return new Response('Hello Cron, fuk you !') && test;
}
