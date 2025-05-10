
// "use client";
// import { useState, useRef, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Send } from "lucide-react";

// export default function TextInputWithSubmit({ onSubmit }) {
//   const [inputValue, setInputValue] = useState("");
//   const textareaRef = useRef(null);

//   const handleSubmit = () => {
//     if (inputValue.trim() !== "") {
//       onSubmit(inputValue);
//       setInputValue("");
//     }
//   };

//   // Auto-resize the textarea height
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto"; // Reset height
//       textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; // Set new height
//     }
//   }, [inputValue]);

//   return (
//     <div className="flex flex-col md:flex-row items-center gap-4 w-full">
//       {/* Textarea */}
//       <textarea
//         ref={textareaRef}
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         placeholder="Type your text here..."
//         rows={1} // Start with one row
//         className="flex-1 px-6 py-3 rounded-2xl border-2 border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 dark:text-white transition-all duration-300 shadow-sm resize-none overflow-hidden"
//       />

//       {/* Submit Button */}
//       <motion.button
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         onClick={handleSubmit}
//         className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
//       >
//         <Send size={22} />
//         Submit
//       </motion.button>
//     </div>
//   );


"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function TextInputWithSubmit({ onSubmit }) {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = () => {
    if (inputValue.trim() !== "") {
      onSubmit(inputValue);
      setInputValue("");
    }
  };

  // Auto-resize the textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; // Set new height
    }
  }, [inputValue]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full">
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your text here..."
        rows={1} // Start with one row
        className="flex-1 px-6 py-3 rounded-2xl border-2 border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 dark:text-white transition-all duration-300 shadow-sm resize-none overflow-hidden"
      />

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
      >
        <Send size={22} />
        Submit
      </motion.button>
    </div>
  );
}
