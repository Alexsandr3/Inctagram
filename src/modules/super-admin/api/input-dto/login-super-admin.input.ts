import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class AdminLoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;
}
