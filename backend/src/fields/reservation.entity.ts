import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { TimeSlot } from './timeslot.entity';

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
}