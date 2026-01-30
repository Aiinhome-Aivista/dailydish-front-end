import React from 'react'
import NavBar from '../../../components/layout/NavBar'
import { useNavigate } from 'react-router-dom'
import Footer from './LandingFooter';

function ExploreRecipes() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <NavBar />
       <button
        onClick={() => navigate('/', { state: { skipSplash: true } })}
        className="absolute top-18 right-12 bg-brand-primary text-brand-dark px-4 py-2 rounded-lg font-semibold hover:bg-[#CEDEBD] transition-colors cursor-pointer flex items-center gap-2"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        Back
      </button>
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-brand-dark mb-4 animate-pulse">
              🍳
            </h1>
            <h2 className="text-4xl md:text-4xl font-bold text-brand-dark mb-6">
              Mind Blowing Recipes Await
            </h2>
            <p className="text-xl md:text-xl text-brand-dark mb-8 leading-relaxed">
              Discover culinary masterpieces crafted with everyday ingredients. 
              Transform your kitchen into a gourmet paradise.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#435334B2] backdrop-blur-2xl text-[#F4F8F1]  rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🌶️</div>
              <h3 className="text-xl font-bold  mb-2">Spicy Delights</h3>
              <p className="">Ignite your taste buds with fiery flavors</p>
            </div>
            <div className="bg-[#435334B2] backdrop-blur-2xl text-[#F4F8F1]  rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🥗</div>
              <h3 className="text-xl font-bold mb-2">Healthy Options</h3>
              <p className="">Nutritious meals that don't compromise on taste</p>
            </div>
            <div className="bg-[#435334B2] backdrop-blur-2xl text-[#F4F8F1]  rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold  mb-2">Quick & Easy</h3>
              <p className="">Delicious meals in under 30 minutes</p>
            </div>
          </div>
          
          <button className="bg-brand-light text-brand-dark px-8 py-4 rounded-full text-xl font-bold hover:bg-[#2a3a24] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer" onClick={() => navigate("/login")}>
            Start Exploring →
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ExploreRecipes
