import IStopwatch from './IStopwatch.js'

export default class IncrementStopwatch implements IStopwatch {
  private time = 1000000

  public stopwatchNow(): number {
    return this.time++
  }
}
