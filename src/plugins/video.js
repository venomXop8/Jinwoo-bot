
const fs = require('fs');
const { exec } = require('child_process');
const { getRandom } = require('../../lib/myfunc');
const { toAudio } = require('../../lib/converter');

module.exports = [
 {
 
  command: ['volvideo'],
  operate: async ({ Jinwoo, m, reply, args }) => {
  
  const quoted = m.quoted ? m.quoted : null;
  const mime = quoted?.mimetype || "";
      
    if (!args.join(" ")) return reply(`*Example: ${global.prefixz + command} 10*`);
   if (!quoted || !/video/.test(mime)) return reply(`Reply to an *video file* with *${prefix + command}* to adjust volume.`);

    try {
      const media = await Jinwoo.downloadAndSaveMediaMessage(quoted, "volume");
      const rname = getRandom(".mp4");

      exec(`ffmpeg -i ${media} -filter:a volume=${args[0]} ${rname}`, (err, stderr, stdout) => {
        fs.unlinkSync(media);
        if (err) return reply("*Error!*");

        const jadie = fs.readFileSync(rname);
        Jinwoo.sendMessage(
          m.chat,
          { video: jadie, mimetype: "video/mp4" },
          { quoted: m }
        );
        fs.unlinkSync(rname);
      });
    } catch (error) {
      console.error('Error processing video:', error);
      reply('An error occurred while processing the video.');
    }
  }
},
{
  command: ['toaudio'],
  operate: async ({ Jinwoo, m, reply }) => {
  const quoted = m.quoted ? m.quoted : null;
  const mime = quoted?.mimetype || "";
    if (!quoted) return reply('*Reply to a video to convert it to audio!*');
    if (!/video/.test(mime)) return reply('*Only videos can be converted to audio!*');

    try {
      let buffer = await quoted.download();
      let converted = await toAudio(buffer, 'mp4');

      await Jinwoo.sendMessage(m.chat, { audio: converted.data, mimetype: 'audio/mpeg' }, { quoted: m });
      await converted.delete();
    } catch (e) {
      console.error(e);
      reply('*Failed to convert video to audio!*');
    }
  }
},
];