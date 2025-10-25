import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Role {
  ADMIN,
  USER,
  DENTIST,
}

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  dob: Date;

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'text',
    name: 'user_name',
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    type: 'text',
    nullable: false,
    select: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    nullable: false,
    default: [Role.USER],
  })
  roles: Role[];

  @Column({
    type: 'bool',
    default: true,
  })
  isActive: boolean;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
