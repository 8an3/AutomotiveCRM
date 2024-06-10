export const config = {
  runtime: 'edge',
};

export async function loader({ req }) {



  return new Response('Hello Cron!');
}
