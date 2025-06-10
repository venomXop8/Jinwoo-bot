const axios = require('axios');

// Fetching reaction images from the API
const fetchReactionImage = async ({ Jinwoo, m, reply, command }) => {
  try {
    const { data } = await axios.get(`https://api.waifu.pics/sfw/${command}`);
    await Jinwoo.sendImageAsSticker(m.chat, data.url, m, {
      packname: global.packname,  // Set the packname globally
      author: global.author,      // Set author globally for the sticker
    });
  } catch (error) {
    reply(`❌ Error fetching image: ${error.message}`);
  }
};

module.exports = [
  { command: ["8ball"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "8ball" }) },
  { command: ["avatar"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "avatar" }) },
  { command: ["awoo"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "awoo" }) },
  { command: ["bite"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "bite" }) },
  { command: ["blush"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "blush" }) },
  { command: ["bonk"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "bonk" }) },
  { command: ["bully"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "bully" }) },
  { command: ["cringe"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "cringe" }) },
  { command: ["cry"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "cry" }) },
  { command: ["cuddle"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "cuddle" }) },
  { command: ["dance"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "dance" }) },
  { command: ["feed"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "feed" }) },
  { command: ["foxgirl"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "foxgirl" }) },
  { command: ["gecg"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "gecg" }) },
  { command: ["glomp"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "glomp" }) },
  { command: ["goose"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "goose" }) },
  { command: ["handhold"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "handhold" }) },
  { command: ["happy"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "happy" }) },
  { command: ["highfive"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "highfive" }) },
  { command: ["hug"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "hug" }) },
  { command: ["kill"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "kill" }) },
  { command: ["kiss"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "kiss" }) },
  { command: ["lick"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "lick" }) },
  { command: ["lizard"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "lizard" }) },
  { command: ["meow"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "meow" }) },
  { command: ["nom"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "nom" }) },
  { command: ["pat"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "pat" }) },
  { command: ["poke"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "poke" }) },
  { command: ["shinobu"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "shinobu" }) },
  { command: ["slap"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "slap" }) },
  { command: ["smile"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "smile" }) },
  { command: ["smug"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "smug" }) },
  { command: ["spank"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "spank" }) },
  { command: ["tickle"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "tickle" }) },
  { command: ["wave"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "wave" }) },
  { command: ["wink"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "wink" }) },
  { command: ["woof"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "woof" }) },
  { command: ["yeet"], operate: async (jinwoox) => fetchReactionImage({ ...jinwoox, command: "yeet" }) },
];
