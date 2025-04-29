declare module 'tone' {
  export function start(): Promise<void>

  export class Synth {
    toDestination(): this
    triggerAttackRelease(
      note: string | string[],
      duration: string,
      time?: number,
      velocity?: number,
    ): this
  }

  export class PolySynth {
    constructor(synth: typeof Synth)
    toDestination(): this
    triggerAttackRelease(
      note: string | string[],
      duration: string,
      time?: number,
      velocity?: number,
    ): this
  }

  export class Player {
    constructor(url?: string)
    toDestination(): this
    start(time?: number): this
    stop(time?: number): this
    load(url: string): Promise<void>
  }
}
