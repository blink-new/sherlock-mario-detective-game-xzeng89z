import { useEffect, useRef, useState, useCallback } from 'react'
import { GameState } from '../App'
import { useSound } from '../hooks/useSound'
import { levelStories, getStoryRevealForClue } from '../data/storyData'

interface GameCanvasProps {
  gameState: GameState
  onGameOver: () => void
  onScoreUpdate: (score: number) => void
  onClueCollected: (clueId: string, storyReveal: string) => void
  onLevelComplete: () => void
  level: number
}

interface Player {
  x: number
  y: number
  width: number
  height: number
  velocityX: number
  velocityY: number
  onGround: boolean
  facing: 'left' | 'right'
}

interface Platform {
  x: number
  y: number
  width: number
  height: number
  type: 'ground' | 'platform' | 'building'
}

interface Clue {
  id: string
  x: number
  y: number
  width: number
  height: number
  collected: boolean
  type: 'magnifying-glass' | 'evidence' | 'key'
  name: string
  storyReveal: string
}

// Game constants
const GRAVITY = 0.8
const JUMP_FORCE = -15
const MOVE_SPEED = 5
const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 600

// Level data
const platforms: Platform[] = [
  // Ground platforms
  { x: 0, y: 550, width: 400, height: 50, type: 'ground' },
  { x: 500, y: 550, width: 400, height: 50, type: 'ground' },
  { x: 1000, y: 550, width: 400, height: 50, type: 'ground' },
  { x: 1500, y: 550, width: 400, height: 50, type: 'ground' },
  
  // Floating platforms (Victorian buildings)
  { x: 300, y: 450, width: 120, height: 20, type: 'platform' },
  { x: 600, y: 400, width: 120, height: 20, type: 'platform' },
  { x: 900, y: 350, width: 120, height: 20, type: 'platform' },
  { x: 1200, y: 300, width: 120, height: 20, type: 'platform' },
  { x: 1500, y: 250, width: 120, height: 20, type: 'platform' },
  
  // Building structures
  { x: 200, y: 450, width: 80, height: 100, type: 'building' },
  { x: 700, y: 400, width: 80, height: 150, type: 'building' },
  { x: 1100, y: 350, width: 80, height: 200, type: 'building' },
  { x: 1600, y: 250, width: 80, height: 300, type: 'building' },
]

