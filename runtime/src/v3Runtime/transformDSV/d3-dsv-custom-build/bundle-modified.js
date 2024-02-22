var EOL = {},
  EOF = {},
  QUOTE = 34,
  NEWLINE = 10,
  RETURN = 13;

function objectConverter(columns) {
  return new Function(
    'd',
    'return {' +
      columns
        .map(function (name, i) {
          return (
            JSON.stringify(name) + ': d[' + i + '] || ""'
          );
        })
        .join(',') +
      '}',
  );
}

function customConverter(columns, f) {
  var object = objectConverter(columns);
  return function (row, i) {
    return f(object(row), i, columns);
  };
}

function dsv(delimiter) {
  var DELIMITER = delimiter.charCodeAt(0);

  function parse(text, f) {
    var convert,
      columns,
      rows = parseRows(text, function (row, i) {
        if (convert) return convert(row, i - 1);
        (columns = row),
          (convert = f
            ? customConverter(row, f)
            : objectConverter(row));
      });
    rows.columns = columns || [];
    return rows;
  }

  function parseRows(text, f) {
    var rows = [], // output rows
      N = text.length,
      I = 0, // current character index
      n = 0, // current line number
      t, // current token
      eof = N <= 0, // current token followed by EOF?
      eol = false; // current token followed by EOL?

    // Strip the trailing newline.
    if (text.charCodeAt(N - 1) === NEWLINE) --N;
    if (text.charCodeAt(N - 1) === RETURN) --N;

    function token() {
      if (eof) return EOF;
      if (eol) return (eol = false), EOL;

      // Unescape quotes.
      var i,
        j = I,
        c;
      if (text.charCodeAt(j) === QUOTE) {
        while (
          (I++ < N && text.charCodeAt(I) !== QUOTE) ||
          text.charCodeAt(++I) === QUOTE
        );
        if ((i = I) >= N) eof = true;
        else if ((c = text.charCodeAt(I++)) === NEWLINE)
          eol = true;
        else if (c === RETURN) {
          eol = true;
          if (text.charCodeAt(I) === NEWLINE) ++I;
        }
        return text.slice(j + 1, i - 1).replace(/""/g, '"');
      }

      // Find next delimiter or newline.
      while (I < N) {
        if ((c = text.charCodeAt((i = I++))) === NEWLINE)
          eol = true;
        else if (c === RETURN) {
          eol = true;
          if (text.charCodeAt(I) === NEWLINE) ++I;
        } else if (c !== DELIMITER) continue;
        return text.slice(j, i);
      }

      // Return last token before EOF.
      return (eof = true), text.slice(j, N);
    }

    while ((t = token()) !== EOF) {
      var row = [];
      while (t !== EOL && t !== EOF)
        row.push(t), (t = token());
      if (f && (row = f(row, n++)) == null) continue;
      rows.push(row);
    }

    return rows;
  }

  return {
    parse: parse,
  };
}

var csv = dsv(',');

var csvParse = csv.parse;

var tsv = dsv('\t');

var tsvParse = tsv.parse;

export { csvParse, tsvParse };
