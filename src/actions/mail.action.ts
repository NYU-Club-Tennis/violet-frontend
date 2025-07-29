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
