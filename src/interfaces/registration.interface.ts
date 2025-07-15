import { RegistrationStatus } from "constants/enum/registration.status.enum";
import { IBaseEntity } from "./common.interface";

export interface IRegistration extends IBaseEntity {
  id: number;
  userId: number;
  sessionId: number;
  position: number;
  lastCancellation: Date | null;
  hasAttended: boolean;
  status: RegistrationStatus;
}

export interface ICreateRegistration {
  userId: number;
  sessionId: number;
}

export interface IGetRegistrationHistoryQuery {
  status?: RegistrationStatus[];
  afterDate?: Date;
  includeSession?: boolean;
  includeUser?: boolean;
}
