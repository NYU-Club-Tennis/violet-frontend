export interface IBulkAnnouncementRequest {
  emails: string[];
  header: string;
  subject: string;
  body: string;
}

export interface IMailResponse {
  messageId: string;
  accepted: string[];
  rejected: string[];
  response: string;
}
