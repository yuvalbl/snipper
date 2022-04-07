#!/usr/bin/env node
import fs from 'fs';
import { homedir } from 'os';

const fileName = '.huskyrc'
const homeDirectory = homedir();
const destination = `${homeDirectory}/${fileName}`;

fs.copyFile(fileName, destination, (err) => {
  if (err) throw err;
  console.log(`${fileName} copied to you home directory (${destination})`);
});
