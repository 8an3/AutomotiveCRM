import { useParams } from "@remix-run/react"
import { KawasakiList } from "./kawasaki";
import { SuzukiList } from "./suzuki";
import { ListOptions } from './canam'
import { ManitouList } from "./manitou";
import { SeadooList } from "./seadoo";
import { SkidooList } from "./skidoo";
import { SpyderList } from "./spyder";
import { SwitchList } from "./switch";
import { TriumphList } from './triumph'
import { BMWMotoList } from './bmwmoto'
import { HarleyList } from './harley'
import { ListOptionsCanAmSXS } from "./canamsxs";


export function ListSelection() {
  let { brandId } = useParams()
  console.log(brandId)
  if (brandId === 'Can-Am') {
    return (
      <ListOptions />
    )
  }
  if (brandId === 'Kawasaki') {
    return (
      <KawasakiList />
    )
  }
  if (brandId === 'Suzuki') {
    return (
      <SuzukiList />
    )
  }
  if (brandId === 'Manitou') {
    return (
      <ManitouList />
    )
  }
  if (brandId === 'Sea-Doo') {
    return (
      <SeadooList />
    )
  }
  if (brandId === 'Ski-Doo') {
    return (
      <SkidooList />
    )
  }
  if (brandId === 'Spyder') {
    return (
      <SpyderList />
    )
  }
  if (brandId === 'Triumph') {
    return (
      <TriumphList />
    )
  }
  if (brandId === 'Switch') {
    return (
      <SwitchList />
    )
  }
  if (brandId === 'BMW-Motorrad') {
    return (
      <BMWMotoList />
    )
  }
  if (brandId === 'Harley-Davidson') {
    return (
      <HarleyList />
    )
  }
  if (brandId === 'Can-Am-SXS') {
    return (
      <ListOptionsCanAmSXS />
    )
  }
}


export function ListSelection2({ brandId }) {
  console.log(brandId)
  if (brandId === 'Can-Am') {
    return (
      <ListOptions />
    )
  }
  if (brandId === 'Kawasaki') {
    return (
      <KawasakiList />
    )
  }
  if (brandId === 'Suzuki') {
    return (
      <SuzukiList />
    )
  }
  if (brandId === 'Manitou') {
    return (
      <ManitouList />
    )
  }
  if (brandId === 'Sea-Doo') {
    return (
      <SeadooList />
    )
  }
  if (brandId === 'Ski-Doo') {
    return (
      <SkidooList />
    )
  }
  if (brandId === 'Spyder') {
    return (
      <SpyderList />
    )
  }
  if (brandId === 'Triumph') {
    return (
      <TriumphList />
    )
  }
  if (brandId === 'Switch') {
    return (
      <SwitchList />
    )
  }
  if (brandId === 'BMW-Motorrad') {
    return (
      <BMWMotoList />
    )
  }
  if (brandId === 'Harley-Davidson') {
    return (
      <HarleyList />
    )
  }
  if (brandId === 'Can-Am-SXS') {
    return (
      <ListOptionsCanAmSXS />
    )
  }
}
