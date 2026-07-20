import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Check, Mail, User, MessageSquare, Loader2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Por favor, completa todos los campos requeridos.');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('https://hook.us2.make.com/g8hwfph64d0ni1q7mui6gt9sgf2jvnde', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          submittedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        throw new Error('No se pudo enviar el mensaje. Código de estado: ' + response.status);
      }
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setErrorMessage(error.message || 'Ocurrió un error de conexión al enviar el formulario. Intenta nuevamente.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto" id="seccion-contacto">
      <div className="bg-white dark:bg-coffee-950/40 border border-coffee-200/60 dark:border-coffee-900/40 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        {/* Subtle decorative mesh or gradient background */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-coffee-800/5 dark:bg-coffee-800/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Form Header Info (Left side on desktop) */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-mono text-xs text-amber-600 dark:text-amber-400 tracking-[0.2em] uppercase font-bold">CONTACTO</span>
            <h2 className="font-serif text-3xl font-bold text-coffee-900 dark:text-coffee-50">Escríbenos</h2>
            <p className="text-sm text-coffee-600 dark:text-coffee-350 leading-relaxed font-sans">
              ¿Tienes alguna duda sobre nuestras suscripciones, orígenes de café o necesitas asesoramiento para tu cafetería? Déjanos un mensaje y te responderemos a la brevedad.
            </p>
            
            <div className="pt-4 space-y-3 font-sans text-xs text-coffee-500 dark:text-coffee-400">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>contacto@alborcafe.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>Soporte personalizado 24/7</span>
              </div>
            </div>
          </div>

          {/* Form Fields Container (Right side on desktop) */}
          <div className="md:col-span-7 bg-coffee-50/50 dark:bg-coffee-900/10 p-6 sm:p-8 rounded-2xl border border-coffee-200/40 dark:border-coffee-850/40">
            <AnimatePresence mode="wait">
              {submitStatus === 'success' ? (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 space-y-4 font-sans"
                >
                  <div className="h-12 w-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-coffee-900 dark:text-coffee-100">¡Mensaje Recibido!</h3>
                  <p className="text-sm text-coffee-650 dark:text-coffee-300 leading-relaxed max-w-xs mx-auto">
                    Gracias por ponerte en contacto con Albor Café de Especialidad. Hemos recibido tu mensaje y nos comunicaremos contigo lo antes posible.
                  </p>
                  <button
                    onClick={() => setSubmitStatus('idle')}
                    className="mt-4 px-5 py-2.5 bg-coffee-800 hover:bg-coffee-750 text-coffee-50 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-coffee-950 text-xs font-bold rounded-xl transition-all"
                  >
                    Enviar otro mensaje
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="contact-form"
                  onSubmit={handleSubmit}
                  className="space-y-4 text-xs font-sans text-left"
                >
                  {submitStatus === 'error' && (
                    <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-700 dark:text-rose-400 flex items-center gap-2.5 font-medium">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="font-bold text-coffee-700 dark:text-coffee-300 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-coffee-400" />
                      <span>Nombre Completo:</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre completo"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-white dark:bg-coffee-900 border border-coffee-200 dark:border-coffee-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-coffee-900 dark:text-coffee-100 text-sm disabled:opacity-60 transition-all"
                      id="contact-name-input"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-coffee-700 dark:text-coffee-300 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-coffee-400" />
                      <span>Correo Electrónico:</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu-email@correo.com"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-white dark:bg-coffee-900 border border-coffee-200 dark:border-coffee-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-coffee-900 dark:text-coffee-100 text-sm disabled:opacity-60 transition-all"
                      id="contact-email-input"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-coffee-700 dark:text-coffee-300 flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-coffee-400" />
                      <span>Tu Mensaje:</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Escribe tu consulta aquí..."
                      disabled={isSubmitting}
                      rows={4}
                      className="w-full px-4 py-3 bg-white dark:bg-coffee-900 border border-coffee-200 dark:border-coffee-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-coffee-900 dark:text-coffee-100 text-sm disabled:opacity-60 transition-all resize-none"
                      id="contact-message-input"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-coffee-900 hover:bg-coffee-850 dark:bg-amber-500 dark:hover:bg-amber-400 text-coffee-50 dark:text-coffee-950 font-bold rounded-xl transition-all shadow-md uppercase tracking-wider text-xs flex items-center justify-center gap-2 disabled:opacity-65"
                    id="contact-submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Enviando Mensaje...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Enviar Mensaje</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
