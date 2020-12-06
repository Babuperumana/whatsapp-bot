const API = require('akaneko');

async function animeNeko() {
	return await API.neko();
}
exports.animeNeko = animeNeko;