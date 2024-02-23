import { ColumnPinningPosition } from '@tanstack/react-table'
import React from 'react'
import { MoveLeft, MoveRight, FilterList, NavArrowLeft, NavArrowRight, FastArrowLeft, FastArrowRight, InputField, MoneySquare, Map } from "iconoir-react";

type Props = {
  isPinned: ColumnPinningPosition
  pin: (position: ColumnPinningPosition) => void
}

export const TablePins: React.FC<Props> = ({ isPinned, pin }) => {
  const pinLeft = () => pin('left')
  const unPin = () => pin(false)
  const pinRight = () => pin('right')

  return (
    <div className="flex gap-1 justify-center">
      {isPinned !== 'left' ? (
        <button className="border rounded px-2 h-6" onClick={pinLeft}>
         <NavArrowLeft />
        </button>
      ) : null}
      {isPinned ? (
        <button className="border rounded px-2 h-6" onClick={unPin}>
          X
        </button>
      ) : null}
      {isPinned !== 'right' ? (
        <button className="border rounded px-2 h-6" onClick={pinRight}>
         <NavArrowRight />
        </button>
      ) : null}
    </div>
  )
}

export default TablePins
