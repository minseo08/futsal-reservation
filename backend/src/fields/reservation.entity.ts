import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { TimeSlot } from './timeslot.entity';
import { User } from '../users/entities/user.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userName: string;

  @CreateDateColumn()
  reservedAt: Date;

  @OneToOne(() => TimeSlot)
  @JoinColumn({ name: 'timeslot_id' })
  timeSlot: TimeSlot;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;
}