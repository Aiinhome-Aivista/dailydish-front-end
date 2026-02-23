import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Clock, Send, HelpCircle } from 'lucide-react';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import PageTransitionOverlay from '../animations/pages/PageTransitionOverlay';

const ContactUs = () => {
    const navigate = useNavigate();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleBack = () => {
        setIsLeaving(true);
        setIsTransitioning(true);
        setTimeout(() => {
            navigate('/', { state: { skipSplash: true } });
        }, 2200);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const contactMethods = [
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Email Us",
            description: "For general inquiries and support",
            value: "support@dailydish.ai",
            action: "mailto:support@dailydish.ai"
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Response Time",
            description: "We typically respond within",
            value: "24-48 hours",
            action: null
        }
    ];

    const faqs = [
        {
            question: "How does the Dr. Foodie Assistant work?",
            answer: "Our Dr. Foodie analyzes your available ingredients, dietary preferences, and desired cuisine to generate personalized recipes in seconds."
        },
        {
            question: "Can I save my favorite recipes?",
            answer: "Yes! Once you create an account, you can save any generated recipe to your personal digital cookbook."
        },
        {
            question: "Is DailyDish free to use?",
            answer: "We offer a generous free tier that includes ingredient-based recipe generation. Premium features are available for advanced meal planning."
        }
    ];

    return (
        <div className="min-h-screen bg-brand-beige relative overflow-hidden font-['Montserrat_Alternates']">
            <PageTransitionOverlay isTransitioning={isTransitioning} />
            <NavBar showBackButton={true} onBackClick={handleBack} />

            <motion.div
                initial={false}
                animate={isLeaving ? { y: -60, opacity: 0 } : { y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col"
            >
                {/* Hero Section */}
                <section className="relative py-16 px-6 md:px-12">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-dark mb-6 border border-brand-primary/20"
                        >
                            <span className="text-sm font-semibold uppercase tracking-wider">We're Here For You</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark mb-6">
                            Contact <span className="italic text-brand-accent">Us</span>
                        </h1>
                        <p className="text-lg text-brand-dark/80 max-w-2xl mx-auto leading-relaxed">
                            Have questions about your culinary journey? We'd love to hear from you.
                        </p>
                    </div>
                </section>

                {/* Contact Methods */}
                <section className="py-8 px-6 md:px-12">
                    <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6">
                        {contactMethods.map((method, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-brand-primary/10 hover:border-brand-accent/30 transition-all duration-300 text-center w-full md:w-80 shadow-sm"
                            >
                                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-4 text-brand-accent">
                                    {method.icon}
                                </div>
                                <h3 className="text-lg font-bold text-brand-dark mb-1">{method.title}</h3>
                                <p className="text-brand-dark/60 text-sm mb-2">{method.description}</p>
                                {method.action ? (
                                    <a href={method.action} className="text-brand-accent hover:text-brand-dark transition-colors font-semibold">
                                        {method.value}
                                    </a>
                                ) : (
                                    <span className="text-brand-dark font-semibold">{method.value}</span>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Main Content */}
                <section className="py-12 px-6 md:px-12">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-brand-primary/20 shadow-xl"
                        >
                            <h2 className="text-2xl font-bold text-brand-dark mb-6">Send Us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-brand-dark mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/50 border border-brand-primary/20 rounded-xl text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:border-brand-accent transition-colors"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-brand-dark mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/50 border border-brand-primary/20 rounded-xl text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:border-brand-accent transition-colors"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-brand-dark mb-2">Subject</label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/50 border border-brand-primary/20 rounded-xl text-brand-dark focus:outline-none focus:border-brand-accent transition-colors"
                                    >
                                        <option value="">Select a topic</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="support">Technical Support</option>
                                        <option value="feedback">Feedback</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-brand-dark mb-2">Your Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white/50 border border-brand-primary/20 rounded-xl text-brand-dark placeholder-brand-dark/40 focus:outline-none focus:border-brand-accent transition-colors resize-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 rounded-xl bg-brand-dark text-white font-bold hover:bg-brand-accent transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {isSubmitting ? "Sending..." : "Send Message"}
                                    {!isSubmitting && <Send className="w-4 h-4" />}
                                </button>
                            </form>
                        </motion.div>

                        {/* FAQ Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h2 className="text-2xl font-bold text-brand-dark mb-6">Frequently Asked</h2>
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-brand-primary/10 shadow-sm"
                                    >
                                        <h3 className="text-lg font-bold text-brand-dark mb-2 flex items-start gap-3">
                                            <HelpCircle className="w-5 h-5 text-brand-accent mt-1 shrink-0" />
                                            {faq.question}
                                        </h3>
                                        <p className="text-brand-dark/70 leading-relaxed ml-8">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
                <Footer />
            </motion.div>
        </div>
    );
};

export default ContactUs;
