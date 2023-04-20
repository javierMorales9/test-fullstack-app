export interface StatsAttr {
  startDate?: string;
  endDate?: string;
}

export interface ActivityAttr extends StatsAttr {
  page?: number;
  length?: number;
}

export interface startSessionPreviewAttr {
  userId: string | number;
  paymentType?: string | number;
}

interface answerPreviewAttr {
  page: string;
  type: "survey" | "coupon" | "pause" | "cancel" | "final";
}

export interface surveyAnswerPreviewAttr extends answerPreviewAttr {
  type: "survey";
  answer: string;
}

interface couponOfferAttr {
  offer: string;
}

interface pauseOfferAttr extends couponOfferAttr {
  monthPaused: number;
}

export interface couponAnswerPreviewAttr extends answerPreviewAttr {
  answer: true;
  data: couponOfferAttr;
  type: "coupon";
}

export interface pauseAnswerPreviewAttr extends answerPreviewAttr {
  answer: true;
  data: pauseOfferAttr;
  type: "pause";
}

export interface cancelAnswerPreviewAttr extends answerPreviewAttr {
  answer: false;
  type: "cancel";
}

export interface finalAnswerPreviewAttr extends answerPreviewAttr {
  answer: true;
  type: "final";
}

// answer: false,
// page: 'dfa06547-07a1-4b01-83c9-86ee5b611b20',
// type: 'cancel',

// answer: true,
// data: { offer: '7aa67605-6d58-4dce-a660-567dcb651621' },
// page: '6c1f4738-be92-4fb5-8469-aefeb70835b4',
// type: 'coupon',

// answer: true,
// data: { offer: '3d7a57da-c19c-4697-baa4-234009751159', monthPaused: 1 },
// page: '6c1f4738-be92-4fb5-8469-aefeb70835b4',
// type: 'pause',

// answer: true,
// page: '063b97ad-6c85-4d8a-9132-6c48103d643e',
// type: 'final',
