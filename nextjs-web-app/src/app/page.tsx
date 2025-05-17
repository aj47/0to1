"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useTheme } from "@/context/ThemeContext";

// Signup Modal Component
export function SignupModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { theme } = useTheme();
  
  if (!isOpen) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={`relative w-full max-w-md p-6 rounded-xl shadow-2xl ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-full ${
            theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <h2 className="text-xl font-bold mb-4">Free Limit Reached</h2>
        <p className="mb-6">You&apos;ve reached the limit of 25 free generations. Create an account to continue using our service.</p>
        
        <div className="flex flex-col gap-4">
          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLSdBUzzrsu74cJlRhZZVSQuYAcGZ4_8RKB-G7vYZGibU7S5T4g/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-2 px-4 rounded-lg font-medium text-center block ${
              theme === "dark" 
                ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }`}
          >
            Sign Up
          </a>
          <button 
            onClick={onClose}
            className={`w-full py-2 px-4 rounded-lg font-medium ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleSubmit = async () => {
    if (!prompt) {
      setError("Please enter a prompt to generate web applications.");
      return;
    }

    setError(null);
    setIsLoading(true);
    
    try {
      // Make a test request to check rate limit before redirecting
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.substring(0, 50), // Just send a small part of the prompt for the check
          variation: "rate-limit-check",
          framework: "none",
        }),
      });
      
      if (response.status === 429) {
        // Rate limit exceeded
        setShowSignupModal(true);
        setIsLoading(false);
        return;
      }
      
      const data = await response.json();
      if (data.error === "rate_limit_exceeded") {
        setShowSignupModal(true);
        setIsLoading(false);
        return;
      }
      
      // If no rate limit issues, proceed to results page
      router.push(`/results?prompt=${encodeURIComponent(prompt)}`);
    } catch (error) {
      console.error("Error checking rate limit:", error);
      // Still try to navigate even if there was an error checking rate limit
      router.push(`/results?prompt=${encodeURIComponent(prompt)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {showSignupModal && (
        <SignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
        />
      )}
      <div className="relative z-10">
        <HeroGeometric badge="" title1="0to1" title2="Vibe Startup">
          <div className="w-full max-w-3xl mx-auto">
            <div className="relative bg-[#1a1f2e]/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-[#2a3040] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
              <div className="relative p-6 z-10">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., A startup that helps people find local events."
                  className="w-full h-32 p-4 bg-[#1a1f2e]/50 font-sans text-base
                         border border-[#2a3040] rounded-xl mb-4 
                         focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-transparent resize-none
                         placeholder:text-gray-400/70
                         text-gray-200"
                />

                <RainbowButton
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 text-lg font-medium"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                  ) : null}
                  Launch Startup!
                </RainbowButton>
                
                <div className="mt-4 text-center text-sm text-gray-400">
                  <p>
                    <a 
                      href="https://discord.gg/cK9WeQ7jPq" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </HeroGeometric>
      </div>
    </div>
  );
}
