export class ApiErrorResultDto {
  public statusCode: number;
  public messages: FieldError[];
  public error: string;
}

export class FieldError {
  public message: string;
  public field: string;
}
