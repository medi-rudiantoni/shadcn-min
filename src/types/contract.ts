export interface Contract {
  id: number;
  _id: string;
  name: string;
  customer: any;
  number: any;
  status: string;
  email: string;
  role: string;
  created_at: string;
}

export interface ContractResponse {
  _id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  number: string;
  duration: number;
  durationUnit: string;
  end_date: string;
  havePartner: boolean;
  partnerContract: any[];
  image: string;
  sla: number;
  slaDoneTime: number;
  slaResponTime: number;
  start_date: string;
  status: string;
  values: number;
  devices: number;
  customer: any;
  partner: any;
  __v: number;
}

export interface ServicePartnerResponse {
  _id: string;
  city: string;
  companyAddress: string;
  companyEmail: string;
  companyName: string;
  companyPhone: string;
  companyPhoto: string | null;
  companyRegister: string | null;
  companyRegistPhoto: string | null;
  courier: any[];
  created_at: string;
  deleted_at: string | null;
  email: string;
  engineer: any[];
  fullName: string;
  originalPassword: boolean;
  ownerAddress: string;
  ownerEmail: string;
  ownerFullName: string;
  ownerImage: string;
  ownerNIK: string | null;
  ownerNIKPhoto: string | null;
  ownerPhone: string;
  password: string;
  pendingEngineer: any[];
  phone: string;
  pin: string | null;
  postalCode: string | number;
  province: string;
  referral_code: string | number;
  resetToken: string;
  role: string;
  status: string;
  storeName: string | null;
  subdistrict: string;
  taxNumber: string | null;
  ticketingMode: string;
  typeRegister: string;
  updated_at: string;
  __v: number;
}
