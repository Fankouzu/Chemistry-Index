import React, { useState, useEffect, useMemo } from 'react';
import { equations, ReactionType, Equation } from '../data/equations';
import { EquationDisplay } from './EquationDisplay';
import { Search, Filter, Info, Heart, FlaskConical, X } from 'lucide-react';
import { motion } from 'motion/react';
import { parseFormula } from '../utils/chemistry';

const REACTION_TYPES: ReactionType[] = ['化合反应', '分解反应', '置换反应', '复分解反应', '其他'];

const CATEGORY_STYLES = {
  'reactive-nonmetal': {
    colorClass: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/50',
    activeClass: 'bg-yellow-500 text-white border-yellow-600 shadow-sm',
    disabledClass: 'bg-yellow-50/40 dark:bg-yellow-900/20 text-yellow-700/40 dark:text-yellow-400/40 border-yellow-200/40 dark:border-yellow-800/40 hover:bg-yellow-50/60 dark:hover:bg-yellow-900/30',
  },
  'alkali-metal': {
    colorClass: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50',
    activeClass: 'bg-red-500 text-white border-red-600 shadow-sm',
    disabledClass: 'bg-red-50/40 dark:bg-red-900/20 text-red-700/40 dark:text-red-400/40 border-red-200/40 dark:border-red-800/40 hover:bg-red-50/60 dark:hover:bg-red-900/30',
  },
  'alkaline-earth-metal': {
    colorClass: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/50',
    activeClass: 'bg-orange-500 text-white border-orange-600 shadow-sm',
    disabledClass: 'bg-orange-50/40 dark:bg-orange-900/20 text-orange-700/40 dark:text-orange-400/40 border-orange-200/40 dark:border-orange-800/40 hover:bg-orange-50/60 dark:hover:bg-orange-900/30',
  },
  'transition-metal': {
    colorClass: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50',
    activeClass: 'bg-blue-500 text-white border-blue-600 shadow-sm',
    disabledClass: 'bg-blue-50/40 dark:bg-blue-900/20 text-blue-700/40 dark:text-blue-400/40 border-blue-200/40 dark:border-blue-800/40 hover:bg-blue-50/60 dark:hover:bg-blue-900/30',
  },
  'post-transition-metal': {
    colorClass: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/50',
    activeClass: 'bg-cyan-500 text-white border-cyan-600 shadow-sm',
    disabledClass: 'bg-cyan-50/40 dark:bg-cyan-900/20 text-cyan-700/40 dark:text-cyan-400/40 border-cyan-200/40 dark:border-cyan-800/40 hover:bg-cyan-50/60 dark:hover:bg-cyan-900/30',
  },
  'metalloid': {
    colorClass: 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/50',
    activeClass: 'bg-teal-500 text-white border-teal-600 shadow-sm',
    disabledClass: 'bg-teal-50/40 dark:bg-teal-900/20 text-teal-700/40 dark:text-teal-400/40 border-teal-200/40 dark:border-teal-800/40 hover:bg-teal-50/60 dark:hover:bg-teal-900/30',
  },
  'halogen': {
    colorClass: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50',
    activeClass: 'bg-purple-500 text-white border-purple-600 shadow-sm',
    disabledClass: 'bg-purple-50/40 dark:bg-purple-900/20 text-purple-700/40 dark:text-purple-400/40 border-purple-200/40 dark:border-purple-800/40 hover:bg-purple-50/60 dark:hover:bg-purple-900/30',
  },
  'noble-gas': {
    colorClass: 'bg-slate-50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/50',
    activeClass: 'bg-slate-500 text-white border-slate-600 shadow-sm',
    disabledClass: 'bg-slate-50/40 dark:bg-slate-900/20 text-slate-700/40 dark:text-slate-400/40 border-slate-200/40 dark:border-slate-800/40 hover:bg-slate-50/60 dark:hover:bg-slate-900/30',
  },
};

const ELEMENT_INFO: Record<
  string,
  { name: string; category: keyof typeof CATEGORY_STYLES; atomicNumber: number }
