export interface StoryClue {
  id: string
  type: 'magnifying-glass' | 'evidence' | 'key'
  name: string
  description: string
  storyReveal: string
  location: string
  x: number
  y: number
  width: number
  height: number
  collected: boolean
}

export interface LevelStory {
  id: number
  title: string
  description: string
  setting: string
  mystery: string
  clues: StoryClue[]
  conclusion: string
  unlocked: boolean
  requiredClues: number
}

export interface CaseFile {
  id: string
  title: string
  description: string
  status: 'locked' | 'active' | 'completed'
  progress: number
  totalClues: number
  collectedClues: number
  storyReveals: string[]
  finalReveal?: string
}

export const levelStories: LevelStory[] = [
  {
    id: 1,
    title: "The Fog-Shrouded Mystery",
    description: "Strange disappearances have been reported in the gaslit streets of Victorian London. As Detective Mario, you must uncover the truth behind these mysterious vanishings.",
    setting: "Victorian London - Whitechapel District, 1887",
    mystery: "Citizens have been vanishing without a trace during the thick London fog. The only clues left behind are strange golden artifacts scattered across the rooftops.",
    unlocked: true,
    requiredClues: 5,
    clues: [
      {
        id: "clue_1_1",
        type: "magnifying-glass",
        name: "Inspector's Magnifying Glass",
        description: "A well-worn magnifying glass belonging to Inspector Lestrade",
        storyReveal: "This magnifying glass reveals scratches on nearby surfaces - someone was here recently, searching for something. The scratches form a pattern... could it be a map?",
        location: "Abandoned warehouse rooftop",
        x: 350,
        y: 420,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "clue_1_2",
        type: "evidence",
        name: "Torn Letter Fragment",
        description: "A piece of parchment with elegant handwriting",
        storyReveal: "The letter fragment reads: '...meet me at the old clock tower when the fog rolls in. The Society of Shadows must not discover our...' The rest is illegible. Who wrote this?",
        location: "Victorian building ledge",
        x: 650,
        y: 370,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "clue_1_3",
        type: "key",
        name: "Ornate Brass Key",
        description: "An intricate key with mysterious engravings",
        storyReveal: "The key bears the symbol of a raven - the same symbol found at each disappearance site. This key unlocks something important, but what? The engravings seem to glow faintly in the moonlight.",
        location: "Clock tower platform",
        x: 950,
        y: 320,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "clue_1_4",
        type: "magnifying-glass",
        name: "Victim's Spectacles",
        description: "Broken spectacles found at a disappearance site",
        storyReveal: "These spectacles belonged to Professor Moriarty's assistant. Through the cracked lens, you notice strange symbols etched into the building walls - a secret code perhaps?",
        location: "High building platform",
        x: 1250,
        y: 270,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "clue_1_5",
        type: "evidence",
        name: "Society Medallion",
        description: "A golden medallion with a raven emblem",
        storyReveal: "The Society of Shadows medallion! This secret organization has been operating in London's underground. The medallion is warm to the touch and seems to pulse with an otherworldly energy. You're getting close to the truth.",
        location: "Highest tower",
        x: 1550,
        y: 220,
        width: 20,
        height: 20,
        collected: false
      }
    ],
    conclusion: "The evidence points to the Society of Shadows - a secret organization using the London fog as cover for their mysterious activities. The disappearances are connected to their search for ancient artifacts hidden throughout the city. But this is only the beginning of a much larger conspiracy..."
  },
  {
    id: 2,
    title: "The Crown Jewels Conspiracy",
    description: "The Crown Jewels have vanished from the Tower of London. Follow the trail through London's rooftops to uncover an international conspiracy.",
    setting: "Tower of London and surrounding districts, 1887",
    mystery: "The Crown Jewels disappeared during a carefully orchestrated heist. The thieves left behind a trail of clues that leads across London's most dangerous rooftops.",
    unlocked: false,
    requiredClues: 5,
    clues: [
      {
        id: "clue_2_1",
        type: "evidence",
        name: "Royal Guard's Button",
        description: "A button from a Royal Guard's uniform",
        storyReveal: "This button was torn off during a struggle. The guard who wore this uniform was found unconscious with no memory of the theft. Someone used advanced techniques to erase his memories.",
        location: "Tower Bridge approach",
        x: 200,
        y: 450,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "clue_2_2",
        type: "key",
        name: "Master Thief's Lockpick",
        description: "A sophisticated lockpicking tool",
        storyReveal: "This lockpick is made from a rare metal found only in the mountains of Bavaria. The thief is not from London - this is an international operation with connections to European criminal networks.",
        location: "Parliament building roof",
        x: 500,
        y: 380,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "clue_2_3",
        type: "magnifying-glass",
        name: "Jeweler's Loupe",
        description: "A high-quality jeweler's magnifying glass",
        storyReveal: "Through this loupe, you can see microscopic scratches on nearby surfaces. The scratches spell out 'MORIARTY' in tiny letters. The Professor is involved in this heist!",
        location: "Big Ben clock face",
        x: 800,
        y: 300,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "clue_2_4",
        type: "evidence",
        name: "Coded Telegram",
        description: "A telegram with mysterious symbols",
        storyReveal: "The telegram reads: 'Package secured. Raven flies at midnight. Destination: The Continent.' The Crown Jewels are being smuggled out of England tonight!",
        location: "Telegraph office rooftop",
        x: 1100,
        y: 250,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "clue_2_5",
        type: "key",
        name: "Ship Captain's Key",
        description: "A key to a ship's cargo hold",
        storyReveal: "This key belongs to Captain Blackwood's merchant vessel. The ship is scheduled to depart for France at midnight - with the Crown Jewels hidden in its cargo hold. You must stop them!",
        location: "Docklands warehouse",
        x: 1400,
        y: 200,
        width: 20,
        height: 20,
        collected: false
      }
    ],
    conclusion: "Professor Moriarty orchestrated the theft of the Crown Jewels as part of a larger plan to destabilize the British Empire. The jewels were to be sold to fund his criminal network across Europe. Thanks to your detective work, the jewels are recovered and Moriarty's plan is foiled... for now."
  },
  {
    id: 3,
    title: "The Phantom of Baker Street",
    description: "A mysterious figure has been terrorizing Baker Street. Uncover the truth behind the phantom's identity and motives.",
    setting: "Baker Street and surrounding areas, 1887",
    mystery: "Residents of Baker Street report seeing a ghostly figure moving across the rooftops at night. Strange sounds echo through the fog, and several witnesses claim the phantom can disappear into thin air.",
    unlocked: false,
    requiredClues: 5,
    clues: [
      {
        id: "clue_3_1",
        type: "evidence",
        name: "Phantom's Cloak Fragment",
        description: "A piece of dark fabric that seems to shimmer",
        storyReveal: "This fabric is woven with silver threads that create an optical illusion. The 'phantom' uses advanced stage magic techniques to appear and disappear. But who has such skills?",
        location: "221B Baker Street rooftop",
        x: 300,
        y: 400,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "clue_3_2",
        type: "magnifying-glass",
        name: "Stage Magician's Glass",
        description: "A magnifying glass with a hidden compartment",
        storyReveal: "Inside the hidden compartment is a theater ticket stub for 'The Great Houdini' performance. The phantom is connected to the world of stage magic and illusion.",
        location: "Theater district rooftop",
        x: 600,
        y: 350,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "clue_3_3",
        type: "key",
        name: "Theater Master Key",
        description: "A key that opens all doors in the theater",
        storyReveal: "This master key belongs to the theater manager. The phantom has been using the theater's underground tunnels to move unseen throughout Baker Street. The tunnels connect to several buildings!",
        location: "Opera house balcony",
        x: 900,
        y: 280,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "clue_3_4",
        type: "evidence",
        name: "Love Letter",
        description: "A passionate letter written in elegant script",
        storyReveal: "The letter reveals the phantom's true motive: 'My dearest Irene, I will prove my love by becoming the greatest mystery London has ever seen. When you see what I can accomplish, you will return to me.' This is about lost love.",
        location: "Church bell tower",
        x: 1200,
        y: 220,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "clue_3_5",
        type: "magnifying-glass",
        name: "Irene's Hand Mirror",
        description: "An ornate hand mirror with initials 'I.A.'",
        storyReveal: "Irene Adler's mirror! The phantom is her former lover, a brilliant stage magician who turned to crime when she left him. He's been trying to win her back by creating the greatest mystery of all - himself.",
        location: "Highest spire",
        x: 1500,
        y: 180,
        width: 20,
        height: 20,
        collected: false
      }
    ],
    conclusion: "The Phantom of Baker Street is revealed to be Magnus the Magnificent, a heartbroken stage magician trying to win back Irene Adler's love through elaborate illusions. His 'hauntings' were actually a desperate attempt to prove his worth. Love makes people do extraordinary things - even become phantoms in the night."
  }
]

