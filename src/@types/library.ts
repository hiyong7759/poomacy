// ----------------------------------------------------------------------

export type IInvoiceAddress = {
  id: string;
  name: string;
  address: string;
  company: string;
  email: string;
  phone: string;
};

export type IInvoiceItem = {
  id: string;
  title: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
  service: string;
};

export type IInvoice = {
  id: string;
  sent: number;
  status: string;
  totalPrice: number;
  invoiceNumber: string;
  subTotalPrice: number;
  taxes: number | string;
  discount: number | string;
  invoiceFrom: IInvoiceAddress;
  invoiceTo: IInvoiceAddress;
  createDate: Date | number;
  dueDate: Date | number;
  items: IInvoiceItem[];
};

export type IBooks = {
  id: string;
  book_no: number;
  book: string;
  publisher: string;
  purchaseDate: string;
  quantity: number;
  price: number;
  list_price: number;
  author: string;
  // purchaser: string | null | undefined;
  location: string | null;
};

// 노션 API data에서 사용될 data interface
export interface IResult {
  id: string;
  properties: {
    book_no: {
      number: number;
    }
    book: {
      title: [{ text: { content: string }}];
    };
    publisher: {
      rich_text: [{ text: { content: string }}];
    };
    purchaseDate: {
      rich_text: [{ text: { content: string }}];
    };
    quantity: {
      number: number;
    }
    price: {
      number: number;
    }
    list_price: {
      number: number;
    }
    author: {
      rich_text: [{ text: { content: string }}];
    };
    purchaser: {
      rich_text: [{ plain_text: string | null | undefined }];
    };
    location: {
      select: string;
    };
  }
}