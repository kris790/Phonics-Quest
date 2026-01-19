
/**
 * Generates a Smart ID following the Player-Type-Timestamp-Random pattern.
 */
export const generateSmartId = (type: string, playerName: string = "Caelum"): string => {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 10000);
  // Sanitize name for ID safety
  const safeName = playerName.replace(/[^a-z0-9]/gi, '').toLowerCase();
  const safeType = type.replace(/[^a-z0-9]/gi, '').toLowerCase();
  
  return `${safeName}-${safeType}-${timestamp}-${randomSuffix}`;
};
