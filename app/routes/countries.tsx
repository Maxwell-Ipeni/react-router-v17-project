import { Link } from "react-router";
import type { Route } from "./+types/countries";
import { useState } from "react";

export async function clientLoader() {
  const res = await fetch("https://restcountries.com/v3.1/all");
  const data = await res.json();
  return data;
}

export default function Countries({ loaderData }: Route.ComponentProps) {
  const [search, setSearch] = useState<string>("");
  const [region, setRegion] = useState<string>("");

  // Normalize loaderData: depending on how the dev/runtime provides loader data
  // it may be the array itself or wrapped in an object (e.g. { data: [...] }).
  // Make this component resilient and fall back to an empty array.
  const raw = loaderData ?? [];
  const countriesArray: any[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw?.loaderData)
    ? raw.loaderData
    : [];

  const filteredCountries = countriesArray.filter((country: any) => {
    const matchesRegion =
      !region || (country.region || "").toLowerCase() === region.toLowerCase();
    const matchesSearch =
      !search ||
      (country.name?.common || "").toLowerCase().includes(search.toLowerCase());
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Explore Countries with Real-Time Data</h2>
          <p className="text-sm text-gray-600 mt-1">Browse, search, and filter countries with live data from REST Countries.</p>
        </div>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
          alt="Colored world countries map"
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            // fallback to local svg
            if (!img.src.endsWith('/world-map.svg')) {
              img.onerror = null;
              img.src = '/world-map.svg';
            }
          }}
          className="w-40 h-auto rounded-md shadow-md"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/2 focus:outline-none focus:border-indigo-500"
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/2 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Regions</option>
          <option value="africa">Africa</option>
          <option value="americas">Americas</option>
          <option value="asia">Asia</option>
          <option value="europe">Europe</option>
          <option value="oceania">Oceania</option>
        </select>
      </div>

      {filteredCountries.length === 0 ? (
        <div> No countries match your filters. </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCountries.map((country: any) => (
            <li
              key={country.cca3}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <Link
                to={`/countries/${country.name.common}`}
                className="text-indigo-600 hover:underline text-lg font-semibold"
              >
                {country.name.common}
              </Link>
              <div className="text-gray-600 text-sm mt-1">
                Region: {country.region} <br />
                Population: {country.population.toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
