// import { Injectable } from '@nestjs/common';
// import { MAIL_LOGIN } from '../settings';
// import {
//   EmailSendStatus,
//   EmailServiceExecutionStatus,
//   MailServiceEntity,
// } from './entities/EmailServiceEntity';

// @Injectable()
// export class EmailService {
//   constructor(private mailerService: MailerService) {}

//   public async SendRegistrationMail(
//     sendTo: string,
//     confirmCode: string,
//     confirmRegistrationUrl: string,
//   ) {
//     let result: EmailServiceExecutionStatus = {
//       status: EmailSendStatus.Sent,
//       error: undefined,
//     };

//     let sendMail = await this.mailerService
//       .sendMail(
//         this._CONFIRM_EMAIL_FORM(sendTo, confirmCode, confirmRegistrationUrl),
//       )
//       .catch((err) => {
//         (result.status = EmailSendStatus.NotDelivered), (result.error = err);

//         console.log(result);
//       });

//     return result;
//   }

//   private _CONFIRM_EMAIL_FORM(
//     sendTo: string,
//     confirmCode: string,
//     registrationPath: string,
//   ): MailServiceEntity {
//     let result: MailServiceEntity = {
//       to: sendTo,
//       from: `"SAMURAI 🥷"<${MAIL_LOGIN}@gmail.com>`,
//       subject: 'Confirm email',
//       text: '',
//       html: `
//             <p>To finish registration please follow the link below:
//             <a href='${registrationPath}?code=${confirmCode}'>complete registration</a>
//             </p>`,
//     };

//     return result;
//   }

//   public async SendPasswordRecoveryMail(
//     sendTo: string,
//     confirmCode: string,
//     recoveryPath: string,
//   ) {
//     let result: EmailServiceExecutionStatus = {
//       status: EmailSendStatus.Sent,
//       error: undefined,
//     };

//     let sendMail = await this.mailerService
//       .sendMail(this._PASSWORD_RECOVERY_FORM(sendTo, confirmCode, recoveryPath))
//       .catch((err) => {
//         (result.status = EmailSendStatus.NotDelivered), (result.error = err);

//         console.log(result);
//       });

//     return result;
//   }

//   private _PASSWORD_RECOVERY_FORM(
//     sendTo: string,
//     confirmCode: string,
//     recoveryPathPath: string,
//   ) {
//     let result: MailServiceEntity = {
//       to: sendTo,
//       from: `"SAMURAI 🥷"<${MAIL_LOGIN}@gmail.com>`,
//       subject: 'Recovery password',
//       text: '',
//       html: `
//             <p>To recover you password please follow the link below:
//             <a href='${recoveryPathPath}?code=${confirmCode}'>complete recovering password</a>
//             </p>`,
//     };

//     return result;
//   }
// }
