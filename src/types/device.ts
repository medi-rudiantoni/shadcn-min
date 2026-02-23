import { ServicePartnerResponse } from "./contract";
import { ProductItemResponse } from "./product";

export interface DeviceResponse {
  _id: string;
  contract: string;
  created_at: string;
  customer: string;
  deleted_at: string | null;
  features: string | null;
  installDate: string | null;
  location: string;
  meterReadPosition: number;
  price: number;
  pricingDetail: string | null;
  productItem: ProductItemResponse;
  servicePartner: ServicePartnerResponse[];
  status: string;
  updated_at: string;
  __v: number;
}
