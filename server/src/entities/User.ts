import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Invite } from './Invite';
import { Post } from './Post';
import { Team } from './Team';

enum UserRole {
  ADMIN = 'admin',
  PlAYER = 'player',
  SUPPORT = 'support',
  MANAGER = 'manager',
}

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  email: string;

  @Field(() => String)
  @Column({ type: 'text', nullable: false })
  username: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Field(() => String)
  @Column({ type: 'text', nullable: false, default: UserRole.PlAYER })
  role: string;

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (post) => post.creator)
  posts?: Post[];

  @OneToOne(() => Invite, (invite) => invite.id)
  lastInvite?: Invite;

  @Field(() => Team, { nullable: true })
  @ManyToOne(() => Team, (team) => team.members, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  team?: Team;
}
