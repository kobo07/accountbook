import * as Tone from 'tone'

class SoundService {
  private synth: Tone.PolySynth
  private player: Tone.Player
  private isInitialized = false

  constructor() {
    // 创建合成器
    this.synth = new Tone.PolySynth(Tone.Synth).toDestination()
    this.player = new Tone.Player().toDestination()
  }

  // 初始化音频上下文（需要用户交互后调用）
  async init() {
    if (this.isInitialized) return

    await Tone.start()
    console.log('音频上下文已初始化')
    this.isInitialized = true
  }

  // 播放完成任务的音效
  playCompleteSound() {
    this.init().then(() => {
      // 播放一个愉快的上升音阶
      this.synth.triggerAttackRelease('C5', '16n')
      setTimeout(() => {
        this.synth.triggerAttackRelease('E5', '16n')
      }, 100)
      setTimeout(() => {
        this.synth.triggerAttackRelease('G5', '16n')
      }, 200)
      setTimeout(() => {
        this.synth.triggerAttackRelease('C6', '8n')
      }, 300)
    })
  }

  // 播放添加任务的音效
  playAddSound() {
    this.init().then(() => {
      // 播放一个简短的点击声
      this.synth.triggerAttackRelease('A4', '32n')
    })
  }

  // 播放删除任务的音效
  playDeleteSound() {
    this.init().then(() => {
      // 播放一个下降的音效
      this.synth.triggerAttackRelease('E4', '16n')
      setTimeout(() => {
        this.synth.triggerAttackRelease('C4', '16n')
      }, 100)
    })
  }

  // 清除所有完成项目的音效
  playClearSound() {
    this.init().then(() => {
      // 播放一个扫除的声音
      this.synth.triggerAttackRelease(['C4', 'E4', 'G4'], '8n')
    })
  }
}

// 导出单例
export default new SoundService()
