import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import ToolsGrid from "@/components/ToolsGrid";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ProjectGrid />
      <ToolsGrid />
      
      <footer className="container mx-auto px-4 py-8 mt-12 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Muchamad Ahfas Fazria. Built with Next.js & Tailwind CSS.</p>
        </div>
      </footer>
    </main>
  );
}
// Test auto-deploy
