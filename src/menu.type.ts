import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from './menu.model';

@ObjectType('Menu')
export class MenuType {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field()
  category: Category;

  @Field()
  response: string;
}
