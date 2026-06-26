import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StoreCatalog from './components/StoreCatalog';
import SubscriptionBuilder from './components/SubscriptionBuilder';
import ProfilePanel from './components/ProfilePanel';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import { Coffee as CoffeeType, CartItem, Subscription, SubscriptionConfig, Order } from './types';
import { Coffee, Sparkles, CheckCircle2, ChevronRight, Github, Info, Heart } from 'lucide-react';

// Seed historical orders helper
const INITIAL_ORDERS: Order[] = [
  {
    id: 'OR-847291',
    date: '2026-05-12',
    items: [
      { name: 'Yirgacheffe Kochere', quantity: 1, price: 18.50, grindSize: 'Filtro (V60/Chemex)' },
      { name: 'San José Red Honey', quantity: 1, price: 16.00, grindSize: 'En grano' }
    ],
    total: 34.50,
    shippingAddress: {
      fullName: 'Juan Carlos Rossi',
      street: 'Av. Santa Fe 1234, Piso 4 B',
      city: 'CABA',
      postalCode: 'C1059'
    },
    status: 'delivered'
  },
  {
    id: 'OR-612059',
    date: '2026-04-01',
    items: [
      { name: 'Cerrado Dulce Natural', quantity: 2, price: 14.50, grindSize: 'Espresso' }
    ],
    total: 33.50, // 29.00 + 4.50 shipping
    shippingAddress: {
      fullName: 'Juan Carlos Rossi',
      street: 'Av. Santa Fe 1234, Piso 4 B',
      city: 'CABA',
      postalCode: 'C1059'
    },
    status: 'delivered'
  }
];

