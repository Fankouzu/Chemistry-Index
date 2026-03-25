export type ReactionType = '化合反应' | '分解反应' | '置换反应' | '复分解反应' | '其他';
export type Difficulty = '初级' | '中级' | '高级';

export interface Molecule {
  formula: string;
  coef: number;
}

export interface Equation {
  id: string;
  reactants: Molecule[];
  products: Molecule[];
  conditions: string;
  phenomenon: string;
  type: ReactionType;
  description: string;
  difficulty: Difficulty;
}

export const equations: Equation[] = [
  // 化合反应
  {
    id: '1',
    description: '镁在空气中燃烧',
    reactants: [{ formula: 'Mg', coef: 2 }, { formula: 'O2', coef: 1 }],
    products: [{ formula: 'MgO', coef: 2 }],
    conditions: '点燃',
    phenomenon: '发出耀眼的白光，放出热量，生成白色固体',
    type: '化合反应',
    difficulty: '初级'
  },
  {
    id: '2',
    description: '铁在氧气中燃烧',
    reactants: [{ formula: 'Fe', coef: 3 }, { formula: 'O2', coef: 2 }],
    products: [{ formula: 'Fe3O4', coef: 1 }],
    conditions: '点燃',
    phenomenon: '剧烈燃烧，火星四射，放出热量，生成黑色固体',
    type: '化合反应',
    difficulty: '中级'
  },
  {
    id: '3',
    description: '氢气中空气中燃烧',
    reactants: [{ formula: 'H2', coef: 2 }, { formula: 'O2', coef: 1 }],
    products: [{ formula: 'H2O', coef: 2 }],
    conditions: '点燃',
    phenomenon: '产生淡蓝色火焰，放出热量，烧杯内壁出现水雾',
    type: '化合反应',
    difficulty: '初级'
  },
  {
    id: '4',
    description: '红磷在空气中燃烧',
    reactants: [{ formula: 'P', coef: 4 }, { formula: 'O2', coef: 5 }],
    products: [{ formula: 'P2O5', coef: 2 }],
    conditions: '点燃',
    phenomenon: '发出白光，放出热量，产生大量白烟',
    type: '化合反应',
    difficulty: '中级'
  },
  {
    id: '5',
    description: '碳在氧气中充分燃烧',
    reactants: [{ formula: 'C', coef: 1 }, { formula: 'O2', coef: 1 }],
    products: [{ formula: 'CO2', coef: 1 }],
    conditions: '点燃',
    phenomenon: '发出白光，放出热量，生成能使澄清石灰水变浑浊的气体',
    type: '化合反应',
    difficulty: '初级'
  },
  {
    id: '6',
    description: '碳在氧气中不充分燃烧',
    reactants: [{ formula: 'C', coef: 2 }, { formula: 'O2', coef: 1 }],
    products: [{ formula: 'CO', coef: 2 }],
    conditions: '点燃',
    phenomenon: '放出热量',
    type: '化合反应',
    difficulty: '初级'
  },
  {
    id: '7',
    description: '二氧化碳通过灼热碳层',
    reactants: [{ formula: 'CO2', coef: 1 }, { formula: 'C', coef: 1 }],
    products: [{ formula: 'CO', coef: 2 }],
    conditions: '高温',
    phenomenon: '黑色固体逐渐减少',
    type: '化合反应',
    difficulty: '初级'
  },
  {
    id: '8',
    description: '一氧化碳在氧气中燃烧',
    reactants: [{ formula: 'CO', coef: 2 }, { formula: 'O2', coef: 1 }],
    products: [{ formula: 'CO2', coef: 2 }],
    conditions: '点燃',
    phenomenon: '产生蓝色火焰，放出热量，生成能使澄清石灰水变浑浊的气体',
    type: '化合反应',
    difficulty: '初级'
  },
  {
    id: '9',
    description: '二氧化碳和水反应',
    reactants: [{ formula: 'CO2', coef: 1 }, { formula: 'H2O', coef: 1 }],
    products: [{ formula: 'H2CO3', coef: 1 }],
    conditions: '',
    phenomenon: '石蕊试液由紫色变成红色',
    type: '化合反应',
    difficulty: '初级'
  },
  {
    id: '10',
    description: '生石灰和水反应（制取熟石灰）',
    reactants: [{ formula: 'CaO', coef: 1 }, { formula: 'H2O', coef: 1 }],
    products: [{ formula: 'Ca(OH)2', coef: 1 }],
    conditions: '',
    phenomenon: '放出大量的热，块状固体变成粉末',
    type: '化合反应',
    difficulty: '初级'
  },
  {
    id: '34',
    description: '铜在空气中受热',
    reactants: [{ formula: 'Cu', coef: 2 }, { formula: 'O2', coef: 1 }],
    products: [{ formula: 'CuO', coef: 2 }],
    conditions: '加热',
    phenomenon: '红色固体逐渐变成黑色',
    type: '化合反应',
    difficulty: '初级'
  },
  {
    id: '42',
    description: '工业合成氨',
    reactants: [{ formula: 'N2', coef: 1 }, { formula: 'H2', coef: 3 }],
    products: [{ formula: 'NH3', coef: 2 }],
    conditions: '高温高压, 催化剂',
    phenomenon: '无明显现象',
    type: '化合反应',
    difficulty: '高级'
  },
  {
    id: '43',
    description: '二氧化硫催化氧化',
    reactants: [{ formula: 'SO2', coef: 2 }, { formula: 'O2', coef: 1 }],
    products: [{ formula: 'SO3', coef: 2 }],
    conditions: '催化剂, 加热',
    phenomenon: '无明显现象',
    type: '化合反应',
    difficulty: '高级'
  },

  // 分解反应
  {
    id: '11',
    description: '水在直流电的作用下分解',
    reactants: [{ formula: 'H2O', coef: 2 }],
    products: [{ formula: 'H2↑', coef: 2 }, { formula: 'O2↑', coef: 1 }],
    conditions: '通电',
    phenomenon: '电极上有气泡产生，正负极气体体积比约为1:2',
    type: '分解反应',
    difficulty: '初级'
  },
  {
    id: '12',
    description: '加热高锰酸钾制氧气',
    reactants: [{ formula: 'KMnO4', coef: 2 }],
    products: [{ formula: 'K2MnO4', coef: 1 }, { formula: 'MnO2', coef: 1 }, { formula: 'O2↑', coef: 1 }],
    conditions: '加热',
    phenomenon: '紫黑色固体逐渐变少，生成能使带火星木条复燃的气体',
    type: '分解反应',
    difficulty: '中级'
  },
  {
    id: '13',
    description: '加热氯酸钾和二氧化锰制氧气',
    reactants: [{ formula: 'KClO3', coef: 2 }],
    products: [{ formula: 'KCl', coef: 2 }, { formula: 'O2↑', coef: 3 }],
    conditions: 'MnO2, 加热',
    phenomenon: '白色固体逐渐变少，生成能使带火星木条复燃的气体',
    type: '分解反应',
    difficulty: '中级'
  },
  {
    id: '14',
    description: '过氧化氢分解制氧气',
    reactants: [{ formula: 'H2O2', coef: 2 }],
    products: [{ formula: 'H2O', coef: 2 }, { formula: 'O2↑', coef: 1 }],
    conditions: 'MnO2',
    phenomenon: '产生大量气泡，生成能使带火星木条复燃的气体',
    type: '分解反应',
    difficulty: '初级'
  },
  {
    id: '15',
    description: '碳酸不稳定分解',
    reactants: [{ formula: 'H2CO3', coef: 1 }],
    products: [{ formula: 'H2O', coef: 1 }, { formula: 'CO2↑', coef: 1 }],
    conditions: '',
    phenomenon: '石蕊试液由红色变成紫色，有气泡产生',
    type: '分解反应',
    difficulty: '初级'
  },
  {
    id: '16',
    description: '高温煅烧石灰石',
    reactants: [{ formula: 'CaCO3', coef: 1 }],
    products: [{ formula: 'CaO', coef: 1 }, { formula: 'CO2↑', coef: 1 }],
    conditions: '高温',
    phenomenon: '固体逐渐减少，生成能使澄清石灰水变浑浊的气体',
    type: '分解反应',
    difficulty: '初级'
  },
  {
    id: '50',
    description: '碳酸氢钠受热分解',
    reactants: [{ formula: 'NaHCO3', coef: 2 }],
    products: [{ formula: 'Na2CO3', coef: 1 }, { formula: 'H2O', coef: 1 }, { formula: 'CO2↑', coef: 1 }],
    conditions: '加热',
    phenomenon: '生成能使澄清石灰水变浑浊的气体，试管口有水珠',
    type: '分解反应',
    difficulty: '中级'
  },

  // 置换反应
  {
    id: '17',
    description: '氢气还原氧化铜',
    reactants: [{ formula: 'H2', coef: 1 }, { formula: 'CuO', coef: 1 }],
    products: [{ formula: 'Cu', coef: 1 }, { formula: 'H2O', coef: 1 }],
    conditions: '加热',
    phenomenon: '黑色粉末逐渐变成红色，试管口有水珠生成',
    type: '置换反应',
    difficulty: '初级'
  },
  {
    id: '18',
    description: '木炭还原氧化铜',
    reactants: [{ formula: 'C', coef: 1 }, { formula: 'CuO', coef: 2 }],
    products: [{ formula: 'Cu', coef: 2 }, { formula: 'CO2↑', coef: 1 }],
    conditions: '高温',
    phenomenon: '黑色粉末逐渐变成红色，生成能使澄清石灰水变浑浊的气体',
    type: '置换反应',
    difficulty: '中级'
  },
  {
    id: '19',
    description: '锌和稀硫酸反应',
    reactants: [{ formula: 'Zn', coef: 1 }, { formula: 'H2SO4', coef: 1 }],
    products: [{ formula: 'ZnSO4', coef: 1 }, { formula: 'H2↑', coef: 1 }],
    conditions: '',
    phenomenon: '固体逐渐溶解，产生大量气泡',
    type: '置换反应',
    difficulty: '初级'
  },
  {
    id: '20',
    description: '铁和稀盐酸反应',
    reactants: [{ formula: 'Fe', coef: 1 }, { formula: 'HCl', coef: 2 }],
    products: [{ formula: 'FeCl2', coef: 1 }, { formula: 'H2↑', coef: 1 }],
    conditions: '',
    phenomenon: '固体逐渐溶解，产生气泡，溶液由无色变成浅绿色',
    type: '置换反应',
    difficulty: '中级'
  },
  {
    id: '21',
    description: '铁和硫酸铜溶液反应',
    reactants: [{ formula: 'Fe', coef: 1 }, { formula: 'CuSO4', coef: 1 }],
    products: [{ formula: 'FeSO4', coef: 1 }, { formula: 'Cu', coef: 1 }],
    conditions: '',
    phenomenon: '铁表面覆盖一层红色物质，溶液由蓝色变成浅绿色',
    type: '置换反应',
    difficulty: '初级'
  },
  {
    id: '33',
    description: '钠和水反应',
    reactants: [{ formula: 'Na', coef: 2 }, { formula: 'H2O', coef: 2 }],
    products: [{ formula: 'NaOH', coef: 2 }, { formula: 'H2↑', coef: 1 }],
    conditions: '',
    phenomenon: '钠浮在水面上，熔化成小球，四处游动，发出嘶嘶声，滴入酚酞变红',
    type: '置换反应',
    difficulty: '中级'
  },
  {
    id: '40',
    description: '镁和稀盐酸反应',
    reactants: [{ formula: 'Mg', coef: 1 }, { formula: 'HCl', coef: 2 }],
    products: [{ formula: 'MgCl2', coef: 1 }, { formula: 'H2↑', coef: 1 }],
    conditions: '',
    phenomenon: '固体迅速溶解，产生大量气泡，放出热量',
    type: '置换反应',
    difficulty: '初级'
  },
  {
    id: '41',
    description: '铜和硝酸银溶液反应',
    reactants: [{ formula: 'Cu', coef: 1 }, { formula: 'AgNO3', coef: 2 }],
    products: [{ formula: 'Cu(NO3)2', coef: 1 }, { formula: 'Ag', coef: 2 }],
    conditions: '',
    phenomenon: '铜表面覆盖一层银白色物质，溶液由无色变成蓝色',
    type: '置换反应',
    difficulty: '中级'
  },
  {
    id: '46',
    description: '铝和稀盐酸反应',
    reactants: [{ formula: 'Al', coef: 2 }, { formula: 'HCl', coef: 6 }],
    products: [{ formula: 'AlCl3', coef: 2 }, { formula: 'H2↑', coef: 3 }],
    conditions: '',
    phenomenon: '固体逐渐溶解，产生大量气泡',
    type: '置换反应',
    difficulty: '高级'
  },
  {
    id: '51',
    description: '铁和稀硫酸反应',
    reactants: [{ formula: 'Fe', coef: 1 }, { formula: 'H2SO4', coef: 1 }],
    products: [{ formula: 'FeSO4', coef: 1 }, { formula: 'H2↑', coef: 1 }],
    conditions: '',
    phenomenon: '固体逐渐溶解，产生气泡，溶液由无色变成浅绿色',
    type: '置换反应',
    difficulty: '初级'
  },

  // 复分解反应
  {
    id: '22',
    description: '盐酸和氢氧化钠反应（盐酸和火碱）',
    reactants: [{ formula: 'HCl', coef: 1 }, { formula: 'NaOH', coef: 1 }],
    products: [{ formula: 'NaCl', coef: 1 }, { formula: 'H2O', coef: 1 }],
    conditions: '',
    phenomenon: '无明显现象（需借助指示剂）',
    type: '复分解反应',
    difficulty: '初级'
  },
  {
    id: '23',
    description: '大理石与稀盐酸反应',
    reactants: [{ formula: 'CaCO3', coef: 1 }, { formula: 'HCl', coef: 2 }],
    products: [{ formula: 'CaCl2', coef: 1 }, { formula: 'H2O', coef: 1 }, { formula: 'CO2↑', coef: 1 }],
    conditions: '',
    phenomenon: '固体逐渐溶解，产生大量气泡',
    type: '复分解反应',
    difficulty: '中级'
  },
  {
    id: '24',
    description: '碳酸钠与稀盐酸反应',
    reactants: [{ formula: 'Na2CO3', coef: 1 }, { formula: 'HCl', coef: 2 }],
    products: [{ formula: 'NaCl', coef: 2 }, { formula: 'H2O', coef: 1 }, { formula: 'CO2↑', coef: 1 }],
    conditions: '',
    phenomenon: '产生大量气泡',
    type: '复分解反应',
    difficulty: '中级'
  },
  {
    id: '25',
    description: '氢氧化钙与碳酸钠反应',
    reactants: [{ formula: 'Ca(OH)2', coef: 1 }, { formula: 'Na2CO3', coef: 1 }],
    products: [{ formula: 'CaCO3↓', coef: 1 }, { formula: 'NaOH', coef: 2 }],
    conditions: '',
    phenomenon: '产生白色沉淀',
    type: '复分解反应',
    difficulty: '中级'
  },
  {
    id: '30',
    description: '氧化铁和稀盐酸反应（盐酸除铁锈）',
    reactants: [{ formula: 'Fe2O3', coef: 1 }, { formula: 'HCl', coef: 6 }],
    products: [{ formula: 'FeCl3', coef: 2 }, { formula: 'H2O', coef: 3 }],
    conditions: '',
    phenomenon: '红色固体逐渐溶解，溶液由无色变成黄色',
    type: '复分解反应',
    difficulty: '高级'
  },
  {
    id: '37',
    description: '氢氧化钠和稀硫酸反应（硫酸和氢氧化钠）',
    reactants: [{ formula: 'H2SO4', coef: 1 }, { formula: 'NaOH', coef: 2 }],
    products: [{ formula: 'Na2SO4', coef: 1 }, { formula: 'H2O', coef: 2 }],
    conditions: '',
    phenomenon: '无明显现象，放出热量',
    type: '复分解反应',
    difficulty: '初级'
  },
  {
    id: '38',
    description: '硝酸银和氯化钠反应',
    reactants: [{ formula: 'AgNO3', coef: 1 }, { formula: 'NaCl', coef: 1 }],
    products: [{ formula: 'AgCl↓', coef: 1 }, { formula: 'NaNO3', coef: 1 }],
    conditions: '',
    phenomenon: '产生不溶于稀硝酸的白色沉淀',
    type: '复分解反应',
    difficulty: '初级'
  },
  {
    id: '39',
    description: '氯化钡和稀硫酸反应',
    reactants: [{ formula: 'BaCl2', coef: 1 }, { formula: 'H2SO4', coef: 1 }],
    products: [{ formula: 'BaSO4↓', coef: 1 }, { formula: 'HCl', coef: 2 }],
    conditions: '',
    phenomenon: '产生不溶于稀硝酸的白色沉淀',
    type: '复分解反应',
    difficulty: '初级'
  },
  {
    id: '44',
    description: '氧化铜和稀硫酸反应',
    reactants: [{ formula: 'CuO', coef: 1 }, { formula: 'H2SO4', coef: 1 }],
    products: [{ formula: 'CuSO4', coef: 1 }, { formula: 'H2O', coef: 1 }],
    conditions: '',
    phenomenon: '黑色粉末逐渐溶解，溶液由无色变成蓝色',
    type: '复分解反应',
    difficulty: '初级'
  },
  {
    id: '45',
    description: '氧化铁和稀硫酸反应（稀硫酸除铁锈）',
    reactants: [{ formula: 'Fe2O3', coef: 1 }, { formula: 'H2SO4', coef: 3 }],
    products: [{ formula: 'Fe2(SO4)3', coef: 1 }, { formula: 'H2O', coef: 3 }],
    conditions: '',
    phenomenon: '红色粉末逐渐溶解，溶液由无色变成黄色',
    type: '复分解反应',
    difficulty: '中级'
  },
  {
    id: '47',
    description: '氢氧化钠和硫酸铜反应',
    reactants: [{ formula: 'NaOH', coef: 2 }, { formula: 'CuSO4', coef: 1 }],
    products: [{ formula: 'Cu(OH)2↓', coef: 1 }, { formula: 'Na2SO4', coef: 1 }],
    conditions: '',
    phenomenon: '产生蓝色絮状沉淀',
    type: '复分解反应',
    difficulty: '中级'
  },
  {
    id: '48',
    description: '氢氧化钠和氯化铁反应',
    reactants: [{ formula: 'NaOH', coef: 3 }, { formula: 'FeCl3', coef: 1 }],
    products: [{ formula: 'Fe(OH)3↓', coef: 1 }, { formula: 'NaCl', coef: 3 }],
    conditions: '',
    phenomenon: '产生红褐色沉淀',
    type: '复分解反应',
    difficulty: '中级'
  },
  {
    id: '49',
    description: '硝酸铵和氢氧化钠反应',
    reactants: [{ formula: 'NH4NO3', coef: 1 }, { formula: 'NaOH', coef: 1 }],
    products: [{ formula: 'NaNO3', coef: 1 }, { formula: 'NH3↑', coef: 1 }, { formula: 'H2O', coef: 1 }],
    conditions: '加热',
    phenomenon: '产生有刺激性气味的气体，能使湿润的红色石蕊试纸变蓝',
    type: '复分解反应',
    difficulty: '高级'
  },
  {
    id: '53',
    description: '氧化铜和稀盐酸反应',
    reactants: [{ formula: 'CuO', coef: 1 }, { formula: 'HCl', coef: 2 }],
    products: [{ formula: 'CuCl2', coef: 1 }, { formula: 'H2O', coef: 1 }],
    conditions: '',
    phenomenon: '黑色粉末逐渐溶解，溶液由无色变成蓝色',
    type: '复分解反应',
    difficulty: '初级'
  },
  {
    id: '54',
    description: '烧碱和三氧化硫反应',
    reactants: [{ formula: 'NaOH', coef: 2 }, { formula: 'SO3', coef: 1 }],
    products: [{ formula: 'Na2SO4', coef: 1 }, { formula: 'H2O', coef: 1 }],
    conditions: '',
    phenomenon: '无明显现象',
    type: '其他',
    difficulty: '中级'
  },
  {
    id: '55',
    description: '盐酸和氢氧化钙反应（盐酸和消石灰）',
    reactants: [{ formula: 'HCl', coef: 2 }, { formula: 'Ca(OH)2', coef: 1 }],
    products: [{ formula: 'CaCl2', coef: 1 }, { formula: 'H2O', coef: 2 }],
    conditions: '',
    phenomenon: '无明显现象（需借助指示剂），放出热量',
    type: '复分解反应',
    difficulty: '初级'
  },
  {
    id: '56',
    description: '熟石灰中和硫酸厂废水（氢氧化钙和稀硫酸）',
    reactants: [{ formula: 'Ca(OH)2', coef: 1 }, { formula: 'H2SO4', coef: 1 }],
    products: [{ formula: 'CaSO4', coef: 1 }, { formula: 'H2O', coef: 2 }],
    conditions: '',
    phenomenon: '无明显现象（需借助指示剂），放出热量',
    type: '复分解反应',
    difficulty: '初级'
  },
  {
    id: '57',
    description: '氢氧化镁药物治疗胃酸过多',
    reactants: [{ formula: 'Mg(OH)2', coef: 1 }, { formula: 'HCl', coef: 2 }],
    products: [{ formula: 'MgCl2', coef: 1 }, { formula: 'H2O', coef: 2 }],
    conditions: '',
    phenomenon: '固体逐渐溶解',
    type: '复分解反应',
    difficulty: '初级'
  },
  {
    id: '58',
    description: '氢氧化铝药物治疗胃酸过多',
    reactants: [{ formula: 'Al(OH)3', coef: 1 }, { formula: 'HCl', coef: 3 }],
    products: [{ formula: 'AlCl3', coef: 1 }, { formula: 'H2O', coef: 3 }],
    conditions: '',
    phenomenon: '固体逐渐溶解',
    type: '复分解反应',
    difficulty: '初级'
  },

  // 其他/高级配平
  {
    id: '26',
    description: '一氧化碳还原氧化铁',
    reactants: [{ formula: 'CO', coef: 3 }, { formula: 'Fe2O3', coef: 1 }],
    products: [{ formula: 'Fe', coef: 2 }, { formula: 'CO2', coef: 3 }],
    conditions: '高温',
    phenomenon: '红色粉末逐渐变成黑色，生成能使澄清石灰水变浑浊的气体',
    type: '其他',
    difficulty: '高级'
  },
  {
    id: '27',
    description: '二氧化碳使澄清石灰水变浑浊（石灰水在空气中变质）',
    reactants: [{ formula: 'CO2', coef: 1 }, { formula: 'Ca(OH)2', coef: 1 }],
    products: [{ formula: 'CaCO3↓', coef: 1 }, { formula: 'H2O', coef: 1 }],
    conditions: '',
    phenomenon: '澄清石灰水变浑浊',
    type: '其他',
    difficulty: '初级'
  },
  {
    id: '28',
    description: '甲烷燃烧',
    reactants: [{ formula: 'CH4', coef: 1 }, { formula: 'O2', coef: 2 }],
    products: [{ formula: 'CO2', coef: 1 }, { formula: 'H2O', coef: 2 }],
    conditions: '点燃',
    phenomenon: '产生明亮的蓝色火焰，放出热量',
    type: '其他',
    difficulty: '中级'
  },
  {
    id: '29',
    description: '乙醇燃烧',
    reactants: [{ formula: 'C2H5OH', coef: 1 }, { formula: 'O2', coef: 3 }],
    products: [{ formula: 'CO2', coef: 2 }, { formula: 'H2O', coef: 3 }],
    conditions: '点燃',
    phenomenon: '产生淡蓝色火焰，放出热量',
    type: '其他',
    difficulty: '高级'
  },
  {
    id: '31',
    description: '铝在氧气中燃烧',
    reactants: [{ formula: 'Al', coef: 4 }, { formula: 'O2', coef: 3 }],
    products: [{ formula: 'Al2O3', coef: 2 }],
    conditions: '点燃',
    phenomenon: '发出耀眼的白光，放出热量',
    type: '化合反应',
    difficulty: '高级'
  },
  {
    id: '32',
    description: '氨气催化氧化',
    reactants: [{ formula: 'NH3', coef: 4 }, { formula: 'O2', coef: 5 }],
    products: [{ formula: 'NO', coef: 4 }, { formula: 'H2O', coef: 6 }],
    conditions: '催化剂, 加热',
    phenomenon: '无色气体生成',
    type: '其他',
    difficulty: '高级'
  },
  {
    id: '35',
    description: '氢氧化钠吸收二氧化碳（氢氧化钠在空气中变质）',
    reactants: [{ formula: 'NaOH', coef: 2 }, { formula: 'CO2', coef: 1 }],
    products: [{ formula: 'Na2CO3', coef: 1 }, { formula: 'H2O', coef: 1 }],
    conditions: '',
    phenomenon: '无明显现象',
    type: '其他',
    difficulty: '中级'
  },
  {
    id: '36',
    description: '苛性钠溶液吸收二氧化硫（氢氧化钠吸收二氧化硫）',
    reactants: [{ formula: 'NaOH', coef: 2 }, { formula: 'SO2', coef: 1 }],
    products: [{ formula: 'Na2SO3', coef: 1 }, { formula: 'H2O', coef: 1 }],
    conditions: '',
    phenomenon: '无明显现象',
    type: '其他',
    difficulty: '中级'
  },
  {
    id: '52',
    description: '氯气和水反应',
    reactants: [{ formula: 'Cl2', coef: 1 }, { formula: 'H2O', coef: 1 }],
    products: [{ formula: 'HCl', coef: 1 }, { formula: 'HClO', coef: 1 }],
    conditions: '',
    phenomenon: '氯气溶于水，溶液呈浅黄绿色',
    type: '其他',
    difficulty: '中级'
  }
];