> = {
  // Period 1
  H: { name: '氢', category: 'reactive-nonmetal', atomicNumber: 1 },
  He: { name: '氦', category: 'noble-gas', atomicNumber: 2 },
  // Period 2
  Li: { name: '锂', category: 'alkali-metal', atomicNumber: 3 },
  Be: { name: '铍', category: 'alkaline-earth-metal', atomicNumber: 4 },
  B: { name: '硼', category: 'metalloid', atomicNumber: 5 },
  C: { name: '碳', category: 'reactive-nonmetal', atomicNumber: 6 },
  N: { name: '氮', category: 'reactive-nonmetal', atomicNumber: 7 },
  O: { name: '氧', category: 'reactive-nonmetal', atomicNumber: 8 },
  F: { name: '氟', category: 'halogen', atomicNumber: 9 },
  Ne: { name: '氖', category: 'noble-gas', atomicNumber: 10 },
  // Period 3
  Na: { name: '钠', category: 'alkali-metal', atomicNumber: 11 },
  Mg: { name: '镁', category: 'alkaline-earth-metal', atomicNumber: 12 },
  Al: { name: '铝', category: 'post-transition-metal', atomicNumber: 13 },
  Si: { name: '硅', category: 'metalloid', atomicNumber: 14 },
  P: { name: '磷', category: 'reactive-nonmetal', atomicNumber: 15 },
  S: { name: '硫', category: 'reactive-nonmetal', atomicNumber: 16 },
  Cl: { name: '氯', category: 'halogen', atomicNumber: 17 },
  Ar: { name: '氩', category: 'noble-gas', atomicNumber: 18 },
  // Period 4
  K: { name: '钾', category: 'alkali-metal', atomicNumber: 19 },
  Ca: { name: '钙', category: 'alkaline-earth-metal', atomicNumber: 20 },
  Sc: { name: '钪', category: 'transition-metal', atomicNumber: 21 },
  Ti: { name: '钛', category: 'transition-metal', atomicNumber: 22 },
  V: { name: '钒', category: 'transition-metal', atomicNumber: 23 },
  Cr: { name: '铬', category: 'transition-metal', atomicNumber: 24 },
  Mn: { name: '锰', category: 'transition-metal', atomicNumber: 25 },
  Fe: { name: '铁', category: 'transition-metal', atomicNumber: 26 },
  Co: { name: '钴', category: 'transition-metal', atomicNumber: 27 },
  Ni: { name: '镍', category: 'transition-metal', atomicNumber: 28 },
  Cu: { name: '铜', category: 'transition-metal', atomicNumber: 29 },
  Zn: { name: '锌', category: 'transition-metal', atomicNumber: 30 },
  Ga: { name: '镓', category: 'post-transition-metal', atomicNumber: 31 },
  Ge: { name: '锗', category: 'metalloid', atomicNumber: 32 },
  As: { name: '砷', category: 'metalloid', atomicNumber: 33 },
  Se: { name: '硒', category: 'reactive-nonmetal', atomicNumber: 34 },
  Br: { name: '溴', category: 'halogen', atomicNumber: 35 },
  Kr: { name: '氪', category: 'noble-gas', atomicNumber: 36 },
  // Period 5
  Rb: { name: '铷', category: 'alkali-metal', atomicNumber: 37 },
  Sr: { name: '锶', category: 'alkaline-earth-metal', atomicNumber: 38 },
  Y: { name: '钇', category: 'transition-metal', atomicNumber: 39 },
  Zr: { name: '锆', category: 'transition-metal', atomicNumber: 40 },
  Nb: { name: '铌', category: 'transition-metal', atomicNumber: 41 },
  Mo: { name: '钼', category: 'transition-metal', atomicNumber: 42 },
  Tc: { name: '锝', category: 'transition-metal', atomicNumber: 43 },
  Ru: { name: '钌', category: 'transition-metal', atomicNumber: 44 },
  Rh: { name: '铑', category: 'transition-metal', atomicNumber: 45 },
  Pd: { name: '钯', category: 'transition-metal', atomicNumber: 46 },
  Ag: { name: '银', category: 'transition-metal', atomicNumber: 47 },
  Cd: { name: '镉', category: 'transition-metal', atomicNumber: 48 },
  In: { name: '铟', category: 'post-transition-metal', atomicNumber: 49 },
  Sn: { name: '锡', category: 'post-transition-metal', atomicNumber: 50 },
  Sb: { name: '锑', category: 'metalloid', atomicNumber: 51 },
  Te: { name: '碲', category: 'metalloid', atomicNumber: 52 },
  I: { name: '碘', category: 'halogen', atomicNumber: 53 },
  Xe: { name: '氙', category: 'noble-gas', atomicNumber: 54 },
  // Period 6
  Cs: { name: '铯', category: 'alkali-metal', atomicNumber: 55 },
  Ba: { name: '钡', category: 'alkaline-earth-metal', atomicNumber: 56 },
  La: { name: '镧', category: 'transition-metal', atomicNumber: 57 },
  Hf: { name: '铪', category: 'transition-metal', atomicNumber: 72 },
  Ta: { name: '钽', category: 'transition-metal', atomicNumber: 73 },
  W: { name: '钨', category: 'transition-metal', atomicNumber: 74 },
  Re: { name: '铼', category: 'transition-metal', atomicNumber: 75 },
  Os: { name: '锇', category: 'transition-metal', atomicNumber: 76 },
  Ir: { name: '铱', category: 'transition-metal', atomicNumber: 77 },
  Pt: { name: '铂', category: 'transition-metal', atomicNumber: 78 },
  Au: { name: '金', category: 'transition-metal', atomicNumber: 79 },
  Hg: { name: '汞', category: 'transition-metal', atomicNumber: 80 },
  Tl: { name: '铊', category: 'post-transition-metal', atomicNumber: 81 },
  Pb: { name: '铅', category: 'post-transition-metal', atomicNumber: 82 },
  Bi: { name: '铋', category: 'post-transition-metal', atomicNumber: 83 },
  Po: { name: '钋', category: 'post-transition-metal', atomicNumber: 84 },
  At: { name: '砹', category: 'halogen', atomicNumber: 85 },
  Rn: { name: '氡', category: 'noble-gas', atomicNumber: 86 },
  // Period 7
  Fr: { name: '钫', category: 'alkali-metal', atomicNumber: 87 },
  Ra: { name: '镭', category: 'alkaline-earth-metal', atomicNumber: 88 },
  Ac: { name: '锕', category: 'transition-metal', atomicNumber: 89 },
  Rf: { name: '𬬻', category: 'transition-metal', atomicNumber: 104 },
  Db: { name: '𬭊', category: 'transition-metal', atomicNumber: 105 },
  Sg: { name: '𬭳', category: 'transition-metal', atomicNumber: 106 },
  Bh: { name: '𬭛', category: 'transition-metal', atomicNumber: 107 },
  Hs: { name: '𬭶', category: 'transition-metal', atomicNumber: 108 },
  Mt: { name: '鿏', category: 'transition-metal', atomicNumber: 109 },
  Ds: { name: '𫟼', category: 'transition-metal', atomicNumber: 110 },
  Rg: { name: '𬬭', category: 'transition-metal', atomicNumber: 111 },
  Cn: { name: '鎶', category: 'transition-metal', atomicNumber: 112 },
  Nh: { name: '鿭', category: 'post-transition-metal', atomicNumber: 113 },
  Fl: { name: '𫓧', category: 'post-transition-metal', atomicNumber: 114 },
  Mc: { name: '镆', category: 'post-transition-metal', atomicNumber: 115 },
  Lv: { name: '𫟷', category: 'post-transition-metal', atomicNumber: 116 },
  Ts: { name: '鿬', category: 'halogen', atomicNumber: 117 },
  Og: { name: '鿫', category: 'noble-gas', atomicNumber: 118 },
};

