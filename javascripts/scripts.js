const content = {
  // Replace all text, wishes, memory copy, photo paths, and the music file here.
  title: 'С\u00A0Днем рождения, мама ❤️',
  subtitle:
    'Сегодня я\u00A0хочу подарить тебе нежную коллекцию маленьких открыток.',
  startButton: 'Начать',
  photoSectionTitle: 'Для\u00A0самой прекрасной.',
  typewriterText:
    'Спасибо тебе за\u00A0любовь, заботу и\u00A0счастливые моменты.',
  memorySectionTitle: 'Открытки, которые хочется хранить.',
  treeSectionTitle: 'Выбери\u00A0листик с\u00A0 растущим пожеланием.',
  skySectionTitle: 'Мечтай, планируй, действуй.',
  finalTitle: 'Твои мечты обязательно сбудутся.',
  blowButton: 'Задуть свечи',
  restartButton: 'Сначала',
  ending: 'С\u00A0Днем рождения ❤️',

  // Main photo for section 2.
  mainPhoto: 'assets/mom.jpg',

  // Replace with real image paths, for example: "assets/images/photo1.jpg".
  photos: [
    'assets/images/photo0.jpg',
    'assets/images/photo1.jpg',
    'assets/images/photo2.jpg',
    'assets/images/photo3.jpg',
    'assets/images/photo4.jpg',
    'assets/images/photo5.jpg'
  ],

  // Replace these memory texts with your own family moments.
  memories: [
    'Будь счастлива каждый день.',
    'Ты красивая сегодня и\u00A0всегда.',
    'Пусть в\u00A0душе всегда будет тепло.',
    'Помни, какая ты сильная, нежная и\u00A0великолепная.',
    'Твои мечты обязательно сбудутся.',
    'Желаю больше поводов улыбаться.'
  ],

  // Wishes for section 4.
  treeWishes: [
    '❤️ Счастья',
    '❤️ Здоровья',
    '❤️ Радости',
    '❤️ Спокойствия',
    '❤️ Любви',
    '❤️ Тепла',
    '❤️ Вдохновения',
    '❤️ Улыбок'
  ],

  // Replace or add wishes here.
  wishes: [
    '❤️ Чудес',
    '❤️ Открытий',
    '❤️ Легкости',
    '❤️ Свободы',
    '❤️ Побед',
    '❤️ Азарта',
    '❤️ Роста',
    '❤️ Прорывов'
  ],

  // Replace with your final music file. The button starts it only after click.
  music: 'assets/music/nastelbom-happy-birthday-471481.mp3'
}

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

const state = {
  mouseX: 0,
  mouseY: 0,
  blown: false,
  lenis: null,
  music: null
}

const qs = (selector, scope = document) => scope.querySelector(selector)
const qsa = (selector, scope = document) => [
  ...scope.querySelectorAll(selector)
]

document.addEventListener('DOMContentLoaded', () => {
  renderContent()
  initSmoothScroll()
  initParticles()
  initMusic()
  initButtons()
  initPhotos()
  renderMemories()
  renderWishTree()
  renderLanterns()
  renderCandles()
  initMotion()
  initCursorTilt()
})

function renderContent() {
  qsa('[data-content]').forEach((element) => {
    const key = element.dataset.content
    element.textContent = content[key] || ''
  })
}

function initSmoothScroll() {
  if (prefersReducedMotion || !window.Lenis) return

  state.lenis = new Lenis({
    lerp: 0.075,
    wheelMultiplier: 0.88,
    touchMultiplier: 1.05,
    smoothWheel: true
  })

  const raf = (time) => {
    state.lenis.raf(time)
    requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)
}

function initParticles() {
  const canvas = qs('#particleCanvas')
  const context = canvas.getContext('2d')
  const particles = []
  let width = 0
  let height = 0
  let pixelRatio = 1

  const resize = () => {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = Math.floor(width * pixelRatio)
    canvas.height = Math.floor(height * pixelRatio)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  }

  const createParticles = () => {
    particles.length = 0
    const count = Math.min(110, Math.max(54, Math.floor(width / 13)))
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.45,
        vx: (Math.random() - 0.5) * 0.2,
        vy: Math.random() * -0.24 - 0.05,
        alpha: Math.random() * 0.46 + 0.15,
        warm: Math.random() > 0.44
      })
    }
  }

  const draw = () => {
    context.clearRect(0, 0, width, height)
    particles.forEach((particle) => {
      const dx = (state.mouseX - 0.5) * particle.r * 12
      const dy = (state.mouseY - 0.5) * particle.r * 12
      particle.x += particle.vx + dx * 0.002
      particle.y += particle.vy + dy * 0.002

      if (particle.y < -10) particle.y = height + 10
      if (particle.x < -10) particle.x = width + 10
      if (particle.x > width + 10) particle.x = -10

      const gradient = context.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.r * 8
      )
      const color = particle.warm ? '214,164,76' : '255,250,242'
      gradient.addColorStop(0, `rgba(${color},${particle.alpha})`)
      gradient.addColorStop(1, `rgba(${color},0)`)
      context.fillStyle = gradient
      context.beginPath()
      context.arc(particle.x, particle.y, particle.r * 8, 0, Math.PI * 2)
      context.fill()
    })
    requestAnimationFrame(draw)
  }

  window.addEventListener('resize', () => {
    resize()
    createParticles()
  })

  window.addEventListener('pointermove', (event) => {
    state.mouseX = event.clientX / window.innerWidth
    state.mouseY = event.clientY / window.innerHeight
  })

  resize()
  createParticles()
  draw()
}

