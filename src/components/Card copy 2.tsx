import { PiDotsNineBold } from "react-icons/pi"
import { CSS } from "@dnd-kit/utilities"
import { useSortable } from "@dnd-kit/sortable"

type Props = {
  card: {
    text: string
    id: string
  }
}




const Card = ({ card }: Props) => {

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id })
  const style = {
    transform: CSS.Transform.toString(transform), transition
  }

  return (
    <div
      style={style}
      ref={setNodeRef}
      className="bg-gray-100 p-3 rounded-lg shadow-sm text-gray-800 flex items-center">
      <div
        {...attributes}
        {...listeners}
        className="me-2 cursor-pointer text-lg">
        <PiDotsNineBold />
      </div>
      {card.text}
    </div>
  )
}

export default Card;
