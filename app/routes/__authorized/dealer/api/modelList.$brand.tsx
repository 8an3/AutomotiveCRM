import { json, type LoaderFunction } from "@remix-run/node";
import { prisma } from "~/libs";

export async function loader({ request, params }: LoaderFunction) {
  const brandId = params.brandId;
  console.log(brandId, ' getting brand list')
  let modelList;
  switch (brandId) {
    case "Harley-DavidsonMY24":
      const HarleyDavidsonMY24 = await prisma.harley24.findMany({ select: { model: true } });
      return json({ HarleyDavidsonMY24 });
    case "Ski-Doo-MY24":
      const skidDoo24 = await prisma.my24canam.findMany({ select: { model: true } });
      return json({ skidDoo24 });
    case "Can-Am-SXS-MY24":
      const CanAmSXSMY24 = await prisma.my24canam.findMany({ select: { model: true } });
      return json({ CanAmSXSMY24 });
    case "Kawasaki":
      const Kawasaki = await prisma.kawasaki.findMany({ select: { model: true } });
      return json({ Kawasaki });
    case "Manitou":
      const Manitou = await prisma.manitou.findMany({ select: { model: true } });
      return json({ Manitou })
    case "Sea-Doo":
      const SeaDoo = await prisma.seadoo.findMany({ select: { model: true } });
      return json({ SeaDoo })
    case "Switch":
      const Switch = await prisma.switch.findMany({ select: { model: true } });
      return json({ Switch });
    case "Can-Am":
      const CanAm = await prisma.canam.findMany({ select: { model: true } });
      return json({ CanAm });
    case "Can-Am-SXS":
      const modelList = await prisma.canamsxs.findMany({ select: { model: true } });
      return json({ modelList });
    case "KTM":
      const KTM = await prisma.harley24.findMany({ select: { model: true } });
      return json({ KTM });
    case "Ski-Doo":
      const SkiDoo = await prisma.skidoo.findMany({ select: { model: true } });
      return json({ SkiDoo });
    case "Suzuki":
      const Suzuki = await prisma.suzuki.findMany({ select: { model: true } });
      return json({ Suzuki });
    case "Triumph":
      const Triumph = await prisma.triumph.findMany({ select: { model: true } });
      return json({ Triumph });
    case "BMW-Motorrad":
      const BMWMotorrad = await prisma.bmwmoto.findMany({ select: { model: true } });
      return json({ BMWMotorrad });
    case "Indian":
      const Indian = await prisma.harley24.findMany({ select: { model: true } });
      return json({ Indian });
    case "Yamaha":
      const Yamaha = await prisma.harley24.findMany({ select: { model: true } });
      return json({ Yamaha });
    case "Spyder":
      const Spyder = await prisma.spyder.findMany({ select: { model: true } });
      return json({ Spyder });
    case "Harley-Davidson":
      const Harley = await prisma.harley.findMany({ select: { model: true } });
      return json({ Harley });
    default:
      null;
  }
}
