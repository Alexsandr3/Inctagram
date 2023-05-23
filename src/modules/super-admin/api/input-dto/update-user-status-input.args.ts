import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

@ArgsType()
export class UpdateUserStatusInputArgs {
  @Field(() => Int)
  @IsNumber()
  userId: number;
  @Field(() => String, { nullable: true })
  @IsOptional()
  banReason: string | null;
  @Field(() => Boolean)
  @IsBoolean()
  isBanned: boolean;
}
