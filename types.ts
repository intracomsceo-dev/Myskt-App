
export enum DiscountType {
  SUBSIDY = 'SUBSIDY', 
  CONTRACT = 'CONTRACT'
}

export enum PaymentMethod {
  INSTALLMENT = 'INSTALLMENT',
  LUMP_SUM = 'LUMP_SUM'
}

export interface SktPlan {
  id: string;
  name: string;
  price: number;
  subsidy: Record<string, number>; // key: deviceId
}

export type DeviceCategory = 'foldable' | 's-series' | 'a-series' | 'apple';

export interface SktDevice {
  id: string;
  name: string;
  price: number;
  category: DeviceCategory;
  order?: number;
}

export interface CalculatorState {
  deviceId: string;
  initialPlanId: string;
  afterPlanId: string;
  discountType: DiscountType;
  paymentMethod: PaymentMethod;
  employeeDiscount: number;
  useFamilyDiscount: boolean;
  internetDiscount: number;
  maintenanceMonths: number;
}
