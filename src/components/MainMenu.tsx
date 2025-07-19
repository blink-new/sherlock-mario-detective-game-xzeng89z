import { Search, Play, BookOpen, Settings } from 'lucide-react'
import { useEffect } from 'react'
import { useSound } from '../hooks/useSound'

interface MainMenuProps {
  onStartGame: () => void
  onOpenCaseFiles: () => void
  onOpenSettings: () => void
}

export default function MainMenu({ onStartGame, onOpenCaseFiles, onOpenSettings }: MainMenuProps) {
  const { playMusic, stopMusic } = useSound()

  // Play menu music when component mounts
  useEffect(() => {
    playMusic('menu')
    return () => stopMusic()
  }, [playMusic, stopMusic])
  return (
    <div className="w-full h-screen bg-gradient-to-b from-background to-card flex items-center justify-center relative overflow-hidden">
      {/* Victorian London Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-accent/30 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-accent/20 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 border border-accent/25 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border border-accent/30 rounded-full"></div>
      </div>

      <div className="text-center z-10 max-w-2xl px-8">
        {/* Game Title */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-4">
            <Search className="w-16 h-16 text-accent mr-4" />
            <h1 className="text-6xl font-serif font-bold text-accent">
              Sherlock Mario
            </h1>
          </div>
          <p className="text-xl text-foreground/80 font-serif italic">
            Detective Platformer Adventure
          </p>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
            Navigate through Victorian London as Detective Mario, collecting clues and solving mysteries 
            while mastering classic platformer mechanics in this unique adventure.
          </p>
        </div>

        {/* Menu Buttons */}
        <div className="space-y-4 mb-8">
          <button 
            onClick={onStartGame}
            className="group w-full max-w-sm mx-auto bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
          >
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-lg">Start Investigation</span>
          </button>
          
          <button 
            onClick={onOpenCaseFiles}
            className="w-full max-w-sm mx-auto bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/30 px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-3"
          >
            <BookOpen className="w-5 h-5" />
            <span>Case Files</span>
          </button>
          
          <button 
            onClick={onOpenSettings}
            className="w-full max-w-sm mx-auto bg-muted/20 hover:bg-muted/30 text-muted-foreground border border-muted/30 px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-3"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>

        {/* Game Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Search className="w-6 h-6 text-accent" />
            </div>
            <p className="font-medium">Collect Clues</p>
            <p className="text-xs">Gather evidence while platforming</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Play className="w-6 h-6 text-primary" />
            </div>
            <p className="font-medium">Classic Gameplay</p>
            <p className="text-xs">Mario-style jumping mechanics</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-6 h-6 text-secondary" />
            </div>
            <p className="font-medium">Solve Mysteries</p>
            <p className="text-xs">Uncover Victorian London secrets</p>
          </div>
        </div>

        {/* Controls Hint */}
        <div className="mt-8 text-xs text-muted-foreground">
          <p>Use ARROW KEYS to move • SPACEBAR to jump • Collect golden clues to progress</p>
        </div>
      </div>
    </div>
  )
}