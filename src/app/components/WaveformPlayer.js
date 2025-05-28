
"use client";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

export default function WaveformPlayer({ audioUrl }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#bbf7d0", // Tailwind green-200
        progressColor: "#22c55e", // Tailwind green-500
        cursorColor: "#16a34a", // Tailwind green-600
        height: 80,
        barWidth: 3,
        barGap: 2,
        barRadius: 3,
        responsive: true,
        normalize: true,
        backend: "WebAudio",
      });

      wavesurfer.current.load(audioUrl);

      wavesurfer.current.on("finish", () => {
        setIsPlaying(false);
      });
    }

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800">
      <div ref={waveformRef} className="w-full rounded overflow-hidden bg-green-50" />

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlayPause}
        className="flex items-center gap-3 px-8 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300"
      >
        {isPlaying ? (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Pause size={28} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Play size={28} />
          </motion.div>
        )}
        {isPlaying ? "Pause" : "Play"}
      </motion.button>
    </div>
  );
}

