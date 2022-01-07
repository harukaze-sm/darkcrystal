import { Arg, Ctx, Field, InputType, Mutation, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from 'type-graphql';
import { Invite } from '../entities/Invite';
import { Team } from '../entities/Team';
import { User } from '../entities/User';
import { ApolloContext } from '../types';

@InputType()
class CreateTeamArgs {
  @Field()
  name: string;
  @Field()
  description: string;
  @Field()
  tag: string;
}

@Resolver()
export class TeamResolver {
  @Query(() => [Team], { nullable: true })
  teams() {
    return Team.find({ relations: ['owner', 'members'] });
  }

  @Mutation(() => Invite, { nullable: false })
  async invite(@Arg('id') id: number, @Ctx() { req }: ApolloContext) {
    const team = await Team.findOne({ where: { owner: { id: req.session.userId } } });
    if (!team) throw new Error('Something went wrong');
    const user = await User.findOne({ where: { id } });
    if (!user) throw new Error('noUser');
    const invite = await Invite.create({ team, invitedUser: user }).save();
    return invite;
  }

  @Mutation(() => Boolean, { nullable: true })
  async invitePlayer(@Arg('id') id: number, @Ctx() { req }: ApolloContext) {
    const user = await User.findOne({ where: { id: req.session.userId } });
    const team = await Team.findOne({ where: { owner: { id: req.session.userId } }, relations: ['owner', 'members'] });
    if (!user) throw new Error('noUser');
    if (!team) throw new Error('noTeam');
    const invitedUser = await User.findOne({ where: { id } });
    if (!invitedUser) throw new Error('noTarget');
    if (invitedUser.team) throw new Error('alreadyInTeam');
    if (team.members.includes(invitedUser)) throw new Error('alreadyInYourTeam');
    const members = [...team.members, invitedUser];
    team.members = members;
    team.save();
    return true;
  }

  @Mutation(() => Team, { nullable: true })
  async createTeam(@Arg('options') options: CreateTeamArgs, @Ctx() { req }: ApolloContext) {
    const owner = await User.findOne({ where: { id: req.session.userId } });
    if (!owner) throw new Error('noUser');
    const team = Team.create({
      members: [owner],
      name: options.name,
      description: options.description,
      tag: options.tag,
      owner: owner,
    }).save();
    return team;
  }

  @Mutation(() => String)
  async sendInvite(@Arg('message') message: string, @PubSub() pubSub: PubSubEngine): Promise<string> {
    await pubSub.publish('SENT_INVITE', message);
    return message;
  }

  @Subscription(() => String, {
    topics: 'SENT_INVITE',
    nullable: true,
  })
  async recieveInvite(@Root() root: string, @Ctx() { userId }: ApolloContext): Promise<any> {
    console.info('context: userID ', userId);
    if (userId === 3) {
      return root;
    }
    return null;
  }
}
