import { renderHook, act } from '@testing-library/react';
import { useSpeechRecognition } from '../useSpeechRecognition';

// Mock SpeechRecognition
const mockSpeechRecognition = {
  continuous: false,
  interimResults: false,
  onresult: null,
  onerror: null,
  onend: null,
  start: jest.fn(),
  stop: jest.fn(),
  abort: jest.fn(),
};

// Mock the global SpeechRecognition
Object.defineProperty(window, 'SpeechRecognition', {
  writable: true,
  value: jest.fn().mockImplementation(() => mockSpeechRecognition),
});

// Mock webkitSpeechRecognition as fallback
Object.defineProperty(window, 'webkitSpeechRecognition', {
  writable: true,
  value: jest.fn().mockImplementation(() => mockSpeechRecognition),
});

describe('useSpeechRecognition', () => {
  let mockSetTranscript: jest.Mock;

  beforeEach(() => {
    mockSetTranscript = jest.fn();
    jest.clearAllMocks();
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() =>
      useSpeechRecognition(mockSetTranscript),
    );

    expect(result.current.isSpeaking).toBe(false);
    expect(typeof result.current.toggleSpeechRecognition).toBe(
      'function',
    );
    expect(typeof result.current.stopSpeaking).toBe('function');
  });

  it('should start speech recognition when toggled', () => {
    const { result } = renderHook(() =>
      useSpeechRecognition(mockSetTranscript),
    );

    act(() => {
      result.current.toggleSpeechRecognition();
    });

    expect(mockSpeechRecognition.start).toHaveBeenCalled();
    expect(result.current.isSpeaking).toBe(true);
  });

  it('should stop speech recognition when toggled while speaking', () => {
    const { result } = renderHook(() =>
      useSpeechRecognition(mockSetTranscript),
    );

    // Start speaking first
    act(() => {
      result.current.toggleSpeechRecognition();
    });

    // Then stop
    act(() => {
      result.current.toggleSpeechRecognition();
    });

    expect(mockSpeechRecognition.stop).toHaveBeenCalled();
    expect(result.current.isSpeaking).toBe(false);
  });

  it('should handle speech recognition results correctly', () => {
    const { result } = renderHook(() =>
      useSpeechRecognition(mockSetTranscript),
    );

    // Start recognition
    act(() => {
      result.current.toggleSpeechRecognition();
    });

    // Simulate speech recognition result with final and interim results
    const mockEvent = {
      results: [
        { isFinal: true, 0: { transcript: 'Hello world' } },
        { isFinal: false, 0: { transcript: ' testing' } },
      ],
      resultIndex: 0,
    };

    act(() => {
      if (mockSpeechRecognition.onresult) {
        mockSpeechRecognition.onresult(mockEvent);
      }
    });

    // Should combine final and interim text
    expect(mockSetTranscript).toHaveBeenCalledWith(
      'Hello world testing',
    );
  });

  it('should handle only final results', () => {
    const { result } = renderHook(() =>
      useSpeechRecognition(mockSetTranscript),
    );

    act(() => {
      result.current.toggleSpeechRecognition();
    });

    const mockEvent = {
      results: [{ isFinal: true, 0: { transcript: 'Final text' } }],
      resultIndex: 0,
    };

    act(() => {
      if (mockSpeechRecognition.onresult) {
        mockSpeechRecognition.onresult(mockEvent);
      }
    });

    expect(mockSetTranscript).toHaveBeenCalledWith('Final text');
  });

  it('should handle only interim results', () => {
    const { result } = renderHook(() =>
      useSpeechRecognition(mockSetTranscript),
    );

    act(() => {
      result.current.toggleSpeechRecognition();
    });

    const mockEvent = {
      results: [
        { isFinal: false, 0: { transcript: 'Interim text' } },
      ],
      resultIndex: 0,
    };

    act(() => {
      if (mockSpeechRecognition.onresult) {
        mockSpeechRecognition.onresult(mockEvent);
      }
    });

    expect(mockSetTranscript).toHaveBeenCalledWith('Interim text');
  });
});