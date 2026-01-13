import * as fs from 'fs-extra';
import * as path from 'path';

const dist = path.join(__dirname, '../dist');

fs.remove(dist)
  .then(() => console.log('Deleted dist folder'))
  .catch(err => console.error(err));
