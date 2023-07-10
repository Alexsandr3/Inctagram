import { ArgsType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Length } from 'class-validator';
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

  @Field(() => Boolean)
  @IsBoolean()
  isBanned: boolean;

  @Field(() => BanReasonInputType, { nullable: true })
  @IsEnum(BanReasonInputType)
  @IsOptional()
  banReason: BanReasonInputType;

  @Field(() => String, { nullable: true })
  @IsString()
  @Length(0, 100)
  @IsOptional()
  details: string;
}
