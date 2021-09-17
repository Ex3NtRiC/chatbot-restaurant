import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType('response')
export class response {
  @IsNotEmpty()
  @IsString()
  @Field()
  response: string;
}

export interface Response {
  response: string;
}
