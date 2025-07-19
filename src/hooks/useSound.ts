import { useRef, useEffect, useState } from 'react'

interface SoundSettings {
  masterVolume: number
  musicVolume: number
  sfxVolume: number
  isMuted: boolean
}

interface SoundHook {
  playSound: (soundType: 'jump' | 'collect' | 'levelComplete' | 'gameOver') => void
  playMusic: (track: 'background' | 'menu') => void
  stopMusic: () => void
  updateSettings: (settings: Partial<SoundSettings>) => void
  settings: SoundSettings
}

// Web Audio API sound generation
const createAudioContext = () => {
  return new (window.AudioContext || (window as any).webkitAudioContext)()
}

const generateTone = (
  audioContext: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.3
) => {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
  oscillator.type = type
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime)
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + duration)
}

const generateChord = (
  audioContext: AudioContext,
  frequencies: number[],
  duration: number,
  volume: number = 0.2
) => {
  frequencies.forEach(freq => {
    generateTone(audioContext, freq, duration, 'sine', volume)
  })
}

export const useSound = (): SoundHook => {
  const audioContextRef = useRef<AudioContext | null>(null)
  const musicIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [settings, setSettings] = useState<SoundSettings>(() => {
    const saved = localStorage.getItem('sherlock-mario-sound-settings')
    return saved ? JSON.parse(saved) : {
      masterVolume: 0.7,
      musicVolume: 0.5,
      sfxVolume: 0.8,
      isMuted: false
    }
  })

  useEffect(() => {
    localStorage.setItem('sherlock-mario-sound-settings', JSON.stringify(settings))
  }, [settings])

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = createAudioContext()
    }
    return audioContextRef.current
  }

  const getVolume = (type: 'music' | 'sfx') => {
    if (settings.isMuted) return 0
    const baseVolume = type === 'music' ? settings.musicVolume : settings.sfxVolume
    return baseVolume * settings.masterVolume
  }

  const playSound = (soundType: 'jump' | 'collect' | 'levelComplete' | 'gameOver') => {
    const audioContext = initAudioContext()
    const volume = getVolume('sfx')
    
    if (volume === 0) return

    switch (soundType) {
      case 'jump':
        // Mario-style jump sound
        generateTone(audioContext, 330, 0.1, 'square', volume * 0.3)
        setTimeout(() => {
          generateTone(audioContext, 440, 0.1, 'square', volume * 0.2)
        }, 50)
        break
        
      case 'collect':
        // Detective clue collection sound - mysterious and satisfying
        generateTone(audioContext, 523, 0.1, 'sine', volume * 0.4)
        setTimeout(() => {
          generateTone(audioContext, 659, 0.1, 'sine', volume * 0.3)
        }, 80)
        setTimeout(() => {
          generateTone(audioContext, 784, 0.2, 'sine', volume * 0.2)
        }, 160)
        break
        
      case 'levelComplete': {
        // Victory fanfare - Sherlock Holmes style
        const victoryChords = [
          [262, 330, 392], // C major
          [294, 370, 440], // D major
          [330, 415, 494], // E major
          [349, 440, 523]  // F major
        ]
        victoryChords.forEach((chord, index) => {
          setTimeout(() => {
            generateChord(audioContext, chord, 0.3, volume * 0.3)
          }, index * 200)
        })
        break
      }
        
      case 'gameOver':
        // Dramatic game over sound
        generateTone(audioContext, 220, 0.5, 'sawtooth', volume * 0.4)
        setTimeout(() => {
          generateTone(audioContext, 196, 0.5, 'sawtooth', volume * 0.3)
        }, 300)
        setTimeout(() => {
          generateTone(audioContext, 174, 1.0, 'sawtooth', volume * 0.2)
        }, 600)
        break
    }
  }

  const playBackgroundMusic = (audioContext: AudioContext) => {
    const volume = getVolume('music')
    if (volume === 0) return

    // Victorian London atmospheric background music
    // Play a mysterious, detective-themed melody
    const melody = [
      { freq: 220, duration: 0.5 }, // A3
      { freq: 247, duration: 0.5 }, // B3
      { freq: 262, duration: 0.5 }, // C4
      { freq: 294, duration: 0.5 }, // D4
      { freq: 330, duration: 0.5 }, // E4
      { freq: 294, duration: 0.5 }, // D4
      { freq: 262, duration: 0.5 }, // C4
      { freq: 247, duration: 0.5 }, // B3
    ]

    let noteIndex = 0
    const playNextNote = () => {
      if (volume === 0) return
      
      const note = melody[noteIndex]
      generateTone(audioContext, note.freq, note.duration, 'sine', volume * 0.15)
      
      // Add harmony
      generateTone(audioContext, note.freq * 1.5, note.duration, 'sine', volume * 0.08)
      
      noteIndex = (noteIndex + 1) % melody.length
    }

    // Play a note every 800ms for atmospheric background
    musicIntervalRef.current = setInterval(playNextNote, 800)
  }

  const playMenuMusic = (audioContext: AudioContext) => {
    const volume = getVolume('music')
    if (volume === 0) return

    // Sherlock Holmes main theme style
    const mainTheme = [
      { freq: 330, duration: 0.4 }, // E4
      { freq: 392, duration: 0.4 }, // G4
      { freq: 440, duration: 0.4 }, // A4
      { freq: 523, duration: 0.6 }, // C5
      { freq: 440, duration: 0.4 }, // A4
      { freq: 392, duration: 0.4 }, // G4
      { freq: 330, duration: 0.8 }, // E4
    ]

    let noteIndex = 0
    const playNextNote = () => {
      if (volume === 0) return
      
      const note = mainTheme[noteIndex]
      generateTone(audioContext, note.freq, note.duration, 'triangle', volume * 0.2)
      
      noteIndex = (noteIndex + 1) % mainTheme.length
    }

    // Play main theme every 600ms
    musicIntervalRef.current = setInterval(playNextNote, 600)
  }

  const playMusic = (track: 'background' | 'menu') => {
    const audioContext = initAudioContext()
    
    // Stop any existing music
    if (musicIntervalRef.current) {
      clearInterval(musicIntervalRef.current)
    }

    if (track === 'background') {
      playBackgroundMusic(audioContext)
    } else if (track === 'menu') {
      playMenuMusic(audioContext)
    }
  }

  const stopMusic = () => {
    if (musicIntervalRef.current) {
      clearInterval(musicIntervalRef.current)
      musicIntervalRef.current = null
    }
  }

  const updateSettings = (newSettings: Partial<SoundSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMusic()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return {
    playSound,
    playMusic,
    stopMusic,
    updateSettings,
    settings
  }
}