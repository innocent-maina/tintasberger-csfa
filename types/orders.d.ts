declare interface IOrder {
  id: number;
  created_at?: Date | null;
  customer_id: number;
  status: string;
  delivery_date: Date;
  delivery_address: string;
  product_attributes: {
    color: string;
    product_type: string;
    width: string;
    height: string;
    wood_type: string;
    description: string;
  };
  product_image_samples: string[];
  production_progress_images: string[];
  order_number: string;
  required_deposit_amount: string;
  notes: null;
  total_cost: number;
  is_viable: boolean;
  deposit_payment: {
    paid: boolean;
    amount_paid: number;
    payment_date: Date;
    payment_time: string;
    payment_method: string;
    payment_reference: string;
  };
  customers?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    image_url: string;
    created_at: Date;
  };
}

declare interface IGetSingleOrder {
  success: boolean;
  data: IOrder | null;
}
