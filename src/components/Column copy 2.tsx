import { BiSolidTrashAlt } from "react-icons/bi"
import type { ColumnInterface } from "../types/types"
import { closestCenter, DndContext } from "@dnd-kit/core"
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { PiDotsNineBold } from "react-icons/pi"
import { CSS } from "@dnd-kit/utilities"
import Card from "./Card"

type Props = {
  col: ColumnInterface
  setColsData: any
}

const Column = ({ col, setColsData }: Props) => {

  let cards = col.cards;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: col.id })
  const style = {
    transform: CSS.Transform.toString(transform), transition
  }

  const handleCardDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = col.cards.findIndex((card) => card.id === active.id);
    const newIndex = col.cards.findIndex((card) => card.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(col.cards, oldIndex, newIndex);

    setColsData((prevCols: ColumnInterface[]) =>
      prevCols.map((c) =>
        c.id === col.id ? { ...c, cards: reordered } : c
      )
    );
  };


  return (
    <div
      style={style}
      ref={setNodeRef}
      className="w-72 bg-white rounded-xl shadow-md p-4 flex flex-col gap-4 h-[40rem]">
      <div className="flex items-center justify-between">
        <div
          {...attributes}
          {...listeners}
          className="cursor-pointer text-xl">
          <PiDotsNineBold />
        </div>
        <h2 className="text-xl font-semibold text-gray-700">{col.title}</h2>
        <button className="text-red-600"><BiSolidTrashAlt /></button>
      </div>
      <div className="flex flex-col gap-2">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleCardDragEnd}>
          <SortableContext items={col.cards} strategy={verticalListSortingStrategy}>
            {col.cards.map((card) => (
              <Card key={card.id} card={card} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

    </div>
  )
}

export default Column
