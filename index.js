#!/usr/bin/env node
const fns = require('./functions');

const pathArg = process.argv[2] || './index.html';
const [_, path, filename] = pathArg.match(/^(.+)\/(.+\.html)$/);

const file = fns.readFile(`${path}/${filename}`);
const html = fns.parse(file);
const body = html.querySelector('body').childNodes;
const classNames = fns.getClasses(body);

const elemRegex = /^[^_]+(_{2}[^_]+)$/;
const blockModRegex = /^[^_]+(?!_{2}[^_]+)(_{1}[^_]+)(?:_{1}[^_]+)?$/;
const elemModRegex = /^[^_]+_{2}[^_]+(_{1}[^_]+)(?:_{1}[^_]+)?$/;
const blockRegex = /^[^_]+$/;

const [elems, notElems] = fns.pack(classNames, cn => elemRegex.test(cn));
const [blockMods, notElemsAndBlockMods] = fns.pack(notElems, cn => blockModRegex.test(cn));
const [elemMods, notElemsAndMods] = fns.pack(notElemsAndBlockMods, cn => elemModRegex.test(cn));
const [blocks, invalidClasses] = fns.pack(notElemsAndMods, cn => blockRegex.test(cn));

if (invalidClasses.length) {
  console.error(`Internal Error: some classes did not qualify for any category:`, invalidClasses);
}

blocks.forEach(block => {
  fns.createFolder(`${path}/blocks/${block}`);
  fns.createFile(`${path}/blocks/${block}/${block}.css`, `.${block} {}`);

  const thisBlockMods = blockMods.filter(cn => cn.startsWith(block));
  thisBlockMods.forEach(mod => {
    const [_, modFolder] = mod.match(blockModRegex);
    const modPath = `${path}/blocks/${block}/${modFolder}`;

    fns.createFolder(modPath);
    fns.createFile(`${modPath}/${mod}.css`, `.${mod} {}`);
  });

  const thisBlockElems = elems.filter(cn => cn.startsWith(block));
  thisBlockElems.forEach(elem => {
    const [_, elemFolder] = elem.match(elemRegex);
    const elemPath = `${path}/blocks/${block}/${elemFolder}`;

    fns.createFolder(elemPath);
    fns.createFile(`${elemPath}/${elem}.css`, `.${elem} {}`);

    const thisElemMods = elemMods.filter(cn => cn.startsWith(elem));
    thisElemMods.forEach(mod => {
      const [_, modFolder] = mod.match(elemModRegex);
      const modPath = `${path}/blocks/${block}/${elemFolder}/${modFolder}`;

      fns.createFolder(modPath);
      fns.createFile(`${modPath}/${mod}.css`, `.${mod} {}`);
    });
  });
});

console.log('BEMissimo!');
