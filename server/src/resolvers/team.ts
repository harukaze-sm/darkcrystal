import { Arg, Ctx, Field, InputType, Mutation, PubSub, PubSubEngine, Query, Resolver } from 'type-graphql';
import { Invite, StatusEnum } from '../entities/Invite';
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
  async invitePlayer(@Arg('id') id: number, @Ctx() { req }: ApolloContext, @PubSub() pubSub: PubSubEngine) {
    const team = await Team.findOne({ where: { owner: { id: req.session.userId } } });
    if (!team) throw new Error('Something went wrong');
    const user = await User.findOne({ where: { id } });
    if (!user) throw new Error('noUser');
    const exists = await Invite.findOne({ where: { invitedUser: user.id, team: team.id, status: StatusEnum.AWAITING } });
    if (exists) throw new Error('alreadyInvited');
    const invite = await Invite.create({ team, invitedUser: user }).save();
    const inviteMessage = {
      userId: user.id,
      team: {
        id: team.id,
        name: team.name,
        tag: team.tag,
      },
      inviteId: invite.id,
    };
    await pubSub.publish('SENT_TEAM_INVITE', inviteMessage);
    return invite;
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
}
