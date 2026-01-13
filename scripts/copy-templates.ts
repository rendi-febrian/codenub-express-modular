import * as fs from 'fs-extra';
import * as path from 'path';

const src = path.join(__dirname, '../src/templates');
const dist = path.join(__dirname, '../dist/templates');

fs.copy(src, dist)
  .then(() => console.log('Templates copied successfully!'))
  .catch(err => console.error(err));
