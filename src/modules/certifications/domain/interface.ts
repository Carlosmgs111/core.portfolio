export interface ICertification /* extends Document */ {
  uuid: string;
  title: string;
  image: string;
  url: string;
  tags: String[];
  emitedAt: number;
  createdAt: number;
  updatedAt: number;
}
