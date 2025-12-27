export interface ReferralData {
  code: string;
}

export interface ReferralCheckResult {
  exists: boolean;
  message: string;
  ownerName?: string;
  benefits?: string[];
}
