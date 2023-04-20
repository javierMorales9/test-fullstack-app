interface PauseOfferAttr {
  id?: string;
  type: "pause";
  title: string;
  message: string;
  maxPauseMonth: string;
}

interface CouponOfferAttr {
  id?: string;
  type: "coupon";
  header: string;
  title: string;
  message: string;
  paymentProviderId: string;
}

export type OfferAttr = CouponOfferAttr | PauseOfferAttr;

export type CouponsAttr = {
  paymentProvider: "stripe" | "braintree" | "local";
};
