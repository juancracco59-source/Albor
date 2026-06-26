import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Subscription, Order, SubscriptionConfig } from '../types';
import { Sparkles, Calendar, Coffee, Package, Check, X, CreditCard, RotateCcw, AlertCircle, ShoppingBag, ArrowUpRight } from 'lucide-react';

interface ProfilePanelProps {
  subscription: Subscription | null;
  orders: Order[];
  onToggleSubscriptionStatus: () => void;
  onCancelSubscription: () => void;
  onUpdateSubscriptionGrind: (grind: SubscriptionConfig['grindSize']) => void;
  onNavigateToTab: (tab: 'inicio' | 'tienda' | 'suscripcion' | 'perfil') => void;
  userEmail: string;
}

export default function ProfilePanel({
  subscription,
  orders,
  onToggleSubscriptionStatus,
  onCancelSubscription,
  onUpdateSubscriptionGrind,
  onNavigateToTab,
  userEmail,
}: ProfilePanelProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isChangingGrind, setIsChangingGrind] = useState(false);

  const getStatusColor = (status: Subscription['status']) => {
    if (status === 'active') return 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20 dark:border-emerald-500/30';
    if (status === 'paused') return 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20 dark:border-amber-500/30';
    return 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/20 dark:border-rose-500/30';
  };

  const getStatusLabel = (status: Subscription['status']) => {
    if (status === 'active') return 'Activa (Recibiendo envíos)';
    if (status === 'paused') return 'Pausada temporalmente';
    return 'Cancelada';
  };

  const getOrderBadge = (status: Order['status']) => {
    if (status === 'delivered') return 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20 dark:border-emerald-500/30';
    if (status === 'shipped') return 'bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-500/20 dark:border-blue-500/30';
    return 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20 dark:border-amber-500/30';
  };

  const getOrderBadgeLabel = (status: Order['status']) => {
    if (status === 'delivered') return 'Entregado';
    if (status === 'shipped') return 'En camino';
    return 'Preparando';
  };

  const coffeeProfilesNames = {
    variado: 'Selección del Tostador (Sorpresa)',
    frutal: 'Florales y Frutales (Acidez Brillante)',
    achocolatado: 'Dulces y Tradicionales (Balanceado)',
    exotico: 'Exóticos y Experimentales (Arriesgados)',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Profile Dashboard */}
      <div className="bg-coffee-900 text-coffee-50 rounded-3xl p-6 sm:p-8 shadow-xl border border-coffee-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#FAF7F2_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="space-y-2 z-10">
          <span className="font-mono text-xs text-amber-400 tracking-widest uppercase">PANEL DE CONTROL GENERAL</span>
          <h1 className="font-serif text-3xl font-bold">¡Hola de nuevo, Cafetero!</h1>
          <p className="text-sm text-coffee-300 font-sans">
            Cuenta vinculada: <span className="font-semibold text-coffee-50">{userEmail}</span>
          </p>
        </div>

        <div className="flex gap-3 z-10">
          <button
            onClick={() => onNavigateToTab('tienda')}
            className="px-5 py-2.5 bg-coffee-800 hover:bg-coffee-700 text-coffee-100 text-xs font-semibold rounded-xl transition-all border border-coffee-700"
          >
            Visitar Tienda
          </button>
          <button
            onClick={() => onNavigateToTab('suscripcion')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-coffee-950 text-xs font-bold rounded-xl transition-all shadow-md"
          >
            Configurar Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Active Membership Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-serif text-2xl font-bold text-coffee-900 dark:text-coffee-100">Suscripción Activa Club</h2>

          {!subscription ? (
            <div className="bg-coffee-50 dark:bg-coffee-950 border-2 border-dashed border-coffee-200/80 dark:border-coffee-850 p-8 rounded-3xl text-center space-y-6">
              <div className="h-16 w-16 bg-coffee-100 dark:bg-coffee-900 rounded-full flex items-center justify-center text-coffee-400 dark:text-coffee-500 mx-auto">
                <Sparkles className="h-8 w-8 text-coffee-500" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="font-serif text-lg font-bold text-coffee-900 dark:text-coffee-100">Aún no eres miembro de nuestro Club</h3>
                <p className="text-sm text-coffee-600 dark:text-coffee-350 leading-relaxed">
                  Únete a nuestro club de café mensual y recibe granos de especialidad frescos recién tostados cada mes directamente en tu puerta, con envío gratis y regalos especiales.
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab('suscripcion')}
                className="px-8 py-3.5 bg-coffee-800 dark:bg-coffee-750 hover:bg-coffee-700 dark:hover:bg-coffee-650 text-coffee-50 text-xs font-bold rounded-xl shadow-md transition-all uppercase tracking-wide inline-flex items-center gap-2"
              >
                <span>Crear mi Plan Personalizado</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="bg-coffee-50 dark:bg-coffee-950 border border-coffee-200 dark:border-coffee-850 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              {/* Subscription title & status badge */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-coffee-200/50 dark:border-coffee-850 pb-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-coffee-800 dark:bg-coffee-900 text-coffee-50 rounded-xl shadow">
                    <Coffee className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-coffee-900 dark:text-coffee-100">Membresía Club Albor</h3>
                    <p className="text-xs text-coffee-500 dark:text-coffee-400 font-mono mt-0.5">ID Membresía: #{subscription.id}</p>
                  </div>
                </div>
                <span className={`px-3 py-1.5 border rounded-full text-xs font-semibold text-center uppercase tracking-wide ${getStatusColor(subscription.status)}`}>
                  {getStatusLabel(subscription.status)}
                </span>
              </div>

              {/* Grid with specs */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 text-sm font-sans">
                <div>
                  <span className="block text-[10px] font-mono text-coffee-400 dark:text-coffee-500 uppercase">Perfil de Café</span>
                  <span className="font-bold text-coffee-900 dark:text-coffee-100 mt-1 block">
                    {coffeeProfilesNames[subscription.config.coffeeType]}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-coffee-400 dark:text-coffee-500 uppercase">Volumen Mensual</span>
                  <span className="font-bold text-coffee-900 dark:text-coffee-100 mt-1 block">
                    {subscription.config.quantity}g por entrega
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-coffee-400 dark:text-coffee-500 uppercase">Frecuencia de envío</span>
                  <span className="font-bold text-coffee-900 dark:text-coffee-100 mt-1 block">
                    Cada {subscription.config.frequency === 'weekly' ? 'semana (4x/mes)' : subscription.config.frequency === 'biweekly' ? 'quincena (2x/mes)' : 'mes'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-coffee-400 dark:text-coffee-500 uppercase">Próximo Envío Estimado</span>
                  <span className="font-bold text-coffee-900 dark:text-coffee-100 mt-1 block">
                    {subscription.status === 'active' ? subscription.nextDelivery : 'Pausado'}
                  </span>
                </div>
              </div>

              {/* Inline Grind Size Editor */}
              <div className="bg-coffee-100/50 dark:bg-coffee-900/30 border border-coffee-200/40 dark:border-coffee-850/50 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-coffee-500 dark:text-coffee-400">MOLIENDA SELECCIONADA:</span>
                  <span className="font-bold text-coffee-900 dark:text-coffee-100">{subscription.config.grindSize}</span>
                </div>
                
                {!isChangingGrind ? (
                  <button
                    onClick={() => setIsChangingGrind(true)}
                    className="text-[10px] font-mono text-coffee-600 dark:text-coffee-400 hover:text-coffee-900 dark:hover:text-coffee-200 underline font-semibold block"
                    id="profile-toggle-grind-btn"
                  >
                    Cambiar punto de molienda
                  </button>
                ) : (
                  <div className="pt-2 border-t border-coffee-200/50 dark:border-coffee-850/50 flex flex-wrap gap-1.5 text-[10px]">
                    {[
                      'En grano',
                      'Espresso',
                      'Filtro (V60/Chemex)',
                      'Prensa Francesa',
                      'Cafetera Italiana',
                    ].map((grind) => (
                      <button
                        key={grind}
                        onClick={() => {
                          onUpdateSubscriptionGrind(grind as SubscriptionConfig['grindSize']);
                          setIsChangingGrind(false);
                        }}
                        className={`px-2 py-1 rounded border transition-all ${
                          subscription.config.grindSize === grind
                            ? 'bg-coffee-800 dark:bg-coffee-750 text-coffee-50 border-coffee-800 dark:border-coffee-700 font-semibold'
                            : 'bg-white dark:bg-coffee-900 text-coffee-600 dark:text-coffee-300 border-coffee-200 dark:border-coffee-800 hover:border-coffee-300 dark:hover:border-coffee-700'
                        }`}
                      >
                        {grind}
                      </button>
                    ))}
                    <button
                      onClick={() => setIsChangingGrind(false)}
                      className="px-2 py-1 bg-transparent text-rose-600 dark:text-rose-400 font-bold"
                    >
                      Cerrar
                    </button>
                  </div>
                )}
              </div>

              {/* Billing Info block */}
              <div className="border-t border-coffee-200/50 dark:border-coffee-850/50 pt-5 flex items-center justify-between text-xs font-sans text-coffee-600 dark:text-coffee-350">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-coffee-400 dark:text-coffee-500" />
                  <span>Monto recurrente mensual: <b>${subscription.price.toFixed(2)}</b> (Envío Incluido)</span>
                </div>
                <span className="text-[10px] font-mono text-coffee-400 dark:text-coffee-500">TARIFA CONGELADA</span>
              </div>

              {/* Actions row: Pause & Cancel */}
              <div className="border-t border-coffee-200/50 dark:border-coffee-850/50 pt-5 flex flex-wrap gap-3">
                {subscription.status !== 'cancelled' ? (
                  <>
                    <button
                      onClick={onToggleSubscriptionStatus}
                      className={`flex-1 py-3 border rounded-xl text-xs font-semibold tracking-wide transition-all ${
                        subscription.status === 'active'
                          ? 'border-amber-600 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-amber-500/10'
                          : 'border-emerald-600 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/10'
                      }`}
                      id="profile-pause-btn"
                    >
                      {subscription.status === 'active' ? 'Pausar Suscripción' : 'Reactivar Suscripción'}
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="px-4 py-3 border border-rose-350 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-700 dark:text-rose-400 font-semibold rounded-xl text-xs transition-all"
                      id="profile-cancel-btn"
                    >
                      Cancelar Plan
                    </button>
                  </>
                ) : (
                  <div className="w-full text-center p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 rounded-xl text-rose-850 dark:text-rose-300 text-xs flex items-center justify-center gap-2 font-medium">
                    <AlertCircle className="h-4 w-4" />
                    <span>Tu suscripción ha sido cancelada. No se realizarán más cargos automáticos.</span>
                  </div>
                )}
              </div>

              {/* Cancel confirmation dialogue overlay */}
              <AnimatePresence>
                {showCancelConfirm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-5 space-y-4 overflow-hidden"
                  >
                    <div className="flex gap-2.5 text-rose-800 dark:text-rose-200 text-xs font-sans">
                      <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">¿Estás seguro de cancelar tu suscripción?</p>
                        <p className="mt-1 text-rose-700 dark:text-rose-300">Perderás tu tarifa congelada actual de descuento y tu taza con el logo del club de regalo en la próxima entrega semanal.</p>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setShowCancelConfirm(false)}
                        className="px-4 py-2 bg-white dark:bg-coffee-900 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/20 text-xs font-semibold rounded-lg transition-all"
                      >
                        No, mantener suscripción
                      </button>
                      <button
                        onClick={() => {
                          onCancelSubscription();
                          setShowCancelConfirm(false);
                        }}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-coffee-50 text-xs font-bold rounded-lg transition-all"
                        id="profile-confirm-cancel-btn"
                      >
                        Sí, cancelar definitivamente
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Past Orders History (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="font-serif text-2xl font-bold text-coffee-900 dark:text-coffee-100">Historial de Pedidos</h2>

          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
            {orders.length === 0 ? (
              <div className="bg-coffee-50 dark:bg-coffee-950/30 border border-coffee-200 dark:border-coffee-850 rounded-3xl p-8 text-center text-sm font-sans text-coffee-500 dark:text-coffee-400">
                <ShoppingBag className="h-8 w-8 text-coffee-300 dark:text-coffee-600 mx-auto mb-3" />
                <p>No tienes pedidos completados registrados en esta simulación.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div 
                  key={order.id}
                  className="bg-coffee-50 dark:bg-coffee-950/30 border border-coffee-200/60 dark:border-coffee-850 rounded-2xl p-5 space-y-3.5 shadow-sm hover:border-coffee-300 dark:hover:border-coffee-750 transition-all text-xs font-sans"
                  id={`order-card-${order.id}`}
                >
                  {/* Title block */}
                  <div className="flex justify-between items-start border-b border-coffee-200/40 dark:border-coffee-800/40 pb-2.5">
                    <div>
                      <p className="font-mono text-[10px] text-coffee-400 dark:text-coffee-500">ID DE PEDIDO</p>
                      <p className="font-bold text-coffee-900 dark:text-coffee-100 font-mono text-xs">{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[10px] text-coffee-400 dark:text-coffee-500">FECHA</p>
                      <p className="font-semibold text-coffee-700 dark:text-coffee-300">{order.date}</p>
                    </div>
                  </div>

                  {/* Items log */}
                  <div className="space-y-2 text-coffee-700 dark:text-coffee-300">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <p className="font-bold text-coffee-900 dark:text-coffee-100">{item.name}</p>
                          <p className="text-[10px] text-coffee-400 dark:text-coffee-500 font-mono mt-0.5">{item.grindSize} (x{item.quantity})</p>
                        </div>
                        <span className="font-mono text-coffee-900 dark:text-coffee-100 font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}

                    {order.subscription && (
                      <div className="p-2.5 bg-amber-500/10 border border-amber-500/15 dark:border-amber-500/30 rounded-lg text-[11px] text-amber-900 dark:text-amber-400 flex gap-2">
                        <Coffee className="h-3.5 w-3.5 text-amber-700 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Alta de Suscripción Club</p>
                          <p className="text-[10px] mt-0.5 opacity-90">Frecuencia: {order.subscription.frequency} | {order.subscription.grindSize}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer order totals */}
                  <div className="border-t border-coffee-200/40 dark:border-coffee-800/40 pt-3.5 flex items-center justify-between">
                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 border rounded-md font-medium text-[10px] tracking-wide uppercase ${getOrderBadge(order.status)}`}>
                      {getOrderBadgeLabel(order.status)}
                    </span>

                    <div className="text-right flex items-end gap-1.5">
                      <span className="text-[10px] text-coffee-400 dark:text-coffee-500 font-mono">TOTAL:</span>
                      <span className="text-sm font-bold font-mono text-coffee-900 dark:text-coffee-100">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
