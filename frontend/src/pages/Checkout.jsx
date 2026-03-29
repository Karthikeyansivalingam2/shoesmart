import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, CheckCircle, CreditCard, Truck, User, Smartphone, Globe, Wallet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isOrdered, setIsOrdered] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('upi');
    const [orderId, setOrderId] = useState('');
    const [showPaymentUI, setShowPaymentUI] = useState(false);
    const [activePaymentTab, setActivePaymentTab] = useState('upi');
    const [upiId, setUpiId] = useState('');
    const [mockOrderData, setMockOrderData] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        phone: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.name?.split(' ')[0] || '',
                lastName: user.name?.split(' ')[1] || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const steps = [
        { id: 1, title: 'Shipping', icon: User },
        { id: 2, title: 'Payment', icon: CreditCard },
        { id: 3, title: 'Confirm', icon: Truck },
    ];

    const handleNext = () => {
        if (step === 1) {
            if (!formData.firstName || !formData.address || !formData.phone) {
                alert('Please fill in required shipping details');
                return;
            }
        }
        setStep(prev => prev + 1);
    };

    const handlePrev = () => setStep(prev => prev - 1);

    const handlePayment = async () => {
        if (!isAuthenticated) {
            alert('Please login to place an order');
            navigate('/login');
            return;
        }

        setIsProcessing(true);

        try {
            const orderResponse = await fetch('http://localhost:5001/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        product: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        size: item.size,
                        image: item.image
                    })),
                    totalAmount: cartTotal,
                    shippingAddress: `${formData.address}, ${formData.city}, ${formData.zip}`,
                    phone: formData.phone,
                    paymentMethod: selectedPayment === 'cod' ? 'COD' : 'Online'
                })
            });

            const orderData = await orderResponse.json();

            if (!orderResponse.ok) {
                throw new Error(orderData.message || 'Failed to create order');
            }

            if (selectedPayment === 'cod') {
                setOrderId(orderData._id);
                setIsOrdered(true);
                clearCart();
                setIsProcessing(false);
                return;
            }

            if (orderData.isMock || !orderData.razorpayOrderId) {
                setMockOrderData(orderData);
                setShowPaymentUI(true);
                setIsProcessing(false);
                return;
            }

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: "INR",
                name: "ShoeMart",
                description: "Premium Footwear Purchase",
                image: "https://cdn-icons-png.flaticon.com/512/3159/3159066.png",
                order_id: orderData.razorpayOrderId,
                handler: async (response) => {
                    await handleVerify(orderData.orderId, response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
                },
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: "#D11919"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                alert("Payment Failed: " + response.error.description);
            });
            rzp.open();

        } catch (error) {
            console.error('Order/Payment error:', error);
            alert(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleVerify = async (orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
        try {
            const verifyRes = await fetch('http://localhost:5001/api/orders/verify-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    orderId,
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature
                })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
                setOrderId(orderId);
                setIsOrdered(true);
                clearCart();
                setShowPaymentUI(false);
            } else {
                alert('Payment verification failed: ' + verifyData.message);
            }
        } catch (error) {
            console.error('Verification error:', error);
            alert('Error verifying payment');
        }
    };

    const processMockPayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            handleVerify(
                mockOrderData.orderId || mockOrderData._id,
                mockOrderData.razorpayOrderId || 'mock_rp_id',
                'pay_mock_success_123',
                'mock_signature'
            );
        }, 1500);
    };

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
                    Thank you for choosing StepUp. Your order #{orderId?.slice(-6).toUpperCase()} is being processed and will be delivered soon.
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
                                            <Input label="First Name" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="John" />
                                            <Input label="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Doe" />
                                            <div className="col-span-2">
                                                <Input label="Email Address" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
                                            </div>
                                            <div className="col-span-2">
                                                <Input label="Full Address" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="123 Street, City, Country" />
                                            </div>
                                            <Input label="City" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="California" />
                                            <Input label="Postal Code" required value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} placeholder="90001" />
                                            <div className="col-span-2">
                                                <Input label="Phone Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="9876543210" />
                                            </div>
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[
                                                { id: 'upi', icon: Smartphone, title: 'Razorpay', desc: 'UPI, Card, Net Banking' },
                                                { id: 'cod', icon: Truck, title: 'Cash on Delivery', desc: 'Pay when you receive' },
                                            ].map(method => (
                                                <div
                                                    key={method.id}
                                                    onClick={() => setSelectedPayment(method.id)}
                                                    className={`p-6 border-2 rounded-2xl flex flex-col gap-2 cursor-pointer transition-all ${selectedPayment === method.id
                                                            ? 'border-accent bg-accent/5 shadow-lg shadow-accent/10'
                                                            : 'border-foreground/5 hover:border-foreground/20'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <method.icon className={selectedPayment === method.id ? 'text-accent' : 'text-foreground/40'} />
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === method.id ? 'border-accent' : 'border-foreground/10'
                                                            }`}>
                                                            {selectedPayment === method.id && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                                                        </div>
                                                    </div>
                                                    <div className="mt-2">
                                                        <p className="font-black text-sm uppercase">{method.title}</p>
                                                        <p className="text-[10px] text-foreground/40 font-bold uppercase mt-1">{method.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-6 border-t border-foreground/10">
                                            <p className="text-[10px] text-foreground/40 font-bold uppercase">
                                                {selectedPayment === 'upi' 
                                                    ? 'Secure payment via Razorpay. Supported: UPI, Cards, Netbanking.' 
                                                    : 'Additional ₹40 fee may apply for Cash on Delivery.'}
                                            </p>
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
                                                <p className="text-sm font-black uppercase">{formData.firstName}, {formData.city}</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm font-bold opacity-40 uppercase">Payment Method</p>
                                                <p className="text-sm font-black uppercase">
                                                    {selectedPayment === 'upi' ? 'Razorpay (Secure)' : 'Cash on Delivery'}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-foreground/40 leading-relaxed font-medium">
                                            By clicking "Place Order", you agree to ShoeMart's Terms of Service and Privacy Policy. Taxes are calculated based on your shipping address.
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
                                        onClick={handlePayment}
                                        disabled={isProcessing}
                                        className={`flex-grow py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-colors ${isProcessing
                                            ? 'bg-accent/50 text-white/80 cursor-not-allowed cursor-wait'
                                            : 'bg-accent text-white hover:bg-foreground shadow-xl shadow-accent/20'
                                            }`}
                                    >
                                        {isProcessing ? 'PROCESSING...' : 'PLACE ORDER'}
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
            
            {/* Secure Payment UI Overlay */}
            <AnimatePresence>
                {showPaymentUI && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white text-black w-full max-w-[450px] rounded-[2rem] overflow-hidden shadow-2xl"
                        >
                            {/* Header */}
                            <div className="bg-[#212b36] p-6 text-white flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#ff7a45] rounded-lg flex items-center justify-center font-black text-xl">S</div>
                                    <div>
                                        <p className="font-black text-sm uppercase leading-none tracking-tight">StepUp Pay</p>
                                        <p className="text-[10px] opacity-60 font-medium">Secured by 256-bit SSL</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">SECURE</span>
                                </div>
                            </div>

                            {/* Order Total Section */}
                            <div className="bg-[#ff7a45] p-6 text-white flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Order Total</p>
                                    <p className="text-2xl font-black">₹{cartTotal.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Ref No.</p>
                                    <p className="text-xs font-black">ST-{Math.floor(Math.random() * 900000 + 100000)}</p>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b">
                                {['upi', 'card', 'netbanking', 'cod'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActivePaymentTab(tab)}
                                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-colors ${
                                            activePaymentTab === tab ? 'text-[#ff7a45] border-b-2 border-[#ff7a45]' : 'text-gray-400'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Content */}
                            <div className="p-8 space-y-8 min-h-[350px] relative">
                                {activePaymentTab === 'upi' && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                                        <div className="grid grid-cols-3 gap-6">
                                            {[
                                                { 
                                                    name: 'GPay', 
                                                    icon: (
                                                        <svg viewBox="0 0 40 40" className="w-10 h-10">
                                                            <path d="M19.7 7.7a12 12 0 11-8.5 3.5l3.5 3.5c1.3-1.3 3.1-2.1 5-2.1 3.9 0 7.1 3.2 7.1 7.1s-3.2 7.1-7.1 7.1c-1.9 0-3.7-.8-5-2.1l-3.5 3.5a12 12 0 0020.1-8.5c0-4.6-2.6-8.6-6.4-10.7l-5.1 8.6z" className="fill-[#4285F4]" />
                                                        </svg>
                                                    )
                                                },
                                                { 
                                                    name: 'PhonePe', 
                                                    icon: (
                                                        <svg viewBox="0 0 40 40" className="w-10 h-10">
                                                            <rect width="32" height="32" x="4" y="4" rx="8" className="fill-[#6739B7]" />
                                                            <path d="M20 10v20M13 17l7 7 7-7" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                        </svg>
                                                    )
                                                },
                                                { 
                                                    name: 'Paytm', 
                                                    icon: (
                                                        <svg viewBox="0 0 40 40" className="w-10 h-10">
                                                            <path d="M5 10h30v20H5z" className="fill-[#00B9F1]" />
                                                            <text x="7" y="24" className="fill-white font-black italic text-[14px]">Pay</text>
                                                        </svg>
                                                    )
                                                }
                                            ].map(app => (
                                                <motion.div 
                                                    key={app.name} 
                                                    whileHover={{ y: -5 }}
                                                    className="flex flex-col items-center gap-3 group cursor-pointer"
                                                >
                                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border-2 border-gray-50 group-hover:border-orange-200 transition-all p-2 shadow-sm">
                                                        {app.icon}
                                                    </div>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{app.name}</span>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="space-y-5">
                                            <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">OR ENTER UPI ID</p>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={upiId}
                                                    onChange={e => setUpiId(e.target.value)}
                                                    placeholder="yourname@okaxis"
                                                    className="w-full bg-gray-50 border-2 border-gray-100 px-6 py-4.5 rounded-[1.5rem] focus:outline-none focus:border-[#ff7a45] focus:bg-white transition-all font-bold text-sm"
                                                />
                                                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#ff7a45] uppercase tracking-widest px-4 py-2 hover:bg-[#ff7a45]/10 rounded-xl transition-all">
                                                    VERIFY
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activePaymentTab === 'card' && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 space-y-4 shadow-inner">
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Card Number</label>
                                                    <div className="relative">
                                                        <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-transparent border-none p-0 focus:outline-none font-bold text-sm tracking-widest placeholder:text-gray-300" />
                                                        <CreditCard className="absolute right-0 top-0 text-gray-300" size={18} />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200/50">
                                                    <div className="space-y-1.5 border-r border-gray-100">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Expiry</label>
                                                        <input type="text" placeholder="MM/YY" className="w-full bg-transparent border-none p-0 focus:outline-none font-bold text-sm" />
                                                    </div>
                                                    <div className="space-y-1.5 pl-4">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">CVV</label>
                                                        <input type="password" placeholder="***" className="w-full bg-transparent border-none p-0 focus:outline-none font-bold text-sm" />
                                                    </div>
                                                </div>
                                            </div>
                                            <input type="text" placeholder="CARD HOLDER NAME" className="w-full bg-gray-50 border-2 border-gray-100 px-6 py-4 rounded-[1.25rem] focus:outline-none focus:border-[#ff7a45] font-black text-[10px] uppercase tracking-widest" />
                                        </div>
                                        <div className="flex items-center gap-3 px-2">
                                            <input type="checkbox" className="accent-[#ff7a45] w-4 h-4 rounded" />
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Securely save card for future payments</span>
                                        </div>
                                    </motion.div>
                                )}

                                {activePaymentTab === 'netbanking' && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { name: 'SBI', color: 'bg-blue-600', icon: 'S' },
                                                { name: 'HDFC', color: 'bg-blue-900', icon: 'H' },
                                                { name: 'ICICI', color: 'bg-orange-800', icon: 'I' },
                                                { name: 'AXIS', color: 'bg-red-900', icon: 'A' }
                                            ].map(bank => (
                                                <div key={bank.name} className="border-2 border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:border-orange-200 cursor-pointer transition-all bg-white group shadow-sm hover:shadow-md">
                                                    <div className={`w-10 h-10 ${bank.color} rounded-lg flex items-center justify-center font-black text-white shadow-sm`}>
                                                        {bank.icon}
                                                    </div>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-orange-500">{bank.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="relative mt-4">
                                            <select className="w-full bg-gray-50 border-2 border-gray-100 px-6 py-5 rounded-[1.25rem] focus:outline-none focus:border-[#ff7a45] font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer">
                                                <option>SELECT OTHER BANK</option>
                                                <option>KOTAK MAHINDRA</option>
                                                <option>BANK OF BARODA</option>
                                                <option>CANARA BANK</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <ChevronRight className="rotate-90" size={14} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activePaymentTab === 'cod' && (
                                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
                                        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl shadow-orange-500/5">
                                            <Truck className="text-[#ff7a45]" size={40} />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[14px] font-black uppercase text-gray-700 leading-none">Cash on Delivery</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed max-w-[250px]">
                                                Pay comfortably with Cash or UPI at your doorstep.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Button */}
                            <div className="p-8 pt-4 border-t border-gray-50 bg-gray-50/20">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={processMockPayment}
                                    disabled={isProcessing}
                                    className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-white flex items-center justify-center gap-4 transition-all relative overflow-hidden group shadow-2xl ${
                                        isProcessing ? 'bg-orange-300' : 'bg-[#ff7a45] hover:bg-[#ff5a1f] shadow-orange-500/30'
                                    }`}
                                >
                                    <Smartphone size={22} className={isProcessing ? 'animate-bounce' : 'group-hover:rotate-12 transition-transform'} />
                                    {isProcessing ? 'PROCESSING...' : `PAY ₹${cartTotal.toLocaleString('en-IN')}`}
                                    {!isProcessing && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    )}
                                </motion.button>
                                
                                <div className="mt-8 flex flex-col items-center gap-6">
                                    <button onClick={() => setShowPaymentUI(false)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#ff7a45] transition-colors flex items-center gap-2 group">
                                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                                        Cancel & Go Back
                                    </button>
                                    <div className="flex items-center gap-6 opacity-30">
                                        <CreditCard size={16} />
                                        <Smartphone size={16} />
                                        <Globe size={16} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
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
