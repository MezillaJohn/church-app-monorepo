import { User } from '@/services/api/unAuth/type';

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  gender?: string;
  country?: string;
  churchMember?: boolean;
  churchCentreId?: string | null;
}
