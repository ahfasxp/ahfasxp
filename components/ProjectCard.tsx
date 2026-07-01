"use client";

import Image from "next/image";
import { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className="relative h-64 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {project.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Tech:</span> {project.tech}
        </p>
      </div>
      
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          project.type === "mobile" 
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" 
            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
        }`}>
          {project.type === "mobile" ? "📱 Mobile" : "🌐 Website"}
        </span>
      </div>
    </div>
  );
}
