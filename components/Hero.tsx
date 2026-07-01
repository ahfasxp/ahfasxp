"use client";

import { FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          👋 Hello, I'm Ahfas
        </h1>
        <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">
          Mobile and Web Developer specializing in Flutter, Swift & Laravel
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Full Stack Developer with 4+ years of experience building professional mobile and web applications. 
          Expertise in Flutter, Swift, Laravel, and Clean Architecture.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="mailto:ahfas.fazria@gmail.com"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaEnvelope />
            <span>ahfas.fazria@gmail.com</span>
          </a>
          
          <a
            href="https://linkedin.com/in/ahfasxp/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FaLinkedin className="text-blue-600" />
            <span>LinkedIn</span>
          </a>
          
          <a
            href="https://github.com/ahfasxp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FaGithub />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
}
