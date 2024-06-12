export interface Alert {
  message: string;
  type: 'success' | 'error';
}

export interface DashboardType {
  clientsInvested: number;
  clientsNotInvested: number;
  tokenPrice: number;
  top10Clients: TopTenHoldersType[];
  totalClients: number;
  totalRaisedOnStage: number;
  totalRaisedUsd: number;
  totalSold: number;
  totalSoldOnStage: number;
  totalTokenByStage: number;
}
export interface TopTenHoldersType {
  publicId: string;
  name: string;
  balance: string;
  usedAmount: string;
}
export interface CountriesType {
  country: string;
  clientCount: string;
  totalTokens: string;
  totalUsdAmount: string;
}
export type TransactionStatus =
  | 'expired'
  | 'invalid_currency'
  | 'finished'
  | 'confirming'
  | 'sending'
  | 'partially_paid'
  | 'failed'
  | 'refunded'
  | 'waiting';

export type TransactionType =
  | 'refund'
  | 'close_stage'
  | 'airdrop'
  | 'purchase_airdrop'
  | 'ref_airdrop'
  | 'deposit'
  | 'buy_tokens'
  | 'referee_pay'
  | 'promo_pay'
  | 'refund_close_stage'
  | 'airdrop_ref_on_hold'
  | 'deposit_withdrawal'
  | 'partially_refund'
  | 'referral_pay'
  | 'bonus_pay'
  | 'bonus_airdrop'
  | 'coupon_pay'
  | 'airdrop_bonus_hold'
  | 'yield_payment';

export interface Bonus {
  name: string;
}

export interface User {
  fullName: string;
  firstName: string;
  lastName: string;
  id: string;
  publicId: string;
}

export interface Paging<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
}

export type Transaction = {
  publicId: string;
  currency: string;
  status: TransactionStatus;
  user: User;
  promoCode: string | null;
  bonuses: Bonus[];
  qr: string | null;
  ipnCallbackUrl: string;
  amountInPc: number;
  amountInUsd: number;
  tokens: number;
  requestAmountInPc: number;
  requestAmountInUsd: number;
  requestTokens: number;
  rate: number;
  tokenPriceInUsd: number;
  type: TransactionType;
  date: number;
  payAddress: string;
  paymentId: string;
  createdAt: number;
  id: string;
};

export interface CurrentStage {
  name: string;
  minPurchase: number;
  maxPurchase: number;
  price: number;
  amount: number;
  raise: number;
}

export interface CurrentBonus {
  name: string;
  isActive: boolean;
  endTime: number;
  startTime: number;
  threshold: [{ bonusPercent: number; purchaseFrom: number; purchaseTo: number; id: string }];
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  refLink: string;
  phoneNumber: string;
  isEmailConfirmed: boolean;
  wallet: string;
}
export interface Referral {
  refBalance: number;
  createdAt: number;
  firstName: string;
  lastName: string;
}

export interface ReferralOverView {
  referrals: number;
  referralIncome: number;
  referralPercentage: number;
}
export interface Balance {
  balance: number;
  refBalance: number;
  bonusBalance: number;
}
export interface PromoCode {
  bonusPercent: number;
  additionalBonus: number;
}

export interface Chain {
  icon: string;
  label: string;
  value: string;
}

export interface Referral {
  refBalance: number;
  createAt: number;
  firstName: string;
  lastName: string;
}

export interface Constants {
  userStatus: { label: string; value: string }[];
  userRole: { label: string; value: string }[];
  paymentStatus: { label: string; value: string }[];
  paymentType: { label: string; value: string }[];
  promoStatus: { label: string; value: string }[];
  airdropStatus: { label: string; value: string }[];
  airdropOrderStatus: { label: string; value: string }[];
  programStatus: { label: string; value: string }[];
  durationUnit: { label: string; value: string }[];
  yieldPayment: { label: string; value: string }[];
  depositStatus: { label: string; value: string }[];
  depositType: { label: string; value: string }[];
  noteStatus: { label: string; value: string }[];
  action: { label: string; value: string }[];
  stageStatus: { label: string; value: string }[];
  bonusStatus: { label: string; value: string }[];
  countries: { label: string; value: string }[];
  currencies: { label: string; value: string }[];
}
