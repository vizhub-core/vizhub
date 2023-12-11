import { describe, it, expect } from 'vitest';
import { primordialViz } from 'entities/test/fixtures';
import { computeSrcDocV2 } from './computeSrcDocV2';
import { setJSDOM } from './getComputedIndexHtml';
import { JSDOM } from 'jsdom';

setJSDOM(JSDOM);

describe('v2 computeSrcDocV2', () => {
  it('TODO should compute correct srcdoc', async () => {
    expect(true).toEqual(true);
    // console.log('`' + computeSrcDocV2(primordialViz.content) + '`');
    expect(await computeSrcDocV2(primordialViz.content))
      .toEqual(`<script>(function() {
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
        url = url.replace('blob://', 'http://')
          
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
      
    })()</script><meta charset="utf-8"><script>var __filesURI = "%7B%22README.md%22%3A%22Test%20%5BMarkdown%5D(https%3A%2F%2Fwww.markdownguide.org%2F).%5Cn%23%20Introduction%5Cn%5CnThis%20is%20a%20test.%22%7D";
var __files = JSON.parse(decodeURIComponent(__filesURI));
var __fileNames = ["README.md"];</script><body style="font-size:26em">Hello</body>`);
  });
});
