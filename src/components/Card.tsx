import { PiDotsNineBold } from "react-icons/pi"
import { CSS } from "@dnd-kit/utilities"
import { useSortable } from "@dnd-kit/sortable"
import type { TaskInterface } from "../types/types"
import { BiSolidTrashAlt } from "react-icons/bi"
import { useState } from "react"

type Props = {
  card: TaskInterface
  deleteTask: (id: string) => void
  updateTask: (id: string, content: string) => void
}

const Card = ({ card, deleteTask, updateTask }: Props) => {
  const [editMode, setEditMode] = useState(false)
  

  const toggleEditMode = () => {
    setEditMode((prev) => !prev)
  }

  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
    id: card.id,
    data: {
      type: "Task",
      card,
    }
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  return (
    <div
      style={style}
      ref={setNodeRef}
      className="bg-gray-200 rounded-lg shadow-sm text-gray-800 flex items-center flex-col overflow-hidden z-20 relative">
      <div className="me-2 text-lg flex items-center justify-between p-2 w-full">
        <button {...attributes} {...listeners} className="cursor-pointer"><PiDotsNineBold /></button>
        <p className="text-xs italic">{card.userEmail}</p>
        <button className="cursor-pointer" onClick={() => deleteTask(card.id)}><BiSolidTrashAlt /></button>
      </div>
      {
        editMode ? <textarea onBlur={toggleEditMode} value={card.content} onChange={e => updateTask(card.id, e.target.value)} name="" id="" className="w-full bg-white p-2 resize-none outline-none"></textarea>
          :
          <div onClick={toggleEditMode} className="w-full bg-white p-2 ">
            {card.content}
          </div>
      }
    </div>
  )
}

export default Card;
