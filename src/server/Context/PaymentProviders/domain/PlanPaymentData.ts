export type PlanPaymentData = {
  id: string;
  name: string | null;
  price: number;
  interval: "no-interval" | "day" | "week" | "month" | "year";
  product: string | null;
};
