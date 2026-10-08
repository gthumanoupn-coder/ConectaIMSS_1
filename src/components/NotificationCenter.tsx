import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Check, 
  Sparkles, 
  Send, 
  ShieldAlert, 
  Award, 
  Clock, 
  Volume2, 
  CheckCheck
} from 'lucide-react';
import { PushNotification, User } from '../types/lms';
import { triggerPushNotification } from '../services/storage';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onTriggerTestPush: (title: string, message: string) => void;
  currentUser: User;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onTriggerTestPush,
  currentUser
}) => {
  if (!isOpen) return null;

  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);

  const handleRequestBrowserPermission = async () => {
    const granted = await triggerPushNotification(
      'CUPN Conecta - IMSS',
      '¡Las notificaciones push del servidor local están activadas!'
    );
    if (granted) {
      setPushStatusMessage('¡Permiso concedido! Ahora recibirás alertas en tu navegador y teléfono móvil.');
    } else {
      setPushStatusMessage('Permiso no concedido o navegador en modo silencioso. Las notificaciones in-app seguirán activas.');
    }
  };

  const handleSendReminderSample = () => {
    onTriggerTestPush(
      '¡Recordatorio de Examen Próximo!',
      'Tu evaluación de Seguridad Criptográfica vence en 24 horas. ¡Ingresa a practicar tus conocimientos!'
    );
    // Play gentle chime
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext fallback
    }
  };

  const getNotifIcon = (type: PushNotification['type']) => {
    switch (type) {
      case 'reminder':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'grade':
        return <Award className="w-4 h-4 text-emerald-500" />;
      case 'security':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Notificaciones Push & Recordatorios
              </h2>
              <p className="text-xs text-slate-500">
                Avisos automáticos de evaluaciones, clases y seguridad
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Web Push Permission Banner */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Alertas en Dispositivos Móviles y Escritorio</span>
            <button
              onClick={handleRequestBrowserPermission}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Habilitar Web Push
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Recibe recordatorios incluso con el navegador minimizado gracias al Service Worker local.
          </p>
          {pushStatusMessage && (
            <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
              {pushStatusMessage}
            </p>
          )}
        </div>

        {/* Quick Trigger Sample */}
        <div className="flex items-center justify-between text-xs">
          <button
            onClick={handleSendReminderSample}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Simular Envío de Recordatorio</span>
          </button>

          <button
            onClick={onMarkAllAsRead}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Marcar todo como leído</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-100">
          {notifications.length > 0 ? (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => onMarkAsRead(notif.id)}
                className={`p-3 rounded-xl transition-all cursor-pointer flex items-start gap-3 pt-3 ${
                  notif.read ? 'bg-white hover:bg-slate-50' : 'bg-indigo-50/50 border border-indigo-100'
                }`}
              >
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs mt-0.5">
                  {getNotifIcon(notif.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="font-bold text-slate-900">{notif.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{notif.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-xs text-slate-400 italic">
              No tienes notificaciones pendientes.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
