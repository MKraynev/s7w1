export type MailServiceEntity = {
    to: string,
    from: string,
    subject: string,
    text: string,
    html: string
}

export enum EmailSendStatus {
    Sent,
    NotDelivered
}

export type EmailServiceExecutionStatus = {
    status: EmailSendStatus,
    error: Error
}