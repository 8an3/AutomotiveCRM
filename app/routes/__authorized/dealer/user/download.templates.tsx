import { createReadableStreamFromReadable } from '@remix-run/node';
import { Readable } from 'node:stream';
import { prisma } from '~/libs';
import { getSession } from '~/sessions/auth-session.server';

export const loader = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")
  const custData = await prisma.emailTemplates.findMany({
    where: { userEmail: email }
  });

  const headers = [
    "subCat",
    "body",
    "userEmail",
    "category",
    "type",
    "subject",
    "dept",
  ];

  const rows = custData.map(entry => [
    entry.subCat,
    `"${entry.body}"`, // Ensure entry.body is wrapped in double quotes
    entry.userEmail,
    entry.category,
    entry.type,
    entry.subject,
    entry.dept,
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

  const file = createReadableStreamFromReadable(
    Readable.from([csvContent]),
  );

  return new Response(file, {
    headers: {
      'Content-Disposition': 'attachment; filename="Templates.csv"',
      'Content-Type': 'text/csv',
    },
  });
};
