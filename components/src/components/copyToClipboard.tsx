// A single function to handle copying text to the clipboard
export const copyToClipboard = (textToCopy: string) => {
  // Check if the Clipboard API is available and text is not empty
  if (navigator.clipboard && textToCopy) {
    navigator.clipboard
      .writeText(textToCopy)
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  } else {
    console.error(
      'Clipboard API not available or text is empty.',
    );
  }
};
