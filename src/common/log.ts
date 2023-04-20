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
          console.log(new Date().toString(), ...info);
          break;
        case 'error':
          console.log(new Date().toString(), ...info);
          break;
        case 'warn':
          console.log(new Date().toString(), ...info);
          break;
        default:
          break;
      }
    }
  }
}
