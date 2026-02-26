import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import RiceDaalIcon from "../../../assets/Rice_Daal.svg";
import DaalIcon from "../../../assets/Daal.jpg";

const LandingLeftovers = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -250]);

    return (
        <div ref={containerRef} className="py-20 px-6 md:px-12 bg-brand-beige overflow-hidden">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">

                <div className="flex-1 scroll-animate scroll-animate-left">
                    <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6 leading-tight">
                        Instant Recipes from your Leftovers
                    </h2>
                    <p className="text-brand-accent text-lg mb-8 leading-none ">
                        Stop wondering "What 's for dinner?" Just list what you have, and watch the magic happen. From 15-minute quick fixes to weekend feasts.
                    </p>

                    <div className="space-y-4">
                        {[
                            "No-waste cooking algorithms.",
                            "Dynamic portion scaling",
                            "Smart ingredient substitutions"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-brand-accent text-brand-light flex items-center justify-center text-xs">✓</div>
                                <span className="font-bold text-brand-dark">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 relative flex justify-center scroll-animate scroll-animate-right delay-2 min-h-[400px]">
                    {/* Card 1 */}
                    <motion.div
                        style={{ y: y1 }}
                        className="bg-brand-light rounded-2xl p-3 transform -rotate-8 w-60 absolute left-6 top-10 z-10 shadow-[0_4px_9px_5px_rgba(0,0,0,0.05)] group transition-all duration-500 hover:shadow-xl hover:scale-[1.01] cursor-pointer"
                    >
                        <div className="bg-gray-800 h-50 rounded-xl mb-3 overflow-hidden">
                            <img src={DaalIcon} alt="Dal Makhani" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <h4 className="font-bold text-brand-dark">Dal Makhani</h4>
                                <span className="text-xs text-brand-dark/60">30 Mins</span>
                            </div>
                            <div className="bg-brand-accent px-2 py-1 rounded text-[10px] font-bold text-white">
                                Score A
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        style={{ y: y2 }}
                        className="bg-brand-light rounded-2xl p-3 transform rotate-6 w-60 mt-40 ml-40 shadow-[0_4px_9px_5px_rgba(0,0,0,0.05)] group transition-all duration-500 hover:shadow-xl hover:scale-[1.01] cursor-pointer"
                    >
                        <div className="bg-gray-800 h-50 rounded-lg mb-3 overflow-hidden">
                            <img src={RiceDaalIcon} alt="Dal Makhani" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <h4 className="font-bold text-brand-dark">Rice-Jira</h4>
                                <span className="text-xs text-brand-dark/60">25 Mins</span>
                            </div>
                            <div className="bg-brand-accent px-2 py-1 rounded text-[10px] font-bold text-white">
                                Score B
                            </div>
                        </div>
                    </motion.div>

                </div>

            </div>
        </div>
    );
};

export default LandingLeftovers;

