import { useState, useEffect } from 'react'
import GameCanvas from './components/GameCanvas'
import MainMenu from './components/MainMenu'
import GameUI from './components/GameUI'
import CaseFiles from './components/CaseFiles'
import Settings from './components/Settings'
import { shouldUnlockNextLevel } from './data/storyData'

export type GameState = 'menu' | 'playing' | 'paused' | 'gameOver' | 'caseFiles' | 'settings'

function App() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [score, setScore] = useState(0)
  const [cluesCollected, setCluesCollected] = useState(0)
  const [level, setLevel] = useState(1)
  const [cluesCollectedByLevel, setCluesCollectedByLevel] = useState<{ [levelId: number]: number }>({})
  const [storyReveals, setStoryReveals] = useState<string[]>([])
  const [showStoryModal, setShowStoryModal] = useState(false)
  const [currentStoryReveal, setCurrentStoryReveal] = useState('')

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setCluesCollected(0)
    setLevel(1)
  }

  const pauseGame = () => {
    setGameState('paused')
  }

  const resumeGame = () => {
    setGameState('playing')
  }

  const gameOver = () => {
    setGameState('gameOver')
  }

  const returnToMenu = () => {
    setGameState('menu')
  }

  const openCaseFiles = () => {
    setGameState('caseFiles')
  }

  const openSettings = () => {
    setGameState('settings')
  }

  const handleClueCollected = (clueId: string, storyReveal: string) => {
    setCluesCollected(prev => prev + 1)
    setCluesCollectedByLevel(prev => ({
      ...prev,
      [level]: (prev[level] || 0) + 1
    }))
    setStoryReveals(prev => [...prev, storyReveal])
    setCurrentStoryReveal(storyReveal)
    setShowStoryModal(true)
  }

  const handleLevelComplete = () => {
    // Check if next level should be unlocked
    if (shouldUnlockNextLevel(level, cluesCollectedByLevel)) {
      // Level progression logic can be added here
      console.log(`Level ${level} completed! Next level unlocked.`)
    }
    
    // Return to menu after level completion
    setTimeout(() => {
      setGameState('menu')
    }, 2000)
  }

  const closeStoryModal = () => {
    setShowStoryModal(false)
    setCurrentStoryReveal('')
  }

  return (
    <div className="w-full h-screen bg-background overflow-hidden relative">
      {gameState === 'menu' && (
        <MainMenu 
          onStartGame={startGame} 
          onOpenCaseFiles={openCaseFiles}
          onOpenSettings={openSettings}
        />
      )}

      {gameState === 'caseFiles' && (
        <CaseFiles 
          onBack={returnToMenu}
          cluesCollected={cluesCollected}
          totalClues={5} // Total clues in the game
          score={score}
          level={level}
        />
      )}

      {gameState === 'settings' && (
        <Settings onBack={returnToMenu} />
      )}
      
      {(gameState === 'playing' || gameState === 'paused') && (
        <>
          <GameCanvas 
            gameState={gameState}
            onGameOver={gameOver}
            onScoreUpdate={setScore}
            onClueCollected={handleClueCollected}
            onLevelComplete={handleLevelComplete}
            level={level}
          />
          <GameUI 
            score={score}
            cluesCollected={cluesCollected}
            level={level}
            gameState={gameState}
            onPause={pauseGame}
            onResume={resumeGame}
            onReturnToMenu={returnToMenu}
          />
        </>
      )}

      {gameState === 'gameOver' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-lg border border-accent/20 text-center max-w-md">
            <h2 className="text-3xl font-serif font-bold text-accent mb-4">Case Closed!</h2>
            <p className="text-foreground mb-2">Final Score: {score}</p>
            <p className="text-foreground mb-6">Clues Collected: {cluesCollected}</p>
            <div className="space-y-3">
              <button 
                onClick={startGame}
                className="w-full bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors"
              >
                New Investigation
              </button>
              <button 
                onClick={returnToMenu}
                className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-3 rounded-md font-medium transition-colors"
              >
                Return to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Story Reveal Modal */}
      {showStoryModal && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-lg border border-accent/20 max-w-2xl mx-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">🔍</span>
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-accent">Evidence Discovered!</h3>
                <p className="text-sm text-muted-foreground">Detective Mario's Investigation Notes</p>
              </div>
            </div>
            
            <div className="bg-background/50 p-4 rounded-lg border border-accent/10 mb-6">
              <p className="text-foreground leading-relaxed font-serif italic">
                "{currentStoryReveal}"
              </p>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={closeStoryModal}
                className="bg-accent hover:bg-accent/80 text-accent-foreground px-6 py-3 rounded-md font-medium transition-colors"
              >
                Continue Investigation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App