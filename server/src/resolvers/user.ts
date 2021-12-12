import { User } from "../entities/User";
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users() {
    return User.find({});
  }

  @Query(() => User)
  async user(@Arg("id", () => Int) id: number) {
    return User.findOne({ id });
  }

  @Mutation(() => User)
  async createUser(@Arg("username", () => String) username: string) {
    const user = await User.create({ username }).save();
    return user;
  }
}
