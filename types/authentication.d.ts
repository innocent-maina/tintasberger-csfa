declare interface ILoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
    full_name: string;
    image_url: string;
    phone_number: string;
    email: string;
    role: string;
  };
  token?: string | undefined;
}

declare interface ICustomer {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  image_url: string;
  created_at?: Date | null;
}
