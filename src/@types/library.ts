// 노션 API data에서 사용될 data type
export type IBooks = {
  id: string;
  book_no: number;
  book: string;
  publisher: string;
  purchaseDate: Date;
  quantity: number;
  price: number;
  list_price: number;
  author: string;
  purchaser: string | null;
  location: string;
  locationColor: string;
};

// 노션 API data에서 사용될 data interface 노션 response 구조 그대로
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
      rich_text: [{ text: { content: string }}];
    };
    location: {
      select: { name: string, color: string };
    };
  }
}