import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field()
  message: string;
  
  @Field({ nullable: true })
  token?: string;
}

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  biometricKey?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}