export const getCaseFiles = (cluesCollected: { [levelId: number]: number }): CaseFile[] => {
  return levelStories.map(level => {
    const collectedClues = cluesCollected[level.id] || 0
    const progress = Math.round((collectedClues / level.requiredClues) * 100)
    
    // Get story reveals for collected clues
    const storyReveals = level.clues
      .filter(clue => clue.collected)
      .map(clue => clue.storyReveal)
    
    // Add final reveal if all clues collected
    const finalReveal = collectedClues >= level.requiredClues ? level.conclusion : undefined
    
    return {
      id: `case_${level.id}`,
      title: level.title,
      description: level.description,
      status: !level.unlocked ? 'locked' : 
              collectedClues >= level.requiredClues ? 'completed' : 'active',
      progress,
      totalClues: level.requiredClues,
      collectedClues,
      storyReveals,
      finalReveal
    }
  })
}

export const getStoryRevealForClue = (levelId: number, clueId: string): string | null => {
  const level = levelStories.find(l => l.id === levelId)
  if (!level) return null
  
  const clue = level.clues.find(c => c.id === clueId)
  return clue ? clue.storyReveal : null
}

export const shouldUnlockNextLevel = (currentLevel: number, cluesCollected: { [levelId: number]: number }): boolean => {
  const currentLevelData = levelStories.find(l => l.id === currentLevel)
  if (!currentLevelData) return false
  
  const collectedCount = cluesCollected[currentLevel] || 0
  return collectedCount >= currentLevelData.requiredClues
}