export const OFFER_VALUES = {
  PAUSE: "pause",
  COUPON: "coupon",
  CUSTOM: "customcontent",
  NOTHING: "nothing",
};

const PAYMENT_PROVIDERS = {
  STRIPE: "stripe",
  BRAINTREE: "braintree",
  ADYEN: "adyen",
  CHARGEBEE: "chargebee",
  PAYPAL: "paypal",
  SLACK: "slack",
  WEBHOOKS: "webhooks",
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

var PRICE_FORMATTER = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export { PAYMENT_PROVIDERS, MONTHS_SHORT, MONTHS, PRICE_FORMATTER };
