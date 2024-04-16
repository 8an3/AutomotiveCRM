// routes/$exportCSV.tsx

import { prisma } from '~/libs';

export const loader = async ({ request }) => {
  const inventoryMotorcycles = await prisma.inventoryMotorcycle.findMany();

  const csvContent = inventoryMotorcycles.map(motorcycle => {
    return Object.values(motorcycle).join(',');
  }).join('\n');

  return {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=inventoryMotorcycles.csv'
    },
    body: csvContent
  };
};
