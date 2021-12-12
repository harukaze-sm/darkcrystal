import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello() {
    return "hello";
  }

  @Query(() => String)
  test() {
    return "test";
  }
}
