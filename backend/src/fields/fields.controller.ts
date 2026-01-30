import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { Field } from './field.entity';

@Controller('fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  create(
    @Body('name') name: string,
    @Body('address') address: string,
    @Body('pricePerHour') pricePerHour: number,
    @Body('startHour') startHour: number,
    @Body('endHour') endHour: number
  ) {
    return this.fieldsService.createField(name, address, pricePerHour, startHour, endHour);
  }

  @Get()
  findAll() {
    return this.fieldsService.findAll();
  }

  @Post('reserve')
  reserve(
    @Body('timeSlotId') timeSlotId: string,
    @Body('userName') userName: string,
  ) {
    return this.fieldsService.bookSlot(timeSlotId, userName);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldsService.findOne(id);
  }

  @Get('reservations/mine')
  findMyReservations(@Query('name') name: string) {
    return this.fieldsService.findMyReservations(name);
  }
  
  @Delete('reservations/:id')
  cancelReservation(@Param('id') id: string) {
    return this.fieldsService.cancelReservation(id);
  }

  // 관리자: 구장 수정
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Field>) {
    return await this.fieldsService.updateField(id, updateData);
  }

  // 관리자: 구장 삭제
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.fieldsService.deleteField(id);
  }
}