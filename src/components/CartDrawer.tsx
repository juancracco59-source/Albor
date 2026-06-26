import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const subtotal = cart.reduce((acc, item) => acc + item.coffee.price * item.quantity, 0);
  const freeShippingThreshold = 50.0;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 4.50;
  const total = subtotal + shippingCost;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-coffee-950/60 backdrop-blur-sm"
          ></motion.div>

          {/* Sliding Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-coffee-50 border-l border-coffee-200/60 flex flex-col justify-between h-full shadow-2xl relative"
              id="cart-drawer-panel"
            >
              {/* Header */}
              <div className="p-6 border-b border-coffee-200/50 flex items-center justify-between bg-coffee-100/30">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="h-5 w-5 text-coffee-800" />
                  <h2 className="font-serif text-lg font-bold text-coffee-900">Carrito de Compras</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 bg-transparent hover:bg-coffee-200/60 text-coffee-600 hover:text-coffee-900 rounded-lg transition-all"
                  id="close-cart-btn"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Free Shipping Progress bar */}
              {cart.length > 0 && (
                <div className="px-6 py-3.5 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-900 font-sans flex items-center justify-between">
                  {isFreeShipping ? (
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Truck className="h-4 w-4 text-amber-700" />
                      <span>¡Felicidades! Tienes envío gratis sin cargo.</span>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="flex justify-between font-medium">
                        <span>Faltan ${(freeShippingThreshold - subtotal).toFixed(2)} para envío gratis</span>
                        <span>{Math.round((subtotal / freeShippingThreshold) * 100)}%</span>
                      </div>
                      <div className="w-full bg-coffee-200 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div 
                          className="bg-amber-600 h-1.5 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cart Content list */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center py-20 flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-coffee-100 rounded-full text-coffee-400">
                      <ShoppingBag className="h-10 w-10" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-coffee-900">Tu carrito está vacío</h3>
                    <p className="text-xs text-coffee-500 max-w-[240px] leading-relaxed">
                      Explora nuestros granos de especialidad y selecciona tu molienda favorita para comenzar.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-4 px-6 py-2.5 bg-coffee-800 text-coffee-50 text-xs font-bold rounded-xl hover:bg-coffee-700 transition-all"
                    >
                      Seguir Comprando
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {cart.map((item, idx) => (
                      <div 
                        key={`${item.coffee.id}-${item.grindSize}-${idx}`}
                        className="flex gap-4 p-4 bg-coffee-50 border border-coffee-200/40 rounded-xl relative hover:border-coffee-300/60 transition-all"
                        id={`cart-item-${idx}`}
                      >
                        {/* Item image */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-coffee-200">
                          <img 
                            src={item.coffee.image} 
                            alt={item.coffee.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-1.5 pr-6">
                          <h4 className="font-serif text-sm font-bold text-coffee-900 leading-snug">
                            {item.coffee.name}
                          </h4>
                          <div className="flex flex-col gap-0.5 text-[11px] font-mono text-coffee-500">
                            <span>Molienda: <b className="text-coffee-700 font-semibold">{item.grindSize}</b></span>
                            <span>Origen: {item.coffee.origin}</span>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center justify-between pt-2">
                            {/* Quantity Adjuster */}
                            <div className="flex items-center border border-coffee-200 bg-coffee-150/40 rounded-lg overflow-hidden scale-90 origin-left">
                              <button
                                onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                                className="px-2.5 py-1 text-coffee-600 hover:bg-coffee-200 hover:text-coffee-900 font-bold transition-all"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-bold text-coffee-900 min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                                className="px-2.5 py-1 text-coffee-600 hover:bg-coffee-200 hover:text-coffee-900 font-bold transition-all"
                              >
                                +
                              </button>
                            </div>

                            {/* Cost display */}
                            <span className="font-mono text-sm font-bold text-coffee-900">
                              ${(item.coffee.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Trash Button */}
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="absolute top-4 right-4 p-1.5 text-coffee-400 hover:text-rose-600 bg-transparent rounded-lg hover:bg-rose-50 transition-all"
                          title="Eliminar del Carrito"
                          id={`cart-item-remove-${idx}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Summary & Checkout (Sticky Footer) */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-coffee-200/50 bg-coffee-100/30 space-y-4">
                  <div className="space-y-2 text-sm font-sans text-coffee-700">
                    <div className="flex justify-between">
                      <span>Subtotal de granos:</span>
                      <span className="font-mono font-bold text-coffee-950">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Costo de envío:</span>
                      <span className="font-mono">
                        {isFreeShipping ? <span className="text-amber-700 font-bold">Gratis</span> : `$${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="border-t border-coffee-200/60 pt-3.5 flex justify-between items-end">
                      <span className="font-serif font-bold text-base text-coffee-900">Monto Total:</span>
                      <span className="text-xl font-bold font-mono text-coffee-900">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={onCheckout}
                    className="w-full py-4 bg-coffee-800 hover:bg-coffee-700 text-coffee-50 font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 group"
                    id="cart-proceed-checkout-btn"
                  >
                    <span>Proceder al Pago</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <p className="text-[10px] text-center text-coffee-400 font-mono">
                    🔒 Transacción encriptada de simulación segura SSL.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
