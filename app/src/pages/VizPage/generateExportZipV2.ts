import AdmZip from 'adm-zip';
import { Files } from 'entities';

export const generateExportZipV2 = (files: Files) => {
  // TODO use V2 code as a template for how to do this.
  // V2 code:
  // export const zipFiles = (files) => {
  //   const zip = new AdmZip();
  //   files.forEach((file) => {
  //     // Defend against potential freakish null or undefined values.
  //     const text = file.text || '';
  //     zip.addFile(file.name, Buffer.alloc(text.length, text));
  //   });
  //   return zip.toBuffer();
  // };
  // Example usage:
  // var AdmZip = require("adm-zip");
  // // reading archives
  // var zip = new AdmZip("./my_file.zip");
  // var zipEntries = zip.getEntries(); // an array of ZipEntry records
  // zipEntries.forEach(function (zipEntry) {
  //     console.log(zipEntry.toString()); // outputs zip entries information
  //     if (zipEntry.entryName == "my_file.txt") {
  //         console.log(zipEntry.getData().toString("utf8"));
  //     }
  // });
  // // outputs the content of some_folder/my_file.txt
  // console.log(zip.readAsText("some_folder/my_file.txt"));
  // // extracts the specified file to the specified location
  // zip.extractEntryTo(/*entry name*/ "some_folder/my_file.txt", /*target path*/ "/home/me/tempfolder", /*maintainEntryPath*/ false, /*overwrite*/ true);
  // // extracts everything
  // zip.extractAllTo(/*target path*/ "/home/me/zipcontent/", /*overwrite*/ true);
  // // creating archives
  // var zip = new AdmZip();
  // // add file directly
  // var content = "inner content of the file";
  // zip.addFile("test.txt", Buffer.from(content, "utf8"), "entry comment goes here");
  // // add local file
  // zip.addLocalFile("/home/me/some_picture.png");
  // // get everything as a buffer
  // var willSendthis = zip.toBuffer();
  // // or write everything to disk
  // zip.writeZip(/*target file name*/ "/home/me/files.zip");

  // TODO make a zip file from the files.
  // TODO make a zip file from the files.
//   const zip = new AdmZip();
//   for(const {name,text} of Object.values(files)){
//     zip.addFile(name, Buffer.alloc(text.length, text));
//   });
//   return zip.toBuffer();

// Or maybe we should use the jszip library instead of adm-zip.
// https://stuk.github.io/jszip/
//
// Example usage:
// var zip = new JSZip();
// zip.file("Hello.txt", "Hello World\n");
// var img = zip.folder("images");
// img.file("smile.gif", imgData, {base64: true});
// zip.generateAsync({type:"blob"})
// .then(function(content) {
//     // see FileSaver.js
//     saveAs(content, "example.zip");
// });

const zip = new JSZip();
// TODO make a zip file from the files.
for(const file of Object.values(files)){
    zip.addFile(file.name, file.text);

};
