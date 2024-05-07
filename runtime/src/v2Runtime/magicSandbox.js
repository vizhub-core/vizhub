// This function was originally part of Blockbuider.
// The original code can be found at https://github.com/enjalot/blockbuilder/blob/master/public/js/utils/parseCode.js
// The original author is Ian Johnson (@enjalot).
// Contributors include:
//  - Geoffery Miller (@georules)
//  - Paweł Kowalski (@pavelloz)
//  - Erik Hazzard (@erikhazzard)
//  - Curran Kelleher (@curran)
//  - Micah Stubbs (@micahstubbs)

// This is from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export default function (template, files) {
  // We parse the user's code to handle some cases where people expect
  // to be able to use relative urls to load files associated with the block
  // (things like external script files, style files or using XHR to grab data)
  // We use RegExps and override the XMLHttpRequest object inside the iframe.
  // obviously this could have some unintended side-effects,
  // but it is presumed that the scenarios where these would fail
  // fall far outside the customary use of blocks.

  // Lets replace relative URL that ignores protocol with http
  // this should work, but its probably an iframe problem
  // http://stackoverflow.com/questions/550038/is-it-valid-to-replace-http-with-in-a-script-src-http
  var find = '<link.*?href=["\']//.*?["\'].*?>';
  var re = new RegExp(find, 'g');
  var matches = template.match(re);
  if (matches) {
    matches.forEach(function (match, i) {
      var proto = match.replace('//', 'https://');
      template = template.replace(match, proto);
    });
  }
  find = '<script.*?src=["\']//.*?["\'].*?>';
  re = new RegExp(find, 'g');
  matches = template.match(re);
  if (matches) {
    matches.forEach(function (match, i) {
      var proto = match.replace('//', 'https://');
      template = template.replace(match, proto);
    });
  }

  var referencedFiles = {};
  var fileNames = Object.keys(files);
  fileNames.forEach(function (file) {
    if (!files[file] || !files[file].content) return;
    if (file === 'index.html') return;
    if (file === 'thumbnail.png') return; // lets ignore the thumbnail if its there

    if (file.indexOf('.js') > 0) {
      // We first try to find instances of loading js files through a <script> tag.
      // We can't fall back on the raw_url because you can't load scripts with MIME type text.
      // This does have the benefit of live reloading when changing a script file.
      var find =
        '<script.*?src=["\']' +
        escapeRegExp(file) +
        '["\'].*?>';
      var re = new RegExp(find, 'g');
      var matches = template.match(re);
      if (matches) {
        // if we found one, replace it with the code and return.
        template = template.replace(
          re,
          '<script>' + files[file].content,
        );
        // this won't work for code that has non-ascii characters in it... which is quite a lot of d3 code
        // template = template.replace(re, '<script src="data:text/javascript;base64,' + btoa(files[file].content) + '">')
        // this works with non-ascii characters but would take more acrobatics to support the defer keyword
        // and also seems like it would make debugging the inserted scripts more complicated
        // template = template.replace(re, '<script src="data:text/javascript;base64,' + b64EncodeUnicode(files[file].content) + '">')
        return;
      }
    }
    if (file.indexOf('.css') > 0) {
      // We support loading of css files with relative paths if they are included in the gist.
      // This has the added benefit of live reloading the iframe when editing the style
      find =
        '<link.*?href=["\']' +
        escapeRegExp(file) +
        '["\'].*?>';
      re = new RegExp(find, 'g');
      matches = template.match(re);
      if (matches) {
        // if we found one, replace it with the code and return.
        template = template.replace(
          re,
          '<style>' + files[file].content + '</style>',
        );
        return;
      }
    }

    // don't try to make html files loadable in this way
    // it has the chance of screwing up the rest of the actual file, and unlikely
    // someone wants to load an html file via ajax...
    if (file.indexOf('.html') >= 0) return;

    /*
      var find = "[\"\']" + file + "[\"\']"
      var re = new RegExp(find, 'g')
      template = template.replace(re, "'" + rawUrl + "'")
      */
    // we keep a list of all the files we might allow people to XHR request.
    // it would be possible to optimize by using the above commented out regex
    // but if a user programatically generates
    referencedFiles[file] = files[file].content;
  });

  // We need to have the file names and their contents available inside the iframe
  // if we want to be able to return them in our short-circuited XHR requests.
  var filesString = encodeURIComponent(
    JSON.stringify(referencedFiles),
  );
  var fileNamesString = JSON.stringify(
    Object.keys(referencedFiles),
  );
  template =
    '<meta charset="utf-8"><script>' +
    // 'var __files = ' + filesString + ';' +
    'var __filesURI = "' +
    filesString +
    '";\n' +
    'var __files = JSON.parse(decodeURIComponent(__filesURI));\n' +
    'var __fileNames = ' +
    fileNamesString +
    ';' +
    '</script>' +
    template;

  // We override the XMLHttpRequest API in order to serve our local copies of files
  // without going to the server. This allows us to live-update the iframe as soon
  // as the file changes.
  // I was able to figure this out thanks to this page:
  // http://ajaxref.com/ch7/xhrhijackfullprototype.html

  var xmlOverride = `<script>(function() {
      var XHR = window.XMLHttpRequest;
      window.XMLHttpRequest = function() {
        this.xhr = new XHR();
        return this;
      }
      window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        if(__fileNames.indexOf(url) >= 0) {
          this.file = url;
          this.responseText = __files[url];
          if(url.indexOf(".xml") === url.length - 4) {
            try {
              var oParser = new DOMParser();
              var oDOM = oParser.parseFromString(this.responseText, "text/xml");
              this.responseXML = oDOM;
            } catch(e) {}
          }
          // we indicate that the request is done
          this.readyState = 4;
          this.status = 200;
        } else {
          // pass thru to the normal xhr
          this.xhr.open(method, url, async, user, password);
        }
      };
      window.XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        if(this.file) return;
        return this.xhr.setRequestHeader(header, value);
      }
      window.XMLHttpRequest.prototype.abort = function() {
        return this.xhr.abort()
      }
      window.XMLHttpRequest.prototype.getAllResponseHeaders = function() {
        return this.xhr.getAllResponseHeaders();
      }
      window.XMLHttpRequest.prototype.getResponseHeader = function(header) {
        return this.xhr.getResponseHeader(header);
      }
      window.XMLHttpRequest.prototype.overrideMimeType = function(mime) {
        return this.xhr.overrideMimeType(mime);
      }
      window.XMLHttpRequest.prototype.send = function(data) {
        //we need to remap the fake XHR to the real one inside the onload/onreadystatechange functions
        var that = this;
        // unfortunately we need to do our copying of handlers in the next tick as
        // it seems with normal XHR you can add them after firing off send... which seems
        // unwise to do in the first place, but this is needed to support jQuery...
        setTimeout(function() {
          // we wire up all the listeners to the real XHR
          that.xhr.onerror = this.onerror;
          that.xhr.onprogress = this.onprogress;
          if(that.responseType || that.responseType === '')
              that.xhr.responseType = that.responseType
          // if the onload callback is used we need to copy over
          // the real response data to the fake object
          if(that.onload) {
            var onload = that.onload;
            that.xhr.onload = that.onload = function() {
              try{
                that.response = this.response;
                that.readyState = this.readyState;
                that.status = this.status;
                that.statusText = this.statusText;
              } catch(e) { console.log("onload", e) }
              try {
                if(that.responseType == '') {
                    that.responseXML = this.responseXML;
                    that.responseText = this.responseText;
                }
                if(that.responseType == 'text') {
                    that.responseText = this.responseText;
                }
              } catch(e) { console.log("onload responseText/XML", e) }
              onload();
            }
          }
          // if the readystate change callback is used we need
          // to copy over the real response data to our fake xhr instance
          if(that.onreadystatechange) {
            var ready = that.onreadystatechange;
            that.xhr.onreadystatechange = function() {
              try{
                that.readyState = this.readyState;
                that.responseText = this.responseText;
                that.responseXML = this.responseXML;
                that.responseType = this.responseType;
                that.status = this.status;
                that.statusText = this.statusText;
              } catch(e){
                 console.log("e", e)
              }
              ready();
            }
          }
          // if this request is for a local file, we short-circuit and just
          // end the request, since all the data should be on our fake request object
          if(that.file) {
            if(that.onreadystatechange)
              return that.onreadystatechange();
            if(that.onload)
              return that.onload(); //untested
          }
          // if this is a real request, we pass through the send call
          that.xhr.send(data)
        }, 0)
      }
  
      var originalFetch = window.fetch;
      window.fetch = function(input, init) {
      
        var url = input;
        if (input instanceof Request) {
          url = input.url
        }

        // This is a hack that seems to fix a problem with the way Mapbox is requesting its TileJSON
        // Not sure what blob:// protocol is anyway...
        if(typeof url === 'string') {
          url = url.replace('blob://', 'http://')
        }

        if(__fileNames.indexOf(url) >= 0) {
          var responseText = __files[url];
          return Promise.resolve({
            ok: true,
            status: 200,
            statusText: 'ok',
            url: url,
            text: function(){ return Promise.resolve(responseText) },
            json: function(){ return Promise.resolve(responseText).then(JSON.parse) },
            blob: function(){ return Promise.resolve(new Blob([responseText])) },
            // Inspired by https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
            arrayBuffer: function() {
              var buffer = new ArrayBuffer(responseText.length * 2);
              var bufferView = new Uint16Array(buffer);
              for (var i = 0, length = responseText.length; i < length; i++) {
                bufferView[i] = responseText.charCodeAt(i);
              }
              return Promise.resolve(buffer);
            }
          })
        }
      
        return originalFetch(input, init)
      }
      
    })()</script>`;

  template = xmlOverride + template;

  return template;
}
