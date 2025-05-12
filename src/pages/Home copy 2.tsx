import { useState } from "react";
import { mockData } from "../data/CardsData";
import { FaPlus } from "react-icons/fa6";
import Column from "../components/Column";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";

const Home = () => {
  const [colsData, setColsData] = useState(mockData);
  const [loged, setLoged] = useState(true);



const handleEnd = (event: any) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const oldIndex = colsData.findIndex((col) => col.id === active.id);
  const newIndex = colsData.findIndex((col) => col.id === over.id);

  if (oldIndex === -1 || newIndex === -1) return;

  const newOrder = arrayMove(colsData, oldIndex, newIndex);
  setColsData(newOrder);
};



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
        <DndContext collisionDetection={closestCenter} onDragEnd={handleEnd}>
          <div className="flex gap-6 w-max h-full">
            <SortableContext items={colsData} strategy={horizontalListSortingStrategy}>
              {colsData.map((col) => (
                <Column key={col.id} col={col} setColsData={setColsData} />
              ))}
            </SortableContext>
            <button className="w-72 bg-white rounded-xl shadow-md p-4 cursor-pointer flex text-xl font-semibold text-gray-400 items-center justify-between h-fit gap-4">
              <h2>New Column</h2>
              <FaPlus />
            </button>
          </div>
        </DndContext>
      </main>
    </div>
  );
};

export default Home;
