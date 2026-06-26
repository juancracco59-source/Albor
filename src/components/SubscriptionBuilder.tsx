import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SubscriptionConfig } from '../types';
import { Sparkles, Calendar, Coffee, Package, Check, Shield, Info, ArrowRight } from 'lucide-react';

interface SubscriptionBuilderProps {
  onSubscribe: (config: SubscriptionConfig, price: number) => void;
  showNotification: (message: string) => void;
}

export default function SubscriptionBuilder({ onSubscribe, showNotification }: SubscriptionBuilderProps) {
  // Config state
  const [frequency, setFrequency] = useState<SubscriptionConfig['frequency']>('monthly');
  const [quantity, setQuantity] = useState<SubscriptionConfig['quantity']>(250);
  const [coffeeType, setCoffeeType] = useState<SubscriptionConfig['coffeeType']>('variado');
  const [grindSize, setGrindSize] = useState<SubscriptionConfig['grindSize']>('En grano');

  // Options Definitions
  const frequencies = [
    { id: 'weekly', label: 'Semanal', desc: 'Recibe café fresco cada semana (4 entregas/mes)', save: 'Extra -5%' },
    { id: 'biweekly', label: 'Quincenal', desc: 'Recibe café fresco cada 2 semanas (2 entregas/mes)', save: 'Extra -2%' },
    { id: 'monthly', label: 'Mensual', desc: 'Recibe café fresco una vez al mes (1 entrega/mes)', save: 'Envío gratis' },
  ];

  const quantities = [
    { id: 250, label: '250 gramos', desc: '1 bolsa. Ideal para 1 persona (~15-18 tazas/mes)', savings: 'Estándar' },
    { id: 500, label: '500 gramos', desc: '2 bolsas. Ideal para parejas (~30-35 tazas/mes)', savings: 'Ahorro 10%' },
    { id: 1000, label: '1000 gramos', desc: '4 bolsas. Ideal para coffee-lovers (~65-70 tazas/mes)', savings: 'Ahorro 15%' },
  ];

  const coffeeTypes = [
    { 
      id: 'variado', 
      label: 'Selección del Tostador (Sorpresa)', 
      desc: 'Rotamos mensualmente por diferentes fincas y perfiles para que experimentes todo el espectro aromático.',
      badge: 'Más Popular',
      priceModifier: 0 
    },
    { 
      id: 'frutal', 
      label: 'Florales y Frutales (Acidez Brillante)', 
      desc: 'Lotes lavados o naturales con acidez brillante de Etiopía o Kenia. Notas de jazmín, lima y durazno.',
      badge: 'Exclusivo',
      priceModifier: 1.50 
    },
    { 
      id: 'achocolatado', 
      label: 'Dulces y Tradicionales (Balanceado)', 
      desc: 'Tuestes medios de Brasil, Colombia o Guatemala. Notas reconfortantes de caramelo, chocolate y avellana.',
      badge: 'Clásico',
      priceModifier: 0 
    },
    { 
      id: 'exotico', 
      label: 'Exóticos y Experimentales (Arriesgados)', 
      desc: 'Fermentaciones anaeróbicas, maceraciones carbónicas o varietales raros (Geisha) para paladares refinados.',
      badge: 'Gourmet',
      priceModifier: 4.00 
    },
  ];

  const grindSizes = [
    { id: 'En grano', label: 'En Grano entero', desc: 'La mejor opción para conservar los aceites esenciales hasta el momento del tueste.' },
    { id: 'Espresso', label: 'Molienda Fina (Espresso)', desc: 'Para máquinas de espresso profesionales u hogareñas.' },
    { id: 'Filtro (V60/Chemex)', label: 'Molienda Media-Fina (Filtro)', desc: 'Para métodos de goteo como V60, Chemex, Melitta o cafetera automática.' },
    { id: 'Cafetera Italiana', label: 'Molienda Media (Italiana)', desc: 'Ideal para cafetera Moka o italiana.' },
    { id: 'Prensa Francesa', label: 'Molienda Gruesa (Prensa)', desc: 'Para prensa francesa o infusión en frío (Cold Brew).' },
  ];

  // Dynamic Price calculation
  const calculatedPrice = useMemo(() => {
    // Base price per 250g bag is $16.50
    let pricePerBag = 16.50;

    // Apply coffee type modifier
    const selectedTypeObj = coffeeTypes.find(t => t.id === coffeeType);
    if (selectedTypeObj) {
      pricePerBag += selectedTypeObj.priceModifier;
    }

    // Bag multipliers based on subscription quantity
    let totalBags = 1;
    let quantityDiscountMultiplier = 1;

    if (quantity === 500) {
      totalBags = 2;
      quantityDiscountMultiplier = 0.90; // 10% discount
    } else if (quantity === 1000) {
      totalBags = 4;
      quantityDiscountMultiplier = 0.85; // 15% discount
    }

    // Price for one single delivery
    const singleDeliveryPrice = pricePerBag * totalBags * quantityDiscountMultiplier;

    // Freq multiplier
    let frequencyDeliveriesPerMonth = 1;
    let frequencyDiscountMultiplier = 1;

    if (frequency === 'weekly') {
      frequencyDeliveriesPerMonth = 4;
      frequencyDiscountMultiplier = 0.95; // extra 5% off
    } else if (frequency === 'biweekly') {
      frequencyDeliveriesPerMonth = 2;
      frequencyDiscountMultiplier = 0.98; // extra 2% off
    } else if (frequency === 'monthly') {
      frequencyDeliveriesPerMonth = 1;
      frequencyDiscountMultiplier = 1;
    }

    // Final monthly cost
    const finalMonthlyPrice = singleDeliveryPrice * frequencyDeliveriesPerMonth * frequencyDiscountMultiplier;

    return finalMonthlyPrice;
  }, [frequency, quantity, coffeeType]);

  const pricePerDelivery = useMemo(() => {
    let deliveries = 1;
    if (frequency === 'weekly') deliveries = 4;
    else if (frequency === 'biweekly') deliveries = 2;
    return calculatedPrice / deliveries;
  }, [calculatedPrice, frequency]);

  const handleSubmit = () => {
    const config: SubscriptionConfig = {
      frequency,
      quantity,
      coffeeType,
      grindSize,
    };
    onSubscribe(config, calculatedPrice);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="font-mono text-xs text-coffee-500 uppercase tracking-[0.25em] font-semibold">CLUB DE CAFÉ DE ESPECIALIDAD</span>
        <h1 className="font-serif text-4xl font-bold text-coffee-900 mt-2">Configura tu Suscripción Mensual</h1>
        <p className="text-coffee-600 mt-3 font-sans leading-relaxed">
          Diseña una experiencia a tu medida. Elige la frecuencia, el peso y el perfil aromático que mejor se adapte a tus rutinas de café. Envíos gratis garantizados directamente a tu puerta.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Wizard Steps (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* STEP 1: Frecuencia de envío */}
          <section className="bg-coffee-50 border border-coffee-200/50 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center h-8 w-8 bg-coffee-800 text-coffee-50 font-serif font-bold text-sm rounded-lg">1</span>
              <div>
                <h3 className="font-serif text-lg font-bold text-coffee-900">¿Con qué frecuencia quieres tu café?</h3>
                <p className="text-xs text-coffee-500 font-sans">Puedes cambiar la frecuencia o pausar en cualquier momento</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {frequencies.map((f) => {
                const isSelected = frequency === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFrequency(f.id as SubscriptionConfig['frequency'])}
                    className={`p-5 rounded-xl border text-left transition-all duration-250 flex flex-col justify-between h-full relative ${
                      isSelected
                        ? 'border-coffee-800 bg-coffee-100/60 shadow-sm ring-1 ring-coffee-800/20'
                        : 'border-coffee-200 bg-transparent hover:border-coffee-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-base text-coffee-900">{f.label}</span>
                        {isSelected && <Check className="h-4 w-4 text-coffee-800 fill-coffee-100" />}
                      </div>
                      <p className="text-xs text-coffee-600 mt-2 font-sans leading-relaxed">{f.desc}</p>
                    </div>
                    <span className="mt-4 inline-block text-[10px] font-mono font-bold px-2 py-0.5 bg-coffee-800 text-coffee-50 rounded uppercase tracking-wider self-start">
                      {f.save}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 2: Cantidad por entrega */}
          <section className="bg-coffee-50 border border-coffee-200/50 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center h-8 w-8 bg-coffee-800 text-coffee-50 font-serif font-bold text-sm rounded-lg">2</span>
              <div>
                <h3 className="font-serif text-lg font-bold text-coffee-900">¿Qué cantidad de café necesitas en cada entrega?</h3>
                <p className="text-xs text-coffee-500 font-sans">Calculado para un consumo óptimo sin perder aroma</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quantities.map((q) => {
                const isSelected = quantity === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => setQuantity(q.id as SubscriptionConfig['quantity'])}
                    className={`p-5 rounded-xl border text-left transition-all duration-250 flex flex-col justify-between h-full ${
                      isSelected
                        ? 'border-coffee-800 bg-coffee-100/60 shadow-sm ring-1 ring-coffee-800/20'
                        : 'border-coffee-200 bg-transparent hover:border-coffee-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-base text-coffee-900">{q.label}</span>
                        {isSelected && <Check className="h-4 w-4 text-coffee-800" />}
                      </div>
                      <p className="text-xs text-coffee-600 mt-2 font-sans leading-relaxed">{q.desc}</p>
                    </div>
                    <span className="mt-4 inline-block text-[10px] font-mono font-semibold px-2 py-0.5 bg-coffee-200 text-coffee-800 rounded uppercase tracking-wider self-start">
                      {q.savings}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 3: Tipo de perfil aromático */}
          <section className="bg-coffee-50 border border-coffee-200/50 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center h-8 w-8 bg-coffee-800 text-coffee-50 font-serif font-bold text-sm rounded-lg">3</span>
              <div>
                <h3 className="font-serif text-lg font-bold text-coffee-900">¿Cuál es tu perfil de sabor preferido?</h3>
                <p className="text-xs text-coffee-500 font-sans">Nuestros tostadores seleccionan los mejores lotes de temporada según tu elección</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coffeeTypes.map((t) => {
                const isSelected = coffeeType === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setCoffeeType(t.id as SubscriptionConfig['coffeeType'])}
                    className={`p-5 rounded-xl border text-left transition-all duration-250 flex flex-col justify-between h-full relative ${
                      isSelected
                        ? 'border-coffee-800 bg-coffee-100/60 shadow-sm ring-1 ring-coffee-800/20'
                        : 'border-coffee-200 bg-transparent hover:border-coffee-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-serif font-bold text-base text-coffee-900 block">{t.label}</span>
                          <span className="inline-block text-[9px] font-mono px-2 py-0.5 bg-amber-500/15 text-amber-900 font-bold rounded uppercase mt-1">
                            {t.badge}
                          </span>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-coffee-800 mt-1 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-coffee-600 mt-3 font-sans leading-relaxed">{t.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-coffee-200/40 text-xs flex justify-between items-center w-full font-sans">
                      <span className="text-coffee-500 font-mono text-[10px]">SUPLEMENTO DEL LOTE:</span>
                      <span className="font-bold text-coffee-800">
                        {t.priceModifier === 0 ? 'Sin recargo' : `+$${t.priceModifier.toFixed(2)} por bolsa`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 4: Molienda */}
          <section className="bg-coffee-50 border border-coffee-200/50 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center h-8 w-8 bg-coffee-800 text-coffee-50 font-serif font-bold text-sm rounded-lg">4</span>
              <div>
                <h3 className="font-serif text-lg font-bold text-coffee-900">¿Qué tipo de molienda necesitas?</h3>
                <p className="text-xs text-coffee-500 font-sans">Optimizado de acuerdo con el método de extracción que utilices</p>
              </div>
            </div>

            <div className="space-y-3">
              {grindSizes.map((g) => {
                const isSelected = grindSize === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setGrindSize(g.id as SubscriptionConfig['grindSize'])}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'border-coffee-800 bg-coffee-100/60 shadow-sm ring-1 ring-coffee-800/20'
                        : 'border-coffee-200 bg-transparent hover:border-coffee-300'
                    }`}
                  >
                    <div className="flex-1 pr-4">
                      <span className="font-serif font-bold text-sm sm:text-base text-coffee-900 block">{g.label}</span>
                      <p className="text-xs text-coffee-600 mt-1 font-sans leading-normal">{g.desc}</p>
                    </div>
                    {isSelected ? (
                      <div className="h-5 w-5 rounded-full bg-coffee-800 flex items-center justify-center text-coffee-50 flex-shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-coffee-300 bg-transparent flex-shrink-0"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

        </div>

        {/* Right: Dynamic Summary Column (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-coffee-900 text-coffee-50 border border-coffee-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#FAF7F2_1px,transparent_1px)] [background-size:12px_12px]"></div>

            <h3 className="font-serif text-xl font-bold border-b border-coffee-800 pb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span>Resumen del Plan</span>
            </h3>

            {/* Config Specs Bullet points */}
            <ul className="space-y-4 my-6 text-sm font-sans">
              <li className="flex gap-3">
                <Calendar className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-mono text-coffee-400">FRECUENCIA DE ENTREGA</span>
                  <span className="font-bold text-coffee-100">
                    Cada {frequency === 'weekly' ? 'semana' : frequency === 'biweekly' ? 'dos semanas' : 'mes'}
                  </span>
                </div>
              </li>
              <li className="flex gap-3">
                <Package className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-mono text-coffee-400">VOLUMEN MENSUAL TOTAL</span>
                  <span className="font-bold text-coffee-100">
                    {quantity === 250 ? '250 gramos (1 bolsa)' : quantity === 500 ? '500 gramos (2 bolsas)' : '1000 gramos (4 bolsas)'}
                  </span>
                </div>
              </li>
              <li className="flex gap-3">
                <Coffee className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-mono text-coffee-400">PERFIL SENSORIAL</span>
                  <span className="font-bold text-coffee-100">
                    {coffeeTypes.find(t => t.id === coffeeType)?.label.split(' (')[0]}
                  </span>
                </div>
              </li>
              <li className="flex gap-3">
                <Check className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block text-xs font-mono text-coffee-400">TIPO DE MOLIENDA</span>
                  <span className="font-bold text-coffee-100">{grindSize}</span>
                </div>
              </li>
            </ul>

            {/* Cost Breakdown */}
            <div className="border-t border-coffee-800 pt-5 space-y-2.5">
              <div className="flex justify-between items-center text-xs font-sans text-coffee-300">
                <span>Costo por envío:</span>
                <span className="font-mono">${pricePerDelivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-sans text-coffee-300">
                <span>Envío express:</span>
                <span className="text-amber-400 font-mono tracking-wider font-semibold">GRATIS</span>
              </div>
              <div className="border-t border-coffee-850 pt-4 mt-2 flex justify-between items-end">
                <div>
                  <span className="block text-[10px] font-mono text-coffee-400 uppercase tracking-widest leading-none">TOTAL MENSUAL</span>
                  <span className="text-xs text-amber-400 font-mono italic leading-none mt-1 inline-block">10% Off ya incluido</span>
                </div>
                <span className="text-3xl font-bold font-mono text-coffee-50 leading-none">
                  ${calculatedPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Subscribe Action Button */}
            <button
              onClick={handleSubmit}
              className="w-full mt-8 py-4 bg-amber-500 hover:bg-amber-400 text-coffee-950 font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] flex items-center justify-center gap-2 group"
              id="subscribe-wizard-submit-btn"
            >
              <span>Unirme al Club de Café</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Core Guarantees card */}
          <div className="bg-coffee-50 border border-coffee-200/50 rounded-2xl p-6 space-y-4">
            <h4 className="font-serif text-sm font-bold text-coffee-900">Garantías de Nuestra Suscripción</h4>
            <ul className="space-y-3 text-xs text-coffee-600 font-sans">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>Pausa, edita o cancela en 1 clic. Sin contratos permanentes.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>Envío express los martes con válvula de desgasificación.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>Mismo precio garantizado durante 6 meses continuos.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
