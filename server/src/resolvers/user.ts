import encrypt from 'bcryptjs';
import { User } from '../entities/User';
import { Arg, Mutation, Field, ObjectType, Query, Resolver, Subscription, PubSub, Root, PubSubEngine, Ctx } from 'type-graphql';
import { PASSWORD_SALT } from '../environment';
import { ApolloContext } from 'src/types';

@ObjectType()
class UserResponse {
  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => User, { nullable: true })
  user: User;
}

@ObjectType()
class MessagePayload {
  @Field()
  message: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users() {
    return User.find({});
  }

  @Query(() => User, { nullable: true })
  async user(@Ctx() { req }: ApolloContext) {
    if (!req.session.userId) return null;
    return User.findOne({ id: req.session.userId });
  }

  @Mutation(() => UserResponse)
  async logIn(@Arg('email', () => String) email: string, @Arg('password', () => String) password: string, @Ctx() { req }: ApolloContext) {
    const user = await User.findOne({ email });
    if (!user) return { error: 'notCorrectLogin' };
    const compare = await encrypt.compare(password, user.password);
    if (!compare) return { error: 'notCorrectLogin' };

    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async createUser(
    @Ctx() { req }: ApolloContext,
    @Arg('username', () => String) username: string,
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string
  ) {
    const alreadyExists = await User.findOne({ email });
    if (alreadyExists)
      return {
        error: 'alreadyExists',
      };
    if (password.length < 8)
      return {
        error: 'passwordLength',
      };
    const hashedPassword = await encrypt.hash(password, PASSWORD_SALT);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    }).save();

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  async logOut(@Ctx() { req, res }: ApolloContext) {
    return new Promise((response) =>
      req.session.destroy((err: Error) => {
        res.clearCookie('qid');
        if (err) {
          response(false);
          return;
        }
        response(true);
      })
    );
  }

  @Mutation(() => String)
  async sendMessage(@Arg('message') message: string, @PubSub() pubSub: PubSubEngine): Promise<string> {
    await pubSub.publish('MESSAGE_NOTIFICATION', { message });
    return message;
  }

  @Subscription(() => MessagePayload, {
    topics: 'MESSAGE_NOTIFICATION',
  })
  async receiveMessage(@Root() root: MessagePayload): Promise<MessagePayload> {
    return root;
  }
}
