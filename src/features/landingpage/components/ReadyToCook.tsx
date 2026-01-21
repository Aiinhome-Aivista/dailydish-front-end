
import { useNavigate } from 'react-router-dom';

const ReadyToCook= () => {
    const navigate = useNavigate();
    return (
        <div className="py-24 px-6 md:px-12 bg-[#CEDEBD36]">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">
                    Ready to cook Smarter?
                </h2>
                <p className="text-brand-dark text-lg mb-10 max-w-xl mx-auto font-medium">
                    Join 50,000+ home chefs using AI to simplify their kitchen routine and eat healthier every single day.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={() => navigate("/signup")}
                        className="px-8 py-3 bg-brand-accent text-white font-bold rounded-lg hover:bg-opacity-90 transition-opacity cursor-pointer"
                    >
                        Get Started - It's Free
                    </button>
                    <button className="px-8 py-3 bg-brand-dark/10 text-brand-dark font-bold rounded-lg hover:bg-brand-dark/20 transition-colors">
                        Explore Features
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReadyToCook;
