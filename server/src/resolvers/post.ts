import { Post } from '../entities/Post';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../entities/User';
import { ApolloContext } from '../types';

// @ObjectType()
// class UserResponse {
//   @Field(() => String, { nullable: true })
//   error?: string;

//   @Field(() => User, { nullable: true })
//   user: User;
// }

// @ObjectType()
// class MessagePayload {
//   @Field()
//   message: string;
// }

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts() {
    return Post.find({ relations: ['creator'] });
  }

  @Mutation(() => Post, { nullable: true })
  async createPost(@Arg('title', () => String) title: string, @Arg('body', () => String) body: string, @Ctx() { req }: ApolloContext) {
    if (!req.session.userId) return null;
    if (!title && !body) return null;
    const user = await User.findOne({ where: { id: req.session.userId } });
    return Post.create({ title, body, creator: user }).save();
  }
}
