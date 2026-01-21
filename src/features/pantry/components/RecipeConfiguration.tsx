import { useState } from "react";
import sobaIcon from "../../../assets/soba.svg";
import japanese_curry from "../../../assets/japanese_curry.svg";
import kebab_dining from "../../../assets/kebab_dining.svg";
import dinner_dining from "../../../assets/dinner_dining.svg";
import yoshoku from "../../../assets/yoshoku.svg";
import { generateRecipes } from "../api/recipeConfigurationService";
import { useNavigate } from "react-router-dom";
import type { RecipeGenerationRequest, Ingredient } from "../types/recipeConfiguration";
import CuisineLoader from '../../../components/feedback/DailyDishLoader';
import type { RowProps, OptionProps } from "../types/recipeConfiguration";
import { useToast } from "../../../shared/context/ToastContext";




export default function RecipeConfiguration() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [servings, setServings] = useState(4);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("Unit");
  const [cuisine, setCuisine] = useState("ORIENTAL");
  const [time, setTime] = useState("15m");
  const [mealType, setMealType] = useState("Daily");
  const [errors, setErrors] = useState<{ name?: string; qty?: string; unit?: string }>({});
  const [generateError, setGenerateError] = useState("");
  const [loading, setLoading] = useState(false);

  const addIngredient = () => {
    const newErrors: { name?: string; qty?: string; unit?: string } = {};
    if (!name.trim()) newErrors.name = "Required";
    if (!qty.trim()) {
      newErrors.qty = "Required";
    } else if (isNaN(Number(qty)) || Number(qty) <= 0) {
      newErrors.qty = "Invalid";
    }
    if (unit === "Unit") newErrors.unit = "Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIngredients([...ingredients, { id: Date.now().toString(), name, qty, unit }]);
    setName("");
    setQty("");
    setUnit("Unit");
    setErrors({});
    setGenerateError("");
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((item) => item.id !== id));
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      setGenerateError("Please add at least one ingredient to generate recipes.");
      return;
    }

    setLoading(true);
    try {
      const payload: RecipeGenerationRequest = {
        ingredients: ingredients.map(i => ({ name: i.name, qty: `${i.qty}${i.unit}` })),
        cuisine_preference: cuisine,
        number_of_people: servings,
        cooking_time: time,
        cooking_preference: mealType,
      };

      const response = await generateRecipes(payload);

      if (response && response.status === "success") {
        showToast("success", "Success", response.message || "Recipes generated successfully!");
        navigate('/ai-menu', { state: { recipes: response.data.recipes } });
      } else {
        showToast("error", "Error", response?.message || "An error occurred.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong!";
      showToast("error", "Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <CuisineLoader />;
  }
  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-brand-dark">
            Recipe Configuration
          </h1>
          <p className="text-sm text-brand-accent">
            Input your ingredients and preferences to let our AI craft your
            perfect meal.
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-sm font-bold text-brand-dark mb-3 flex items-center gap-3">
            <span className="rounded-full bg-brand-dark w-7 h-7 flex  items-center justify-center text-brand-beige">
              1
            </span>

            Add Ingredients
          </h2>

          <div className="bg-[#CEDEBD36] border border-brand-light rounded-xl p-4 space-y-4">
            <h2 className="text-sm  text-brand-accent font-bold mb-2">
              Ingredient Name
            </h2>
            <div className="grid grid-cols-12 gap-3 items-start">
              <div className="col-span-6 flex flex-col gap-1">
                <input
                  className={`w-full rounded-lg px-4 py-2 text-sm bg-brand-beige outline-none text-brand-accent ${errors.name ? "border border-red-500" : ""
                    }`}
                  placeholder="e.g. Fresh Atlantic Salmon"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                />
                {errors.name && <span className="text-[10px] text-red-500 pl-1">{errors.name}</span>}
              </div>

              <div className="col-span-2 flex flex-col gap-1">
                <input
                  className={`w-full rounded-lg px-4 py-2 text-sm bg-brand-beige outline-none text-brand-accent ${errors.qty ? "border border-red-500" : ""
                    }`}
                  placeholder="0"
                  value={qty}
                  onChange={(e) => {
                    setQty(e.target.value);
                    if (errors.qty) setErrors({ ...errors, qty: undefined });
                  }}
                />
                {errors.qty && <span className="text-[10px] text-red-500 pl-1">{errors.qty}</span>}
              </div>

              <div className="col-span-3 flex flex-col gap-1">
                <select
                  className={`w-full rounded-lg px-3 py-2 text-sm bg-brand-beige outline-none text-brand-accent ${errors.unit ? "border border-red-500" : ""
                    }`}
                  value={unit}
                  onChange={(e) => {
                    setUnit(e.target.value);
                    if (errors.unit) setErrors({ ...errors, unit: undefined });
                  }}
                >
                  <option value="Unit">Unit</option>
                  <option value="Grams">Grams</option>
                  <option value="Kg">Kg</option>
                  <option value="Cloves">Cloves</option>
                  <option value="Pieces">Pieces</option>
                  <option value="Cups">Cups</option>
                </select>
                {errors.unit && <span className="text-[10px] text-red-500 pl-1">{errors.unit}</span>}
              </div>

              <button
                onClick={addIngredient}
                className="col-span-1 bg-brand-accent text-brand-dark rounded-lg text-sm font-medium py-2 cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>
          {ingredients.length > 0 && (
            <div className="mt-4">
              <div className="bg-[#CEDEBD36] border border-brand-light rounded-2xl">
                <div className="grid grid-cols-12 text-xs text-brand-accent font-bold bg-[#CEDEBD36] px-4 py-2">
                  <div className="col-span-5">INGREDIENT NAME</div>
                  <div className="col-span-3">QUANTITY</div>
                  <div className="col-span-3">UNIT</div>
                  <div className="col-span-1 text-right">ACTION</div>
                </div>
                <div className="left">
                  {ingredients.map((ing) => (
                    <Row
                      key={ing.id}
                      {...ing}
                      onDelete={() => removeIngredient(ing.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
        <div className="mb-6">
          <h2 className="text-sm font-bold text-[#4A5D3B] mb-3 flex items-center gap-3">
            <span className="rounded-full bg-brand-dark w-7 h-7 flex  items-center justify-center text-brand-beige">
              2
            </span> Cuisine Preferences
          </h2>
          <div className="grid grid-cols-5 gap-3">
            <Cuisine
              active={cuisine === "ORIENTAL"}
              label="ORIENTAL"
              icon={sobaIcon}
              onClick={() => setCuisine("ORIENTAL")}
            />
            <Cuisine
              active={cuisine === "INDIAN-SUB"}
              label="INDIAN-SUB"
              icon={japanese_curry}
              onClick={() => setCuisine("INDIAN-SUB")}
            />
            <Cuisine
              active={cuisine === "CENTRAL ASIAN"}
              label="CENTRAL ASIAN"
              icon={kebab_dining}
              onClick={() => setCuisine("CENTRAL ASIAN")}
            />
            <Cuisine
              active={cuisine === "EUROPEAN"}
              label="EUROPEAN"
              icon={dinner_dining}
              onClick={() => setCuisine("EUROPEAN")}
            />
            <Cuisine
              active={cuisine === "INTER-CONT"}
              label="INTER-CONT"
              icon={yoshoku}
              onClick={() => setCuisine("INTER-CONT")}
            />
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-sm font-bold text-[#4A5D3B] mb-3 flex items-center gap-3">
            <span className="rounded-full bg-brand-dark w-7 h-7 flex  items-center justify-center text-brand-beige">
              3
            </span> Time and Servings
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {/* Servings */}
            <div className="bg-[#CEDEBD36] border border-[#43533414] rounded-xl p-4">
              <p className="text-sm text-brand-dark font-bold mb-2">Number of Servings</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="w-8 h-8 rounded-lg bg-[#D6E3C1]"
                >
                  −
                </button>
                <span className="text-lg font-semibold text-[#4A5D3B]">
                  {servings}
                </span>
                <button
                  onClick={() => setServings(servings + 1)}
                  className="w-8 h-8 rounded-lg bg-[#D6E3C1]"
                >
                  +
                </button>
                <span className="text-xs text-brand-accent ml-auto font-bold">People</span>
              </div>
            </div>

            {/* Cooking Time */}
            <div className="bg-[#CEDEBD36] border border-[#43533414] rounded-xl p-4">
              <p className="text-sm text-brand-dark font-bold mb-2">Cooking Time</p>
              <div className="flex gap-3">
                <Time
                  active={time === "15m"}
                  label="15m"
                  onClick={() => setTime("15m")}
                />
                <Time
                  active={time === "30m"}
                  label="30m"
                  onClick={() => setTime("30m")}
                />
                <Time
                  active={time === "45m"}
                  label="45m"
                  onClick={() => setTime("45m")}
                />
                <Time
                  active={time === "1h+"}
                  label="1h+"
                  onClick={() => setTime("1h+")}
                />
              </div>
            </div>

            {/* Meal Type */}
            <div className="bg-[#CEDEBD36] border border-[#43533414] rounded-xl p-4">
              <p className="text-sm text-brand-dark font-bold mb-2">Meal Type</p>
              <div className="flex gap-3">
                <Time
                  active={mealType === "Daily"}
                  label="Daily"
                  onClick={() => setMealType("Daily")}
                />
                <Time
                  active={mealType === "Special"}
                  label="Special"
                  onClick={() => setMealType("Special")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-brand-light rounded-xl p-4 flex items-center justify-between border border-[#43533414] py-6">
          <div>
            <p className="text-lg font-bold text-brand-dark">
              Ready for your AI Creation?
            </p>
            <p className="text-xs text-brand-accent font-medium">
              We have enough information to craft a unique 5-star recipe for
              you.
            </p>
            {generateError && <p className="text-xs text-red-500 font-bold mt-1">{generateError}</p>}
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`bg-brand-accent text-brand-dark px-6 py-2 rounded-lg text-sm font-bold cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Generating..." : "Generate Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small Components ---------- */



function Row({ name, qty, unit, onDelete }: RowProps) {
  return (
    <div className="grid grid-cols-12 px-4 py-3 text-sm text-[#4A5D3B]">
      <div className="col-span-5">{name}</div>
      <div className="col-span-3">{qty}</div>
      <div className="col-span-3">{unit}</div>
      <div className="col-span-1 text-right cursor-pointer" onClick={onDelete}>
        <span className="material-symbols-outlined">
          delete
        </span>
      </div>
    </div>
  );
}



function Cuisine({ label, active, icon, onClick }: OptionProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-4 text-center text-xs font-semibold border border-[#43533414]
        cursor-pointer ${active ? "bg-[#D6E3C1] text-[#4A5D3B]" : " text-[#7A8F63] bg-[#CEDEBD36] "
        }`}
    >
      {icon && <img src={icon} alt={label} className="w-8 h-8 mx-auto mb-2" />}
      {label}
    </div>
  );
}

function Time({ label, active, onClick }: OptionProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm
        ${active ? "bg-[#B9D3A4] text-[#4A5D3B]" : "bg-[#E6E1CA] text-[#7A8F63]"
        }`}
    >
      {label}
    </button>
  );
}
