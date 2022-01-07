import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Team } from './Team';
import { User } from './User';

enum StatusEnum {
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  AWAITING = 'awaiting',
}

@ObjectType()
@Entity()
export class Invite extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id)
  invitedUser: User;

  @Field(() => Team)
  @ManyToOne(() => Team, (team) => team.id)
  team: Team;

  @Field(() => String)
  @Column({ type: 'enum', nullable: false, enum: StatusEnum, default: StatusEnum.AWAITING })
  status: StatusEnum;

  @Field(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  validUntil: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;
}
