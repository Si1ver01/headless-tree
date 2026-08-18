export interface TreeLogger {
  readonly debug?:
    ((message: string, data?: Readonly<Record<string, unknown>>) => void) | undefined;
  readonly info?: ((message: string, data?: Readonly<Record<string, unknown>>) => void) | undefined;
  readonly warn?: ((message: string, data?: Readonly<Record<string, unknown>>) => void) | undefined;
  readonly error?:
    ((message: string, data?: Readonly<Record<string, unknown>>) => void) | undefined;
}
