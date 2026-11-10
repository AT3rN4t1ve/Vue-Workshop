<template>
  <span class="typewriter">
    <span class="sr-only">{{ words.join(', ') }}</span>
    <span aria-hidden="true">
      <span class="typewriter__text">{{ text }}</span><span class="typewriter__cursor">|</span>
    </span>
  </span>
</template>

<script>
import { prefersReducedMotion } from '../../utils/motion'

export default {
  name: 'TypewriterText',
  props: {
    words: { type: Array, required: true },
    typeSpeed: { type: Number, default: 80 },
    deleteSpeed: { type: Number, default: 40 },
    holdTime: { type: Number, default: 1800 },
    startDelay: { type: Number, default: 800 },
  },
  data() {
    return { text: '', index: 0, deleting: false, timer: null }
  },
  computed: {
    current() {
      return this.words[this.index] || ''
    },
  },
  mounted() {
    if (prefersReducedMotion()) {
      this.text = this.current
      this.timer = setInterval(() => {
        this.index = (this.index + 1) % this.words.length
        this.text = this.current
      }, 3000)
      return
    }
    this.timer = setTimeout(this.tick, this.startDelay)
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    clearInterval(this.timer)
  },
  methods: {
    tick() {
      let wait = this.deleting ? this.deleteSpeed : this.typeSpeed

      if (!this.deleting) {
        this.text = this.current.slice(0, this.text.length + 1)
        if (this.text === this.current) {
          this.deleting = true
          wait = this.holdTime
        }
      } else {
        this.text = this.current.slice(0, this.text.length - 1)
        if (!this.text) {
          this.deleting = false
          this.index = (this.index + 1) % this.words.length
          wait = 300
        }
      }
      this.timer = setTimeout(this.tick, wait)
    },
  },
}
</script>

<style scoped>
.typewriter__text {
  background: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.typewriter__cursor {
  margin-left: 2px;
  font-weight: 400;
  color: var(--accent);
  animation: blink 1s step-end infinite;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
