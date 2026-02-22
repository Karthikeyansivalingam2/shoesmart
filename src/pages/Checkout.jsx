import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ChevronRight, CheckCircle, CreditCard, Truck, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Checkout = () => {
    const { cart, cartTotal } = useCart();
    const [step, setStep] = useState(1);
    const [isOrdered, setIsOrdered] = useState(false);

    const steps = [
        { id: 1, title: 'Shipping', icon: User },
        { id: 2, title: 'Payment', icon: CreditCard },
        { id: 3, title: 'Confirm', icon: Truck },
    ];

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => prev - 1);
    const handleOrder = () => setIsOrdered(true);

    if (isOrdered) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pt-48 pb-24 text-center space-y-8 px-6"
            >
                <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20">
                    <CheckCircle size={48} />
                </div>
                <h1 className="text-5xl font-black uppercase tracking-tighter">Order Success!</h1>
                <p className="text-foreground/60 max-w-md mx-auto text-lg font-medium">
                    Thank you for choosing STEPUP. Your order #82910 is being processed and will be delivered soon.
                </p>
                <div className="pt-8">
                    <Link to="/">
                        <button className="bg-foreground text-background px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-accent transition-colors shadow-xl">
                            BACK TO HOME
                        </button>
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="pt-40 pb-24 px-6 min-h-screen">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Stepper */}
                        <div className="flex justify-between relative">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-secondary -z-10 -translate-y-1/2" />
                            <div
                                className="absolute top-1/2 left-0 h-0.5 bg-accent transition-all duration-500 -z-10 -translate-y-1/2"
                                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                            />
                            {steps.map((s) => (
                                <div key={s.id} className="flex flex-col items-center gap-2">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-colors ${step >= s.id ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-secondary text-foreground/20'
                                        }`}>
                                        <s.icon size={20} />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-accent' : 'text-foreground/20'
                                        }`}>
                                        {s.title}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Form Steps */}
                        <div className="glass p-10 rounded-[3rem] min-h-[400px]">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <h3 className="text-2xl font-black uppercase tracking-tighter">Shipping Details</h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <Input label="First Name" placeholder="John" />
                                            <Input label="Last Name" placeholder="Doe" />
                                            <div className="col-span-2">
                                                <Input label="Email Address" type="email" placeholder="john@example.com" />
                                            </div>
                                            <div className="col-span-2">
                                                <Input label="Full Address" placeholder="123 Street, City, Country" />
                                            </div>
                                            <Input label="City" placeholder="California" />
                                            <Input label="Postal Code" placeholder="90001" />
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <h3 className="text-2xl font-black uppercase tracking-tighter">Payment Method</h3>
                                        <div className="space-y-4">
                                            <div className="p-6 border-2 border-accent bg-accent/5 rounded-2xl flex justify-between items-center cursor-pointer">
                                                <div className="flex gap-4 items-center">
                                                    <CreditCard className="text-accent" />
                                                    <div>
                                                        <p className="font-black text-sm uppercase">Credit / Debit Card</p>
                                                        <p className="text-[10px] text-foreground/40 font-bold uppercase">Pay with Visa, Mastercard or Amex</p>
                                                    </div>
                                                </div>
                                                <div className="w-5 h-5 rounded-full border-4 border-accent" />
                                            </div>

                                            <div className="p-6 border-2 border-foreground/5 rounded-2xl flex justify-between items-center cursor-pointer opacity-50">
                                                <div className="flex gap-4 items-center">
                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="Paypal" />
                                                    <p className="font-black text-sm uppercase">PayPal</p>
                                                </div>
                                                <div className="w-5 h-5 rounded-full border-2 border-foreground/10" />
                                            </div>
                                        </div>

                                        <div className="space-y-6 pt-6">
                                            <Input label="Card Number" placeholder="**** **** **** 1234" />
                                            <div className="grid grid-cols-2 gap-6">
                                                <Input label="Expiry Date" placeholder="MM/YY" />
                                                <Input label="CVV" placeholder="***" type="password" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-8"
                                    >
                                        <h3 className="text-2xl font-black uppercase tracking-tighter">Confirm & Order</h3>
                                        <div className="p-8 bg-secondary/50 rounded-3xl space-y-6">
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm font-bold opacity-40 uppercase">Shipping To</p>
                                                <p className="text-sm font-black uppercase">John Doe, California</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm font-bold opacity-40 uppercase">Payment Method</p>
                                                <p className="text-sm font-black uppercase">Visa ending in 1234</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-foreground/40 leading-relaxed font-medium">
                                            By clicking "Place Order", you agree to StepUp's Terms of Service and Privacy Policy. Taxes are calculated based on your shipping address.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Navigation */}
                            <div className="flex gap-4 mt-12 pt-8 border-t border-foreground/10">
                                {step > 1 && (
                                    <button
                                        onClick={handlePrev}
                                        className="p-5 rounded-2xl bg-secondary hover:bg-foreground/5 transition-colors"
                                    >
                                        <ChevronLeft />
                                    </button>
                                )}
                                {step < 3 ? (
                                    <button
                                        onClick={handleNext}
                                        className="flex-grow bg-foreground text-background py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-accent transition-colors"
                                    >
                                        CONTINUE <ChevronRight size={20} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleOrder}
                                        className="flex-grow bg-accent text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-accent/20"
                                    >
                                        PLACE ORDER
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Order Summary</h3>
                        <div className="glass p-8 rounded-[2.5rem] space-y-6">
                            <div className="max-h-64 overflow-y-auto space-y-4 pr-2">
                                {cart.map(item => (
                                    <div key={`${item.id}-${item.size}`} className="flex gap-4">
                                        <div className="w-16 h-16 bg-secondary/50 rounded-xl overflow-hidden flex-shrink-0">
                                            <img src={item.image} className="w-full h-full object-cover p-2" />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-xs font-black uppercase leading-tight line-clamp-1">{item.name}</p>
                                            <p className="text-[10px] text-foreground/40 font-bold uppercase mt-1">Size {item.size} • Qty {item.quantity}</p>
                                            <p className="text-sm font-black mt-1">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-foreground/10 space-y-3">
                                <div className="flex justify-between text-sm opacity-40 font-bold uppercase">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm opacity-40 font-bold uppercase">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between items-center text-xl font-black pt-4">
                                    <span>TOTAL</span>
                                    <span className="text-accent">₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const Input = ({ label, ...props }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex justify-between items-center">
            {label}
            {props.required && <span className="text-accent">*</span>}
        </label>
        <input
            {...props}
            className="w-full bg-secondary/30 border border-foreground/5 px-5 py-4 rounded-xl focus:outline-none focus:border-accent transition-colors font-bold text-sm"
        />
    </div>
);

export default Checkout;