function initMusic() {
  const toggle = qs('.music-toggle')
  state.music = new Audio(content.music)
  state.music.loop = true
  state.music.preload = 'none'

  toggle.addEventListener('click', async () => {
    try {
      if (state.music.paused) {
        await state.music.play()
        toggle.classList.add('is-playing')
        toggle.setAttribute('aria-label', 'Выключить музыку')
      } else {
        state.music.pause()
        toggle.classList.remove('is-playing')
        toggle.setAttribute('aria-label', 'Включить музыку')
      }
    } catch {
      toggle.classList.remove('is-playing')
    }
  })
}

function initButtons() {
  qsa('button').forEach((button) => {
    button.addEventListener('click', (event) => {
      const ripple = document.createElement('span')
      const rect = button.getBoundingClientRect()
      ripple.className = 'ripple'
      ripple.style.left = `${event.clientX - rect.left}px`
      ripple.style.top = `${event.clientY - rect.top}px`
      button.append(ripple)
      ripple.addEventListener('animationend', () => ripple.remove())
    })
  })

  qs('.start-button').addEventListener('click', () => {
    scrollToElement(qs('#photo-journey'))
  })

  qs('.restart-button').addEventListener('click', () => {
    window.location.hash = ''
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    })
    resetFinale()
  })

  qs('#blowButton').addEventListener('click', blowCandles)
}

function scrollToElement(element) {
  if (state.lenis) {
    state.lenis.scrollTo(element, {
      duration: 1.8,
      easing: (t) => 1 - Math.pow(1 - t, 4)
    })
    return
  }

  element.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
}

function initPhotos() {
  qsa('[data-photo-index]').forEach((frame) => {
    const index = Number(frame.dataset.photoIndex || 0)
    const image = qs('img', frame)
    const source = content.mainPhoto || content.photos[index]
    if (!image || !source) return

    image.src = source
    image.alt = 'Семейная фотография'
    image.addEventListener('load', () => frame.classList.add('has-image'))
    image.addEventListener('error', () => frame.classList.remove('has-image'))
  })
}

function renderMemories() {
  const field = qs('#memoryCards')
  const positions = [
    { left: 8, top: 10, rotate: -9 },
    { left: 36, top: 7, rotate: 6 },
    { left: 61, top: 18, rotate: -4 },
    { left: 18, top: 48, rotate: 7 },
    { left: 53, top: 52, rotate: -8 }
  ]

  content.memories.forEach((memory, index) => {
    const card = document.createElement('button')
    const imagePath = content.photos[index % content.photos.length]
    const pos = positions[index % positions.length]
    card.className = 'polaroid'
    card.type = 'button'
    card.dataset.style = String(index % 6)
    card.style.left = `${pos.left}%`
    card.style.top = `${pos.top}%`
    card.style.setProperty('--rotate', `${pos.rotate}deg`)
    if (window.gsap && !prefersReducedMotion) {
      card.style.opacity = '0'
      card.style.transform = `rotate(${pos.rotate}deg) translateY(-120px)`
    } else {
      card.style.transform = `rotate(${pos.rotate}deg)`
    }
    card.setAttribute('aria-label', `Открыть воспоминание ${index + 1}`)
    card.setAttribute('aria-pressed', 'false')

    const inner = document.createElement('span')
    const front = document.createElement('span')
    const photo = document.createElement('span')
    const img = document.createElement('img')
    const caption = document.createElement('span')
    const back = document.createElement('span')
    const memoryText = document.createElement('p')

    inner.className = 'polaroid-inner'
    front.className = 'polaroid-face polaroid-front'
    photo.className = 'polaroid-photo'
    caption.className = 'polaroid-caption'
    back.className = 'polaroid-face polaroid-back'
    caption.textContent = `Пожелание ${index + 1}`
    img.alt = `Семейное воспоминание ${index + 1}`
    memoryText.textContent = memory

    photo.append(img)
    front.append(photo, caption)
    back.append(memoryText)
    inner.append(front, back)
    card.append(inner)

    img.src = imagePath
    img.addEventListener('load', () => card.classList.add('has-image'))
    img.addEventListener('error', () => card.classList.remove('has-image'))

    card.addEventListener('click', () => {
      card.classList.toggle('is-flipped')
      card.setAttribute(
        'aria-pressed',
        String(card.classList.contains('is-flipped'))
      )
    })
    field.append(card)
  })
}

