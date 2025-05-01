// app/transcription/page.jsx
"use client";

import WaveformPlayer from "../components/WaveformPlayer"; // <-- Adjust the path if needed
import TextInputWithSubmit from "../components/TextInputWithSubmit";

export default function TranscriptionPage() {
    const audioUrl = "https://www.bensound.com/bensound-music/bensound-ukulele.mp3"; //This is the audio URL that we are using now.
  
    const handleTextSubmit = (text) => {
      console.log("Submitted text:", text);
      // Later you can send this text to your backend!
    };
  
    return (
      <main className="p-6 min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white space-y-8">
        <h1 className="text-2xl font-bold mb-6">New Transcription</h1>
  
        {/* Audio Waveform */}
        <WaveformPlayer audioUrl={audioUrl} />
  
        {/* Text Input with Submit */}
        <TextInputWithSubmit onSubmit={handleTextSubmit} />
      </main>
    );
  }