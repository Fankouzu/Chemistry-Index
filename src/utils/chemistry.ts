export const parseFormula = (formula: string): Record<string, number> => {
  const counts: Record<string, number> = {};
  // 移除气体和沉淀符号
  let f = formula.replace(/[↑↓]/g, '');
  
  // 处理括号，例如 Ca(OH)2 -> CaO2H2
  f = f.replace(/\(([^)]+)\)(\d+)/g, (_, inside, multiplier) => {
    const mult = parseInt(multiplier, 10);
    return inside.replace(/([A-Z][a-z]?)(\d*)/g, (m: string, elem: string, count: string) => {
      const c = count ? parseInt(count, 10) : 1;
      return `${elem}${c * mult}`;
    });
  });

  // 统计平铺后的化学式中的原子
  const regex = /([A-Z][a-z]?)(\d*)/g;
  let match;
  while ((match = regex.exec(f)) !== null) {
    const elem = match[1];
    const count = match[2] ? parseInt(match[2], 10) : 1;
    counts[elem] = (counts[elem] || 0) + count;
  }
  return counts;
};

export const countTotalAtoms = (molecules: {formula: string}[], currentCoefs: number[]) => {
  const total: Record<string, number> = {};
  molecules.forEach((mol, i) => {
    const coef = currentCoefs[i];
    const atoms = parseFormula(mol.formula);
    Object.entries(atoms).forEach(([elem, count]) => {
      total[elem] = (total[elem] || 0) + count * coef;
    });
  });
  return total;
};

export const getGcd = (a: number, b: number): number => {
  return b === 0 ? a : getGcd(b, a % b);
};

export const getArrayGcd = (arr: number[]): number => {
  if (arr.length === 0) return 1;
  return arr.reduce((acc, val) => getGcd(acc, val), arr[0]);
};

/** Pick a single emoji hint from Chinese phenomenon text for UI labels. */
export const getPhenomenonEmoji = (phenomenon: string): string => {
  const t = phenomenon;
  if (/无明显现象/.test(t)) return '🔍';
  if (/电极|正负极/.test(t)) return '⚡';
  if (/带火星木条复燃|木条复燃/.test(t)) return '✨';
  if (/燃烧|火星|火焰|耀眼|剧烈/.test(t)) return '🔥';
  if (/发出白光/.test(t)) return '🔥';
  if (/水雾|水珠/.test(t)) return '💧';
  if (/白烟/.test(t)) return '💨';
  if (/石灰水变浑浊|变浑浊/.test(t)) return '🌫️';
  if (/红褐色沉淀/.test(t)) return '🟤';
  if (/蓝色絮状|蓝色沉淀/.test(t)) return '🔵';
  if (/白色沉淀|不溶于稀硝酸/.test(t)) return '⚪';
  if (/沉淀/.test(t)) return '🧪';
  if (/气泡/.test(t)) return '🫧';
  if (/石蕊|酚酞|试纸/.test(t)) return '🧪';
  if (/氯气|黄绿色|浅黄绿色/.test(t)) return '🟢';
  if (/刺激性气味/.test(t)) return '👃';
  if (/钠浮|四处游动|嘶嘶/.test(t)) return '💥';
  if (/溶解/.test(t)) return '🫗';
  if (/覆盖一层|银白色物质/.test(t)) return '✨';
  if (/固体逐渐|粉末逐渐|逐渐减少|逐渐变成|逐渐变少/.test(t)) return '⚗️';
  if (/热量|放热|大量的热|熔化/.test(t)) return '♨️';
  if (/无色气体/.test(t)) return '💨';
  return '🔬';
};
