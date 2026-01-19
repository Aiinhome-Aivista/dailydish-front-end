import { useState } from "react";
import sobaIcon from "../../../assets/soba.svg";
import japanese_curry from "../../../assets/japanese_curry.svg";
import kebab_dining from "../../../assets/kebab_dining.svg";
import dinner_dining from "../../../assets/dinner_dining.svg";
import yoshoku from "../../../assets/yoshoku.svg";

interface Ingredient {
  id: string;
  name: string;
  qty: string;
  unit: string;
}

export default function RecipeConfiguration() {
  const [servings, setServings] = useState(4);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", name: "Chicken Breast", qty: "500", unit: "Grams" },
    { id: "2", name: "Garlic", qty: "3", unit: "Cloves" },
  ]);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("Unit");
  const [cuisine, setCuisine] = useState("ORIENTAL");
  const [time, setTime] = useState("15m");

  const addIngredient = () => {
    if (name && qty && unit !== "Unit") {
      setIngredients([
        ...ingredients,
        { id: Date.now().toString(), name, qty, unit },
      ]);
      setName("");
      setQty("");
      setUnit("Unit");
    }
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((item) => item.id !== id));
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#435334]">
            Recipe Configuration
          </h1>
          <p className="text-sm text-[#95B974]">
            Input your ingredients and preferences to let our AI craft your
            perfect meal.
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#435334] mb-2">
            1&nbsp; Add Ingredients
          </h2>

          <div className="rounded-xl p-4 space-y-4">
            <h2 className="text-sm font-semibold text-[#435334] mb-2">
              Ingredient Name
            </h2>
            <div className="grid grid-cols-12 gap-3">
              <input
                className="col-span-6 rounded-lg px-4 py-2 text-sm bg-[#F7F4E8] outline-none"
                placeholder="e.g. Fresh Atlantic Salmon"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="col-span-2 rounded-lg px-4 py-2 text-sm bg-[#F7F4E8] outline-none"
                placeholder="0"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
              <select
                className="col-span-3 rounded-lg px-3 py-2 text-sm bg-[#F7F4E8] outline-none"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option>Unit</option>
                <option>Grams</option>
                <option>Cloves</option>
              </select>
              <button
                onClick={addIngredient}
                className="col-span-1 bg-[#95B974] text-white rounded-lg text-sm font-medium"
              >
                + Add
              </button>
            </div>
          </div>
          <div className="mt-4">
            <div className="bg-[#EFEAD6] rounded-xl">
              <div className="grid grid-cols-12 text-xs text-[#95B974] bg-[#CEDEBD36] px-4 py-2">
                <div className="col-span-5">INGREDIENT NAME</div>
                <div className="col-span-3">QUANTITY</div>
                <div className="col-span-3">UNIT</div>
                <div className="col-span-1 text-right">ACTION</div>
              </div>
              <div className="border-t border-[#DDD7BF]">
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
        </div>
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#4A5D3B] mb-3">
            2&nbsp; Cuisine Preferences
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
          <h2 className="text-sm font-semibold text-[#4A5D3B] mb-3">
            3&nbsp; Meal Settings
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Servings */}
            <div className="bg-[#F1EEDC] rounded-xl p-4">
              <p className="text-sm text-[#4A5D3B] mb-2">Number of Servings</p>
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
                <span className="text-xs text-[#7A8F63] ml-auto">People</span>
              </div>
            </div>

            {/* Cooking Time */}
            <div className="bg-[#F1EEDC] rounded-xl p-4">
              <p className="text-sm text-[#4A5D3B] mb-2">Cooking Time</p>
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
                  active={time === "1h+"}
                  label="1h+"
                  onClick={() => setTime("1h+")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#D9E8C6] rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#4A5D3B]">
              Ready for your AI Creation?
            </p>
            <p className="text-xs text-[#6E8B5C]">
              We have enough information to craft a unique 5-star recipe for
              you.
            </p>
          </div>
          <button className="bg-[#8FB573] text-white px-6 py-2 rounded-lg text-sm font-medium">
            Generate Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small Components ---------- */

interface RowProps {
  name: string;
  qty: string;
  unit: string;
  onDelete: () => void;
}

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

interface OptionProps {
  label: string;
  active?: boolean;
  icon?: string;
  onClick?: () => void;
}

function Cuisine({ label, active, icon, onClick }: OptionProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-4 text-center text-xs font-semibold
        cursor-pointer ${
          active ? "bg-[#D6E3C1] text-[#4A5D3B]" : "bg-[#F1EEDC] text-[#7A8F63]"
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
        ${
          active ? "bg-[#B9D3A4] text-[#4A5D3B]" : "bg-[#E6E1CA] text-[#7A8F63]"
        }`}
    >
      {label}
    </button>
  );
}
