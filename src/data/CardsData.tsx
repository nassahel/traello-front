import type { ColumnInterface } from "../types/types";

export const mockData: ColumnInterface[] = [
  {
    id: "col1",
    title: "To Do",
    cards: [
      { id: 'card3', text: "Tarea 3" },
    ]
  },
  {
    id: 'col2',
    title: "In Progress",
    cards: [
      { id: 'card1', text: "Tarea 1" },
      { id: 'card2', text: "Tarea 2" },
    ]
  },
  {
    id: 'col3',
    title: "Done",
    cards: [
      { id: 'card4', text: "Tarea 4" },
      { id: 'card5', text: "Tarea 5" }
    ]
  }
];