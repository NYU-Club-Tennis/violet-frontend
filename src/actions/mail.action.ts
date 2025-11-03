import {
  IBulkAnnouncementRequest,
  IMailResponse,
} from "../interfaces/mail.interface";
import { fetch } from "../utils/fetch.util";

const url = "mail";

export const sendBulkAnnouncement = (data: IBulkAnnouncementRequest) => {
  const method = "POST";
  const path = `${url}/bulk-announcement`;

  return fetch<IMailResponse>(method, path, data);
};

export const sendSessionNotification = (data: {
  emails: string[];
  subject: string;
  body: string;
}) => {
  const method = "POST";
  const path = `${url}/session-notification`;
  return fetch(method, path, data);
};
