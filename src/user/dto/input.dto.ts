import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class RegisterValidate {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

@ArgsType()
export class LoginValidate {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;
}

@ArgsType()
export class BiometricValidate {
  @Field()
  @IsNotEmpty()
  biometricKey: string;
}