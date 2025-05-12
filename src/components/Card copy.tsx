import { PiDotsNineBold } from "react-icons/pi"

type Props = {
  card: {
    text: string
    id: string
  }
}

const Card = ({ card }: Props) => {
  return (
    <div className="bg-gray-100 p-3 rounded-lg shadow-sm text-gray-800 flex items-center">
      <div className="me-2 cursor-pointer text-lg">
        <PiDotsNineBold />
      </div>
      {card.text}
    </div>
  )
}

export default Card;
