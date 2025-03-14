import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';

export interface UseSpeechRecognitionResult {
  isSpeaking: boolean;
  toggleSpeechRecognition: () => void;
  stopSpeaking: () => void;
}

export const useSpeechRecognition = (
  onTranscriptChange: Dispatch<SetStateAction<string>>,
): UseSpeechRecognitionResult => {
  const [isSpeaking, setIsSpeaking] =
    useState<boolean>(false);
  const [recognition, setRecognition] =
    useState<SpeechRecognition | null>(null);

  // Speech recognition setup
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');

        onTranscriptChange((prev: string) => {
          // For interim results, replace the last sentence
          // For final results, append to existing text
          const isInterim =
            event.results[event.results.length - 1]
              .isFinal === false;
          if (isInterim && prev.includes('.')) {
            const lastSentenceIndex = prev.lastIndexOf('.');
            return (
              prev.substring(0, lastSentenceIndex + 1) +
              ' ' +
              transcript
            );
          }
          return transcript;
        });
      };

      recognitionInstance.onerror = (event) => {
        console.error(
          'Speech recognition error',
          event.error,
        );
        setIsSpeaking(false);
      };

      recognitionInstance.onend = () => {
        setIsSpeaking(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [onTranscriptChange]);

  const toggleSpeechRecognition = useCallback(() => {
    if (!recognition) {
      console.error(
        'Speech recognition not supported in this browser',
      );
      return;
    }

    if (isSpeaking) {
      recognition.stop();
      setIsSpeaking(false);
    } else {
      recognition.start();
      setIsSpeaking(true);
    }
  }, [isSpeaking, recognition]);

  const stopSpeaking = useCallback(() => {
    if (recognition && isSpeaking) {
      recognition.stop();
      setIsSpeaking(false);
    }
  }, [isSpeaking, recognition]);

  return {
    isSpeaking,
    toggleSpeechRecognition,
    stopSpeaking,
  };
};
