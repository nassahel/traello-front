import { BiSolidTrashAlt } from "react-icons/bi"
import type { ColumnInterface } from "../types/types"
import Card from "./Card"
import { PiDotsNineBold } from "react-icons/pi"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import SortableItem from "./SortableItem"

type Props = {
  board: ColumnInterface
}

const Column = ({ board }: Props) => {
  return (
    <div className="w-72 bg-white rounded-xl shadow-md p-4 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div className="cursor-pointer text-xl">
          <PiDotsNineBold />
        </div>
        <h2 className="text-xl font-semibold text-gray-700">{board.title}</h2>
        <button className="text-red-600"><BiSolidTrashAlt /></button>
      </div>

      <SortableContext
        items={board.cards.map((card) => card.id.toString())}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {board.cards.map((card) => (
            <SortableItem key={card.id} id={card.id.toString()}>
              <Card card={card} />
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export default Column
