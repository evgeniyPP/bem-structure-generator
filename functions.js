const fs = require('fs');
const HTMLParser = require('node-html-parser');

function readFile(path) {
  try {
    return fs.readFileSync(path, 'utf8');
  } catch (err) {
    console.error(err);
  }
}

function parse(html) {
  try {
    return HTMLParser.parse(html);
  } catch (err) {
    console.error(err);
  }
}

function getClasses(rootEl) {
  const output = [];

  const pushClasses = el => {
    if (el.classList) {
      output.push(...el.classList.value);
    }

    if (el.childNodes) {
      el.childNodes.forEach(child => pushClasses(child));
    }
  };

  rootEl.forEach(el => pushClasses(el));

  return output.filter((i, idx, arr) => arr.indexOf(i) === idx);
}

function createFolder(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
    console.log('Folder created: ', path);
  }
}

function createFile(path, content = '') {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, content);
    console.log('File created:   ', path);
  }
}

function pack(array, predicate) {
  const filterTrue = [];
  const filterFalse = [];

  array.forEach(value => {
    (predicate(value) ? filterTrue : filterFalse).push(value);
  });

  return [filterTrue, filterFalse];
}

module.exports = {
  readFile,
  parse,
  getClasses,
  createFolder,
  createFile,
  pack
};
