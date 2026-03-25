import { PaginationLinks, PaginationMeta } from "@/services/api/public/types";

export interface MyBooksResponse {
  success: boolean;
  message: string;
  data: MyBookItem[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface MyBookItem {
  id: number;
  type: "book_purchase";
  attributes: MyBookAttributes;
  relationships: {
    book: PurchasedBook;
  };
  meta: {
    purchased_at: string;
  };
}

export interface MyBookAttributes {
  payment_reference: string | null;
  price_paid: string;
  status: "pending" | "completed" | "failed";
  payment_method: "paystack" | "flutterwave" | "stripe" | string;
  transaction_reference: string;
}

export interface PurchasedBook {
  id: number;
  title: string;
  cover_image: string;
  price: string;
  average_rating: string;
}

export interface BuyBookresponse {
  success: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}
