declare interface IInvoice {
  id?: number;
  issue_date: string;
  invoice_number: string;
  total_amount: number;
  customer_id: string;
  order_id: string;
  invoice_url: string;
  status: string;
}
