import { json, type LoaderFunction } from "@remix-run/node";
import { prisma } from "~/libs";

export async function loader({ request, params }: LoaderFunction) {
  const brandId = params.brand;
  console.log(brandId, ' getting brand list')
  let modelList;
  switch (brandId) {
    case "Harley-DavidsonMY24":
      const HarleyDavidsonMY24 = await prisma.harley24.findMany({ select: { model: true } });
      return (HarleyDavidsonMY24);
    case "Ski-Doo-MY24":
      const skidDoo24 = await prisma.my24canam.findMany({ select: { model: true } });
      return (skidDoo24);
    case "Can-Am-SXS-MY24":
      const CanAmSXSMY24 = await prisma.my24canam.findMany({ select: { model: true } });
      return (CanAmSXSMY24);
    case "Kawasaki":
      const Kawasaki = await prisma.kawasaki.findMany({ select: { model: true } });
      return (Kawasaki);
    case "Manitou":
      const Manitou = await prisma.manitou.findMany({ select: { model: true } });
      return (Manitou)
    case "Sea-Doo":
      const SeaDoo = await prisma.seadoo.findMany({ select: { model: true } });
      return (SeaDoo)
    case "Switch":
      const Switch = await prisma.switch.findMany({ select: { model: true } });
      return (Switch);
    case "Can-Am":
      const CanAm = await prisma.canam.findMany({ select: { model: true } });
      return (CanAm);
    case "Can-Am-SXS":
      const modelList = await prisma.canamsxs.findMany({ select: { model: true } });
      return (modelList);
    case "KTM":
      const KTM = await prisma.harley24.findMany({ select: { model: true } });
      return (KTM);
    case "Ski-Doo":
      const SkiDoo = await prisma.skidoo.findMany({ select: { model: true } });
      return (SkiDoo);
    case "Suzuki":
      const Suzuki = await prisma.suzuki.findMany({ select: { model: true } });
      return (Suzuki);
    case "Triumph":
      const Triumph = await prisma.triumph.findMany({ select: { model: true } });
      return (Triumph);
    case "BMW-Motorrad":
      const BMWMotorrad = await prisma.bmwmoto.findMany({ select: { model: true } });
      return (BMWMotorrad);
    case "Indian":
      const Indian = await prisma.harley24.findMany({ select: { model: true } });
      return (Indian);
    case "Yamaha":
      const Yamaha = await prisma.harley24.findMany({ select: { model: true } });
      return (Yamaha);
    case "Spyder":
      const Spyder = await prisma.spyder.findMany({ select: { model: true } });
      return (Spyder);
    case "Harley-Davidson":
      const Harley = await prisma.harley.findMany({ select: { model: true } });
      console.log(Harley, 'harley')
      return (Harley);
    default:
      return json('did not get brand');
  }
}
