import { UserAvatar } from 'src/models/user.schema';

export interface UserAuth {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: UserAvatar;
}
