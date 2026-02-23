import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen, Utensils, Users, Settings, MessageSquare, ChevronRight, PlayCircle, HelpCircle } from 'lucide-react';
import NavBar from '../components/layout/NavBar';
import Footer from '../components/layout/Footer';
import PageTransitionOverlay from '../animations/pages/PageTransitionOverlay';

const HelpCenter = () => {
    const navigate = useNavigate();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleBack = () => {
        setIsLeaving(true);
        setIsTransitioning(true);
        setTimeout(() => {
            navigate('/', { state: { skipSplash: true } });
        }, 2200);
    };

    const categories = [
        {
            icon: <BookOpen className="w-8 h-8" />,
            title: "Getting Started",
            description: "Learn the basics of using DailyDish and setting up your kitchen.",
            link: "#"
        },
        {
            icon: <Utensils className="w-8 h-8" />,
            title: "Dr. Foodie Assistant",
            description: "How to get the best recipe recommendations from Dr. Foodie.",
            link: "#"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Community",
            description: "Share your masterpieces and interact with other foodies.",
            link: "#"
        },
        {
            icon: <Settings className="w-8 h-8" />,
            title: "Account & Settings",
            description: "Manage your profile, preferences, and dietary restrictions.",
            link: "#"
        }
    ];

    const popularArticles = [
        "How do I add my own ingredients?",
        "Setting up dietary restrictions",
        "How to share recipes to the community",
        "Unlocking premium Dr. Foodie features",
        "Managing my saved recipe collection"
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
                <section className="relative py-20 px-6 md:px-12 bg-brand-light/50">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark mb-8">
                            How can we <span className="italic text-brand-accent">help?</span>
                        </h1>

                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-dark/40 w-6 h-6" />
                            <input
                                type="text"
                                placeholder="Search for recipes, features, or help..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-white rounded-2xl shadow-xl border border-brand-primary/10 text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-all text-lg"
                            />
                        </div>
                    </div>
                </section>

                {/* Categories Grid */}
                <section className="py-16 px-6 md:px-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((cat, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -8 }}
                                    className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl border border-brand-primary/10 shadow-sm hover:shadow-md transition-all cursor-pointer group text-center"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-6 text-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all duration-300">
                                        {cat.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-brand-dark mb-3">{cat.title}</h3>
                                    <p className="text-brand-dark/60 text-sm leading-relaxed">{cat.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Popular Articles & Quick Help */}
                <section className="py-16 px-6 md:px-12 bg-brand-primary/5">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
                        {/* Popular Articles */}
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-bold text-brand-dark mb-8 flex items-center gap-3">
                                <PlayCircle className="text-brand-accent" />
                                Popular Articles
                            </h2>
                            <div className="space-y-4">
                                {popularArticles.map((article, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ x: 10 }}
                                        className="bg-white/40 p-5 rounded-2xl border border-brand-primary/10 flex items-center justify-between cursor-pointer group"
                                    >
                                        <span className="text-brand-dark font-medium group-hover:text-brand-accent transition-colors">{article}</span>
                                        <ChevronRight className="w-5 h-5 text-brand-dark/30 group-hover:text-brand-accent" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Help Box */}
                        <div className="bg-brand-dark rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/20 rounded-full blur-3xl"></div>
                            <div className="relative z-10">
                                <HelpCircle className="w-12 h-12 text-brand-accent mb-6" />
                                <h3 className="text-xl font-bold mb-4 italic">Still need support?</h3>
                                <p className="text-white/70 mb-8 text-sm leading-relaxed">
                                    Can't find what you're looking for? Our dedicated team of foodies is ready to assist you.
                                </p>
                                <button
                                    onClick={() => navigate('/contact-us')}
                                    className="w-full py-4 rounded-xl bg-white text-brand-dark font-bold hover:bg-brand-accent hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Contact Us
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </motion.div>
        </div>
    );
};

export default HelpCenter;
