import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { BiSolidTrashAlt } from "react-icons/bi"
import { FaPlus } from "react-icons/fa6"
import { PiDotsNineBold } from "react-icons/pi"
import type { ColumnInterface, TaskInterface } from "../types/types"
import Card from "./Card"
import { useMemo} from "react"

type Props = {
  col: ColumnInterface
  deleteColumn: (id: string) => void;
  createTask: (columnId: string) => void;
  deleteTask: (id: string) => void
  updateTask: (id: string, content: string) => void
  tasks: TaskInterface[]
}

const Column = ({ col, deleteColumn, createTask, tasks, deleteTask, updateTask }: Props) => {
  const tasksIds = useMemo(() => {
    return tasks.map(task => task.id)
  }, [tasks])

  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
    id: col.id,
    data: {
      type: "Column",
      col,
    }
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-72 bg-white rounded-xl shadow-md flex flex-col gap-4 h-[40rem] overflow-hidden">
      <div className="flex items-center justify-between bg-blue-600 text-white p-4 ">
        <div
          {...attributes}
          {...listeners}
          className="cursor-pointer text-2xl">
          <PiDotsNineBold />
        </div>
        <h2 className="text-xl font-semibold ">{col.title}</h2>
        <button onClick={() => deleteColumn(col.id)} className="cursor-pointer"><BiSolidTrashAlt /></button>
      </div>
      <div className="flex flex-col gap-2 px-3">
        <SortableContext items={tasksIds}>
          {tasks.map((card) => (
            <Card key={card.id} card={card} deleteTask={deleteTask} updateTask={updateTask} />
          ))}
        </SortableContext>
        <button onClick={() => { createTask(col.id) }} className="bg-gray-100 p-3 cursor-pointer hover:bg-gray-200 duration-200 rounded-lg  text-gray-400 flex items-center justify-between">Add Task <FaPlus /></button>
      </div>

    </div>
  )
}

export default Column