// Drawing functions
const drawBackground = (ctx: CanvasRenderingContext2D, camera: { x: number, y: number }) => {
  // Victorian London atmosphere
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
  gradient.addColorStop(0, '#2F1B14') // Dark brown at top
  gradient.addColorStop(1, '#1A0F0A') // Darker brown at bottom
  
  ctx.fillStyle = gradient
  ctx.fillRect(camera.x, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // Add some fog/atmosphere
  ctx.fillStyle = 'rgba(218, 165, 32, 0.1)' // Golden tint
  ctx.fillRect(camera.x, CANVAS_HEIGHT - 200, CANVAS_WIDTH, 200)
}

const drawPlatform = (ctx: CanvasRenderingContext2D, platform: Platform) => {
  if (platform.type === 'ground') {
    // Ground platforms - cobblestone style
    ctx.fillStyle = '#8B4513' // Detective brown
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
    
    // Add cobblestone texture
    ctx.strokeStyle = '#DAA520' // Detective gold
    ctx.lineWidth = 1
    for (let i = 0; i < platform.width; i += 20) {
      ctx.strokeRect(platform.x + i, platform.y, 20, platform.height)
    }
  } else if (platform.type === 'platform') {
    // Floating platforms - wooden planks
    ctx.fillStyle = '#A0522D'
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
    
    // Wood grain effect
    ctx.strokeStyle = '#8B4513'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(platform.x, platform.y + platform.height / 2)
    ctx.lineTo(platform.x + platform.width, platform.y + platform.height / 2)
    ctx.stroke()
  } else if (platform.type === 'building') {
    // Victorian buildings
    ctx.fillStyle = '#654321'
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
    
    // Building details
    ctx.fillStyle = '#DAA520'
    // Windows
    for (let y = platform.y + 20; y < platform.y + platform.height - 20; y += 30) {
      ctx.fillRect(platform.x + 15, y, 12, 15)
      ctx.fillRect(platform.x + platform.width - 27, y, 12, 15)
    }
  }
}

const drawClue = (ctx: CanvasRenderingContext2D, clue: Clue) => {
  // Enhanced glowing effect with pulsing animation
  const time = Date.now() / 1000
  const pulse = Math.sin(time * 3) * 0.3 + 0.7
  
  ctx.shadowColor = '#DAA520'
  ctx.shadowBlur = 15 * pulse
  
  if (clue.type === 'magnifying-glass') {
    // Draw magnifying glass with enhanced details
    ctx.fillStyle = '#DAA520'
    ctx.beginPath()
    ctx.arc(clue.x + 10, clue.y + 10, 8, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.fillStyle = '#8B4513'
    ctx.beginPath()
    ctx.arc(clue.x + 10, clue.y + 10, 5, 0, Math.PI * 2)
    ctx.fill()
    
    // Handle with better styling
    ctx.strokeStyle = '#DAA520'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(clue.x + 16, clue.y + 16)
    ctx.lineTo(clue.x + 20, clue.y + 20)
    ctx.stroke()
    
    // Add lens reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.beginPath()
    ctx.arc(clue.x + 8, clue.y + 8, 2, 0, Math.PI * 2)
    ctx.fill()
  } else if (clue.type === 'evidence') {
    // Draw evidence as a scroll/document
    ctx.fillStyle = '#F5F5DC' // Beige paper
    ctx.fillRect(clue.x, clue.y, clue.width, clue.height)
    
    // Add document details
    ctx.strokeStyle = '#DAA520'
    ctx.lineWidth = 1
    ctx.strokeRect(clue.x, clue.y, clue.width, clue.height)
    
    // Add text lines
    ctx.strokeStyle = '#8B4513'
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.moveTo(clue.x + 2, clue.y + 5 + i * 4)
      ctx.lineTo(clue.x + clue.width - 2, clue.y + 5 + i * 4)
      ctx.stroke()
    }
  } else if (clue.type === 'key') {
    // Draw ornate key
    ctx.fillStyle = '#DAA520'
    // Key shaft
    ctx.fillRect(clue.x + 2, clue.y + 8, 16, 4)
    // Key head
    ctx.beginPath()
    ctx.arc(clue.x + 4, clue.y + 10, 6, 0, Math.PI * 2)
    ctx.fill()
    // Key teeth
    ctx.fillRect(clue.x + 14, clue.y + 12, 4, 3)
    ctx.fillRect(clue.x + 16, clue.y + 15, 2, 2)
  }
  
  ctx.shadowBlur = 0
}

const drawPlayer = (ctx: CanvasRenderingContext2D, player: Player) => {
  // Detective character - enhanced Mario-style with more details
  
  // Hat with detective style
  ctx.fillStyle = '#2F1B14'
  ctx.fillRect(player.x + 4, player.y, 24, 12)
  // Hat brim
  ctx.fillRect(player.x + 2, player.y + 10, 28, 3)
  
  // Head
  ctx.fillStyle = '#FDBCB4' // Skin tone
  ctx.fillRect(player.x + 8, player.y + 8, 16, 16)
  
  // Eyes
  ctx.fillStyle = '#000000'
  ctx.fillRect(player.x + 11, player.y + 12, 2, 2)
  ctx.fillRect(player.x + 19, player.y + 12, 2, 2)
  
  // Mustache
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(player.x + 10, player.y + 18, 12, 4)
  
  // Body - Detective coat with buttons
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(player.x + 6, player.y + 24, 20, 20)
  
  // Coat buttons
  ctx.fillStyle = '#DAA520'
  ctx.fillRect(player.x + 14, player.y + 28, 2, 2)
  ctx.fillRect(player.x + 14, player.y + 32, 2, 2)
  ctx.fillRect(player.x + 14, player.y + 36, 2, 2)
  
  // Legs
  ctx.fillStyle = '#2F1B14'
  ctx.fillRect(player.x + 8, player.y + 44, 6, 8)
  ctx.fillRect(player.x + 18, player.y + 44, 6, 8)
  
  // Arms
  ctx.fillStyle = '#8B4513'
  if (player.facing === 'right') {
    ctx.fillRect(player.x + 26, player.y + 26, 6, 12)
    ctx.fillRect(player.x, player.y + 28, 6, 10)
  } else {
    ctx.fillRect(player.x, player.y + 26, 6, 12)
    ctx.fillRect(player.x + 26, player.y + 28, 6, 10)
  }
  
  // Detective badge
  ctx.fillStyle = '#DAA520'
  ctx.fillRect(player.x + 12, player.y + 30, 8, 6)
  
  // Badge details
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(player.x + 14, player.y + 32, 4, 2)
}

// Collision detection
const checkCollision = (rect1: any, rect2: any) => {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y
}

export default function GameCanvas({ 
  gameState, 
  onGameOver, 
  onScoreUpdate, 
  onClueCollected,
  onLevelComplete,
  level 
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const keysRef = useRef<Set<string>>(new Set())
  const { playSound, playMusic, stopMusic } = useSound()
  
  // Game state - using refs to avoid dependency issues
  const playerRef = useRef<Player>({
    x: 100,
    y: 300,
    width: 32,
    height: 48,
    velocityX: 0,
    velocityY: 0,
    onGround: false,
    facing: 'right'
  })
  
  const cameraRef = useRef({ x: 0, y: 0 })
  const scoreRef = useRef(0)
  const cluesRef = useRef<Clue[]>([])
  const levelCompleteRef = useRef(false)

  // Initialize clues from story data
  useEffect(() => {
    const currentLevelStory = levelStories.find(story => story.id === level)
    if (currentLevelStory) {
      cluesRef.current = currentLevelStory.clues.map(clue => ({
        id: clue.id,
        x: clue.x,
        y: clue.y,
        width: clue.width,
        height: clue.height,
        collected: clue.collected,
        type: clue.type,
        name: clue.name,
        storyReveal: clue.storyReveal
      }))
    }
    levelCompleteRef.current = false
  }, [level])

  // Start background music when playing
  useEffect(() => {
    if (gameState === 'playing') {
      playMusic('background')
    } else {
      stopMusic()
    }
    
    return () => stopMusic()
  }, [gameState, playMusic, stopMusic])

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return

    const gameLoop = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const player = playerRef.current
      const camera = cameraRef.current
      const clues = cluesRef.current

      // Handle input
      if (keysRef.current.has('ArrowLeft') || keysRef.current.has('KeyA')) {
        player.velocityX = -MOVE_SPEED
        player.facing = 'left'
      } else if (keysRef.current.has('ArrowRight') || keysRef.current.has('KeyD')) {
        player.velocityX = MOVE_SPEED
        player.facing = 'right'
      } else {
        player.velocityX *= 0.8 // Friction
      }

      if ((keysRef.current.has('Space') || keysRef.current.has('ArrowUp') || keysRef.current.has('KeyW')) && player.onGround) {
        player.velocityY = JUMP_FORCE
        player.onGround = false
        playSound('jump') // Play jump sound
      }

      // Apply gravity
      player.velocityY += GRAVITY

      // Store previous position for collision detection
      const prevX = player.x
      const prevY = player.y

      // Update position
      player.x += player.velocityX
      player.y += player.velocityY

      // Platform collision
      player.onGround = false
      
      for (const platform of platforms) {
        if (checkCollision(player, platform)) {
          // Landing on top of platform
          if (prevY + player.height <= platform.y && player.velocityY > 0) {
            player.y = platform.y - player.height
            player.velocityY = 0
            player.onGround = true
          }
          // Hitting platform from below
          else if (prevY >= platform.y + platform.height && player.velocityY < 0) {
            player.y = platform.y + platform.height
            player.velocityY = 0
          }
          // Hitting platform from sides
          else if (player.velocityY === 0 || Math.abs(player.velocityY) < 2) {
            if (prevX + player.width <= platform.x) {
              player.x = platform.x - player.width
            } else if (prevX >= platform.x + platform.width) {
              player.x = platform.x + platform.width
            }
            player.velocityX = 0
          }
        }
      }

      // Boundary checks
      if (player.x < 0) player.x = 0
      if (player.y > CANVAS_HEIGHT) {
        playSound('gameOver')
        onGameOver()
      }

      // Update camera to follow player
      camera.x = Math.max(0, player.x - CANVAS_WIDTH / 2)
      camera.y = 0

      // Check clue collection
      for (const clue of clues) {
        if (!clue.collected && checkCollision(player, clue)) {
          clue.collected = true
          playSound('collect') // Play collection sound
          onClueCollected(clue.id, clue.storyReveal)
          scoreRef.current += 100
          onScoreUpdate(scoreRef.current)
        }
      }

      // Check level completion
      const allCluesCollected = clues.every(clue => clue.collected)
      if (allCluesCollected && !levelCompleteRef.current) {
        levelCompleteRef.current = true
        playSound('levelComplete')
        setTimeout(() => {
          onLevelComplete()
        }, 1000) // Delay to let the sound play
      }

      // Render
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      
      // Save context for camera transform
      ctx.save()
      ctx.translate(-camera.x, -camera.y)

      // Draw Victorian London background
      drawBackground(ctx, camera)
      
      // Draw platforms
      platforms.forEach(platform => {
        drawPlatform(ctx, platform)
      })

      // Draw clues
      clues.forEach(clue => {
        if (!clue.collected) {
          drawClue(ctx, clue)
        }
      })

      // Draw player
      drawPlayer(ctx, player)

      // Restore context
      ctx.restore()

      // Draw UI elements (not affected by camera)
      if (allCluesCollected && levelCompleteRef.current) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        
        ctx.fillStyle = '#DAA520'
        ctx.font = 'bold 48px serif'
        ctx.textAlign = 'center'
        ctx.fillText('Level Complete!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50)
        
        ctx.fillStyle = '#FFFFFF'
        ctx.font = '24px serif'
        ctx.fillText('All evidence collected!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
        ctx.fillText('The mystery deepens...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40)
      }

      animationRef.current = requestAnimationFrame(gameLoop)
    }

    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameState, onGameOver, onScoreUpdate, onClueCollected, onLevelComplete, playSound])

  // Input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Reset game state when level changes
  useEffect(() => {
    playerRef.current = {
      x: 100,
      y: 300,
      width: 32,
      height: 48,
      velocityX: 0,
      velocityY: 0,
      onGround: false,
      facing: 'right'
    }
    cameraRef.current = { x: 0, y: 0 }
    scoreRef.current = 0
    levelCompleteRef.current = false
  }, [level])

  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-accent/20 rounded-lg shadow-2xl"
        style={{ 
          maxWidth: '100%', 
          maxHeight: '100%',
          imageRendering: 'pixelated' // For crisp pixel art
        }}
      />
    </div>
  )
}