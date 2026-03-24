import React, { useState, useEffect, useMemo } from 'react';
import { equations, ReactionType, Equation } from '../data/equations';
import { EquationDisplay } from './EquationDisplay';
import { Search, Filter, Info, Heart, FlaskConical } from 'lucide-react';
import { motion } from 'motion/react';
import { getPhenomenonEmoji, parseFormula } from '../utils/chemistry';
import { CATEGORY_STYLES, ELEMENT_INFO, PERIODIC_TABLE_POSITIONS } from '../data/elements';

const REACTION_TYPES: ReactionType[] = ['化合反应', '分解反应', '置换反应', '复分解反应', '其他'];

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
                gridTemplateColumns: 'repeat(18, minmax(46px, 1fr))', 
                gridTemplateRows: 'repeat(7, minmax(58px, 1fr))',
                gap: '6px',
                minWidth: '860px'
              }}
            >
              {Object.keys(PERIODIC_TABLE_POSITIONS).map(elem => {
                const info = ELEMENT_INFO[elem];
                const styles = info ? CATEGORY_STYLES[info.category] : CATEGORY_STYLES['transition-metal'];
                const isPresent = ALL_ELEMENTS.includes(elem);
                const isSelected = selectedElement === elem;
                const pos = PERIODIC_TABLE_POSITIONS[elem];
                
                const gridStyle = pos ? { gridColumn: pos.col, gridRow: pos.row } : { gridColumn: 'auto', gridRow: 'auto' };

                let buttonClass: string = styles.colorClass;
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
                    className={`relative flex h-full min-h-0 flex-col items-center px-1 pt-5 pb-1 rounded-lg text-sm transition-all border shadow-sm ${
                      isPresent ? 'hover:shadow' : ''
                    } ${buttonClass}`}
                    title={
                      info?.name
                        ? `${elem}（${info.atomicNumber}）${info.name}，相对原子质量 ${info.relativeAtomicMass}${
                            !isPresent ? '（无相关方程式）' : ''
                          }`
                        : elem
                    }
                  >
                    {info && (
                      <>
                        <span
                          className={`absolute top-0.5 left-1 z-[1] text-[10px] font-semibold tabular-nums leading-none ${
                            isSelected
                              ? 'text-white'
                              : !isPresent
                                ? 'text-slate-300 dark:text-slate-300'
                                : 'opacity-95'
                          }`}
                        >
                          {info.atomicNumber}
                        </span>
                        <span
                          className={`absolute top-0.5 right-1 z-[1] max-w-[55%] truncate text-right text-[9px] font-medium leading-tight ${
                            isSelected
                              ? 'text-white'
                              : !isPresent
                                ? 'text-slate-300 dark:text-slate-300'
                                : 'opacity-90'
                          }`}
                          title={info.name}
                        >
                          {info.name}
                        </span>
                      </>
                    )}
                    <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
                      <span className="font-bold text-xl leading-none">{elem}</span>
                    </div>
                    {info && (
                      <span
                        className={`mb-0 w-full shrink-0 px-0.5 pb-0.5 text-center text-[8px] font-medium tabular-nums leading-none ${
                          isSelected
                            ? 'text-white/90'
                            : !isPresent
                              ? 'text-slate-300 dark:text-slate-300'
                              : 'opacity-85'
                        }`}
                      >
                        {info.relativeAtomicMass}
                      </span>
                    )}
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
                      type="button"
                      aria-label={`实验现象：${eq.phenomenon}`}
                      title="悬停查看实验现象"
                      className="inline-flex size-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 transition-colors cursor-default text-xl leading-none"
                    >
                      <span aria-hidden="true">{getPhenomenonEmoji(eq.phenomenon)}</span>
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
