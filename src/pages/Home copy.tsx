import { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { mockData } from "../data/CardsData";
import { FaPlus } from "react-icons/fa6";
import Column from "../components/Column";
import { socket } from "../websocket/socket";
import SortableItem from "../components/SortableItem";
import { handleDragEnd as createHandleDragEnd } from "../utils/dragHandlers";

const Home = () => {
  const [boards, setBoards] = useState(mockData);
  const [loged, setLoged] = useState(true);

  const handleDragEnd = createHandleDragEnd(boards, setBoards, socket);

  useEffect(() => {
    socket.on("columnMoved", (data: any) => {
      console.log("Columna movida desde otro cliente:", data);
      if (Array.isArray(data.boards)) {
        setBoards(data.boards);
      }
    });

    socket.on("cardMoved", (data: any) => {
      console.log("Tarjeta movida desde otro cliente:", data);
      setBoards(data.boards);
    });

    return () => {
      socket.off("columnMoved");
      socket.off("cardMoved");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <nav className="flex items-center justify-between bg-blue-600 text-white px-6 py-4">
        <h1 className="text-2xl font-bold">
          Tr<span className="text-yellow-300">a</span>ello
        </h1>
        {loged ? (
          <button onClick={() => setLoged(false)}>Logout</button>
        ) : (
          <button onClick={() => setLoged(true)}>Login</button>
        )}
      </nav>

      <main className="flex-1 flex overflow-x-auto p-6 min-h-0">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={boards.map((b) => b.id.toString())}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex gap-6 w-max h-full">
              {boards.map((board) => (
                <SortableItem key={board.id} id={board.id.toString()}>
                  <Column board={board} />
                </SortableItem>
              ))}
              <button className="w-72 bg-white rounded-xl shadow-md p-4 cursor-pointer flex text-xl font-semibold text-gray-400 items-center justify-between h-fit gap-4">
                <h2>New Column</h2>
                <FaPlus />
              </button>
            </div>
          </SortableContext>
        </DndContext>
      </main>
    </div>
  );
};

export default Home;
