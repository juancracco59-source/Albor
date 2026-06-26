import React from 'react';
import { motion } from 'motion/react';
import { Coffee, ShieldCheck, Truck, Sparkles, ChevronRight, Star, Heart } from 'lucide-react';

interface HeroProps {
  onNavigate: (tab: 'inicio' | 'tienda' | 'suscripcion' | 'perfil') => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  // Features of Albor Café
  const features = [
    {
      icon: <Coffee className="h-6 w-6 text-coffee-600" />,
      title: "Granos de Especialidad (SCA > 85)",
      description: "Importamos únicamente granos seleccionados con puntuaciones sobresalientes de catación internacional. Trazabilidad total de fincas éticas."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-coffee-600" />,
      title: "Tueste Artesanal Semanal",
      description: "Tostamos en lotes pequeños de manera semanal para optimizar el perfil de sabor de cada origen. Recibe tu café en el pico de su frescura."
    },
    {
      icon: <Truck className="h-6 w-6 text-coffee-600" />,
      title: "Envío Prioritario Express",
      description: "Envíos directos en empaques herméticos con válvula de desgasificación para mantener intactos los volátiles aromáticos."
    }
  ];

  // Steps for the subscription
  const steps = [
    {
      num: "01",
      title: "Selecciona tu perfil",
      desc: "Elige entre notas florales y frutales, achocolatadas, o sorpréndete con una rotación mensual curada por nuestro maestro tostador."
    },
    {
      num: "02",
      title: "Elige molienda y peso",
      desc: "Indica si prefieres en grano para moler en casa o molienda específica para tu cafetera (espresso, filtro, prensa o italiana) y la cantidad."
    },
    {
      num: "03",
      title: "Recibe frescura mensual",
      desc: "Tostado el lunes, enviado el martes. Disfruta del café premium en la comodidad de tu hogar con envío gratis y cancela cuando quieras."
    }
  ];

  const testimonial = {
    quote: "La suscripción de Albor cambió por completo mis mañanas. El perfil frutal de Etiopía Kochere tiene una acidez tan limpia y floral que parece un té de jazmín. Es el mejor café que he probado en años.",
    author: "Sofía Rossi",
    role: "Aficionada y Barista Hogareña",
    stars: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
  };

  return (
    <div className="w-full pb-16">
      {/* Top Banner */}
      <div className="bg-coffee-900 text-coffee-100 text-center py-2 px-4 text-xs font-mono tracking-wider">
        ☕ ENVÍO SIN CARGO EN TODAS LAS SUSCRIPCIONES Y COMPRAS SUPERIORES A $50. TUESTE RECIENTE GARANTIZADO.
      </div>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-28 overflow-hidden bg-mesh">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Text */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-coffee-100 border border-coffee-300 text-coffee-800 text-xs font-semibold rounded-full"
            >
              <Star className="h-3.5 w-3.5 fill-coffee-600 text-coffee-600" />
              <span>Cafés Seleccionados con Puntuación SCA superior a 85 pts</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-coffee-900 tracking-tight leading-[1.1]"
            >
              El arte del café de especialidad, <br />
              <span className="text-coffee-600 italic">fresco en tu taza.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-coffee-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans"
            >
              Descubre granos de fincas sostenibles de todo el mundo, tostados artesanalmente de forma semanal para revelar notas únicas e inolvidables de frutas, flores, chocolates y especias.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
            >
              <button
                onClick={() => onNavigate('suscripcion')}
                className="px-8 py-4 bg-coffee-800 hover:bg-coffee-700 text-coffee-50 font-semibold rounded-xl tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                id="hero-sub-btn"
              >
                <span>Únete al Club de Suscripción</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigate('tienda')}
                className="px-8 py-4 bg-transparent hover:bg-coffee-200/50 border-2 border-coffee-800 text-coffee-800 font-semibold rounded-xl tracking-wide transition-all duration-300 flex items-center justify-center"
                id="hero-shop-btn"
              >
                Explorar Tienda de Granos
              </button>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-coffee-200/60 max-w-md mx-auto lg:mx-0"
            >
              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-bold text-coffee-900">100%</span>
                <span className="text-xs text-coffee-500 font-mono">Arábica Premium</span>
              </div>
              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-bold text-coffee-900">72hs</span>
                <span className="text-xs text-coffee-500 font-mono">Máximo post-tueste</span>
              </div>
              <div>
                <span className="block font-serif text-2xl sm:text-3xl font-bold text-coffee-900">Ético</span>
                <span className="text-xs text-coffee-500 font-mono">Trazabilidad Directa</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Image / Coffee Presentation */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-coffee-100 aspect-[4/5] w-full max-w-[400px] bg-coffee-100"
            >
              <img 
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop" 
                alt="Café de especialidad recién hecho" 
                className="w-full h-full object-cover brightness-[0.95]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/60 via-transparent to-transparent"></div>
              
              {/* Product Note Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-coffee-50/95 backdrop-blur-md rounded-xl border border-coffee-200/50 shadow-lg">
                <p className="font-mono text-[10px] text-coffee-500 tracking-wider uppercase">Origen de la Semana</p>
                <h4 className="font-serif text-base font-bold text-coffee-900 mt-1">Yirgacheffe Kochere</h4>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-xs px-2 py-0.5 bg-amber-500/15 text-amber-900 font-semibold rounded">Etiopía - Lavado</span>
                  <span className="text-sm font-bold text-coffee-800">$18.50 <span className="text-[10px] font-normal text-coffee-500">/ 250g</span></span>
                </div>
              </div>
            </motion.div>

            {/* Absolute Decorative elements */}
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-amber-500/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-coffee-500/10 rounded-full blur-2xl"></div>
          </div>

