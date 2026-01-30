import { Controller, Get, Post, Body, Param, Query, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { Field } from './field.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';

@Controller('fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
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

  @UseGuards(AuthGuard('jwt'))
  @Post('reserve')
  reserve(
    @Body('timeSlotId') timeSlotId: string,
    @Request() req: any
  ) {
        return this.fieldsService.bookSlot(timeSlotId, req.user.name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldsService.findOne(id);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('reservations/mine')
  findMyReservations(@Request() req: any) {
    return this.fieldsService.findMyReservations(req.user.name);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Delete('reservations/:id')
  cancelReservation(@Param('id') id: string) {
    return this.fieldsService.cancelReservation(id);
  }

  // 관리자: 구장 수정
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Field>) {
    return await this.fieldsService.updateField(id, updateData);
  }

  // 관리자: 구장 삭제
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.fieldsService.deleteField(id);
  }
}