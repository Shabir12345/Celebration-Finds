"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { confirmOrder } from "@/lib/actions/orders";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      router.push("/");
      return;
    }

    const processOrder = async () => {
      try {
        const result = await confirmOrder(sessionId);
        if (result.success) {
          clearCart(); // Success! Clear the cart locally
          setOrderId(result.order?._id || result.order?.id || "Pending");
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    processOrder();
  }, [sessionId, clearCart, router]);

  if (status === "loading") {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-6 bg-slate-50">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="text-center space-y-2">
          <p className="font-serif text-2xl font-bold text-accent">Personalizing Your Order...</p>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Verifying Secure Transaction</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-8 bg-slate-50 px-4 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 opacity-20" />
        </div>
        <div className="space-y-4 max-w-sm">
          <h1 className="font-serif text-4xl font-bold text-accent">Order Verification Delayed</h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            We're having trouble verifying your payment details. Don't worry, if you completed the Stripe payment, your order is being processed. 
          </p>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Check your email for confirmation.
          </p>
        </div>
        <Link 
          href="/"
          className="px-10 py-4 bg-accent text-white text-[10px] font-bold uppercase tracking-[.2em] shadow-xl hover:bg-primary transition-all"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-4xl w-full bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Visual Confirmation Column */}
        <div className="md:w-1/2 bg-slate-900 relative p-12 flex flex-col justify-between overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 scale-110 blur-[2px]"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&q=80')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-accent/90" />
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="w-16 h-16 bg-secondary text-primary rounded-full flex items-center justify-center mb-10 shadow-3xl shadow-secondary/20"
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="font-serif text-5xl font-bold text-white tracking-tighter leading-tight">
                Order <span className="text-secondary italic">Confirmed.</span>
              </h1>
              <p className="text-white/70 text-sm font-medium leading-relaxed max-w-[280px]">
                Thank you for choosing Celebration Finds. Your beautiful, handmade gifts are now being made with care in our studio.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 pt-10"
          >
             <div className="h-px w-20 bg-secondary/30 mb-6" />
             <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">Est. Delivery: 10-14 Days</p>
          </motion.div>
        </div>

        {/* Details Column */}
        <div className="md:w-1/2 p-12 space-y-10 flex flex-col justify-center">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Reference</p>
              <p className="font-sans text-lg font-bold text-accent tracking-widest">#{orderId || 'PENDING'}</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                 <h2 className="font-serif text-xl font-bold text-accent">What happens now?</h2>
                 <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                        <p className="text-sm text-slate-600 font-medium">A skilled maker is now handcrafting your gifts using the colors and scents you chose.</p>
                    </div>
                    <div className="flex items-start space-x-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                        <p className="text-sm text-slate-600 font-medium">We will send you a note once your gifts are wrapped and ready to ship.</p>
                    </div>
                 </div>
              </div>

              <div className="pt-10 flex flex-col gap-4">
                  <Link 
                    href="/shop"
                    className="flex items-center justify-center space-x-3 w-full py-4 bg-accent text-white text-[10px] font-bold uppercase tracking-[.2em] shadow-xl hover:bg-primary transition-all group"
                  >
                    <span>Continue Shopping</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    href="/portfolio"
                    className="flex items-center justify-center space-x-3 w-full py-4 border border-slate-200 text-accent text-[10px] font-bold uppercase tracking-[.2em] hover:bg-slate-50 transition-all"
                  >
                    <span>Visit Lookbook</span>
                  </Link>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
