const EASE_OUT = [0.22, 1, 0.36, 1]
const EASE_IN = [0.4, 0, 1, 1]
const DURATION = 600
const EXIT_DURATION = 300
const OFFSET = 12

const transition = (delay: number) => ({ type: 'keyframes', duration: DURATION, ease: EASE_OUT, delay })

const exit = { type: 'keyframes', duration: EXIT_DURATION, ease: EASE_IN }

const rise = (delay: number) => ({
  initial: { opacity: 0, y: OFFSET, transition: exit },
  visible: { opacity: 1, y: 0, transition: transition(delay) },
})

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: OFFSET, transition: exit },
  visible: { opacity: 1, y: 0, transition: transition(delay) },
})

const bar = {
  initial: { scaleX: 0, transition: exit },
  visible: { scaleX: 1, transition: transition(0) },
}

const figure = {
  initial: { opacity: 0, scale: 0.96, transition: exit },
  visible: { opacity: 1, scale: 1, transition: transition(0) },
}

export const motionDirectives = {
  'rise': rise(0),
  'rise-1': rise(100),
  'rise-2': rise(180),
  'rise-3': rise(260),
  'rise-4': rise(340),
  'reveal': reveal(0),
  'reveal-1': reveal(80),
  'reveal-2': reveal(160),
  'bar': bar,
  'figure': figure,
}
