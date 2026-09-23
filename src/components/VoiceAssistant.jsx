import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

/**
 * TextToSpeechButton: Reads out given text in Hindi, English, or Assamese (Bengali/Assamese phonetic fallback).
 */
export function SpeakButton({
  text = "",
  lang = "en",
  label = "Listen",
  className = "",
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeak = () => {
    if (!isSupported || !text) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const cleanText = (text || "").replace(/[*#_~`[\]()]/g, " "); // Strip markdown
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Set appropriate language code
    if (lang === "hi") {
      utterance.lang = "hi-IN";
    } else if (lang === "as") {
      // Assamese fallback: many engines use bn-IN (Bengali script family) or en-IN
      utterance.lang = "bn-IN";
    } else {
      utterance.lang = "en-IN";
    }

    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={handleToggleSpeak}
      title={isSpeaking ? "Stop voice narration" : "Listen in voice"}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
        isSpeaking
          ? "bg-amber-500 text-white animate-pulse shadow-md"
          : "bg-surface-container hover:bg-surface-container-high text-primary border border-surface-container-highest"
      } ${className}`}
    >
      {isSpeaking ? (
        <>
          <VolumeX size={15} />
          <span>Stop Voice</span>
        </>
      ) : (
        <>
          <Volume2 size={15} className="text-secondary" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

/**
 * SpeechInputButton: Allows the user to speak their question/answer using their microphone.
 */
export function VoiceInputButton({
  onTranscript,
  lang = "en",
  className = "",
}) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;

      recognizer.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && onTranscript) {
          onTranscript(transcript);
        }
        setIsListening(false);
      };

      recognizer.onerror = (e) => {
        console.warn("Speech recognition error:", e.error);
        setIsListening(false);
      };

      recognizer.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognizer;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    } else {
      // Set language code based on current UI language
      if (lang === "hi") {
        recognitionRef.current.lang = "hi-IN";
      } else if (lang === "as") {
        recognitionRef.current.lang = "as-IN";
      } else {
        recognitionRef.current.lang = "en-IN";
      }

      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech recognition start failed:", err);
      }
    }
  };

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      title={isListening ? "Listening... Click to stop" : "Speak your message"}
      className={`p-2 rounded-full transition-all flex items-center justify-center cursor-pointer ${
        isListening
          ? "bg-rose-500 text-white animate-bounce shadow-lg ring-4 ring-rose-200"
          : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
      } ${className}`}
    >
      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
    </button>
  );
}
