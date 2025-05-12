export interface ColumnInterface {
  id: string
  title: string

}

export interface TaskInterface {
  id: string;
  columnId: string;
  content: string
  userId: number
}