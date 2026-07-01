import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Subscription, Order, SubscriptionConfig } from '../types';
import { 
  Sparkles, Calendar, Coffee, Package, Check, X, CreditCard, RotateCcw, 
  AlertCircle, ShoppingBag, ArrowUpRight, Lock, Shield, TrendingUp, Users, 
  DollarSign, CheckCircle2, RefreshCw, Trash2, Edit3 
} from 'lucide-react';

interface ProfilePanelProps {
  subscription: Subscription | null;
  orders: Order[];
  onToggleSubscriptionStatus: () => void;
  onCancelSubscription: () => void;
  onUpdateSubscriptionGrind: (grind: SubscriptionConfig['grindSize']) => void;
  onNavigateToTab: (tab: 'inicio' | 'tienda' | 'suscripcion' | 'perfil') => void;
  userEmail: string;
  onUpdateOrders?: (orders: Order[]) => void;
}

export default function ProfilePanel({
  subscription,
  orders,
  onToggleSubscriptionStatus,
  onCancelSubscription,
  onUpdateSubscriptionGrind,
  onNavigateToTab,
  userEmail,
  onUpdateOrders,
}: ProfilePanelProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isChangingGrind, setIsChangingGrind] = useState(false);

  // Administrative login states
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

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

  if (isAdminAuthenticated) {
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    const avgTicket = orders.length > 0 ? totalSales / orders.length : 0;
    const subscriberCount = subscription && subscription.status === 'active' ? 125 : 124;

    const handleCycleStatus = (orderId: string) => {
      if (!onUpdateOrders) return;
      const updated = orders.map(o => {
        if (o.id === orderId) {
          const nextStatus: Order['status'] = 
            o.status === 'pending' ? 'shipped' :
            o.status === 'shipped' ? 'delivered' : 'pending';
          return { ...o, status: nextStatus };
        }
        return o;
      });
      onUpdateOrders(updated);
    };

    const handleDeleteOrder = (orderId: string) => {
      if (!onUpdateOrders) return;
      const updated = orders.filter(o => o.id !== orderId);
      onUpdateOrders(updated);
    };

    const handleSimulateNewOrder = () => {
      if (!onUpdateOrders) return;
      const randomId = 'ALB-' + Math.floor(100000 + Math.random() * 900000);
      const mockOrder: Order = {
        id: randomId,
        date: new Date().toISOString().split('T')[0],
        items: [
          {
            name: 'Colombia Huila Ancestral',
            quantity: Math.floor(Math.random() * 2) + 1,
            price: 18.5,
            grindSize: 'Espresso'
          }
        ],
        total: 18.5 * (Math.floor(Math.random() * 2) + 1),
        subscription: undefined,
        shippingAddress: {
          fullName: ['Carlos Pérez', 'Sofía Rodríguez', 'Mateo Giménez', 'Lucía Díaz'][Math.floor(Math.random() * 4)],
          street: ['Av. Libertador 4500', 'San Martín 123', 'Calle 50 nro 620', 'Pampa 3320'][Math.floor(Math.random() * 4)],
          city: 'Buenos Aires',
          province: ['Buenos Aires', 'CABA', 'Córdoba', 'Santa Fe'][Math.floor(Math.random() * 4)],
          locality: ['La Plata', 'Palermo', 'Rosario', 'Córdoba Capital'][Math.floor(Math.random() * 4)],
          postalCode: 'B1900',
          phone: '+54 9 11 ' + Math.floor(10000000 + Math.random() * 90000000),
          email: 'usuario.demo' + Math.floor(Math.random() * 100) + '@gmail.com',
        },
        status: 'pending'
      };
      onUpdateOrders([mockOrder, ...orders]);
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header Admin */}
        <div className="bg-coffee-900 text-coffee-50 rounded-3xl p-6 sm:p-8 shadow-xl border border-coffee-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#FAF7F2_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="space-y-2 z-10">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-400" />
              <span className="font-mono text-xs text-amber-400 tracking-widest uppercase font-bold">PANEL DE ADMINISTRACIÓN CENTRAL</span>
            </div>
            <h1 className="font-serif text-3xl font-bold">Consola de Control Albor</h1>
            <p className="text-sm text-coffee-300 font-sans">
              Autenticado como: <span className="font-bold text-amber-400 font-mono">Admin</span>
            </p>
          </div>
          <button
            onClick={() => setIsAdminAuthenticated(false)}
            className="px-5 py-2.5 bg-coffee-800 hover:bg-coffee-750 text-coffee-100 text-xs font-semibold rounded-xl transition-all border border-coffee-700 z-10 shadow-md"
            id="admin-logout-btn"
          >
            Salir del Modo Admin
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-coffee-950 border border-coffee-200 dark:border-coffee-850 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-xl">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-mono text-coffee-400 dark:text-coffee-500 uppercase">Ventas Totales (Sim.)</p>
              <h3 className="text-2xl font-bold text-coffee-900 dark:text-coffee-100 font-mono mt-0.5">${totalSales.toFixed(2)}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-coffee-950 border border-coffee-200 dark:border-coffee-850 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-mono text-coffee-400 dark:text-coffee-500 uppercase">Miembros Club (Sim.)</p>
              <h3 className="text-2xl font-bold text-coffee-900 dark:text-coffee-100 font-mono mt-0.5">{subscriberCount}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-coffee-950 border border-coffee-200 dark:border-coffee-850 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-mono text-coffee-400 dark:text-coffee-500 uppercase">Ticket Promedio</p>
              <h3 className="text-2xl font-bold text-coffee-900 dark:text-coffee-100 font-mono mt-0.5">${avgTicket.toFixed(2)}</h3>
            </div>
          </div>
        </div>

        {/* Order Admin Table */}
        <div className="bg-white dark:bg-coffee-950/20 border border-coffee-200 dark:border-coffee-850 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-coffee-900 dark:text-coffee-100">Gestión de Pedidos & Envíos</h2>
              <p className="text-xs text-coffee-500 dark:text-coffee-400 mt-0.5">Control y actualización de pedidos realizados en esta simulación.</p>
            </div>
            <button
              onClick={handleSimulateNewOrder}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-coffee-950 text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
              id="simulate-order-btn"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Simular Nuevo Pedido
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center p-12 border border-dashed border-coffee-200 dark:border-coffee-850 rounded-2xl text-coffee-500 dark:text-coffee-400 text-sm">
              No hay pedidos simulados en el sistema. Haz clic en "Simular Nuevo Pedido" para comenzar.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-coffee-200 dark:border-coffee-850 text-coffee-400 font-mono uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Pedido / Fecha</th>
                    <th className="py-3 px-4">Cliente / Contacto</th>
                    <th className="py-3 px-4">Dirección</th>
                    <th className="py-3 px-4">Productos / Total</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-100 dark:divide-coffee-900/50">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-coffee-50/50 dark:hover:bg-coffee-900/10 transition-colors">
                      <td className="py-4 px-4 font-sans">
                        <span className="font-mono font-bold text-coffee-900 dark:text-coffee-100 block">{o.id}</span>
                        <span className="text-[10px] text-coffee-400 font-mono block mt-0.5">{o.date}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-coffee-900 dark:text-coffee-100 block">{o.shippingAddress.fullName}</span>
                        <span className="text-[10px] text-coffee-400 font-mono block mt-0.5">{o.shippingAddress.email || 'Sin email'}</span>
                        <span className="text-[10px] text-coffee-400 font-mono block">{o.shippingAddress.phone || 'Sin tel'}</span>
                      </td>
                      <td className="py-4 px-4 text-coffee-750 dark:text-coffee-300 max-w-[200px] truncate">
                        <span className="block">{o.shippingAddress.street}</span>
                        <span className="text-[10px] text-coffee-400 block mt-0.5">
                          {o.shippingAddress.locality || o.shippingAddress.city}, {o.shippingAddress.province || ''} ({o.shippingAddress.postalCode})
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono">
                        <div className="text-coffee-800 dark:text-coffee-200 max-w-[150px] truncate">
                          {o.items.map((it, idx) => (
                            <span key={idx} className="block text-[11px] font-sans">
                              {it.name} (x{it.quantity})
                            </span>
                          ))}
                        </div>
                        <span className="font-bold text-coffee-900 dark:text-coffee-100 block mt-1">${o.total.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleCycleStatus(o.id)}
                          title="Haz clic para avanzar de estado"
                          className={`px-2.5 py-1 border rounded-md font-medium text-[10px] tracking-wide uppercase transition-all ${getOrderBadge(o.status)} hover:ring-2 hover:ring-amber-400`}
                        >
                          {getOrderBadgeLabel(o.status)} 🔄
                        </button>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDeleteOrder(o.id)}
                          className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all"
                          title="Eliminar registro"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

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

      {/* Discrete administrative portal link */}
      <div className="flex justify-center pt-8 border-t border-coffee-200/30 dark:border-coffee-800/10">
        <button 
          onClick={() => {
            setShowAdminLogin(true);
            setAdminError('');
            setAdminUser('');
            setAdminPass('');
          }}
          className="text-[10px] font-mono text-coffee-400 hover:text-amber-600 dark:text-coffee-600 dark:hover:text-amber-400 flex items-center gap-1.5 transition-colors duration-200"
          id="admin-portal-trigger"
        >
          <Lock className="h-3 w-3" />
          <span>Acceso de Administración</span>
        </button>
      </div>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-coffee-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-coffee-950 border border-coffee-200 dark:border-coffee-850 w-full max-w-sm rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 text-left"
            >
              <button
                onClick={() => setShowAdminLogin(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-coffee-400 hover:text-coffee-600 dark:hover:text-coffee-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center space-y-2">
                <div className="h-12 w-12 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-coffee-900 dark:text-coffee-100">Acceso Restringido</h3>
                <p className="text-xs text-coffee-500 dark:text-coffee-400 font-sans">
                  Ingrese las credenciales autorizadas de administrador.
                </p>
              </div>

              {adminError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-700 dark:text-rose-400 text-xs text-center font-medium font-sans">
                  {adminError}
                </div>
              )}

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (adminUser === 'Admin' && adminPass === 'hola1234') {
                    setIsAdminAuthenticated(true);
                    setShowAdminLogin(false);
                    setAdminError('');
                  } else {
                    setAdminError('Credenciales incorrectas. Verifique e intente nuevamente.');
                  }
                }}
                className="space-y-4 text-xs font-sans"
              >
                <div className="space-y-1.5">
                  <label className="font-bold text-coffee-700 dark:text-coffee-300">Nombre de Usuario:</label>
                  <input
                    type="text"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    placeholder="Ej: Admin"
                    className="w-full px-4 py-3 bg-coffee-50 dark:bg-coffee-900 border border-coffee-200 dark:border-coffee-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-coffee-900 dark:text-coffee-100"
                    id="admin-user-input"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-coffee-700 dark:text-coffee-300">Contraseña:</label>
                  <input
                    type="password"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-coffee-50 dark:bg-coffee-900 border border-coffee-200 dark:border-coffee-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-coffee-900 dark:text-coffee-100"
                    id="admin-pass-input"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-coffee-900 hover:bg-coffee-850 dark:bg-amber-500 dark:hover:bg-amber-400 text-coffee-50 dark:text-coffee-950 font-bold rounded-xl transition-all shadow-md uppercase tracking-wider text-xs"
                >
                  Verificar Credenciales
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
