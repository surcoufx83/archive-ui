export interface ApiReply {
  success: boolean;
  errno?: number;
  error?: string;
  payload?: { [key: string]: string; };
}
