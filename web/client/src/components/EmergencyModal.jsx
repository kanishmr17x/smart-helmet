import { AlertTriangle, ShieldX, TimerReset } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function EmergencyModal({ isOpen, onCancel, onConfirm, countdown = 10 }) {
    const [timeLeft, setTimeLeft] = useState(countdown);
    const onConfirmRef = useRef(onConfirm);

    useEffect(() => {
        onConfirmRef.current = onConfirm;
    }, [onConfirm]);

    useEffect(() => {
        if (!isOpen) return undefined;

        setTimeLeft(countdown);
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onConfirmRef.current?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen, countdown]);

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-3xl border border-red-500/30 bg-slate-950/95 p-6 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-300 ring-1 ring-red-500/20">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-red-300">Emergency Confirmation</p>
                        <h3 className="mt-1 text-2xl font-bold text-white">False Alarm Check</h3>
                    </div>
                </div>

                <p className="text-sm text-slate-300">
                    A potential accident was detected. Confirm the alert is false to cancel dispatch within the countdown period.
                </p>

                <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-center">
                    <div className="text-xs uppercase tracking-[0.25em] text-red-300">Auto-dispatch in</div>
                    <div className="mt-2 text-5xl font-black text-white">{timeLeft}s</div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
                    >
                        <span className="inline-flex items-center gap-2">
                            <ShieldX className="h-4 w-4" />
                            CANCEL ALERT
                        </span>
                    </button>
                    <button
                        onClick={() => onConfirm()}
                        className="flex-1 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                    >
                        <span className="inline-flex items-center gap-2">
                            <TimerReset className="h-4 w-4" />
                            Continue Event
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
