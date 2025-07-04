// createAvatarFolders.js
const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'assets', 'avatars'); // ajuste se necessário

const temperatureRanges = [
  'freezing',
  'cold',
  'chilly',
  'mild',
  'comfortable',
  'warm',
  'hot',
  'extreme_heat',
];

const genders = ['female', 'male'];

const preferences = ['feel_colder', 'feel_hot'];

function createFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`✅ Pasta criada: ${folderPath}`);
  }
}

temperatureRanges.forEach(range => {
  genders.forEach(gender => {
    preferences.forEach(pref => {
      const folderPath = path.join(baseDir, range, gender, pref);
      createFolder(folderPath);
    });
  });
});

console.log('\n🎉 Estrutura de pastas concluída!');
