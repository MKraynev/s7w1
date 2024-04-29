// import { Module } from '@nestjs/common';
// import { MAIL_LOGIN, MAIL_PASSWORD } from '../settings';
// export const EmailServiceUseCases = [EmailService];

// @Module({
//   imports: [
//     MailerModule.forRoot({
//       transport: {
//         host: 'smtp.gmail.com',
//         port: 465,
//         auth: {
//           user: MAIL_LOGIN,
//           pass: MAIL_PASSWORD,
//         },
//       },
//     }),
//   ],
//   providers: [EmailService, ...EmailServiceUseCases],
//   exports: [EmailService, ...EmailServiceUseCases],
// })
// export class EmailModule {}
