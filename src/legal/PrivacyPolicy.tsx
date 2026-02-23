import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Share2, Cookie, HardDrive, RefreshCw } from 'lucide-react';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import PageTransitionOverlay from '../animations/pages/PageTransitionOverlay';

const PrivacyPolicy = () => {
    const navigate = useNavigate();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    const handleBack = () => {
        setIsLeaving(true);
        setIsTransitioning(true);
        setTimeout(() => {
            navigate('/', { state: { skipSplash: true } });
        }, 2200);
    };

    const sections = [
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Information We Collect",
            content: "We collect information you provide directly, such as your name, email address, and culinary preferences. We also collect usage data to improve your recipe recommendations and overall app experience."
        },
        {
            icon: <Lock className="w-6 h-6" />,
            title: "How We Protect Your Data",
            content: "Your data is encrypted using industry-standard protocols. We employ advanced security measures to ensure your personal information and saved recipes are kept private and secure."
        },
        {
            icon: <Share2 className="w-6 h-6" />,
            title: "Data Sharing",
            content: "We do not sell or rent your personal information to third parties. We only share data when necessary to provide our services or when required by law."
        },
        {
            icon: <Cookie className="w-6 h-6" />,
            title: "Cookies & Tracking",
            content: "We use essential cookies to maintain your session and remember your preferences. You can control cookie settings through your browser at any time."
        },
        {
            icon: <HardDrive className="w-6 h-6" />,
            title: "Data Retention",
            content: "We retain your data only as long as necessary to provide our services. You can request account deletion at any time, and your data will be permanently removed from our servers."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Your Rights",
            content: "You have the right to access, update, or delete your personal information. If you have any concerns about how your data is handled, please contact us."
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
                <section className="relative py-20 px-6 md:px-12 overflow-hidden">
                    <div className="max-w-[900px] mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-dark mb-6 border border-brand-primary/20"
                        >
                            <Shield className="w-4 h-4 text-brand-accent" />
                            <span className="text-sm font-semibold uppercase tracking-wider">Your Privacy Matters</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark mb-6">
                            Privacy <span className="italic text-brand-accent">Policy</span>
                        </h1>
                        <p className="text-lg text-brand-dark/80 max-w-2xl mx-auto leading-relaxed">
                            At DailyDish, we are committed to protecting your personal information and your right to privacy in the kitchen and beyond.
                        </p>

                    </div>
                </section>

                {/* Content Sections */}
                <section className="py-16 px-6 md:px-12">
                    <div className="max-w-[1000px] mx-auto">
                        <div className="grid md:grid-cols-2 gap-8">
                            {sections.map((section, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-brand-primary/10 hover:border-brand-accent/30 transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center shrink-0 text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all duration-500">
                                            {section.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-brand-dark mb-3 leading-tight">{section.title}</h3>
                                            <p className="text-brand-dark/70 leading-relaxed text-sm">{section.content}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="py-16 px-6 md:px-12 mb-12">
                    <div className="max-w-3xl mx-auto text-center bg-brand-dark rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-primary/20 rounded-full -ml-16 -mb-16 blur-3xl"></div>

                        <div className="relative z-10">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6 italic">Questions About Your Privacy?</h2>
                            <p className="text-white/80 mb-10 text-lg">
                                If you have any questions or concerns about our privacy practices, our team is here to help and clarify.
                            </p>
                            <button
                                onClick={() => navigate('/contact-us')}
                                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white text-brand-dark font-bold hover:bg-brand-accent hover:text-white transition-all duration-300 shadow-lg hover:shadow-brand-accent/20"
                            >
                                <span>Get in Touch</span>
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </section>
                <Footer />
            </motion.div>
        </div>
    );
};

export default PrivacyPolicy;
