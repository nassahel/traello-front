// export interface ColumnInterface{
//   id: number
//   title: string
// }

// export interface CardInterface{
//   id: string
//   text: string
// }



export interface ColumnInterface {
  id: string
  title: string

}



export interface TaskInterface {
  id: string;
  columnId: string;
  content: string
}