Remove-Item -Recurse -Force app/
Copy-Item -Recurse F:/crmStack/yoda/app/ .
Remove-Item .env
Copy-Item app/components/microsoft/DONOTDELETEROUTES/.env .
Remove-Item app/components/microsoft/Config.ts
Copy-Item app/components/microsoft/DONOTDELETEROUTES/Config.ts app/components/microsoft/Config.ts
Remove-Item prisma/schema.prisma
Copy-Item F:/crmStack/yoda/prisma/schema.prisma prisma/schema.prisma
Remove-Item prisma/seed.ts
Copy-Item F:/crmStack/yoda/prisma/seed.ts prisma/seed.ts
