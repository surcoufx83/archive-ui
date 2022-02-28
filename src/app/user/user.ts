import { Settings } from "./settings/settings";

export interface User {
  id: number;
  enabled: boolean;
  email: string;
  loginname: string;
  settings: Settings;
}
