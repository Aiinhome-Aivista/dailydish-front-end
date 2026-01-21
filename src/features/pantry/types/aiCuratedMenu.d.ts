export interface Recipe {
  id: number;
  title: string;
  description: string;
  time: string;
  image: string;
  tags?: string[];
}