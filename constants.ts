
export const INITIAL_HP = 100;
export const DAMAGE_PER_HIT = 20;
export const STREAK_BONUS_THRESHOLD = 3;

export const HERO_LORE = {
  name: "Caelum",
  title: "The Word Weaver",
  backstory: "Born in the echoing valleys of the Vowel Vortex before the shadow fell, Caelum was the youngest apprentice at the Great Academy of Echoes. When the Silent King issued his tragic decree, the world’s music vanished. Caelum escaped with the Lumina Quill—a legendary artifact that can stitch broken letters back into powerful spells. Driven by the hope of hearing their parents' voices once more, Caelum journeys to the heart of the shadow to rewrite the Kingdom's fate.",
  origin: "Vowel Valley",
  motivation: "To restore the Grand Harmony and free the trapped voices of the Royal Keep."
};

export const CHAPTERS = [
  {
    id: 'ch1',
    name: 'Consonant Cove',
    isUnlocked: true,
    isCompleted: false,
    background: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgUuGIqRApdeiRdPh5ycGoS7lvOg16yMXywpKNpK0b_eBF5ILB_Z28wH29gtjVSi6XVzAGa2kwifYN89d_30lGLNWL4FZ-7mPIeWfAANgIXYS5PEPJEXz2xsR_HOYRoYhFobe80m6QfPLuwidLqKJkGzgOODdCPPzmo8AF_pSEWFm8yUEdOlxuFPCaQoKIVthXgi3O4GHGYOFhsV3MPeKou7YWg3obeIU_yQVic7haMPelNbgUmbOtUKF_a2BwMxpuQ0CPPuYImA',
    guardian: {
      id: 'g1',
      name: 'The Mumbler',
      title: 'Voice of Fog',
      island: 'Consonant Cove',
      description: 'A fuzzy creature that scrambles sounds into nonsense.',
      baseHealth: 100,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKxVGCVcC2qbSqUopQLgfG1arggAJXfVOyQ5e3QTKwGtLK9V3IU0mmJp2bGgfS10ZgJ8lpZXXx-L6G8Ivv_SRUOxW0deIitchydlHjBJ1Wzr6s80GkuDQ4ZxSW8tgKoeVOkciNLQQtB4okkl3L3Csl0Wd4grWwYxG8QirCL3_MsXpu_Upy3cKLrkYSrn9uHQHeI2B2pPBF_ndFWIOmxpI5RdRIPeOMaXiIBfPQEkMn6aSX8zRSjfXGU5hotXx3zDK3omSTyU-CMw',
      weakness: 'Clear Sounds',
      accentColor: '#8b5cf6'
    }
  },
  {
    id: 'ch2',
    name: 'Vowel Valley',
    isUnlocked: false,
    isCompleted: false,
    background: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1200',
    guardian: {
      id: 'g2',
      name: 'Vowel Vortex',
      title: 'The Sound Storm',
      island: 'Vowel Valley',
      description: 'A chaotic spirit that sucks the melody out of words.',
      baseHealth: 150,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
      weakness: 'Vowel Mastery',
      accentColor: '#f59e0b'
    }
  },
  {
    id: 'ch3',
    name: 'Blend Beach',
    isUnlocked: false,
    isCompleted: false,
    background: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    guardian: {
      id: 'g3',
      name: 'Blend Beast',
      title: 'Tide of Chaos',
      island: 'Blend Beach',
      description: 'An aggressive monster that shatters blends into single sounds.',
      baseHealth: 200,
      image: 'https://images.unsplash.com/photo-1541411191162-9940027ca2c5?auto=format&fit=crop&q=80&w=400',
      weakness: 'Consonant Blends',
      accentColor: '#10b981'
    }
  },
  {
    id: 'ch4',
    name: 'Digraph Den',
    isUnlocked: false,
    isCompleted: false,
    background: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
    guardian: {
      id: 'g4',
      name: 'Digraph Dragon',
      title: 'Pair Hoarder',
      island: 'Digraph Den',
      description: 'A greedy dragon that splits powerful letter pairs apart.',
      baseHealth: 250,
      image: 'https://images.unsplash.com/photo-1614726365922-0d1279a37e1a?auto=format&fit=crop&q=80&w=400',
      weakness: 'Letter Pairs',
      accentColor: '#0ddff2'
    }
  },
  {
    id: 'ch5',
    name: 'Royal Keep',
    isUnlocked: false,
    isCompleted: false,
    background: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80&w=1200',
    guardian: {
      id: 'g5',
      name: 'The Silent King',
      title: 'Ruler of Stillness',
      island: 'Royal Keep',
      description: 'A majestic king whose tragic decree stole the voices of all.',
      baseHealth: 400,
      image: 'https://images.unsplash.com/photo-1560932763-0ad9eaeb5131?auto=format&fit=crop&q=80&w=400',
      weakness: 'All Skills',
      accentColor: '#ef4444'
    }
  }
];

export const FALLBACK_QUESTIONS = [
  {
    word: 'ship',
    displayWord: '__ip',
    correctDigraph: 'sh',
    options: ['sh', 'ch', 'th', 'wh'],
    meaning: 'A large boat that sails on the ocean.'
  },
  {
    word: 'chair',
    displayWord: '__air',
    correctDigraph: 'ch',
    options: ['ch', 'sh', 'ph', 'th'],
    meaning: 'Something you sit on.'
  }
];

export const ASSETS = {
  hero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9er1ezLiN7AMHCG2n5LTwKzCEuARlIokPRmCb8umsI-IOXdFby8dVtsB_bLeZLLYw1EEvAy9qMazBbklz-loK-ytSjkwkvuttmsjqYP9VRgZkN0omXAJzUpmwlHznBdzVkCZsQ0UZD68HmTUeyZjjvEqEXnzIO6YT4c4Tc0T4HoGC4SQFs_Cc1umRRvBOrM1PVXIof_rjL2P4KkK_QHj42qR-7_orK-8KIqtoDeL4eeEz7oR_CbWc1FF2Qv9Z_4EIDd9CoVohMg'
};
