import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { pantryService } from '../api/saveMenuService';
import { BASE_URL } from '../../../config/endpoints';
import { useToast } from '../../../shared/context/ToastContext';

const ShareMasterpiece = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const meal = location.state?.meal || { details: { menu_name: "Masterpiece" } };
    const mealId = meal.id;
    const { showToast } = useToast();

    const getImageUrl = (url: string) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const cleanUrl = url.replace(/^\/+/, '');
        return `${BASE_URL.replace(/\/$/, '')}/${cleanUrl}`;
    };

    const [rating, setRating] = useState(meal.rating || 4);
    const [story, setStory] = useState(meal.comment || '');
    const [selectedImage, setSelectedImage] = useState<string | null>(meal.image_url ? getImageUrl(meal.image_url) : null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isShared, setIsShared] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleShare = async () => {
        if (!imageFile && !selectedImage) {
            alert('Please select an image first.');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();

            // If post_id exists, it's an edit
            if (meal.post_id) {
                formData.append('post_id', meal.post_id.toString());
                formData.append('rating', rating.toString());
                formData.append('comment', story);
                if (imageFile) {
                    formData.append('image', imageFile);
                }

                const response = await pantryService.editCommunityPost(formData);
                if (response?.status === 'success') {
                    showToast("success", "Post Updated", "Your changes have been submitted and are waiting for admin approval.");
                    setIsShared(true);
                    setTimeout(() => {
                        navigate('/manage-blog-post');
                    }, 2000);
                }
            } else {
                // Otherwise it's a new share
                formData.append('meal_id', mealId.toString());
                formData.append('rating', rating.toString());
                formData.append('comment', story);
                if (imageFile) {
                    formData.append('image', imageFile);
                }

                const response = await pantryService.shareToCommunity(formData);
                if (response?.status === 'success') {
                    showToast("success", "Post Submitted", "Your post is waiting for admin approval. Once approved, it will be visible in the community.");
                    setIsShared(true);
                    setTimeout(() => {
                        navigate('/blog');
                    }, 2000);
                }
            }
        } catch (error) {
            console.error('Failed to process post:', error);
            alert('Failed to process post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full text-brand-dark overflow-y-auto animate-in fade-in duration-500">


            {/* Upload Area */}
            <div
                className={`relative w-full aspect-[33/9] rounded-[2.5rem] border-2 border-dashed border-[#7A8F63]/30 bg-[#F1EDDC] flex flex-col items-center justify-center gap-6`}
                onClick={() => {
                    if (!selectedImage) return;
                    setSelectedImage(null);
                    setImageFile(null);
                }}
            >
                {selectedImage ? (
                    <>
                        <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-[2.5rem]" />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                                setImageFile(null);
                            }}
                            className="absolute top-6 right-6 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors shadow-lg cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center text-brand-accent">
                            <span className="material-symbols-outlined">add_a_photo</span>
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="text-lg font-bold text-[#3e5035]">Click or drag your dish photo here</h3>
                            <p className="text-xs text-brand-dark">High-resolution PNG or JPG (Max 10MB)</p>
                        </div>
                        <label className="bg-brand-primary hover:bg-[#a3b987] text-[#3e5035] px-14 py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer hover:shadow-md active:scale-95">
                            Select File
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    </>
                )}
            </div>

            {/* Slider Section */}
            <div className="space-y-4 mt-6 max-w-[50%]">
                <div className="flex justify-between items-center -mb-0">
                    <h3 className="text-lg font-bold text-brand-dark ">Taste Rating</h3>
                    <span className="text-2xl font-extrabold text-brand-dark">{rating.toString().padStart(2, '0')}</span>
                </div>

                <div className="relative h-10 flex items-center">
                    {/* Background track - padded by half thumb width (14px) */}
                    <div
                        className="absolute h-2 bg-brand-light/40 rounded-full overflow-hidden"
                        style={{ left: '14px', right: '14px' }}
                    >
                        {/* Progress track */}
                        <div
                            className="h-full bg-brand-primary transition-all duration-300"
                            style={{ width: `${((rating - 1) / 9) * 100}%` }}
                        />
                    </div>
                    {/* Functional range input */}
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                        className="relative z-10 w-full h-full bg-transparent appearance-none cursor-pointer outline-none block
                            [&::-webkit-slider-thumb]:appearance-none 
                            [&::-webkit-slider-thumb]:w-5 
                            [&::-webkit-slider-thumb]:h-5 
                            [&::-webkit-slider-thumb]:rounded-full 
                            [&::-webkit-slider-thumb]:bg-[#95B974]
                            [&::-webkit-slider-thumb]:border-[3px]
                            [&::-webkit-slider-thumb]:border-white
                            [&::-webkit-slider-thumb]:shadow-md
                            [&::-moz-range-thumb]:w-7 
                            [&::-moz-range-thumb]:h-7 
                            [&::-moz-range-thumb]:rounded-full 
                            [&::-moz-range-thumb]:bg-[#95B974]
                            [&::-moz-range-thumb]:border-[3px]
                            [&::-moz-range-thumb]:border-white
                            [&::-moz-range-thumb]:shadow-md"
                    />
                </div>
                <div className="flex justify-between text-xs font-bold text-brand-dark -mt-6">
                    <span>01</span>
                    <span>10</span>
                </div>
            </div>

            {/* Story Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-brand-dark mt-3">Your Culinary Story</h3>
                <textarea
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="Tell the community how it went. Any custom tweaks to the recipe?"
                    className="w-full h-30 bg-[#F1EDDC] border border-[#95B97480] rounded-2xl p-4 text-brand-accent placeholder:text-brand-accent focus:outline-none focus:border-[#7A8F63]/40  text-xs"
                />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-6 pt-6 text-xs">
                <button className="px-5 py-3.5 rounded-xl font-bold border border-[#95B974]  text-brand-dark hover:bg-[#E8EDDE] transition-all shadow-sm active:scale-95 cursor-pointer">
                    Save to Draft
                </button>
                <button
                    onClick={handleShare}
                    disabled={isLoading || isShared}
                    className="px-5 py-3.5 rounded-xl font-bold bg-brand-accent text-brand-dark hover:bg-[#84a863] transition-all active:scale-95 flex items-center justify-center gap-2 min-w-[180px] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Sharing...</span>
                        </>
                    ) : isShared ? (
                        <>
                            <Check size={20} strokeWidth={3} className="animate-in zoom-in duration-300" />
                            <span>Shared!</span>
                        </>
                    ) : (
                        <span>Share to Community</span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ShareMasterpiece;
