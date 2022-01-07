import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class Team extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ type: 'text', nullable: false, unique: true })
  name: string;

  @Field(() => String)
  @Column({ type: 'text', nullable: false })
  description: string;

  @Field(() => String)
  @Column({ type: 'text', nullable: false })
  tag: string;

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.team, { cascade: true })
  members: User[];

  @Field(() => User)
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'owner' })
  owner: User;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  updatedAt: Date;
}
