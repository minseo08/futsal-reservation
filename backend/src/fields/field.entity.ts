import { Entity, PrimaryGeneratedColumn, Column, VersionColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { TimeSlot } from './timeslot.entity';

@Entity('fields')
export class Field {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'int' })
  pricePerHour: number;

  @Column({ nullable: true })
  description: string;

  @VersionColumn()
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column("simple-array", { nullable: true })
  imageUrls: string[];

  @OneToMany(() => TimeSlot, (timeSlot) => timeSlot.field, {
    cascade: true,
  })
  timeSlots: TimeSlot[];
}