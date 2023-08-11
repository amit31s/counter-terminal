type UserRoles = {
  role: string;
  fadCode: string;
};
export type User = {
  id: string;
  provider: string;
  createdAt: number;
  roles: UserRoles[];
};

export type RawUserIdentities = {
  dateCreated: number;
  providerName: string;
  userId: string;
};
