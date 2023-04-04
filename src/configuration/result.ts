import { NotificationExtension } from './notification';

export class Result<T, E> {
  private readonly success: boolean;
  private readonly value?: T;
  private readonly error?: E;
  private code: number | null = null;
  private extensions: NotificationExtension[] = [];

  constructor(success: boolean, value?: T, error?: E) {
    this.success = success;
    this.value = value;
    this.error = error;
  }

  isSuccess(): boolean {
    return this.success;
  }

  isFailure(): boolean {
    return !this.success;
  }

  getValue(): T {
    if (this.success) {
      return this.value as T;
    } else {
      throw new Error('Cannot get value of a failed result');
    }
  }

  getError(): E {
    if (!this.success) {
      return this.error as E;
    } else {
      throw new Error('Cannot get error of a successful result');
    }
  }

  static OK<T>(value: T): Result<T, never> {
    return new Result<T, never>(true, value);
  }

  addError(
    message: string, // message for mistake
    key: string | null = null,
    code: number | null = null, //status code
  ) {
    this.code = code ?? 1;
    this.extensions.push(new NotificationExtension(message, key));
  }

  static throwError(message: string, key: string, code: number) {
    const result = new Result(false);
    result.addError(message, key, code);
    return result;
  }
}
