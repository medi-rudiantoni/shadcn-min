
export interface ContractData {
  contractNumber: string;
  contractDate: {
    day: string;
    date: string;
    month: string;
    year: string;
  };
  firstParty: {
    companyName: string;
    address: string;
    representative: string;
    position: string;
  };
  secondParty: {
    companyName: string;
    address: string;
    representative: string;
    position: string;
  };
  pricing: {
    registrationFee: number | string;
    monitoringPerDevice: number | string;
    perTicket: number | string;
    onsiteInstallation?: number | string;
    onsiteRemoval?: number | string;
    onsiteRepair?: number | string;
  };
  bankDetails: {
    bankName?: string;
    branch?: string;
    accountNumber?: string;
    accountHolder: string;
  };
  contractEndDate: {
    date: string;
    month: string;
    year: string;
  };
  signingLocation: string;
  signingDate: string;
  regionalCourt: string;
}