const PERIODIC_TABLE_POSITIONS: Record<string, { col: number, row: number }> = {
  // Period 1
  H: { col: 1, row: 1 },
  He: { col: 18, row: 1 },
  // Period 2
  Li: { col: 1, row: 2 },
  Be: { col: 2, row: 2 },
  B: { col: 13, row: 2 },
  C: { col: 14, row: 2 },
  N: { col: 15, row: 2 },
  O: { col: 16, row: 2 },
  F: { col: 17, row: 2 },
  Ne: { col: 18, row: 2 },
  // Period 3
  Na: { col: 1, row: 3 },
  Mg: { col: 2, row: 3 },
  Al: { col: 13, row: 3 },
  Si: { col: 14, row: 3 },
  P: { col: 15, row: 3 },
  S: { col: 16, row: 3 },
  Cl: { col: 17, row: 3 },
  Ar: { col: 18, row: 3 },
  // Period 4
  K: { col: 1, row: 4 },
  Ca: { col: 2, row: 4 },
  Sc: { col: 3, row: 4 },
  Ti: { col: 4, row: 4 },
  V: { col: 5, row: 4 },
  Cr: { col: 6, row: 4 },
  Mn: { col: 7, row: 4 },
  Fe: { col: 8, row: 4 },
  Co: { col: 9, row: 4 },
  Ni: { col: 10, row: 4 },
  Cu: { col: 11, row: 4 },
  Zn: { col: 12, row: 4 },
  Ga: { col: 13, row: 4 },
  Ge: { col: 14, row: 4 },
  As: { col: 15, row: 4 },
  Se: { col: 16, row: 4 },
  Br: { col: 17, row: 4 },
  Kr: { col: 18, row: 4 },
  // Period 5
  Rb: { col: 1, row: 5 },
  Sr: { col: 2, row: 5 },
  Y: { col: 3, row: 5 },
  Zr: { col: 4, row: 5 },
  Nb: { col: 5, row: 5 },
  Mo: { col: 6, row: 5 },
  Tc: { col: 7, row: 5 },
  Ru: { col: 8, row: 5 },
  Rh: { col: 9, row: 5 },
  Pd: { col: 10, row: 5 },
  Ag: { col: 11, row: 5 },
  Cd: { col: 12, row: 5 },
  In: { col: 13, row: 5 },
  Sn: { col: 14, row: 5 },
  Sb: { col: 15, row: 5 },
  Te: { col: 16, row: 5 },
  I: { col: 17, row: 5 },
  Xe: { col: 18, row: 5 },
  // Period 6
  Cs: { col: 1, row: 6 },
  Ba: { col: 2, row: 6 },
  La: { col: 3, row: 6 },
  Hf: { col: 4, row: 6 },
  Ta: { col: 5, row: 6 },
  W: { col: 6, row: 6 },
  Re: { col: 7, row: 6 },
  Os: { col: 8, row: 6 },
  Ir: { col: 9, row: 6 },
  Pt: { col: 10, row: 6 },
  Au: { col: 11, row: 6 },
  Hg: { col: 12, row: 6 },
  Tl: { col: 13, row: 6 },
  Pb: { col: 14, row: 6 },
  Bi: { col: 15, row: 6 },
  Po: { col: 16, row: 6 },
  At: { col: 17, row: 6 },
  Rn: { col: 18, row: 6 },
  // Period 7
  Fr: { col: 1, row: 7 },
  Ra: { col: 2, row: 7 },
  Ac: { col: 3, row: 7 },
  Rf: { col: 4, row: 7 },
  Db: { col: 5, row: 7 },
  Sg: { col: 6, row: 7 },
  Bh: { col: 7, row: 7 },
  Hs: { col: 8, row: 7 },
  Mt: { col: 9, row: 7 },
  Ds: { col: 10, row: 7 },
  Rg: { col: 11, row: 7 },
  Cn: { col: 12, row: 7 },
  Nh: { col: 13, row: 7 },
  Fl: { col: 14, row: 7 },
  Mc: { col: 15, row: 7 },
  Lv: { col: 16, row: 7 },
  Ts: { col: 17, row: 7 },
  Og: { col: 18, row: 7 },
};

