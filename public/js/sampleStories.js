// Preloaded showcase stories for instant presentation & demonstration
const SAMPLE_STORIES = [
  {
    id: "sample_fantasy_1",
    title: "The Chrono-Crystal of Lumina Grove",
    genre: "Fantasy",
    artStyle: "Pixar 3D",
    audience: "Kids & Young Readers (Ages 6-12)",
    tone: "Whimsical & Heartwarming",
    summary: "A young wizard apprentice discovers a magical crystal that whispers lost celestial songs, unlocking the ancient friendship between mortals and luminous dragons.",
    coverImage: "assets/samples/dragon_story.jpg",
    characters: [
      { name: "Leo", role: "Protagonist", description: "Young curious wizard apprentice in sapphire robes carrying an ancient wooden focus staff" },
      { name: "Sparky", role: "Magical Companion", description: "Luminous baby dragon with iridescent emerald scales and golden wings" }
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: "The Whispering Forest",
        narration: "Deep within the ancient grove of Eldoria, moonlight filtered through canopy crystals like liquid silver. Leo, clutching his grandfather's oak staff, noticed a rhythmic golden chime pulsing from beneath an elder moss bank. As he knelt down, small glittering fireflies swirled into the air, revealing an iridescent dragon hatchling holding a glimmering shard of celestial quartz.",
        visualPrompt: "Young wizard apprentice with staff befriending a glowing baby dragon in an enchanted crystal forest, Pixar 3D style, volumetric lighting",
        mood: "Enchanting & Wonder-filled",
        imageUrl: "assets/samples/dragon_story.jpg"
      },
      {
        sceneNumber: 2,
        title: "The Celestial Map Awakens",
        narration: "When Sparky touched the crystal shard to Leo's staff, the cavern walls burst into a shimmering constellation map. Star lines traced an forgotten path across the Whispering Peaks toward the Sunken Citadel. 'You're not lost,' Leo whispered with a wide smile, 'you're the keeper of the first beacon!' With a chirp of excitement, Sparky fluttered onto Leo's shoulder, eager for the journey ahead.",
        visualPrompt: "Boy apprentice and baby dragon looking at glowing golden holographic star map in a magical cavern, 3D animated style, warm radiant light",
        mood: "Adventurous & Uplifting",
        imageUrl: "assets/samples/dragon_story.jpg"
      },
      {
        sceneNumber: 3,
        title: "The Guardian of the Bridge",
        narration: "At the threshold of the Whispering Peaks, an ancient moss-stone golem blocked the suspension bridge. Instead of casting defensive spells, Leo remembered the lullaby of the grove. Together with Sparky's gentle melodic humming, the crystal glowed with harmonic warmth. The great stone giant softened its gaze, bowed low, and placed a crown of luminescent orchids upon Leo's brow.",
        visualPrompt: "Gentle giant stone golem bowing to young wizard and baby dragon on a rope bridge surrounded by mountain clouds, Pixar 3D cinematic lighting",
        mood: "Triumphant & Peaceful",
        imageUrl: "assets/samples/dragon_story.jpg"
      },
      {
        sceneNumber: 4,
        title: "Dawn of the Celestial Beacon",
        narration: "Atop the highest pinnacle as the morning sun broke the horizon, Leo and Sparky united the crystal with the great spire altar. A beam of prismatic dawn light shot into the stratosphere, banishing the centuries-old mist and bathing the kingdom in perpetual warmth. The citizens celebrated in the courtyards below, welcoming their youngest master wizard and the guardian dragon.",
        visualPrompt: "Pinnacle tower firing a brilliant beam of rainbow light into morning sunrise sky, young wizard and baby dragon cheering, Pixar animation style",
        mood: "Inspiring & Joyful",
        imageUrl: "assets/samples/dragon_story.jpg"
      }
    ]
  },
  {
    id: "sample_cyberpunk_2",
    title: "Neo-Tokyo 2099: The Ghost in the Subgrid",
    genre: "Cyberpunk Sci-Fi",
    artStyle: "Anime / Studio Ghibli",
    audience: "Young Adult & Sci-Fi Enthusiasts",
    tone: "Atmospheric & Gripping",
    summary: "Detective Kael and an AI recon companion trace an encrypted cyber-signal beneath a rain-slicked metropolis, uncovering the city's lost digital soul.",
    coverImage: "assets/samples/cyberpunk_story.jpg",
    characters: [
      { name: "Kael Vance", role: "Cyber Detective", description: "Trenchcoat-wearing cyborg investigator with a cyan holographic tactical visor" },
      { name: "Cipher", role: "AI Companion", description: "Miniature floating drone with neon ocular sensors and quantum encryption antennas" }
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: "Rain on Neon Street 404",
        narration: "Acid rain drummed against the reinforced glass of Neo-Tokyo's skyline. Detective Kael Vance adjusted the optical frequency of his visor, reflecting towering holographic advertisements that burned through the violet fog. Floating alongside his shoulder, Cipher emitted a synchronized frequency ping: an unauthorized neural stream was bleeding out from the sealed sublevels of Old Town.",
        visualPrompt: "Cyborg detective in trenchcoat walking rainy neon cyberpunk street with flying cars, anime aesthetic, moody atmospheric lighting",
        mood: "Moody & Mysterious",
        imageUrl: "assets/samples/cyberpunk_story.jpg"
      },
      {
        sceneNumber: 2,
        title: "Descent into the Datastream",
        narration: "Navigating abandoned subway corridors overgrown with fiber-optic moss, Kael reached the decommissioned mainframe chamber. Holographic phantom figures—memories of early city architects—flickered in infinite loops. Cipher docked into the primary port, decoding a hidden protocol designed to restore unrestricted clean energy to the lower districts.",
        visualPrompt: "Detective interfacing with colossal glowing blue supercomputer surrounded by holographic phantom memories, anime aesthetic, high detail",
        mood: "High-Tech & Enigmatic",
        imageUrl: "assets/samples/cyberpunk_story.jpg"
      },
      {
        sceneNumber: 3,
        title: "The Neural Override",
        narration: "The corporate firewall surged in defense, manifesting obsidian digital sentinels. Kael deployed counter-intrusion barriers, his cybernetic gauntlet pulsing with azure lightning. 'Cipher, divert power to the backup shunt!' Kael shouted over the alarm siren. With split-second precision, Cipher bridged the neural circuit, disabling the quarantine protocol just as the core stabilized.",
        visualPrompt: "Cyberpunk action scene with electric blue data sparks, defensive shields, anime art style, dynamic cinematic composition",
        mood: "Thrilling & High-Stakes",
        imageUrl: "assets/samples/cyberpunk_story.jpg"
      },
      {
        sceneNumber: 4,
        title: "A City Reborn in Light",
        narration: "As dawn filtered through the dissipating smog, millions of lights across the lower districts flickered on with radiant warmth. For the first time in sixty years, children played under warm streetlamps powered by the people's grid. Standing atop the bridge overlooking the awakened city, Kael smiled beneath his visor, ready for whatever tomorrow might bring.",
        visualPrompt: "Sunrise over futuristic cyberpunk city skyline, clean light breaking through clouds, detective on balcony looking over peaceful city, anime style",
        mood: "Hopeful & Victorious",
        imageUrl: "assets/samples/cyberpunk_story.jpg"
      }
    ]
  },
  {
    id: "sample_ocean_3",
    title: "The Whispering Reef of Aquaria",
    genre: "Adventure & Fairy Tale",
    artStyle: "Dreamy Watercolor",
    audience: "Children (Ages 4-10)",
    tone: "Gentle & Curious",
    summary: "Captain Barnaby the Sea Turtle embarks on a whimsical underwater quest to find the lost coral lullaby that makes the ocean stars glow.",
    coverImage: "assets/samples/ocean_story.jpg",
    characters: [
      { name: "Captain Barnaby", role: "Gentle Navigator", description: "Elderly giant sea turtle wearing a tiny brass captain's cap and a blue sea-coat" },
      { name: "Coralie", role: "Jellyfish Guide", description: "Golden glowing bioluminescent jellyfish who hums sweet undersea melodies" }
    ],
    scenes: [
      {
        sceneNumber: 1,
        title: "The Sunken Palace of Pearls",
        narration: "Underneath the turquoise ripples of Coral Bay lay the kingdom of Aquaria, where sea anemones blossomed like flowers and golden jellyfish swam like floating lanterns. Captain Barnaby, the ocean's gentlest voyager, adjusted his brass cap as little Coralie the jellyfish floated beside him. 'Look Captain,' Coralie chimed, 'the Grand Sea Palace is missing its evening glow!'",
        visualPrompt: "Underwater fantasy kingdom with glowing corals, giant turtle with captain cap, golden jellyfish, whimsical watercolor painting",
        mood: "Peaceful & Enchanting",
        imageUrl: "assets/samples/ocean_story.jpg"
      },
      {
        sceneNumber: 2,
        title: "The Mystery of the Singing Shell",
        narration: "Gliding through forests of emerald kelp, Barnaby and Coralie followed the faint hum of a giant rainbow conch shell buried in iridescent pearl sand. When Barnaby gave the shell a gentle puff of air, bubbles shaped like dancing seahorses spiraled toward the surface, playing a soft melody that awakened sleepy starfish all along the ocean floor.",
        visualPrompt: "Giant rainbow conch shell emitting musical bubbles surrounded by playful seahorses and glowing starfish, watercolor storybook style",
        mood: "Playful & Magical",
        imageUrl: "assets/samples/ocean_story.jpg"
      },
      {
        sceneNumber: 3,
        title: "The Coral Symphony",
        narration: "Gathering hundreds of schools of rainbow fish, Coralie led the underwater choir in harmony with the conch shell's lullaby. The ancient coral towers began to absorb the musical vibration, changing from dormant gray into brilliant shades of magenta, turquoise, and shimmering gold. Every creature in the deep sea joined the celebration.",
        visualPrompt: "Underwater coral reef bursting into brilliant neon bioluminescent colors with schools of fish dancing in circles, watercolor painting",
        mood: "Celebratory & Vibrant",
        imageUrl: "assets/samples/ocean_story.jpg"
      },
      {
        sceneNumber: 4,
        title: "The Ocean of Starlight",
        narration: "By nightfall, the surface of the water mirrored the starry night sky above. Barnaby drifted peacefully on the gentle ocean swells, watching the glowing coral reef illuminate the seabed below like a city of fallen stars. 'Well done, little friend,' Barnaby whispered to Coralie as they drifted off to sleep, lullabied by the heartbeat of the deep.",
        visualPrompt: "Peaceful underwater night scene with gentle sea turtle sleeping near glowing coral castle under starry ocean surface, watercolor illustration",
        mood: "Serene & Heartwarming",
        imageUrl: "assets/samples/ocean_story.jpg"
      }
    ]
  }
];

if (typeof module !== 'undefined') {
  module.exports = { SAMPLE_STORIES };
}
