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