// 提取方程式中包含的所有元素
const getEquationElements = (eq: Equation): string[] => {
  const elements = new Set<string>();
  [...eq.reactants, ...eq.products].forEach(mol => {
    Object.keys(parseFormula(mol.formula)).forEach(elem => elements.add(elem));
  });
  return Array.from(elements);
};

// 获取所有方程式中出现过的所有元素并排序
const ALL_ELEMENTS = Array.from(
  new Set(equations.flatMap(getEquationElements))
).sort();

export const LearningMode: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ReactionType | '全部'>('全部');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  
  // 从 localStorage 初始化收藏列表
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('chem_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // 当收藏列表改变时，保存到 localStorage
  useEffect(() => {
    localStorage.setItem('chem_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const toggleElement = (elem: string) => {
    setSelectedElement(prev => prev === elem ? null : elem);
  };

  const filteredEquations = useMemo(() => {
    return equations.filter((eq) => {
      // 支持多关键词搜索（以空格分隔），且忽略大小写
      const searchTerms = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
      
      const matchesSearch = searchTerms.every(term => {
        const inDesc = eq.description.toLowerCase().includes(term);
        const inReactants = eq.reactants.some(r => r.formula.toLowerCase().includes(term));
        const inProducts = eq.products.some(p => p.formula.toLowerCase().includes(term));
        return inDesc || inReactants || inProducts;
      });

      const matchesType = selectedType === '全部' || eq.type === selectedType;
      const matchesFavorites = showFavoritesOnly ? favorites.includes(eq.id) : true;
      
      const eqElements = getEquationElements(eq);
      const matchesElements = selectedElement ? eqElements.includes(selectedElement) : true;
      
      return (searchTerms.length === 0 || matchesSearch) && matchesType && matchesFavorites && matchesElements;
    });
  }, [searchTerm, selectedType, showFavoritesOnly, favorites, selectedElement]);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">方程式大全</h2>
        <p className="text-gray-600 dark:text-gray-400">浏览初中阶段常见的化学方程式，了解反应条件与现象。</p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索物质、化学式 (如: h2o, co2) 支持空格多词搜索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
              />
            </div>
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
                showFavoritesOnly
                  ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">我的收藏</span>
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <Filter className="text-gray-400 dark:text-gray-500 w-5 h-5 flex-shrink-0" />
            {['全部', ...REACTION_TYPES].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedType === type
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 元素周期表筛选 */}
        <div className="bg-white dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
              <FlaskConical className="w-4 h-4" />
              按元素筛选 (周期表)
            </span>
            {selectedElement && (
              <button
                onClick={() => setSelectedElement(null)}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md"
              >
                清除筛选
              </button>
            )}
          </div>
          <div className="overflow-x-auto hide-scrollbar pb-2">
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(18, minmax(42px, 1fr))', 
                gridTemplateRows: 'repeat(7, minmax(52px, 1fr))',
                gap: '6px',
                minWidth: '800px'
              }}
            >
              {Object.keys(PERIODIC_TABLE_POSITIONS).map(elem => {
                const info = ELEMENT_INFO[elem];
                const styles = info ? CATEGORY_STYLES[info.category] : CATEGORY_STYLES['transition-metal'];
                const isPresent = ALL_ELEMENTS.includes(elem);
                const isSelected = selectedElement === elem;
                const pos = PERIODIC_TABLE_POSITIONS[elem];
                
                const gridStyle = pos ? { gridColumn: pos.col, gridRow: pos.row } : { gridColumn: 'auto', gridRow: 'auto' };

                let buttonClass = styles.colorClass;
                if (!isPresent) {
                  buttonClass = styles.disabledClass;
                } else if (isSelected) {
                  buttonClass = styles.activeClass + ' ring-2 ring-offset-1 ring-blue-500 dark:ring-offset-gray-900';
                }

                return (
                  <button
                    key={elem}
                    onClick={() => isPresent && toggleElement(elem)}
                    disabled={!isPresent}
                    style={gridStyle}
                    className={`relative flex flex-col items-center justify-center p-1 pt-3 rounded-lg text-sm transition-all border shadow-sm ${
                      isPresent ? 'hover:shadow' : ''
                    } ${buttonClass}`}
                    title={
                      info?.name
                        ? `${elem} (${info.atomicNumber}) ${info.name}${!isPresent ? ' (无相关方程式)' : ''}`
                        : elem
                    }
                  >
                    {info && (
                      <span
                        className={`absolute top-0.5 left-1 text-[9px] font-medium tabular-nums leading-none ${
                          isSelected ? 'text-white/90' : 'opacity-70'
                        }`}
                      >
                        {info.atomicNumber}
                      </span>
                    )}
                    <span className="font-bold text-base leading-none mb-0.5">{elem}</span>
                    {info?.name && <span className="text-[10px] opacity-80 leading-none">{info.name}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredEquations.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {showFavoritesOnly && favorites.length === 0 
              ? "您还没有收藏任何方程式，点击方程式右上角的爱心加入收藏吧！" 
              : "没有找到匹配的方程式"}
          </div>
        ) : (
          filteredEquations.map((eq, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={eq.id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="bg-gray-50/80 dark:bg-gray-800/50 px-6 py-3 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100">{eq.description}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    eq.difficulty === '初级' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                    eq.difficulty === '中级' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {eq.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full">
                    {eq.type}
                  </span>
                  <button
                    onClick={() => toggleFavorite(eq.id)}
                    className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none"
                    title={favorites.includes(eq.id) ? "取消收藏" : "加入收藏"}
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(eq.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <EquationDisplay equation={eq} />
                
                {eq.phenomenon && (
                  <div className="mt-6 flex justify-end relative group">
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg transition-colors text-sm font-medium cursor-default"
                    >
                      <Info className="w-4 h-4" />
                      查看现象
                    </button>
                    {/* 悬浮提示框 */}
                    <div className="absolute bottom-full right-0 mb-2 w-72 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                      <h4 className="text-sm font-bold text-amber-900 dark:text-amber-400 mb-2 flex items-center gap-1">
                        <Info className="w-4 h-4" /> 实验现象
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {eq.phenomenon}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
