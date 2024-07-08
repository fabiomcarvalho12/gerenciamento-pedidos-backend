import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Column({ primary: true })
  id: string;

  @Column()
  @CreateDateColumn({ name: 'creation_date' })
  creationDate: Date;

  @Column()
  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate: Date;
}
