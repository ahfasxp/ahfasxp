"use client";

import Link from "next/link";

const tools = [
  {
    title: "Saving Challenge",
    description: "Rp30 juta dalam 52 minggu - Track progress menabung dengan visual interaktif",
    path: "/tools/saving-challenge",
    icon: "💰",
    color: "from-purple-500 to-indigo-600"
  },
  {
    title: "Target Realistis Saham",
    description: "Hitung target harga saham realistis berdasarkan data orderbook dan volume",
    path: "/tools/stock-targets",
    icon: "📈",
    color: "from-blue-500 to-cyan-600"
  },
  {
    title: "My Trading Plan",
    description: "Buat dan kelola trading plan dengan entry, TP, SL, dan risk management",
    path: "/tools/trading-plan",
    icon: "📊",
    color: "from-green-500 to-emerald-600"
  }
];

export default function ToolsGrid() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          🛠️ Trading Tools
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Koleksi tools untuk membantu trading dan investasi
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.path}
              href={tool.path}
              className="group block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className={`text-4xl mb-4 w-16 h-16 flex items-center justify-center rounded-lg bg-gradient-to-br ${tool.color}`}>
                {tool.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {tool.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
