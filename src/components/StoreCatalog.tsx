import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee as CoffeeType, CartItem } from '../types';
import { COFFEES } from '../data/coffees';
import { Search, Filter, SlidersHorizontal, Info, Check, Plus, Star, X, MapPin } from 'lucide-react';

interface StoreCatalogProps {
  onAddToCart: (coffee: CoffeeType, quantity: number, grindSize: CartItem['grindSize']) => void;
  showNotification: (message: string) => void;
}

export default function StoreCatalog({ onAddToCart, showNotification }: StoreCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('Todos');
  const [selectedProcess, setSelectedProcess] = useState<string>('Todos');
  const [selectedRoast, setSelectedRoast] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<string>('score'); // score, price-asc, price-desc, default
  const [selectedCoffee, setSelectedCoffee] = useState<CoffeeType | null>(null);

  // Detail Modal state
  const [modalGrindSize, setModalGrindSize] = useState<CartItem['grindSize']>('En grano');
  const [modalQuantity, setModalQuantity] = useState(1);

  // Quick grind selection for directly adding
  const [quickGrindActiveId, setQuickGrindActiveId] = useState<string | null>(null);

  // Extract unique values for filters
  const origins = useMemo(() => {
    const list = COFFEES.map(c => c.origin);
    return ['Todos', ...Array.from(new Set(list))];
  }, []);

  const processes = useMemo(() => {
    const list = COFFEES.map(c => c.process);
    return ['Todos', ...Array.from(new Set(list))];
  }, []);

  // Filter & Sort Logic
  const filteredCoffees = useMemo(() => {
    let result = [...COFFEES];

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        c => c.name.toLowerCase().includes(q) || 
             c.origin.toLowerCase().includes(q) || 
             c.farm.toLowerCase().includes(q) ||
             c.flavorNotes.some(note => note.toLowerCase().includes(q))
      );
    }

    // Origin filter
    if (selectedOrigin !== 'Todos') {
      result = result.filter(c => c.origin === selectedOrigin);
    }

    // Process filter
    if (selectedProcess !== 'Todos') {
      result = result.filter(c => c.process === selectedProcess);
    }

    // Roast filter
    if (selectedRoast !== 'Todos') {
      result = result.filter(c => c.roastLevel === selectedRoast);
    }

    // Sorting
    if (sortBy === 'score') {
      result.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [searchQuery, selectedOrigin, selectedProcess, selectedRoast, sortBy]);

  const handleOpenDetail = (coffee: CoffeeType) => {
    setSelectedCoffee(coffee);
    setModalGrindSize('En grano');
    setModalQuantity(1);
  };

  const handleAddFromModal = () => {
    if (!selectedCoffee) return;
    onAddToCart(selectedCoffee, modalQuantity, modalGrindSize);
    showNotification(`Se añadieron ${modalQuantity} bolsita(s) de ${selectedCoffee.name} (${modalGrindSize}) al carrito.`);
    setSelectedCoffee(null);
  };

  const handleQuickAdd = (coffee: CoffeeType, grind: CartItem['grindSize'] = 'En grano') => {
    onAddToCart(coffee, 1, grind);
    showNotification(`Añadido: ${coffee.name} (${grind}) al carrito.`);
    setQuickGrindActiveId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="font-serif text-4xl font-bold text-coffee-900">Nuestra Tienda de Especialidad</h1>
        <p className="text-coffee-600 mt-3 font-sans leading-relaxed">
          Cafés en grano de tueste fresco, 100% trazables y con puntuaciones excepcionales en escala SCA. Elige tu origen favorito y el tipo de molienda perfecto para tu preparación.
        </p>
      </div>

      {/* Catalog Control Bar */}
      <div className="bg-coffee-100/60 border border-coffee-200/40 rounded-2xl p-6 mb-10 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full lg:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-coffee-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder="Buscar por origen, finca, notas de sabor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-coffee-50 border border-coffee-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 transition-all placeholder:text-coffee-400"
              id="store-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-coffee-400 hover:text-coffee-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <span className="text-xs font-mono text-coffee-500 uppercase tracking-wide whitespace-nowrap flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4" /> Ordenar por:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-coffee-50 border border-coffee-200/60 rounded-xl text-xs font-medium text-coffee-700 focus:outline-none focus:ring-2 focus:ring-coffee-500 cursor-pointer"
              id="store-sort-select"
            >
              <option value="score">Mayor Puntuación (SCA)</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="border-t border-coffee-200/30 pt-5 space-y-4">
          {/* Origin filter group */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono text-coffee-500 uppercase tracking-wider w-16 mr-1">Origen:</span>
            {origins.map(origin => (
              <button
                key={origin}
                onClick={() => setSelectedOrigin(origin)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedOrigin === origin
                    ? 'bg-coffee-800 text-coffee-50 font-semibold shadow-sm'
                    : 'bg-coffee-50 border border-coffee-200/50 text-coffee-600 hover:text-coffee-900 hover:bg-coffee-200/20'
                }`}
              >
                {origin}
              </button>
            ))}
          </div>

          {/* Process filter group */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono text-coffee-500 uppercase tracking-wider w-16 mr-1">Proceso:</span>
            {processes.map(proc => (
              <button
                key={proc}
                onClick={() => setSelectedProcess(proc)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedProcess === proc
                    ? 'bg-coffee-800 text-coffee-50 font-semibold shadow-sm'
                    : 'bg-coffee-50 border border-coffee-200/50 text-coffee-600 hover:text-coffee-900 hover:bg-coffee-200/20'
                }`}
              >
                {proc}
              </button>
            ))}
          </div>

          {/* Roast level filter group */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono text-coffee-500 uppercase tracking-wider w-16 mr-1">Tueste:</span>
            {['Todos', 'Claro', 'Medio'].map(roast => (
              <button
                key={roast}
                onClick={() => setSelectedRoast(roast)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedRoast === roast
                    ? 'bg-coffee-800 text-coffee-50 font-semibold shadow-sm'
                    : 'bg-coffee-50 border border-coffee-200/50 text-coffee-600 hover:text-coffee-900 hover:bg-coffee-200/20'
                }`}
              >
                {roast === 'Todos' ? 'Todos' : `Tueste ${roast}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Results */}
      {filteredCoffees.length === 0 ? (
        <div className="text-center py-20 bg-coffee-100/20 border border-dashed border-coffee-200 rounded-3xl">
          <Info className="h-10 w-10 text-coffee-400 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-coffee-900">No encontramos ningún grano coincidente</h3>
          <p className="text-sm text-coffee-500 mt-2">Intenta limpiar los filtros de origen o proceso, o reduce la consulta de búsqueda.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedOrigin('Todos');
              setSelectedProcess('Todos');
              setSelectedRoast('Todos');
            }}
            className="mt-6 px-6 py-2.5 bg-coffee-800 text-coffee-50 text-xs font-bold rounded-lg hover:bg-coffee-700 transition-all"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredCoffees.map((coffee) => {
              const isExcellent = coffee.score >= 88;
              const isDirectGrindOpen = quickGrindActiveId === coffee.id;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  key={coffee.id}
                  className="bg-coffee-50 rounded-2xl overflow-hidden border border-coffee-200/50 flex flex-col justify-between coffee-card-glow relative"
                  id={`coffee-card-${coffee.id}`}
                >
                  {/* Top Badges / Image Container */}
                  <div className="relative h-64 overflow-hidden bg-coffee-200 group">
                    <img
                      src={coffee.image}
                      alt={coffee.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/40 via-transparent to-transparent"></div>

                    {/* Score Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-coffee-900/95 backdrop-blur-md rounded-lg text-coffee-50 border border-coffee-700/50 flex items-center gap-1 shadow-md">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-mono text-xs font-bold">{coffee.score} SCA</span>
                    </div>

                    {/* Premium / Micro-lote Badge */}
                    {isExcellent && (
                      <div className="absolute top-4 right-4 px-2.5 py-1 bg-amber-500 text-coffee-950 font-mono text-[9px] font-bold tracking-wider uppercase rounded shadow-md">
                        Micro-Lote
                      </div>
                    )}

                    {/* Altitude and Process Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-coffee-50">
                      <div className="flex items-center gap-1 bg-coffee-900/65 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-mono font-medium">
                        <MapPin className="h-3 w-3 text-amber-400" />
                        <span>{coffee.origin}</span>
                      </div>
                      <div className="bg-coffee-900/65 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-mono font-medium">
                        {coffee.process}
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Name / Farm */}
                      <div className="mb-2">
                        <h3 className="font-serif text-xl font-bold text-coffee-900 leading-tight">
                          {coffee.name}
                        </h3>
                        <p className="text-xs text-coffee-500 font-sans mt-1">
                          Finca: <span className="font-medium text-coffee-700">{coffee.farm}</span>
                        </p>
                      </div>

                      {/* Elevation & Roast specifications */}
                      <div className="grid grid-cols-2 gap-2 border-t border-b border-coffee-200/30 py-2.5 my-3.5 text-[11px] font-mono text-coffee-500">
                        <div>
                          Altitud: <span className="font-bold text-coffee-700">{coffee.altitude}m</span>
                        </div>
                        <div>
                          Tueste: <span className="font-bold text-coffee-700">{coffee.roastLevel}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-coffee-600 font-sans line-clamp-2 leading-relaxed mb-4">
                        {coffee.description}
                      </p>

                      {/* Flavor Notes Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {coffee.flavorNotes.map((note) => (
                          <span
                            key={note}
                            className="text-[10px] font-sans px-2.5 py-1 bg-coffee-100 text-coffee-800 rounded-md border border-coffee-200/30"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Buy Actions */}
                    <div>
                      <div className="flex items-center justify-between pt-4 border-t border-coffee-200/40">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-coffee-400 tracking-wider">PRECIO (250G)</span>
                          <span className="text-lg font-bold text-coffee-900">
                            ${coffee.price.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenDetail(coffee)}
                            className="p-2 bg-coffee-100 hover:bg-coffee-250/70 text-coffee-800 rounded-lg text-xs font-semibold border border-coffee-200/50 transition-all"
                            title="Ver Perfil Completo"
                          >
                            <Info className="h-4 w-4" />
                          </button>

                          {/* Quick Add Interface */}
                          <div className="relative">
                            {!isDirectGrindOpen ? (
                              <button
                                onClick={() => setQuickGrindActiveId(coffee.id)}
                                className="px-3.5 py-2.5 bg-coffee-800 hover:bg-coffee-700 text-coffee-50 rounded-lg text-xs font-semibold tracking-wider flex items-center gap-1 transition-all"
                                id={`quick-add-${coffee.id}`}
                              >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Añadir</span>
                              </button>
                            ) : (
                              <div className="absolute right-0 bottom-0 z-10 bg-coffee-50 border border-coffee-300 shadow-xl rounded-xl p-3 w-48 text-left animate-slideUp">
                                <p className="text-[10px] font-mono font-bold text-coffee-500 mb-2 tracking-wide uppercase">Selecciona Molienda:</p>
                                <div className="space-y-1 text-xs">
                                  {(['En grano', 'Espresso', 'Filtro (V60/Chemex)', 'Prensa Francesa'] as CartItem['grindSize'][]).map((grind) => (
                                    <button
                                      key={grind}
                                      onClick={() => handleQuickAdd(coffee, grind)}
                                      className="w-full text-left px-2 py-1.5 rounded hover:bg-coffee-100 text-coffee-700 hover:text-coffee-950 font-medium transition-all"
                                    >
                                      {grind}
                                    </button>
                                  ))}
                                </div>
                                <button
                                  onClick={() => setQuickGrindActiveId(null)}
                                  className="w-full text-center text-[10px] font-mono text-rose-600 mt-2 pt-1 border-t border-coffee-200/50 hover:text-rose-800"
                                >
                                  Cancelar
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Coffee Detailed Modal */}
      <AnimatePresence>
        {selectedCoffee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCoffee(null)}
              className="fixed inset-0 bg-coffee-950/70 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-coffee-50 rounded-3xl overflow-hidden shadow-2xl border border-coffee-200 max-w-3xl w-full relative z-10 max-h-[90vh] overflow-y-auto"
              id="coffee-detail-modal"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCoffee(null)}
                className="absolute top-4 right-4 p-2.5 bg-coffee-950/20 hover:bg-coffee-950/40 text-coffee-50 rounded-full z-20 transition-all"
                id="close-detail-modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                {/* Left side: Large image */}
                <div className="md:col-span-5 h-64 md:h-auto min-h-[250px] relative">
                  <img
                    src={selectedCoffee.image}
                    alt={selectedCoffee.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-coffee-950/40 via-transparent to-transparent"></div>
                  
                  {/* Big SCA Score Badge */}
                  <div className="absolute bottom-6 left-6 p-4 bg-coffee-950/80 backdrop-blur-md rounded-2xl border border-coffee-800 text-coffee-100 shadow-xl">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="h-5 w-5 fill-current" />
                      <span className="font-mono text-lg font-bold">{selectedCoffee.score}</span>
                    </div>
                    <p className="text-[9px] font-mono uppercase text-coffee-300 tracking-wider mt-1">Puntuación Oficial SCA</p>
                  </div>
                </div>

                {/* Right side: Info and Configuration */}
                <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
                  <div>
                    <span className="font-mono text-xs text-coffee-500 uppercase tracking-widest">{selectedCoffee.origin}</span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-coffee-900 mt-1">
                      {selectedCoffee.name}
                    </h2>
                    <p className="text-sm text-coffee-600 mt-1 font-sans italic">{selectedCoffee.farm}</p>
                  </div>

                  {/* Quick Specs */}
                  <div className="grid grid-cols-3 gap-3 bg-coffee-100/50 p-3.5 rounded-xl border border-coffee-200/40 text-xs font-sans text-coffee-700">
                    <div className="text-center">
                      <p className="text-[10px] font-mono text-coffee-400 uppercase">Altitud</p>
                      <p className="font-bold text-coffee-900 mt-0.5">{selectedCoffee.altitude}m</p>
                    </div>
                    <div className="text-center border-l border-r border-coffee-200/60">
                      <p className="text-[10px] font-mono text-coffee-400 uppercase">Proceso</p>
                      <p className="font-bold text-coffee-900 mt-0.5">{selectedCoffee.process}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-mono text-coffee-400 uppercase">Tueste</p>
                      <p className="font-bold text-coffee-900 mt-0.5">{selectedCoffee.roastLevel}</p>
                    </div>
                  </div>

                  {/* Full Description */}
                  <p className="text-sm text-coffee-600 leading-relaxed">
                    {selectedCoffee.description}
                  </p>

                  {/* Flavor Notes */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono text-coffee-400 tracking-wider uppercase">Descriptor Sensorial:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCoffee.flavorNotes.map((note) => (
                        <span
                          key={note}
                          className="text-xs font-sans font-medium px-3 py-1 bg-coffee-800 text-coffee-100 rounded-lg shadow-sm"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Grind & Quantity Selection */}
                  <div className="border-t border-coffee-200/50 pt-5 space-y-4">
                    {/* Grind size */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-coffee-500 uppercase tracking-wide block">Punto de Molienda:</label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {([
                          'En grano',
                          'Espresso',
                          'Filtro (V60/Chemex)',
                          'Prensa Francesa',
                          'Cafetera Italiana',
                        ] as CartItem['grindSize'][]).map((grind) => {
                          const isSelected = modalGrindSize === grind;
                          return (
                            <button
                              key={grind}
                              onClick={() => setModalGrindSize(grind)}
                              className={`px-3 py-2.5 rounded-lg border text-left font-medium transition-all ${
                                isSelected
                                  ? 'border-coffee-800 bg-coffee-100 text-coffee-900 font-semibold'
                                  : 'border-coffee-200/60 bg-transparent text-coffee-600 hover:border-coffee-300 hover:text-coffee-850'
                              }`}
                            >
                              {grind}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between pt-3">
                      {/* Quantity Selector */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-coffee-500 uppercase tracking-wide block">Cantidad (Bolsas de 250g):</label>
                        <div className="flex items-center border border-coffee-200 bg-coffee-100/50 rounded-xl max-w-[120px] overflow-hidden">
                          <button
                            onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                            className="px-3 py-2 text-coffee-700 hover:bg-coffee-200 hover:text-coffee-900 transition-all font-bold"
                          >
                            -
                          </button>
                          <span className="flex-1 text-center text-sm font-bold text-coffee-900">{modalQuantity}</span>
                          <button
                            onClick={() => setModalQuantity(modalQuantity + 1)}
                            className="px-3 py-2 text-coffee-700 hover:bg-coffee-200 hover:text-coffee-900 transition-all font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Summary Price */}
                      <div className="text-right">
                        <p className="text-[10px] font-mono text-coffee-400 uppercase tracking-wider">Monto Total</p>
                        <p className="text-2xl font-bold text-coffee-900 mt-1">
                          ${(selectedCoffee.price * modalQuantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Modal Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-coffee-200/30">
                    <button
                      onClick={() => setSelectedCoffee(null)}
                      className="flex-1 py-3 border border-coffee-300 text-coffee-700 font-semibold rounded-xl text-sm hover:bg-coffee-150 transition-all"
                    >
                      Volver a la Tienda
                    </button>
                    <button
                      onClick={handleAddFromModal}
                      className="flex-[1.5] py-3 bg-coffee-800 hover:bg-coffee-700 text-coffee-50 font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                      id="modal-add-to-cart-btn"
                    >
                      <span>Añadir al Carrito</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
