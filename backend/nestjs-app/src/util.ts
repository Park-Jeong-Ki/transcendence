export enum UserStatusType {
  ONLINE,
  GAME,
  OFFLINE,
  SIGNUP,
}

export interface TMP {
  id?: string;
}

export enum UserRelationType {
  FRIEND,
  BLOCK,
}

export interface ValidNicknameType {
  message: string;
  status: number;
}

export interface Room {
  id: string;
  name: string;
  owner: string;
  users: string[];
  maneger: string[];
}