import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, SubscriptionConfig, Order } from '../types';
import { X, CreditCard, ShieldCheck, CheckCircle2, ShoppingBag, Truck, Calendar, ArrowRight, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  subscriptionConfig: SubscriptionConfig | null;
  subscriptionPrice: number;
  userEmail: string; // From metadata
  onCompleteCheckout: (
    shippingAddress: { fullName: string; street: string; city: string; postalCode: string },
    newSubscription: { config: SubscriptionConfig; price: number } | null
  ) => void;
  showNotification: (message: string) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  subscriptionConfig,
  subscriptionPrice,
  userEmail,
  onCompleteCheckout,
  showNotification,
}: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Shipping, 2: Payment, 3: Success
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');

  // Form States - Shipping
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(userEmail || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  // Form States - Payment
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Form Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Summary Totals
  const isSubscriptionOnly = subscriptionConfig !== null;
  const subtotal = isSubscriptionOnly 
    ? 0 
    : cart.reduce((acc, item) => acc + item.coffee.price * item.quantity, 0);
  
  const shippingCost = isSubscriptionOnly || subtotal >= 50 ? 0 : 4.50;
  const total = isSubscriptionOnly ? subscriptionPrice : subtotal + shippingCost;

  // Formatting helpers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  const validateShippingForm = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'El nombre completo es requerido';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Introduce un email válido';
    if (!street.trim()) newErrors.street = 'La dirección es requerida';
    if (!city.trim()) newErrors.city = 'La ciudad es requerida';
    if (!postalCode.trim()) newErrors.postalCode = 'El código postal es requerido';
    if (!phone.trim()) newErrors.phone = 'El teléfono es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentForm = () => {
    const newErrors: Record<string, string> = {};
    if (cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Número de tarjeta inválido';
    if (!cardName.trim()) newErrors.cardName = 'Nombre del titular requerido';
    if (cardExpiry.length < 5) newErrors.cardExpiry = 'Fecha de expiración inválida';
    if (cardCvv.length < 3) newErrors.cardCvv = 'CVV inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateShippingForm()) {
        setStep(2);
      }
    }
  };

  const handleCompletePayment = () => {
    if (!validatePaymentForm()) return;

    setIsProcessing(true);

    // Simulate server-side processing
    setTimeout(() => {
      setIsProcessing(false);
      const orderId = `OR-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedOrderId(orderId);
      setStep(3);

      // Trigger state updates
      onCompleteCheckout(
        { fullName, street, city, postalCode },
        subscriptionConfig ? { config: subscriptionConfig, price: subscriptionPrice } : null
      );
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step !== 3 && !isProcessing ? onClose : undefined}
            className="fixed inset-0 bg-coffee-950/70 backdrop-blur-sm"
          ></motion.div>

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-coffee-50 rounded-3xl overflow-hidden border border-coffee-200/80 shadow-2xl max-w-4xl w-full relative z-10 max-h-[92vh] flex flex-col lg:flex-row"
            id="checkout-modal-container"
          >
            {/* Close Trigger */}
            {step !== 3 && !isProcessing && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-coffee-100 hover:bg-coffee-200 text-coffee-600 hover:text-coffee-950 rounded-full transition-all z-20"
                id="checkout-close-btn"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Left Column: Form Details (Step 1 or 2 or 3) */}
            <div className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-h-[60vh] lg:max-h-[92vh] border-b lg:border-b-0 lg:border-r border-coffee-200/50">
              
              {/* Progress Steps Indicators (Hidden on success screen) */}
              {step !== 3 && (
                <div className="flex items-center gap-2 mb-8 font-mono text-[10px] uppercase tracking-wider text-coffee-500">
                  <span className={`font-bold ${step === 1 ? 'text-coffee-800' : 'text-coffee-400'}`}>1. Envío</span>
                  <ArrowRight className="h-3 w-3" />
                  <span className={`font-bold ${step === 2 ? 'text-coffee-800' : 'text-coffee-400'}`}>2. Pago</span>
                  <ArrowRight className="h-3 w-3" />
                  <span className="text-coffee-300">3. Confirmación</span>
                </div>
              )}

              {/* STEP 1: Shipping Details */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-coffee-900">Detalles de Envío</h2>
                    <p className="text-xs text-coffee-500 font-sans mt-1">Ingresa el destino donde quieres recibir tu café recién tostado.</p>
                  </div>

                  <div className="space-y-4 text-xs font-sans">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-coffee-700 block">Nombre Completo:</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Juan Carlos Rossi"
                        className={`w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 ${
                          errors.fullName ? 'border-red-500' : 'border-coffee-200'
                        }`}
                        id="checkout-fullName"
                      />
                      {errors.fullName && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-coffee-700 block">Correo Electrónico:</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        className={`w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 ${
                          errors.email ? 'border-red-500' : 'border-coffee-200'
                        }`}
                        id="checkout-email"
                      />
                      {errors.email && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.email}</p>}
                    </div>

                    {/* Street address */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-coffee-700 block">Dirección de Entrega:</label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Av. Santa Fe 1234, Piso 4 B"
                        className={`w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 ${
                          errors.street ? 'border-red-500' : 'border-coffee-200'
                        }`}
                        id="checkout-street"
                      />
                      {errors.street && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.street}</p>}
                    </div>

                    {/* City and Postal Code */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-coffee-700 block">Ciudad / Provincia:</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="CABA"
                          className={`w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 ${
                            errors.city ? 'border-red-500' : 'border-coffee-200'
                          }`}
                          id="checkout-city"
                        />
                        {errors.city && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.city}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-coffee-700 block">Código Postal:</label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="C1059"
                          className={`w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 ${
                            errors.postalCode ? 'border-red-500' : 'border-coffee-200'
                          }`}
                          id="checkout-postalCode"
                        />
                        {errors.postalCode && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.postalCode}</p>}
                      </div>
                    </div>

                    {/* Phone number */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-coffee-700 block">Teléfono de Contacto:</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+54 11 5555 1234"
                        className={`w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 ${
                          errors.phone ? 'border-red-500' : 'border-coffee-200'
                        }`}
                        id="checkout-phone"
                      />
                      {errors.phone && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="w-full mt-6 py-3.5 bg-coffee-800 hover:bg-coffee-700 text-coffee-50 font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                    id="checkout-next-btn"
                  >
                    <span>Continuar al Pago Seguro</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* STEP 2: Payment Details (with credit card graphics!) */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-coffee-900">Método de Pago</h2>
                    <p className="text-xs text-coffee-500 font-sans mt-1">
                      {isSubscriptionOnly 
                        ? 'Simulación segura para iniciar tu suscripción recurrente.'
                        : 'Simula una transacción segura con tarjeta de crédito.'}
                    </p>
                  </div>

                  {/* Real-time Simulated Card Visual */}
                  <div className="w-full h-44 bg-gradient-to-br from-coffee-800 to-coffee-950 text-coffee-100 rounded-2xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden font-mono border border-coffee-700/50">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
                    
                    {/* Top bank logo */}
                    <div className="flex justify-between items-center z-10">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold tracking-widest text-coffee-300">CLUB ALBOR</span>
                        <span className="text-[7px] text-amber-400 font-semibold tracking-wider uppercase mt-0.5">Suscripción Especial</span>
                      </div>
                      <CreditCard className="h-5 w-5 text-coffee-300" />
                    </div>

                    {/* Card number */}
                    <p className="text-base sm:text-lg tracking-[0.15em] font-medium my-4 z-10">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </p>

                    {/* Footer */}
                    <div className="flex justify-between items-end z-10 text-xs">
                      <div className="flex flex-col text-[10px]">
                        <span className="text-coffee-400 text-[8px]">TITULAR</span>
                        <span className="truncate max-w-[150px] uppercase font-semibold text-coffee-200 mt-0.5">
                          {cardName || 'JUAN PEREZ'}
                        </span>
                      </div>
                      <div className="flex items-end gap-4 text-[10px]">
                        <div className="flex flex-col">
                          <span className="text-coffee-400 text-[8px]">EXPIRA</span>
                          <span className="font-semibold text-coffee-200 mt-0.5">{cardExpiry || 'MM/AA'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-coffee-400 text-[8px]">CVV</span>
                          <span className="font-semibold text-coffee-200 mt-0.5">{cardCvv || '•••'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form inputs */}
                  <div className="space-y-4 text-xs font-sans">
                    {/* Cardholder name */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-coffee-700 block">Nombre en la Tarjeta:</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Juan Carlos Rossi"
                        className={`w-full px-4 py-3 bg-white border rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 ${
                          errors.cardName ? 'border-red-500' : 'border-coffee-200'
                        }`}
                        id="checkout-cardName"
                        disabled={isProcessing}
                      />
                      {errors.cardName && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.cardName}</p>}
                    </div>

                    {/* Card Number */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-coffee-700 block">Número de Tarjeta:</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4500 1234 5678 9000"
                          className={`w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 ${
                            errors.cardNumber ? 'border-red-500' : 'border-coffee-200'
                          }`}
                          id="checkout-cardNumber"
                          disabled={isProcessing}
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center text-coffee-400">
                          <CreditCard className="h-4 w-4" />
                        </span>
                      </div>
                      {errors.cardNumber && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.cardNumber}</p>}
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-coffee-700 block">Fecha Expiración (MM/AA):</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="12/28"
                          className={`w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 ${
                            errors.cardExpiry ? 'border-red-500' : 'border-coffee-200'
                          }`}
                          id="checkout-cardExpiry"
                          disabled={isProcessing}
                        />
                        {errors.cardExpiry && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.cardExpiry}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-coffee-700 block">Código CVV:</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setCardCvv(val);
                          }}
                          placeholder="•••"
                          className={`w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 ${
                            errors.cardCvv ? 'border-red-500' : 'border-coffee-200'
                          }`}
                          id="checkout-cardCvv"
                          disabled={isProcessing}
                        />
                        {errors.cardCvv && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.cardCvv}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-3 pt-4 border-t border-coffee-200/50">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 border border-coffee-300 text-coffee-700 font-semibold rounded-xl text-sm hover:bg-coffee-150 transition-all"
                      disabled={isProcessing}
                    >
                      Atrás
                    </button>
                    <button
                      onClick={handleCompletePayment}
                      className="flex-[1.5] py-3 bg-amber-600 hover:bg-amber-500 text-coffee-50 font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                      id="checkout-complete-btn"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Procesando pago...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          <span>Pagar ${total.toFixed(2)}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Complete Success Screen */}
              {step === 3 && (
                <div className="text-center py-6 sm:py-10 space-y-6 flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="h-16 w-16 bg-green-500 text-coffee-50 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <CheckCircle2 className="h-10 w-10" />
                  </motion.div>

                  <div className="space-y-2">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-coffee-900">¡Pedido Confirmado!</h2>
                    <p className="text-sm text-coffee-600">Muchas gracias por confiar en Albor Café.</p>
                  </div>

                  {/* Order Receipt Card */}
                  <div className="bg-coffee-100/60 rounded-2xl p-5 border border-coffee-200/50 w-full text-left text-xs font-sans space-y-4">
                    <div className="flex justify-between items-center font-mono text-[10px] text-coffee-500 pb-3 border-b border-coffee-200/40">
                      <span>NÚMERO DE PEDIDO:</span>
                      <b className="text-coffee-900 font-bold">{generatedOrderId}</b>
                    </div>

                    <div className="space-y-2 text-coffee-700">
                      <p><b>Destinatario:</b> {fullName}</p>
                      <p><b>Dirección:</b> {street}, {city} ({postalCode})</p>
                      <p><b>Email de notificación:</b> {email}</p>
                    </div>

                    <div className="border-t border-coffee-200/40 pt-3 space-y-1">
                      <p className="flex justify-between">
                        <span>Método de entrega:</span>
                        <span className="font-semibold text-coffee-900">Envío Express de Frescura</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Fecha estimada de llegada:</span>
                        <span className="font-semibold text-coffee-900">En 3 a 5 días hábiles</span>
                      </p>
                    </div>

                    {isSubscriptionOnly && (
                      <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex gap-2 text-[11px] text-amber-900 mt-2 font-sans">
                        <Calendar className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Suscripción Mensual Activa</p>
                          <p className="mt-1">Hemos creado tu membresía. Tu primer paquete de café se procesará el próximo lunes en el tueste semanal. Puedes administrarlo en tu cuenta.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-coffee-800 hover:bg-coffee-700 text-coffee-50 font-bold rounded-xl text-sm transition-all"
                    id="checkout-success-continue-btn"
                  >
                    Cerrar y Volver
                  </button>
                </div>
              )}

            </div>

            {/* Right Column: Order Summary (Visible during step 1 & 2 only) */}
            {step !== 3 && (
              <div className="w-full lg:w-80 bg-coffee-100/50 p-6 sm:p-8 flex flex-col justify-between font-sans">
                <div>
                  <h3 className="font-serif text-lg font-bold text-coffee-900 pb-3 border-b border-coffee-200/50">Resumen del Pedido</h3>
                  
                  {/* Subscription summary or Cart items */}
                  {isSubscriptionOnly ? (
                    <div className="py-4 space-y-3.5">
                      <div className="flex gap-3 p-3 bg-coffee-50 border border-coffee-200/40 rounded-xl">
                        <ShoppingBag className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-coffee-900 text-xs">Membresía Club Albor</p>
                          <p className="text-[10px] text-coffee-500 font-mono mt-0.5 uppercase">
                            Frecuencia: {subscriptionConfig.frequency === 'weekly' ? 'Semanal' : subscriptionConfig.frequency === 'biweekly' ? 'Quincenal' : 'Mensual'}
                          </p>
                          <p className="text-[10px] text-coffee-500 font-mono">
                            Peso: {subscriptionConfig.quantity}g | {subscriptionConfig.grindSize}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 max-h-[250px] overflow-y-auto space-y-3 pr-2 border-b border-coffee-200/30">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start text-xs text-coffee-700 gap-2">
                          <div className="flex-1">
                            <p className="font-bold text-coffee-900">{item.coffee.name}</p>
                            <p className="text-[10px] text-coffee-500 font-mono mt-0.5">{item.grindSize} (x{item.quantity})</p>
                          </div>
                          <span className="font-mono text-coffee-900 font-semibold">${(item.coffee.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="py-4 space-y-2.5 text-xs text-coffee-650">
                    {/* Subtotal */}
                    <div className="flex justify-between">
                      <span>Subtotal de granos:</span>
                      <span className="font-mono text-coffee-900 font-bold">${subtotal.toFixed(2)}</span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between">
                      <span>Costo de envío:</span>
                      <span className="font-mono text-coffee-900">
                        {shippingCost === 0 ? <span className="text-amber-700 font-bold">Gratis</span> : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>

                    {/* Subscription Monthly cost */}
                    {isSubscriptionOnly && (
                      <div className="flex justify-between border-t border-dashed border-coffee-200/60 pt-2 text-amber-800 font-semibold">
                        <span>Cargo mensual Club:</span>
                        <span className="font-mono">${subscriptionPrice.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Big Grand Total */}
                <div className="border-t border-coffee-200 pt-5 mt-4">
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-coffee-500 font-bold uppercase">TOTAL DE HOY:</span>
                    <span className="text-2xl font-bold font-mono text-coffee-900">${total.toFixed(2)}</span>
                  </div>
                  
                  {isSubscriptionOnly && (
                    <p className="text-[9px] text-coffee-400 mt-2 font-mono leading-normal">
                      * El cargo de ${subscriptionPrice.toFixed(2)} se debitará mensualmente de forma recurrente. Puedes pausar o cancelar sin cargo.
                    </p>
                  )}
                </div>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
