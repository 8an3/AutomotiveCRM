import { createReadableStreamFromReadable } from '@remix-run/node';
import { Readable } from 'node:stream';
import { prisma } from '~/libs';

export const loader = async () => {
  const data = await prisma.clientfile.findMany();

  const headers = [
    "id",
    "createdAt",
    "updatedAt",
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
    "conversationId",
    "billingAddress",
  ];
  const testData = {
    "id": "id",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    "financeId": "financeId",
    "userId": "userId",
    "firstName": "firstName",
    "lastName": "lastName",
    "name": "name",
    "email": "email",
    "phone": "phone",
    "address": "address",
    "city": "city",
    "postal": "postal",
    "province": "province",
    "dl": "dl",
    "typeOfContact": "typeOfContact",
    "timeToContact": "timeToContact",
  }
  const csvData = data.length > 0 ? data : [testData];


  const rows = csvData.map(entry => [
    entry.id,
    entry.createdAt,
    entry.updatedAt,
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
    entry.conversationId,
    entry.billingAddress,
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
