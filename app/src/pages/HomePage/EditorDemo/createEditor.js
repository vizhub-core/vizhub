import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import interact from '@replit/codemirror-interact';

export const createEditor = ({ codemirrorContainer, doc, onChange }) =>
  new EditorView({
    doc,
    extensions: [
      basicSetup,
      javascript(),
      // Inspired by:
      // https://github.com/replit/codemirror-interact/blob/master/dev/index.ts
      interact({
        rules: [
          // a rule for a number dragger
          {
            // the regexp matching the value
            regexp: /-?\b\d+\.?\d*\b/g,
            // set cursor to "ew-resize" on hover
            cursor: 'ew-resize',
            // change number value based on mouse X movement on drag
            onDrag: (text, setText, e) => {
              const newVal = Number(text) + e.movementX;
              if (isNaN(newVal)) return;
              setText(newVal.toString());
            },
          },
          // bool toggler
          {
            regexp: /true|false/g,
            cursor: 'pointer',
            onClick: (text, setText) => {
              switch (text) {
                case 'true':
                  return setText('false');
                case 'false':
                  return setText('true');
              }
            },
          },
          // url clicker
          {
            regexp: /https?:\/\/[^ "]+/g,
            cursor: 'pointer',
            onClick: (text) => {
              window.open(text);
            },
          },
        ],
      }),
      // Listen for changes.
      // Inspired by https://discuss.codemirror.net/t/codemirror-6-proper-way-to-listen-for-changes/2395/10
      EditorView.updateListener.of((viewUpdate) => {
        if (viewUpdate.docChanged) {
          onChange(viewUpdate.state.doc.toString());
        }
      }),
    ],
    parent: codemirrorContainer,
  });