export default function App() {
  const userEmail = "juancracco59@gmail.com"; // Customized from metadata

  // Application Tabs: 'inicio' | 'tienda' | 'suscripcion' | 'perfil'
  const [activeTab, setActiveTab] = useState<'inicio' | 'tienda' | 'suscripcion' | 'perfil'>('inicio');

  // Interactive UI drawers & modals
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Subscription builder transient config (for checkout redirection)
  const [pendingSubscriptionConfig, setPendingSubscriptionConfig] = useState<SubscriptionConfig | null>(null);
  const [pendingSubscriptionPrice, setPendingSubscriptionPrice] = useState<number>(0);

  // Floating Toast Notifications state
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('origen_cart');
    const savedSub = localStorage.getItem('origen_subscription');
    const savedOrders = localStorage.getItem('origen_orders');

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedSub) setSubscription(JSON.parse(savedSub));
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Seed initial mock history so page has content
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('origen_orders', JSON.stringify(INITIAL_ORDERS));
    }
  }, []);

  // Sync to LocalStorage
  const updateAndSaveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('origen_cart', JSON.stringify(newCart));
  };

  const updateAndSaveSubscription = (newSub: Subscription | null) => {
    setSubscription(newSub);
    if (newSub) {
      localStorage.setItem('origen_subscription', JSON.stringify(newSub));
    } else {
      localStorage.removeItem('origen_subscription');
    }
  };

  const updateAndSaveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('origen_orders', JSON.stringify(newOrders));
  };

  // Toast trigger
  const triggerNotification = (message: string) => {
    setToast({ message, visible: true });
  };

  // Auto hide toast
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // Add Product to Cart
  const handleAddToCart = (coffee: CoffeeType, quantity: number, grindSize: CartItem['grindSize']) => {
    const existingIndex = cart.findIndex(
      item => item.coffee.id === coffee.id && item.grindSize === grindSize
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      updateAndSaveCart(updated);
    } else {
      updateAndSaveCart([...cart, { coffee, quantity, grindSize }]);
    }
  };

  // Remove item from Cart
  const handleRemoveCartItem = (index: number) => {
    const updated = cart.filter((_, idx) => idx !== index);
    updateAndSaveCart(updated);
    triggerNotification("Producto removido del carrito.");
  };

  // Update item quantity in Cart
  const handleUpdateCartItemQuantity = (index: number, quantity: number) => {
    const updated = [...cart];
    updated[index].quantity = quantity;
    updateAndSaveCart(updated);
  };

  // Initiate Subscription from wizard (opens checkout directly)
  const handleInitiateSubscription = (config: SubscriptionConfig, price: number) => {
    setPendingSubscriptionConfig(config);
    setPendingSubscriptionPrice(price);
    setCheckoutOpen(true);
  };

  // Complete Simulated Checkout (saves subscription and/or logs purchases)
  const handleCompleteCheckout = (
    shippingAddress: { fullName: string; street: string; city: string; postalCode: string },
    newSubscription: { config: SubscriptionConfig; price: number } | null
  ) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const generatedId = `OR-${Math.floor(100000 + Math.random() * 900000)}`;

    if (newSubscription) {
      // Create Subscription membership
      const createdSub: Subscription = {
        id: `SUB-${Math.floor(10000 + Math.random() * 90000)}`,
        config: newSubscription.config,
        status: 'active',
        nextDelivery: 'El próximo martes (tueste semanal fresco)',
        price: newSubscription.price,
        startDate: todayStr
      };

      updateAndSaveSubscription(createdSub);

      // Log subscription in orders history
      const subOrder: Order = {
        id: generatedId,
        date: todayStr,
        items: [],
        subscription: newSubscription.config,
        total: newSubscription.price,
        shippingAddress,
        status: 'pending'
      };

      updateAndSaveOrders([subOrder, ...orders]);
      setPendingSubscriptionConfig(null);
      setPendingSubscriptionPrice(0);
      triggerNotification("Suscripción creada con éxito. ¡Bienvenido al club!");
    } else {
      // Normal purchase from cart
      const cartItemsSummary = cart.map(item => ({
        name: item.coffee.name,
        quantity: item.quantity,
        price: item.coffee.price,
        grindSize: item.grindSize
      }));

      const normalSubtotal = cart.reduce((acc, item) => acc + item.coffee.price * item.quantity, 0);
      const isFreeShipping = normalSubtotal >= 50.0;
      const normalShipping = isFreeShipping ? 0 : 4.50;

      const purchaseOrder: Order = {
        id: generatedId,
        date: todayStr,
        items: cartItemsSummary,
        total: normalSubtotal + normalShipping,
        shippingAddress,
        status: 'pending'
      };

      updateAndSaveOrders([purchaseOrder, ...orders]);
      updateAndSaveCart([]); // Clear Cart
      triggerNotification("Pedido procesado correctamente.");
    }
  };

  // Pause / Resume active subscription membership
  const handleToggleSubscriptionStatus = () => {
    if (!subscription) return;
    const nextStatus: Subscription['status'] = subscription.status === 'active' ? 'paused' : 'active';
    const updated: Subscription = {
      ...subscription,
      status: nextStatus,
      nextDelivery: nextStatus === 'active' ? 'El próximo martes (tueste semanal fresco)' : 'Pausado'
    };
    updateAndSaveSubscription(updated);
    triggerNotification(
      nextStatus === 'active'
        ? "Membresía reactivada exitosamente. ¡Recibirás café pronto!"
        : "Suscripción pausada sin costo. Puedes reactivar cuando desees."
    );
  };

  // Cancel active subscription membership
  const handleCancelSubscription = () => {
    if (!subscription) return;
    const updated: Subscription = {
      ...subscription,
      status: 'cancelled',
      nextDelivery: 'Cancelado'
    };
    updateAndSaveSubscription(updated);
    triggerNotification("Tu membresía ha sido cancelada.");
  };

  // Update active subscription grind size
  const handleUpdateSubscriptionGrind = (grind: SubscriptionConfig['grindSize']) => {
    if (!subscription) return;
    const updated: Subscription = {
      ...subscription,
      config: {
        ...subscription.config,
        grindSize: grind
      }
    };
    updateAndSaveSubscription(updated);
    triggerNotification(`Punto de molienda actualizado a: ${grind}`);
  };

  // Proceed checkout helper from cart drawer
  const handleProceedCheckoutFromCart = () => {
    setPendingSubscriptionConfig(null);
    setPendingSubscriptionPrice(0);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const hasActiveSubscription = subscription !== null && subscription.status === 'active';

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF7F2] font-sans antialiased text-coffee-950">
      
      {/* Navigation header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cart={cart}
        setCartOpen={setCartOpen}
        hasActiveSubscription={hasActiveSubscription}
      />

      {/* Main Container viewport */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            id="tab-content-container"
          >
            {activeTab === 'inicio' && (
              <Hero onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />
            )}
            
            {activeTab === 'tienda' && (
              <StoreCatalog 
                onAddToCart={handleAddToCart} 
                showNotification={triggerNotification}
              />
            )}

            {activeTab === 'suscripcion' && (
              <SubscriptionBuilder 
                onSubscribe={handleInitiateSubscription} 
                showNotification={triggerNotification}
              />
            )}

            {activeTab === 'perfil' && (
              <ProfilePanel 
                subscription={subscription}
                orders={orders}
                onToggleSubscriptionStatus={handleToggleSubscriptionStatus}
                onCancelSubscription={handleCancelSubscription}
                onUpdateSubscriptionGrind={handleUpdateSubscriptionGrind}
                onNavigateToTab={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                userEmail={userEmail}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Shared Footer block */}
      <footer className="bg-coffee-950 text-coffee-100 border-t border-coffee-900 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-coffee-800 text-coffee-50 rounded-lg">
                <Coffee className="h-4 w-4" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-coffee-50">ALBOR</span>
            </div>
            <p className="text-xs text-coffee-400 font-sans leading-relaxed">
              La plataforma definitiva de tueste fresco e importación de granos de especialidad. Conectamos pequeños agricultores éticos con amantes del café gourmet.
            </p>
          </div>

          <div className="space-y-3 font-sans text-xs">
            <h4 className="font-serif font-bold text-coffee-50 text-sm tracking-wide">Explorar</h4>
            <ul className="space-y-2 text-coffee-400">
              <li><button onClick={() => { setActiveTab('tienda'); window.scrollTo(0,0); }} className="hover:text-amber-400 transition-colors text-left">Tienda de Granos</button></li>
              <li><button onClick={() => { setActiveTab('suscripcion'); window.scrollTo(0,0); }} className="hover:text-amber-400 transition-colors text-left">Suscripción Mensual</button></li>
              <li><button onClick={() => { setActiveTab('perfil'); window.scrollTo(0,0); }} className="hover:text-amber-400 transition-colors text-left">Mi Perfil / Miembro</button></li>
            </ul>
          </div>

          <div className="space-y-3 font-sans text-xs">
            <h4 className="font-serif font-bold text-coffee-50 text-sm tracking-wide">Compromiso Albor</h4>
            <ul className="space-y-2 text-coffee-400">
              <li className="flex items-center gap-1.5"><span>•</span> Puntuación SCA superior a 85 pts</li>
              <li className="flex items-center gap-1.5"><span>•</span> Tueste artesanal reciente (72 hs máx)</li>
              <li className="flex items-center gap-1.5"><span>•</span> Pago justo a cooperativas agrícolas</li>
            </ul>
          </div>

          <div className="space-y-3 font-sans text-xs">
            <h4 className="font-serif font-bold text-coffee-50 text-sm tracking-wide">Soporte y Contacto</h4>
            <p className="text-coffee-400 leading-normal">
              ¿Tienes dudas sobre la molienda ideal? <br />
              Soporte al miembro en: <br />
              <b className="text-coffee-100">{userEmail}</b>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-coffee-900/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-coffee-500 gap-4">
          <p>© 2026 ALBOR CAFÉ DE ESPECIALIDAD. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1.5">
            <span>Hecho con amor</span>
            <Heart className="h-3.5 w-3.5 text-rose-600 fill-rose-600" />
            <span>para amantes del buen café</span>
          </div>
        </div>
      </footer>

      {/* Shopping Cart Sliding Drawer */}
      <CartDrawer 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartItemQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleProceedCheckoutFromCart}
      />

      {/* Checkout Forms & Confirm Modal */}
      <CheckoutModal 
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        subscriptionConfig={pendingSubscriptionConfig}
        subscriptionPrice={pendingSubscriptionPrice}
        userEmail={userEmail}
        onCompleteCheckout={handleCompleteCheckout}
        showNotification={triggerNotification}
      />

      {/* Floating capsule toast alerts */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 p-4 bg-coffee-900 text-coffee-50 border border-coffee-700/60 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm"
            id="floating-toast-alert"
          >
            <CheckCircle2 className="h-5 w-5 text-amber-400 flex-shrink-0" />
            <p className="text-xs font-sans font-semibold leading-snug">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
