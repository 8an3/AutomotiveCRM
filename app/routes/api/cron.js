export const config = {
  runtime: 'edge',
};

export async function loader({ req }) {
  const why = 'why me'
  const test = await prisma.automations.create({
    data: {
      userEmail: 'skylerzanth@gmail.com',
      pickUp24before: 'yes',
      appt24before: 'yes',
    }
  })

  return new Response('Hello Cron, fuk you !') && test;
}
