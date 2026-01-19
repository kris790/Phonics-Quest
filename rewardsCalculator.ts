
import { BattleState, BattleRewards, LootItem, RootState } from './types';
import { generateSmartId } from './utils/rewardUtils';

const GUARDIAN_LOOT_TABLES: Record<string, LootItem[]> = {
  'mumbler': [
    { id: 'whisper-dust', name: 'Whisper Dust', type: 'material', rarity: 'common', icon: '✨', description: 'Sparkling dust from the Mumbler\'s whispers' },
    { id: 'focus-potion', name: 'Focus Potion', type: 'consumable', rarity: 'rare', icon: '🧪', description: 'Restores 25 Focus in battle' },
    { id: 'mumbling-scroll', name: 'Mumbling Scroll', type: 'equipment', rarity: 'epic', icon: '📜', description: 'Reduces damage taken by 10%' },
  ],
  'default': [
    { id: 'phonics-shard', name: 'Phonics Shard', type: 'material', rarity: 'common', icon: '💎', description: 'A fragment of phonetic energy' },
    { id: 'healing-potion', name: 'Healing Potion', type: 'consumable', rarity: 'common', icon: '❤️', description: 'Restores 30 HP' },
  ]
};

export const calculateBattleRewards = (state: BattleState, unlockedNPCs: string[] = []): BattleRewards => {
  const baseXP = state.guardianMaxHealth / 2;
  const streakBonus = state.maxComboStreak * 10;
  const perfectBonus = state.perfectRounds === state.maxRounds;
  const perfectBonusAmount = perfectBonus ? 50 : 0;
  
  // Calculate crystals
  const crystals = Math.floor((state.totalDamageDealt / 20) + (state.criticalHits * 5));

  // Determine loot drops
  const lootDrops: LootItem[] = [];
  const guardianKey = state.guardian.id.toLowerCase();
  const guardianLoot = GUARDIAN_LOOT_TABLES[guardianKey] || GUARDIAN_LOOT_TABLES.default;
  lootDrops.push(guardianLoot[0]);
  if (state.maxComboStreak >= 5) {
    const rareItem = guardianLoot.find(item => item.rarity === 'rare');
    if (rareItem) lootDrops.push({ ...rareItem });
  }
  if (perfectBonus) {
    const epicItem = guardianLoot.find(item => item.rarity === 'epic');
    if (epicItem) lootDrops.push({ ...epicItem });
  }

  let finalXP = Math.floor(baseXP + streakBonus + perfectBonusAmount);
  
  // Eldrin NPC Bonus (+10% XP)
  if (unlockedNPCs.includes('eldrin')) {
    finalXP = Math.floor(finalXP * 1.1);
  }

  // Corrected: Return must match BattleRewards interface with id and timestamp.
  return {
    id: generateSmartId('battle-reward'),
    xp: finalXP,
    crystals,
    perfectBonus,
    streakBonus,
    loot: lootDrops,
    timestamp: Date.now()
  };
};