        </div>
      </section>

      {/* Key Core Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-coffee-900">La diferencia está en el origen</h2>
          <p className="text-coffee-600 mt-4 leading-relaxed font-sans">
            Comprar café comercial significa consumir tuestes excesivos para ocultar imperfecciones de granos mezclados. En Albor tratamos el café como un fruto noble y único.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="p-8 bg-coffee-100/50 border border-coffee-200/40 rounded-2xl coffee-card-glow flex flex-col items-center text-center space-y-4"
            >
              <div className="p-3 bg-coffee-50 rounded-xl border border-coffee-200/60 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-coffee-900">{feature.title}</h3>
              <p className="text-sm text-coffee-600 leading-relaxed font-sans">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Subscription Callout / How it Works */}
      <section className="bg-coffee-900 text-coffee-100 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle mesh overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#FAF7F2_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-xs text-amber-400 tracking-[0.2em] uppercase font-semibold">CLUB DE CAFÉ ALBOR</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-coffee-50 mt-2">¿Cómo funciona la suscripción?</h2>
            <p className="text-coffee-300 mt-4 leading-relaxed font-sans text-sm sm:text-base">
              La forma definitiva de disfrutar del café más fresco del mundo sin preocuparte por quedarte sin granos. Diseña tu plan mensual y únete a los verdaderos apasionados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className="bg-coffee-800/50 border border-coffee-700/50 p-8 rounded-2xl flex flex-col justify-between h-full hover:border-coffee-600/80 transition-all duration-300"
              >
                <div className="space-y-4">
                  <span className="font-mono text-3xl font-bold text-amber-500/50 block">{step.num}</span>
                  <h3 className="font-serif text-xl font-bold text-coffee-100">{step.title}</h3>
                  <p className="text-sm text-coffee-300 leading-relaxed font-sans">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => onNavigate('suscripcion')}
              className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-coffee-950 font-bold rounded-xl tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
              id="hero-cta-sub-btn"
            >
              Configurar Mi Suscripción Mensual
            </button>
            <p className="text-xs text-coffee-400 mt-3 font-mono">
              🎁 10% de descuento en tu primer bolso y taza de regalo con la primera entrega. Sin contratos de permanencia.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Quote / Testimonial */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <div className="flex justify-center gap-1 mb-6 text-amber-500">
          {[...Array(testimonial.stars)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-current" />
          ))}
        </div>
        
        <blockquote className="font-serif text-xl sm:text-2xl text-coffee-900 leading-relaxed italic mb-8">
          "{testimonial.quote}"
        </blockquote>

        <div className="flex items-center justify-center gap-3">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.author}
            className="w-12 h-12 rounded-full object-cover border-2 border-coffee-200"
            referrerPolicy="no-referrer"
          />
          <div className="text-left">
            <cite className="not-italic block font-bold text-coffee-900 text-sm sm:text-base">{testimonial.author}</cite>
            <span className="text-xs text-coffee-500 font-mono">{testimonial.role}</span>
          </div>
        </div>
      </section>

      {/* Mini FAQ Section */}
      <section className="bg-coffee-100/30 border-t border-b border-coffee-200/40 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-coffee-900 text-center mb-12">Preguntas Frecuentes</h2>
          <div className="space-y-8">
            <div className="bg-coffee-50 p-6 rounded-xl border border-coffee-200/40">
              <h4 className="font-serif font-bold text-coffee-900 text-base sm:text-lg">¿Puedo suspender o pausar mi suscripción?</h4>
              <p className="text-sm text-coffee-600 mt-2 font-sans leading-relaxed">
                Totalmente. Puedes pausar, cambiar la frecuencia de entrega, modificar el perfil de sabor o cancelar tu suscripción con un solo clic desde tu panel "Mi Cuenta", sin penalidades ni llamadas telefónicas molestosas.
              </p>
            </div>
            <div className="bg-coffee-50 p-6 rounded-xl border border-coffee-200/40">
              <h4 className="font-serif font-bold text-coffee-900 text-base sm:text-lg">¿Cómo eligen el punto de molienda?</h4>
              <p className="text-sm text-coffee-600 mt-2 font-sans leading-relaxed">
                Cada método requiere un tamaño de partícula de molienda diferente para asegurar una extracción perfecta. Ofrecemos moliendas optimizadas para Espresso (fina), Filtro (media-fina, ideal para V60/Chemex), Cafetera Italiana (media) o Prensa Francesa (gruesa). Por supuesto, la opción favorita de los puristas es "En grano" para moler en el momento exacto de la preparación.
              </p>
            </div>
            <div className="bg-coffee-50 p-6 rounded-xl border border-coffee-200/40">
              <h4 className="font-serif font-bold text-coffee-900 text-base sm:text-lg">¿Cuándo se realiza el envío del café recién tostado?</h4>
              <p className="text-sm text-coffee-600 mt-2 font-sans leading-relaxed">
                Tostamos los lunes y enviamos de martes a jueves de cada semana para asegurar que el café repose los días óptimos durante el tránsito y te llegue listo para liberar su perfil de sabor completo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
