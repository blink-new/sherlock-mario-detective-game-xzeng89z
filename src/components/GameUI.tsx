import { Pause, Play, Home, Search, Star } from 'lucide-react'
import { GameState } from '../App'

interface GameUIProps {
  score: number
  cluesCollected: number
  level: number
  gameState: GameState
  onPause: () => void
  onResume: () => void
  onReturnToMenu: () => void
}

export default function GameUI({ 
  score, 
  cluesCollected, 
  level, 
  gameState, 
  onPause, 
  onResume, 
  onReturnToMenu 
}: GameUIProps) {
  return (
    <>
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/60 to-transparent p-4">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          {/* Left Side - Game Stats */}
          <div className="flex items-center space-x-6">
            <div className="bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-accent/20">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">Score: {score}</span>
              </div>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-accent/20">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">Clues: {cluesCollected}</span>
              </div>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-accent/20">
              <span className="text-sm font-medium text-foreground">Level {level}</span>
            </div>
          </div>

          {/* Right Side - Game Controls */}
          <div className="flex items-center space-x-3">
            {gameState === 'playing' && (
              <button 
                onClick={onPause}
                className="bg-primary/80 hover:bg-primary text-primary-foreground p-2 rounded-lg transition-colors"
                title="Pause Game"
              >
                <Pause className="w-5 h-5" />
              </button>
            )}
            
            <button 
              onClick={onReturnToMenu}
              className="bg-secondary/80 hover:bg-secondary text-secondary-foreground p-2 rounded-lg transition-colors"
              title="Return to Menu"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Pause Overlay */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-lg border border-accent/20 text-center max-w-md">
            <h2 className="text-2xl font-serif font-bold text-accent mb-6">Investigation Paused</h2>
            
            <div className="space-y-4 mb-6">
              <div className="text-sm text-muted-foreground">
                <p>Current Progress:</p>
                <div className="mt-2 space-y-1">
                  <p>Score: {score}</p>
                  <p>Clues Found: {cluesCollected}</p>
                  <p>Level: {level}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={onResume}
                className="w-full bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Resume Investigation</span>
              </button>
              
              <button 
                onClick={onReturnToMenu}
                className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-3 rounded-md font-medium transition-colors"
              >
                Return to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Controls Hint - Bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
          <p className="text-xs text-foreground/80 text-center">
            ← → Move • SPACE Jump • Collect 🔍 Clues
          </p>
        </div>
      </div>
    </>
  )
}