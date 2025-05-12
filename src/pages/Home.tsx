import { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { closestCenter, DndContext, type DragEndEvent, type DragOverEvent, type DragStartEvent } from "@dnd-kit/core";
import Column from "../components/Column";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import type { ColumnInterface, TaskInterface } from "../types/types";
import { socket } from "../websocket/socket";

const Home = () => {
  const [columns, setColumns] = useState<ColumnInterface[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<ColumnInterface | null>(null);
  const [activeTask, setActiveTask] = useState<TaskInterface | null>(null);
  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [loged, setLoged] = useState(true);

  const createNewColumn = () => {
    const columnToAdd = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
    socket.emit("createColumn", columnToAdd);
  };

  const generateId = () => {
    const randomNumber = Math.floor(Math.random() * 1001);
    return randomNumber.toString();
  };

  const deleteColumn = (id: string) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    socket.emit("deleteColumn", { columnId: id });
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.card);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const activeColumnId = active.id;
    const overColumnId = over?.id;

    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeColumnId);
      const overColumnIndex = columns.findIndex((col) => col.id === overColumnId);

      const newOrder = arrayMove(columns, activeColumnIndex, overColumnIndex);

      socket.emit("moveColumn", {
        from: activeColumnIndex,
        to: overColumnIndex,
        columnId: activeColumnId,
      });

      return newOrder;
    });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    const activeId = active.id;
    const overId = over?.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over?.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        const updatedTasks = [...tasks];
        updatedTasks[activeIndex] = {
          ...updatedTasks[activeIndex],
          columnId: updatedTasks[overIndex].columnId,
        };

        // Emitir el movimiento de la tarea
        socket.emit("moveTask", {
          from: activeIndex,
          to: overIndex,
          taskId: activeId,
          columnId: updatedTasks[overIndex].columnId,  // o el nuevo columnId si cambió
        });

        return arrayMove(updatedTasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over?.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn && typeof overId === "string") {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        const updatedTasks = [...tasks];
        updatedTasks[activeIndex] = {
          ...updatedTasks[activeIndex],
          columnId: overId,
        };

        // Emitir el movimiento de la tarea a una nueva columna
        socket.emit("moveTask", {
          from: activeIndex,
          to: activeIndex, // No estamos reordenando la tarea dentro de la columna, solo cambiando la columna
          taskId: activeId,
          columnId: overId,  // El nuevo columnId
        });

        return arrayMove(updatedTasks, activeIndex, activeIndex);
      });
    }
  };

  const createTask = (columnId: string) => {
    const newTask: TaskInterface = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);

    socket.emit("createTask", newTask);
  };

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);

    socket.emit("deleteTask", { taskId: id });
  };

  const updateTask = (id: string, content: string) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
    setTasks(newTasks);
  };

  useEffect(() => {
    socket.on("columnMoved", (data) => {
      console.log("Columna movida desde otro cliente", data);
      setColumns((columns) => {
        const fromIndex = columns.findIndex((col) => col.id === data.columnId);
        if (fromIndex === -1) return columns;
        return arrayMove(columns, fromIndex, data.to);
      });
    });

    socket.on("columnCreated", (newCol) => {
      console.log("Columna creada desde otro cliente", newCol);

      // Solo agregar la columna si no existe
      setColumns((columns) => {
        if (!columns.find((col) => col.id === newCol.id)) {
          return [...columns, newCol];
        }
        return columns;
      });
    });

    return () => {
      socket.off("columnMoved");
      socket.off("columnCreated");
    };
  }, []);


  useEffect(() => {
    socket.on("taskMoved", (data) => {
      console.log("Tarea movida desde otro cliente:", data);

      setTasks((prevTasks) => {
        const { taskId, columnId, from, to } = data;

        const taskIndex = prevTasks.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) return prevTasks;

        const updatedTasks = [...prevTasks];

        // Actualizamos el columnId si cambió
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          columnId,
        };

        // Filtramos las tareas de la columna destino (para reordenar correctamente)
        const columnTasks = updatedTasks
          .filter((t) => t.columnId === columnId)
          .sort((a, b) => prevTasks.indexOf(a) - prevTasks.indexOf(b));

        const currentIndex = columnTasks.findIndex((t) => t.id === taskId);

        const reordered = arrayMove(columnTasks, currentIndex, to);

        // Reconstruimos la lista general con las tareas actualizadas de esa columna
        let finalTasks: typeof updatedTasks = [];
        let reorderIndex = 0;

        for (let task of updatedTasks) {
          if (task.columnId !== columnId) {
            finalTasks.push(task);
          } else {
            finalTasks.push(reordered[reorderIndex++]);
          }
        }

        return finalTasks;
      });
    });

    return () => {
      socket.off("taskMoved");
    };
  }, []);




  useEffect(() => {
    socket.on("taskCreated", (task) => {
      console.log("Tarea creada desde otro cliente", task);

      // Verifica si la tarea ya existe en el estado
      setTasks((tasks) => {
        if (tasks.some(t => t.id === task.id)) {
          console.log("Tarea ya existe, no se duplica.");
          return tasks;  // Si la tarea ya existe, no la añadimos
        }

        return [...tasks, task];  // Si no existe, agregamos la nueva tarea
      });
    });

    return () => {
      socket.off("taskCreated");
    };
  }, []);

  useEffect(() => {
    socket.on("taskDeleted", (taskId) => {
      setTasks((tasks) => tasks.filter((task) => task.id !== taskId));
    });

    return () => {
      socket.off("taskDeleted");
    };
  }, []);


  useEffect(() => {
    socket.on("columnDeleted", (columnId) => {
      setColumns((columns) => columns.filter((col) => col.id !== columnId));
    });

    return () => {
      socket.off("columnDeleted");
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
        <DndContext collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
          <div className="flex gap-6 w-max h-full">
            <SortableContext items={columnsId}>
              {columns.map((col: ColumnInterface) => (
                <Column
                  key={col.id}
                  col={col}
                  deleteColumn={deleteColumn}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              ))}
            </SortableContext>
            <button
              onClick={createNewColumn}
              className="w-72 bg-white rounded-xl shadow-md p-4 cursor-pointer flex text-xl font-semibold text-gray-400 items-center justify-between h-fit gap-4"
            >
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
