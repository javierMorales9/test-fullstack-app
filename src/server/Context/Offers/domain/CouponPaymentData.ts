export type CouponPaymentDataAlternative = {
  id: string;
  name: string;
  duration: number | null;
  basedOnPercentage: boolean;
  basedOnAmount: boolean;
  amount: number;
  percent_off: number; //Backwards compatibility
  valid: boolean;
};
