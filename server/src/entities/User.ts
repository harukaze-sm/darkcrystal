import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './Post';
// import { Post } from './Post';

enum UserRole {
  ADMIN = 'admin',
  PlAYER = 'player',
  SUPPORT = 'support',
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

  @Field(() => [Post])
  @OneToMany(() => Post, (post) => post.creator)
  posts?: Post[];
}
