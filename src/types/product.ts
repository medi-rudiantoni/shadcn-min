export interface Product {
  _id: string,
  productName: string;
}

export interface ProductItemResponse {
  _id: string,
  product: Product;
  location: string;
  serialNumber: string;
}