/**
 * DTO for API error result with status code, messages and error
 */
export class ApiErrorResultDto {
  public statusCode: number;
  public messages: FieldError[];
  public error: string;
}

export class FieldError {
  public message: string;
  public field: string;
}
