import * as bcrypt from 'bcrypt';
import { Entity, Column, BeforeInsert, OneToOne, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '@common/bases/base.entity';


@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true, length: 80 })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ unique: true, length: 20 })
  document: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  constructor(user?: Partial<User>) {
    super();

    this.id = user?.id;
    this.name = user?.name;
    this.email = user?.email;
    this.password = user?.password;
    this.document = user?.document;
  
  }
}
