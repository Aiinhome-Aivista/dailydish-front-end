import { useState } from "react";

export default function RecipeConfiguration() {
  const [servings, setServings] = useState(4);

  return (
    <div className="min-h-screen bg-[#FBF5E9] flex items-center justify-center p-6">
      <div className="w-full max-w-full bg-[#FBF5E9] rounded-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#4A5D3B]">
            Recipe Configuration
          </h1>
          <p className="text-sm text-[#7A8F63]">
            Input your ingredients and preferences to let our AI craft your perfect meal.
          </p>
        </div>
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#4A5D3B] mb-2">
            1&nbsp; Add Ingredients
          </h2>

          <div className="bg-[#F1EEDC] rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-12 gap-3">
              <input
                className="col-span-6 rounded-lg px-4 py-2 text-sm bg-[#F7F4E8] outline-none"
                placeholder="e.g. Fresh Atlantic Salmon"
              />
              <input
                className="col-span-2 rounded-lg px-4 py-2 text-sm bg-[#F7F4E8] outline-none"
                placeholder="0"
              />
              <select className="col-span-2 rounded-lg px-3 py-2 text-sm bg-[#F7F4E8] outline-none">
                <option>Unit</option>
                <option>Grams</option>
                <option>Cloves</option>
              </select>
              <button className="col-span-2 bg-[#8FB573] text-white rounded-lg text-sm font-medium">
                + Add
              </button>
            </div>
            <div className="bg-[#EFEAD6] rounded-lg">
              <div className="grid grid-cols-12 text-xs text-[#7A8F63] px-4 py-2">
                <div className="col-span-5">INGREDIENT NAME</div>
                <div className="col-span-3">QUANTITY</div>
                <div className="col-span-3">UNIT</div>
                <div className="col-span-1 text-right">ACTION</div>
              </div>
              <div className="border-t border-[#DDD7BF]">
                <Row name="Chicken Breast" qty="500" unit="Grams" />
                <Row name="Garlic" qty="3" unit="Cloves" />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#4A5D3B] mb-3">
            2&nbsp; Cuisine Preferences
          </h2>
          <div className="grid grid-cols-5 gap-3">
            <Cuisine active label="ORIENTAL" />
            <Cuisine label="INDIAN-SUB" />
            <Cuisine label="CENTRAL ASIAN" />
            <Cuisine label="EUROPEAN" />
            <Cuisine label="INTER-CONT" />
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#4A5D3B] mb-3">
            3&nbsp; Meal Settings
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Servings */}
            <div className="bg-[#F1EEDC] rounded-xl p-4">
              <p className="text-sm text-[#4A5D3B] mb-2">
                Number of Servings
              </p>
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
                <span className="text-xs text-[#7A8F63] ml-auto">
                  People
                </span>
              </div>
            </div>

            {/* Cooking Time */}
            <div className="bg-[#F1EEDC] rounded-xl p-4">
              <p className="text-sm text-[#4A5D3B] mb-2">
                Cooking Time
              </p>
              <div className="flex gap-3">
                <Time active label="15m" />
                <Time label="30m" />
                <Time label="1h+" />
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
              We have enough information to craft a unique 5-star recipe for you.
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
}

function Row({ name, qty, unit }: RowProps) {
  return (
    <div className="grid grid-cols-12 px-4 py-3 text-sm text-[#4A5D3B]">
      <div className="col-span-5">{name}</div>
      <div className="col-span-3">{qty}</div>
      <div className="col-span-3">{unit}</div>
      <div className="col-span-1 text-right cursor-pointer">🗑</div>
    </div>
  );
}

interface OptionProps {
  label: string;
  active?: boolean;
}

function Cuisine({ label, active }: OptionProps) {
  return (
    <div
      className={`rounded-xl p-4 text-center text-xs font-semibold
        ${
          active
            ? "bg-[#D6E3C1] text-[#4A5D3B]"
            : "bg-[#F1EEDC] text-[#7A8F63]"
        }`}
    >
      {label}
    </div>
  );
}

function Time({ label, active }: OptionProps) {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm
        ${
          active
            ? "bg-[#B9D3A4] text-[#4A5D3B]"
            : "bg-[#E6E1CA] text-[#7A8F63]"
        }`}
    >
      {label}
    </button>
  );
}
