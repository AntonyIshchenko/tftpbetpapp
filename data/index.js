import fs from 'node:fs';

export const backgrounds = JSON.parse(
  fs.readFileSync('./data/backgrounds.json', 'utf-8')
);
