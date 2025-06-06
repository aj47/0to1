"use client";

import { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { BrowserContainer } from "@/components/ui/browser-container";
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import styled from "styled-components";

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: none;
  outline: none;
`;

// Array of all available videos
const videos = [
  { src: "/v0video.mp4", title: "V0 Video" },
  { src: "/v0.mp4", title: "V0" },
  { src: "/every.mp4", title: "Every" },
  { src: "/namecheap.mp4", title: "Namecheap" },
  { src: "/posthog.mp4", title: "PostHog" },
  { src: "/stripe.mp4", title: "Stripe" },
  { src: "/tiktok.mp4", title: "TikTok" },
  { src: "/x.mp4", title: "X" },
  { src: "/product hunt.mp4", title: "Product Hunt" }
];

// Simplified component that shows all videos in a grid
function ResultsContent() {
  const { theme } = useTheme();

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`w-full min-h-screen p-6 pb-20 md:p-8 ${
          theme === "dark" ? "bg-gray-900" : ""
        }`}
      >
        <div
          className={`max-w-7xl mx-auto flex flex-col ${
            theme === "light" ? "backdrop-blur-sm" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-xl ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 ">
                0to1
              </span>
            </motion.h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/"
                className={`hover:underline transition-colors ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                ← Back to Prompt
              </Link>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`mb-8 text-center ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
          </motion.div>

          {/* Grid of videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {videos.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-[250px]"
              >
                <BrowserContainer theme={theme} title={video.title}>
                  <VideoContainer>
                    <StyledVideo 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                    >
                      <source src={video.src} type="video/mp4" />
                      Your browser does not support the video tag.
                    </StyledVideo>
                  </VideoContainer>
                </BrowserContainer>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}

// Main component with Suspense boundary
export default function Results() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Loading...</h2>
          <div className="w-16 h-16 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
