import { json, type LoaderFunction } from '@remix-run/node';
import { prisma } from "~/libs";

export async function loader({ request, params }: LoaderFunction) {
  const modelId = params.model
  const brandId = params.brandId
  console.log(brandId, modelId, ' getting model data')
  let model;
  switch (brandId) {
    case 'Harley-DavidsonMY24':
      const HarleyDavidsonMY2 = await prisma.manitou.findFirst({ where: { model: modelId } });
      return json({ HarleyDavidsonMY2 });
    case 'Kawasaki':
      const Kawasaki = await prisma.kawasaki.findFirst({ where: { model: modelId } });
      return json({ Kawasaki });
    case 'Manitou':
      const Manitou = await prisma.manitou.findFirst({ where: { model: modelId } });
      return json({ Manitou });
    case 'Triumph':
      const Triumph = await prisma.triumph.findFirst({ where: { model: modelId } });
      return json({ Triumph });
    case 'BMW-Motorrad':
      const BMWMotorrad = await prisma.bmwmoto.findFirst({ where: { model: modelId } });
      return json({ BMWMotorrad });
    case 'Harley-Davidson':
      const HarleyDavidson = await prisma.harley.findFirst({ where: { model: modelId } });
      return json({ HarleyDavidson });
    default:
      const thelastone = await prisma.canam.findUnique({ where: { model: modelId } });
      return json({ thelastone });
  }
  return model
}
/**
 *  case 'Indian':
      model = await prisma.harley24.findMany()
      break;
    case 'Yamaha':
      model = await prisma.harley24.findMany()
      break;
    case 'Spyder':
      model = await prisma.spyder.findMany()
      break;
       case 'Ski-Doo-MY24':
      model = await prisma.my24canam.findMany()
      break;
    case 'Can-Am-SXS-MY24':
      model = await prisma.my24canam.findMany()
      break;
         case 'Sea-Doo':
      model = await prisma.seadoo.findMany()
      break;
    case 'Switch':
      model = await prisma.switch.findMany()
      break;
    case 'Can-Am':
      model = await prisma.canam.findMany()
      break;
    case 'Can-Am-SXS':
      model = await prisma.canamsxs.findMany()
      break;
    case 'KTM':
      model = await prisma.harley24.findMany()
      break;
    case 'Ski-Doo':
      model = await prisma.skidoo.findMany()
      break;
    case 'Suzuki':
      model = await prisma.suzuki.findMany()
      break;

      */
