
export type User = {
  id: string;
  email: string;
  name: string;
  image?: string;
  roles?: string[];
  notifications?: Notification[];
};