function renderWishTree() {
  const group = qs('#wishLeaves')
  const note = qs('#wishNote')
  const leaves = [
    [250, 214, -28],
    [214, 312, 16],
    [286, 384, -14],
    [456, 204, 20],
    [548, 290, -18],
    [540, 424, 12],
    [384, 178, -8]
  ]

  content.treeWishes.forEach((wish, index) => {
    const [x, y, rotate] = leaves[index % leaves.length]
    const leafWrap = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    const leaf = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    leafWrap.setAttribute('class', 'wish-leaf-wrap')
    leafWrap.setAttribute('transform', `translate(${x} ${y}) rotate(${rotate})`)
    leaf.setAttribute(
      'd',
      'M0,-36 C36,-28 50,2 18,32 C-10,54 -42,28 -36,-4 C-32,-24 -18,-34 0,-36 Z'
    )
    leaf.setAttribute('fill', 'url(#leafGradient)')
    leaf.setAttribute('class', 'wish-leaf')
    leaf.style.animationDelay = `${index * 260}ms`
    leaf.setAttribute('role', 'button')
    leaf.setAttribute('aria-label', wish)
    leaf.setAttribute('tabindex', '0')

    const showWish = () => {
      qsa('.wish-leaf').forEach((item) => item.classList.remove('is-active'))
      leaf.classList.add('is-active')
      note.textContent = wish
      note.classList.add('is-visible')
      if (window.gsap && !prefersReducedMotion) {
        gsap.fromTo(
          leaf,
          { scale: 1 },
          { scale: 1.18, duration: 0.28, yoyo: true, repeat: 1 }
        )
      }
    }

    leaf.addEventListener('click', showWish)
    leaf.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      showWish()
    })

    leafWrap.append(leaf)
    group.append(leafWrap)
  })

  const firstLeaf = qs('.wish-leaf')
  if (content.treeWishes.length && firstLeaf) {
    firstLeaf.classList.add('is-active')
    note.textContent = content.treeWishes[0]
    note.classList.add('is-visible')
  }
}

function renderLanterns() {
  const stage = qs('#lanternStage')
  content.wishes.slice(0, 8).forEach((wish, index) => {
    const lantern = document.createElement('button')
    lantern.className = 'lantern'
    lantern.type = 'button'
    lantern.dataset.style = String(index % 5)
    lantern.style.left = `${8 + ((index * 14) % 78)}%`
    lantern.style.top = `${28 + ((index * 9) % 42)}%`
    lantern.style.setProperty('--size', `${84 + (index % 3) * 26}px`)
    lantern.style.setProperty('--duration', `${17 + index * 2.2}s`)
    lantern.style.setProperty(
      '--sway',
      `${index % 2 ? '-' : ''}${36 + index * 8}px`
    )
    lantern.style.animationDelay = `${index * -2.4}s`
    const label = document.createElement('span')
    label.textContent = wish.replace('❤️ ', '')
    lantern.append(label)
    lantern.addEventListener('pointerenter', () => {
      lantern.classList.add('is-hovered')
    })
    lantern.addEventListener('pointerleave', () => {
      lantern.classList.remove('is-hovered')
    })
    stage.append(lantern)
  })
}

function renderCandles() {
  const candles = qs('#candles')
  for (let i = 0; i < 5; i += 1) {
    const candle = document.createElement('span')
    const flame = document.createElement('span')
    candle.className = 'candle'
    flame.className = 'flame'
    candle.append(flame)
    candles.append(candle)
  }
}

