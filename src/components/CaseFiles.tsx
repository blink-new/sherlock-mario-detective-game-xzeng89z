import { ArrowLeft, Search, BookOpen, Key, Eye, Scroll, Lock, CheckCircle } from 'lucide-react'
import { getCaseFiles } from '../data/storyData'

interface CaseFilesProps {
  onBack: () => void
  cluesCollected: number
  totalClues: number
  score: number
  level: number
}

export default function CaseFiles({ onBack, cluesCollected, totalClues, score, level }: CaseFilesProps) {
  const caseProgress = Math.round((cluesCollected / totalClues) * 100)
  
  // Get case files with story reveals
  const cluesCollectedByLevel = { [level]: cluesCollected }
  const caseFiles = getCaseFiles(cluesCollectedByLevel)

  const evidenceTypes = [
    { type: 'magnifying-glass', name: 'Magnifying Glass', description: 'Essential detective tool for examining clues', icon: Search },
    { type: 'evidence', name: 'Physical Evidence', description: 'Tangible proof found at crime scenes', icon: BookOpen },
    { type: 'key', name: 'Mysterious Keys', description: 'Keys that unlock hidden secrets', icon: Key }
  ]

  return (
    <div className="w-full h-screen bg-gradient-to-b from-background to-card overflow-auto">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack}
            className="mr-4 p-2 hover:bg-accent/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-accent" />
          </button>
          <div>
            <h1 className="text-4xl font-serif font-bold text-accent mb-2">Case Files</h1>
            <p className="text-muted-foreground">Detective Mario's Investigation Records</p>
          </div>
        </div>

        {/* Case Progress Summary */}
        <div className="bg-card/50 border border-accent/20 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Investigation Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{score}</div>
              <div className="text-sm text-muted-foreground">Total Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{cluesCollected}</div>
              <div className="text-sm text-muted-foreground">Clues Found</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">{level}</div>
              <div className="text-sm text-muted-foreground">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{caseProgress}%</div>
              <div className="text-sm text-muted-foreground">Case Progress</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Case Progress</span>
              <span>{cluesCollected}/{totalClues} clues</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-3">
              <div 
                className="bg-accent h-3 rounded-full transition-all duration-500"
                style={{ width: `${caseProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Active Cases with Story Reveals */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Active Cases</h2>
          <div className="space-y-6">
            {caseFiles.map((caseFile) => (
              <div 
                key={caseFile.id}
                className={`bg-card/30 border rounded-lg p-6 transition-all duration-200 ${
                  caseFile.status === 'locked' 
                    ? 'border-muted/30 opacity-60' 
                    : 'border-accent/20 hover:border-accent/40'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {caseFile.status === 'locked' && <Lock className="w-6 h-6 text-muted-foreground" />}
                      {caseFile.status === 'active' && <Search className="w-6 h-6 text-accent" />}
                      {caseFile.status === 'completed' && <CheckCircle className="w-6 h-6 text-green-500" />}
                    </div>
                    <h3 className="text-xl font-serif font-bold text-foreground">{caseFile.title}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    caseFile.status === 'active' 
                      ? 'bg-accent/20 text-accent' 
                      : caseFile.status === 'locked'
                      ? 'bg-muted/20 text-muted-foreground'
                      : 'bg-green-500/20 text-green-500'
                  }`}>
                    {caseFile.status === 'locked' ? 'Locked' : 
                     caseFile.status === 'active' ? 'In Progress' : 'Completed'}
                  </span>
                </div>
                
                <p className="text-muted-foreground mb-4">{caseFile.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-muted-foreground">
                    Evidence: {caseFile.collectedClues}/{caseFile.totalClues} collected
                  </div>
                  {caseFile.status !== 'locked' && (
                    <div className="w-32 bg-muted/30 rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full"
                        style={{ width: `${caseFile.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Story Reveals */}
                {caseFile.storyReveals.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h4 className="font-medium text-foreground flex items-center">
                      <Scroll className="w-4 h-4 text-accent mr-2" />
                      Investigation Notes
                    </h4>
                    {caseFile.storyReveals.map((reveal, index) => (
                      <div key={index} className="bg-background/50 p-3 rounded-lg border border-accent/10">
                        <p className="text-sm text-foreground italic font-serif">
                          "{reveal}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Final Reveal */}
                {caseFile.finalReveal && (
                  <div className="mt-4">
                    <h4 className="font-medium text-accent flex items-center mb-2">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Case Conclusion
                    </h4>
                    <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                      <p className="text-foreground font-serif">
                        {caseFile.finalReveal}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Types Guide */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Evidence Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {evidenceTypes.map((evidence) => {
              const IconComponent = evidence.icon
              return (
                <div key={evidence.type} className="bg-card/30 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center mr-3">
                      <IconComponent className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-serif font-bold text-foreground">{evidence.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{evidence.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detective Notes */}
        <div className="bg-card/30 border border-accent/20 rounded-lg p-6">
          <h2 className="text-xl font-serif font-bold text-foreground mb-4 flex items-center">
            <Eye className="w-5 h-5 text-accent mr-2" />
            Detective's Notes
          </h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>• The streets of Victorian London hold many secrets. Look for glowing clues as you navigate the rooftops.</p>
            <p>• Each piece of evidence brings you closer to solving the mystery. Collect them all to unlock new cases.</p>
            <p>• Use your detective skills to reach difficult areas - some clues require precise jumping and timing.</p>
            <p>• The magnifying glass is your most valuable tool. It reveals hidden details others might miss.</p>
            {cluesCollected > 2 && (
              <p className="text-accent">• Excellent work, Detective! You're making real progress on this case.</p>
            )}
            {cluesCollected >= totalClues && (
              <p className="text-green-500 font-medium">• Outstanding! You've collected all evidence for this case. The mystery deepens...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}