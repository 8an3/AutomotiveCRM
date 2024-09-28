rm -r app/
cp -r F:/crmStack/yoda/app/ .
rm .env
cp app/components/microsoft/DONOTDELETEROUTES/.env .
rm app/components/microsoft/Config.ts
cp app/components/microsoft/DONOTDELETEROUTES/Config.ts app/components/microsoft/Config.ts
rm prisma/schema.prisma
cp F:/crmStack/yoda/prisma/schema.prisma prisma/schema.prisma
rm prisma/seed.ts
cp F:/crmStack/yoda/prisma/seed.ts prisma/seed.ts