function initMotion() {
  if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion) {
    qs('.typewriter').textContent = content.typewriterText
    return
  }

  gsap.registerPlugin(ScrollTrigger)

  gsap.set('.intro-content > *', {
    opacity: 0,
    y: 20,
    scale: 0.96,
    filter: 'blur(10px)'
  })
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .to(
      '.intro-content .eyebrow',
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1 },
      0.2
    )
    .to(
      '#intro-title',
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.4 },
      0.45
    )
    .to(
      '.intro-subtitle',
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.1 },
      0.95
    )
    .to(
      '.start-button',
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.9 },
      1.75
    )

  qsa('.section-heading, .photo-copy, .cake-stage, .final-copy').forEach(
    (element) => {
      gsap.from(element, {
        opacity: 0,
        y: 38,
        filter: 'blur(14px)',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%'
        }
      })
    }
  )

  gsap.to('.photo-frame', {
    scale: 1.08,
    ease: 'none',
    scrollTrigger: {
      trigger: '.photo-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  })

  const typeTarget = { value: 0 }
  ScrollTrigger.create({
    trigger: '.typewriter',
    start: 'top 78%',
    once: true,
    onEnter: () => {
      gsap.to(typeTarget, {
        value: content.typewriterText.length,
        duration: 2.8,
        ease: 'none',
        onUpdate: () => {
          qs('.typewriter').textContent = content.typewriterText.slice(
            0,
            Math.round(typeTarget.value)
          )
        }
      })
    }
  })

  gsap.to('.polaroid', {
    opacity: 1,
    y: 0,
    rotation: (index, target) =>
      parseFloat(target.style.getPropertyValue('--rotate')) || 0,
    duration: 1.15,
    ease: 'back.out(1.25)',
    stagger: 0.18,
    scrollTrigger: {
      trigger: '.memory-table',
      start: 'top 68%'
    }
  })

  gsap.from('.wish-tree', {
    opacity: 0,
    y: 40,
    scale: 0.92,
    filter: 'blur(12px)',
    duration: 1.4,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.tree-stage',
      start: 'top 72%'
    }
  })

  gsap.from('.lantern', {
    opacity: 0.7,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.08,
    scrollTrigger: {
      trigger: '.sky-section',
      start: 'top 65%'
    }
  })
}

function initCursorTilt() {
  qsa('.polaroid').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      const base = parseFloat(card.style.getPropertyValue('--rotate')) || 0
      card.style.transform = `translateY(-10px) rotate(${base + x * 5}deg) rotateX(${-y * 5}deg)`
    })

    card.addEventListener('pointerleave', () => {
      const base = parseFloat(card.style.getPropertyValue('--rotate')) || 0
      card.style.transform = `rotate(${base}deg)`
    })
  })
}

function blowCandles() {
  if (state.blown) return
  state.blown = true

  const flames = qsa('.flame')
  const finalSection = qs('.final-section')
  const heart = qs('#heartMessage')

  flames.forEach((flame, index) => {
    setTimeout(() => {
      const smoke = document.createElement('span')
      smoke.className = 'smoke'
      flame.parentElement.append(smoke)
      flame.style.opacity = '0'
      flame.style.transform = 'translateX(-50%) scale(0.2)'

      if (window.gsap && !prefersReducedMotion) {
        gsap.to(smoke, {
          y: -54,
          x: index % 2 ? 18 : -18,
          opacity: 0,
          scale: 2.4,
          duration: 1.3,
          ease: 'power2.out',
          onComplete: () => smoke.remove()
        })
      }
    }, index * 220)
  })

  setTimeout(
    () => {
      finalSection.classList.add('is-bright')
      launchConfetti()

      if (window.gsap && !prefersReducedMotion) {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .to('.cake-stage', { scale: 0.9, y: 46, opacity: 0.3, duration: 1 })
          .to('.final-copy', { y: -18, opacity: 0, duration: 0.7 }, 0)
          .to(heart, { opacity: 1, y: 0, scale: 1, duration: 1 }, 0.36)
          .fromTo(
            '.heart-shape',
            { scale: 0.52, rotate: -45 },
            { scale: 0.72, rotate: -45, duration: 1.2 },
            0.4
          )
      } else {
        heart.style.opacity = '1'
      }
      heart.classList.add('is-visible')
    },
    flames.length * 220 + 240
  )
}

function launchConfetti() {
  if (!window.confetti) return

  const duration = 1700
  const end = Date.now() + duration

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 58,
      origin: { x: 0, y: 0.72 },
      colors: ['#fff4d2', '#f4cfd0', '#d6a44c', '#fffaf2']
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 58,
      origin: { x: 1, y: 0.72 },
      colors: ['#fff4d2', '#f4cfd0', '#d6a44c', '#fffaf2']
    })

    if (Date.now() < end) requestAnimationFrame(frame)
  }

  frame()
}

function resetFinale() {
  state.blown = false
  qs('.final-section').classList.remove('is-bright')
  qs('#heartMessage').classList.remove('is-visible')
  qs('#heartMessage').removeAttribute('style')
  qsa('.flame').forEach((flame) => {
    flame.removeAttribute('style')
  })
  qsa('.smoke').forEach((smoke) => smoke.remove())
}
