import { createReadableStreamFromReadable } from '@remix-run/node';
import { Readable } from 'node:stream';
import { prisma } from '~/libs';

export const loader = async () => {
  const custData = await prisma.clientfile.findMany();

  const headers = [
    "financeId",
    "userId",
    "firstName",
    "lastName",
    "name",
    "email",
    "phone",
    "address",
    "city",
    "postal",
    "province",
    "dl",
    "typeOfContact",
    "timeToContact",
    "conversationId"
  ];

  const rows = custData.map(entry => [
    entry.financeId,
    entry.userId,
    entry.firstName,
    entry.lastName,
    entry.name,
    entry.email,
    entry.phone,
    entry.address,
    entry.city,
    entry.postal,
    entry.province,
    entry.dl,
    entry.typeOfContact,
    entry.timeToContact,
    entry.conversationId
  ].map(value => (value === null ? '' : value)).join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');

  const file = createReadableStreamFromReadable(
    Readable.from([csvContent]),
  );

  return new Response(file, {
    headers: {
      'Content-Disposition': 'attachment; filename="Customers.csv"',
      'Content-Type': 'text/csv',
    },
  });
};
