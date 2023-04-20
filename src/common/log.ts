export class WithLog {
  public isDebug: boolean;
  constructor(isDebug: boolean) {
    this.isDebug = isDebug;
  }
  /**
   * log
   */
  public log(level: 'log' | 'error' | 'warn', ...info: unknown[]) {
    if (this.isDebug) {
      switch (level) {
        case 'log':
          console.log(...info);
          break;
        case 'error':
          console.log(...info);
          break;
        case 'warn':
          console.log(...info);
          break;
        default:
          break;
      }
    }
  }
}
