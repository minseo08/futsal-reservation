import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'superider00@gmail.com',
        pass: 'oeukpyggftxgweku',
      },
    });
  }

  async sendReservationConfirm(to: string, userName: string, fieldName: string, time: string) {
    const mailOptions = {
      from: '"풋살 예약 시스템" <superider00@gmail.com>',
      to,
      subject: `[예약 확정] ${userName}님, 예약이 완료되었습니다!`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4dabf7;">예약이 성공적으로 완료되었습니다!</h2>
          <p>안녕하세요, <b>${userName}</b>님!</p>
          <p>신청하신 풋살장 예약 내역을 안내해 드립니다.</p>
          <hr />
          <ul style="list-style: none; padding: 0;">
            <li><b>구장명:</b> ${fieldName}</li>
            <li><b>예약 시간:</b> ${time}</li>
          </ul>
          <hr />
          <p>경기 시작 10분 전까지 도착해 주시기 바랍니다. 즐거운 경기 되세요!</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`${to}님에게 예약 확인 메일을 보냈습니다.`);
    } catch (error) {
      console.error('메일 발송 중 오류 발생:', error);
    }
  }
}