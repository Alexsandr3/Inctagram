import { ArgsType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { BanReasonInputType } from './types/ban-reason.input.type';

registerEnumType(BanReasonInputType, {
  name: 'BanReasonInputType',
  description: 'Reasons for banning a user',
});

@ArgsType()
export class UpdateUserStatusInputArgs {
  @Field(() => Int)
  @IsNumber()
  userId: number;

  @Field(() => BanReasonInputType, { nullable: true })
  @IsEnum(BanReasonInputType)
  @IsOptional()
  banReason: BanReasonInputType;

  @Field(() => Boolean)
  @IsBoolean()
  isBanned: boolean;
}
