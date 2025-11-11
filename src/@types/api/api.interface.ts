export interface BaseApiResponse<T> {
  status_code: number;
  data: T;
  message: string;
  time_stamp: string;
}
