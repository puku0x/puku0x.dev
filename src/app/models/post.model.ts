import { CategoryType } from './category-type.model';

export interface Post {
  title: string;
  date: Date;
  description: string;
  image: string;
  categories: CategoryType[];
  route: string;
}
