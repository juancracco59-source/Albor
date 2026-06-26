import React, { useState } from 'react';
import { ShoppingBag, Coffee, Menu, X, User, Sparkles, Sun, Moon } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  activeTab: 'inicio' | 'tienda' | 'suscripcion' | 'perfil';
  setActiveTab: (tab: 'inicio' | 'tienda' | 'suscripcion' | 'perfil') => void;
  cart: CartItem[];
  setCartOpen: (open: boolean) => void;
  hasActiveSubscription: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  cart,
  setCartOpen,
  hasActiveSubscription,
  isDarkMode,
  toggleTheme,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'tienda', label: 'Tienda de Granos' },
    { id: 'suscripcion', label: 'Suscripción Club' },
    { id: 'perfil', label: 'Mi Cuenta' },
  ] as const;

  const handleNavClick = (tab: 'inicio' | 'tienda' | 'suscripcion' | 'perfil') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-coffee-50/90 dark:bg-coffee-950/90 backdrop-blur-md border-b border-coffee-200/50 dark:border-coffee-900/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('inicio')}
            className="flex items-center gap-2.5 cursor-pointer group"
            id="nav-logo"
          >
            <div className="p-2.5 bg-coffee-800 dark:bg-coffee-900 text-coffee-50 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-coffee-700 dark:group-hover:bg-coffee-800 shadow-md">
              <Coffee className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-coffee-900 dark:text-coffee-50 leading-none">
                ALBOR
              </span>
              <span className="text-[10px] tracking-[0.2em] font-mono text-coffee-500 dark:text-coffee-400 uppercase leading-none mt-1">
                Café de Especialidad
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 relative ${
                    isActive 
                      ? 'text-coffee-800 dark:text-coffee-50 bg-coffee-100/80 dark:bg-coffee-900/80 font-semibold' 
                      : 'text-coffee-600 dark:text-coffee-300 hover:text-coffee-900 dark:hover:text-coffee-50 hover:bg-coffee-100/40 dark:hover:bg-coffee-900/40'
                  }`}
                >
                  {item.label}
                  {item.id === 'suscripcion' && hasActiveSubscription && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border border-coffee-50 dark:border-coffee-950"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Subscription Indicator */}
            {hasActiveSubscription && (
              <button 
                onClick={() => handleNavClick('perfil')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400 text-xs font-semibold rounded-full hover:bg-amber-500/20 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                <span>Miembro Club Albor</span>
              </button>
            )}

            {/* Theme Toggle Trigger */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-coffee-200/50 dark:border-coffee-800/80 bg-transparent hover:bg-coffee-100/80 dark:hover:bg-coffee-900/80 text-coffee-700 dark:text-coffee-300 hover:text-coffee-900 dark:hover:text-coffee-50 transition-all duration-200"
              title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
              id="theme-toggle-btn"
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-coffee-700" />}
            </button>

            {/* Profile Trigger */}
            <button
              onClick={() => handleNavClick('perfil')}
              className={`p-2.5 rounded-xl border border-coffee-200/50 dark:border-coffee-800/80 hover:bg-coffee-100/80 dark:hover:bg-coffee-900/80 text-coffee-700 dark:text-coffee-300 hover:text-coffee-900 dark:hover:text-coffee-100 transition-all duration-200 ${
                activeTab === 'perfil' ? 'bg-coffee-200 dark:bg-coffee-800 text-coffee-900 dark:text-coffee-50' : 'bg-transparent'
              }`}
              title="Mi Cuenta"
              id="nav-profile-btn"
            >
              <User className="h-5 w-5" />
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="p-2.5 rounded-xl border border-coffee-200/50 dark:border-coffee-800/80 bg-transparent hover:bg-coffee-100/80 dark:hover:bg-coffee-900/80 text-coffee-700 dark:text-coffee-300 hover:text-coffee-900 dark:hover:text-coffee-100 transition-all duration-200 relative"
              title="Ver Carrito"
              id="nav-cart-btn"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-coffee-700 dark:bg-coffee-600 text-coffee-50 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-coffee-50 dark:border-coffee-950 shadow-md">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-coffee-200/50 dark:border-coffee-800/80 bg-transparent hover:bg-coffee-100/80 dark:hover:bg-coffee-900/80 text-coffee-700 dark:text-coffee-300 hover:text-coffee-900 dark:hover:text-coffee-100 transition-all"
              id="nav-mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-coffee-200/50 dark:border-coffee-900/50 bg-coffee-50 dark:bg-coffee-950 shadow-lg animate-fadeIn">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium tracking-wide transition-all ${
                    isActive 
                      ? 'text-coffee-850 dark:text-coffee-50 bg-coffee-100 dark:bg-coffee-900 font-semibold border-l-4 border-coffee-700 dark:border-coffee-400 pl-3' 
                      : 'text-coffee-650 dark:text-coffee-300 hover:text-coffee-900 dark:hover:text-coffee-100 hover:bg-coffee-100/50 dark:hover:bg-coffee-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    {item.id === 'suscripcion' && hasActiveSubscription && (
                      <span className="px-2 py-0.5 bg-amber-500 text-coffee-950 text-xs font-bold rounded-full">
                        Activo
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
