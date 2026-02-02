export interface GeneratedRecipe {
  cooking_time: string;
  description: string;
  image_url: string;
  menu_name: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  time: string;
  image: string;
  tags?: string[];
}