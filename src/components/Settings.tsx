import { ArrowLeft, Volume2, VolumeX, Gamepad2, Monitor, Smartphone, RotateCcw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSound } from '../hooks/useSound'

interface SettingsProps {
  onBack: () => void
}

export default function Settings({ onBack }: SettingsProps) {
  const { settings, updateSettings, playSound, playMusic, stopMusic } = useSound()
  const [controlScheme, setControlScheme] = useState('arrows')
  const [displayMode, setDisplayMode] = useState('desktop')

  const handleReset = () => {
    updateSettings({
      masterVolume: 0.7,
      musicVolume: 0.5,
      sfxVolume: 0.8,
      isMuted: false
    })
    setControlScheme('arrows')
    setDisplayMode('desktop')
  }

  // Play menu music when settings open
  useEffect(() => {
    playMusic('menu')
    return () => stopMusic()
  }, [playMusic, stopMusic])

  const handleVolumeChange = (type: 'master' | 'music' | 'sfx', value: number) => {
    const normalizedValue = value / 100
    if (type === 'master') {
      updateSettings({ masterVolume: normalizedValue })
    } else if (type === 'music') {
      updateSettings({ musicVolume: normalizedValue })
    } else if (type === 'sfx') {
      updateSettings({ sfxVolume: normalizedValue })
      // Play test sound when adjusting SFX volume
      if (value > 0) {
        playSound('collect')
      }
    }
  }

  const controlSchemes = [
    { id: 'arrows', name: 'Arrow Keys + Space', description: 'Classic platformer controls' },
    { id: 'wasd', name: 'WASD + Space', description: 'Modern gaming layout' },
    { id: 'custom', name: 'Custom Controls', description: 'Configure your own keys' }
  ]

  const displayModes = [
    { id: 'desktop', name: 'Desktop', icon: Monitor, description: 'Optimized for desktop play' },
    { id: 'mobile', name: 'Mobile', icon: Smartphone, description: 'Touch-friendly interface' }
  ]

  return (
    <div className="w-full h-screen bg-gradient-to-b from-background to-card overflow-auto">
      <div className="max-w-3xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack}
            className="mr-4 p-2 hover:bg-accent/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-accent" />
          </button>
          <div>
            <h1 className="text-4xl font-serif font-bold text-accent mb-2">Settings</h1>
            <p className="text-muted-foreground">Configure your detective experience</p>
          </div>
        </div>

        {/* Audio Settings */}
        <div className="bg-card/50 border border-accent/20 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 flex items-center">
            {!settings.isMuted ? <Volume2 className="w-6 h-6 text-accent mr-2" /> : <VolumeX className="w-6 h-6 text-muted-foreground mr-2" />}
            Audio Settings
          </h2>
          
          {/* Master Sound Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-medium text-foreground">Master Audio</h3>
              <p className="text-sm text-muted-foreground">Enable or disable all game sounds</p>
            </div>
            <button
              onClick={() => updateSettings({ isMuted: !settings.isMuted })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                !settings.isMuted ? 'bg-accent' : 'bg-muted/30'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  !settings.isMuted ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Volume Controls */}
          <div className={`space-y-4 ${settings.isMuted ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium text-foreground">Master Volume</label>
                <span className="text-sm text-muted-foreground">{Math.round(settings.masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(settings.masterVolume * 100)}
                onChange={(e) => handleVolumeChange('master', Number(e.target.value))}
                className="w-full h-2 bg-muted/30 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium text-foreground">Music Volume</label>
                <span className="text-sm text-muted-foreground">{Math.round(settings.musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(settings.musicVolume * 100)}
                onChange={(e) => handleVolumeChange('music', Number(e.target.value))}
                className="w-full h-2 bg-muted/30 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium text-foreground">Sound Effects</label>
                <span className="text-sm text-muted-foreground">{Math.round(settings.sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(settings.sfxVolume * 100)}
                onChange={(e) => handleVolumeChange('sfx', Number(e.target.value))}
                className="w-full h-2 bg-muted/30 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>

        {/* Controls Settings */}
        <div className="bg-card/50 border border-accent/20 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4 flex items-center">
            <Gamepad2 className="w-6 h-6 text-accent mr-2" />
            Controls
          </h2>
          
          <div className="space-y-4">
            {controlSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  controlScheme === scheme.id
                    ? 'border-accent bg-accent/10'
                    : 'border-muted/30 hover:border-accent/40'
                }`}
                onClick={() => setControlScheme(scheme.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{scheme.name}</h3>
                    <p className="text-sm text-muted-foreground">{scheme.description}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    controlScheme === scheme.id
                      ? 'border-accent bg-accent'
                      : 'border-muted/30'
                  }`}>
                    {controlScheme === scheme.id && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Control Instructions */}
          <div className="mt-6 p-4 bg-muted/20 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Current Controls:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Move Left:</span> {controlScheme === 'wasd' ? 'A' : '← Arrow'}
              </div>
              <div>
                <span className="font-medium">Move Right:</span> {controlScheme === 'wasd' ? 'D' : '→ Arrow'}
              </div>
              <div>
                <span className="font-medium">Jump:</span> Spacebar / W / ↑ Arrow
              </div>
              <div>
                <span className="font-medium">Pause:</span> Esc
              </div>
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-card/50 border border-accent/20 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Display</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayModes.map((mode) => {
              const IconComponent = mode.icon
              return (
                <div
                  key={mode.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    displayMode === mode.id
                      ? 'border-accent bg-accent/10'
                      : 'border-muted/30 hover:border-accent/40'
                  }`}
                  onClick={() => setDisplayMode(mode.id)}
                >
                  <div className="flex items-center mb-2">
                    <IconComponent className="w-5 h-5 text-accent mr-2" />
                    <h3 className="font-medium text-foreground">{mode.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{mode.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Game Information */}
        <div className="bg-card/50 border border-accent/20 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Game Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-foreground">Version:</span>
              <span className="text-muted-foreground ml-2">2.0.0</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Engine:</span>
              <span className="text-muted-foreground ml-2">HTML5 Canvas + Web Audio</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Developer:</span>
              <span className="text-muted-foreground ml-2">Blink Detective Studios</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Genre:</span>
              <span className="text-muted-foreground ml-2">Story-Driven Detective Platformer</span>
            </div>
          </div>
        </div>

        {/* Reset Settings */}
        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 bg-muted/20 hover:bg-muted/30 text-muted-foreground px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Defaults</span>
          </button>
        </div>
      </div>
    </div>
  )
}