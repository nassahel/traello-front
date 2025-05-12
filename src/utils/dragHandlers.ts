import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";

export const handleDragEnd =
  (boards: any[], setBoards: (newBoards: any[]) => void, socket: any) =>
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const isColumn = boards.some((b) => b.id.toString() === active.id);

      if (isColumn) {
        const oldIndex = boards.findIndex((b) => b.id.toString() === active.id);
        const newIndex = boards.findIndex((b) => b.id.toString() === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          const newBoards = arrayMove(boards, oldIndex, newIndex);
          setBoards(newBoards);
          socket.emit("moveColumn", { oldIndex, newIndex, boards: newBoards });
        }
      } else {
        let sourceColumnIndex = -1;
        let destinationColumnIndex = -1;

        boards.forEach((column, index) => {
          if (column.cards.some((card: any) => card.id.toString() === active.id)) {
            sourceColumnIndex = index;
          }
          if (column.cards.some((card: any) => card.id.toString() === over.id)) {
            destinationColumnIndex = index;
          }
        });

        if (sourceColumnIndex === -1 || destinationColumnIndex === -1) return;

        const sourceCards = [...boards[sourceColumnIndex].cards];
        const destinationCards =
          sourceColumnIndex === destinationColumnIndex
            ? sourceCards
            : [...boards[destinationColumnIndex].cards];

        const cardIndex = sourceCards.findIndex(
          (card: any) => card.id.toString() === active.id
        );
        const [movedCard] = sourceCards.splice(cardIndex, 1);

        const overCardIndex = destinationCards.findIndex(
          (card: any) => card.id.toString() === over.id
        );
        const insertAtIndex = overCardIndex >= 0 ? overCardIndex : destinationCards.length;

        destinationCards.splice(insertAtIndex, 0, movedCard);

        const newBoards = [...boards];
        newBoards[sourceColumnIndex] = {
          ...newBoards[sourceColumnIndex],
          cards: sourceCards,
        };
        newBoards[destinationColumnIndex] = {
          ...newBoards[destinationColumnIndex],
          cards: destinationCards,
        };

        setBoards(newBoards);
        socket.emit("moveCard", { boards: newBoards });
      }
    };
