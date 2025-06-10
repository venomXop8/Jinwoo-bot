const fetch = require('node-fetch');

module.exports = [
  {
    command: ['bible'],
    operate: async ({ m, text, prefix, command, reply }) => {
      const BASE_URL = "https://bible-api.com";

      try {
        let chapterInput = text.split(" ").join("").trim();
        if (!chapterInput) {
          throw new Error(`*Please specify the chapter number or name. Example: ${prefix + command} John 3:16*`);
        }

        chapterInput = encodeURIComponent(chapterInput);
        let chapterRes = await fetch(`${BASE_URL}/${chapterInput}`);

        if (!chapterRes.ok) {
          throw new Error(`*Chapter not found. Please check your input. Example: ${prefix + command} John 3:16*`);
        }

        let chapterData = await chapterRes.json();
        let bibleChapter = `
*The Holy Bible*

*Chapter ${chapterData.reference}*
Translation: ${chapterData.translation_name}
Number of Verses: ${chapterData.verses.length}

*Chapter Content:*
${chapterData.text}
        `.trim();

        reply(bibleChapter);
      } catch (error) {
        reply(`❌ Error: ${error.message}`);
      }
    }
  },

  {
    command: ['quran'],
    operate: async ({ m, text, Jinwoo, reply }) => {
      try {
        let surahInput = text.split(" ")[0];
        if (!surahInput) {
          throw new Error(`*Please specify the surah number or name*`);
        }

        let surahListRes = await fetch("https://quran-endpoint.vercel.app/quran");
        let surahList = await surahListRes.json();
        let surahData = surahList.data.find(
          (surah) =>
            surah.number === Number(surahInput) ||
            surah.asma.ar.short.toLowerCase() === surahInput.toLowerCase() ||
            surah.asma.en.short.toLowerCase() === surahInput.toLowerCase()
        );

        if (!surahData) {
          throw new Error(`Couldn't find Surah with number or name "${surahInput}"`);
        }

        let res = await fetch(`https://quran-endpoint.vercel.app/quran/${surahData.number}`);
        if (!res.ok) {
          let error = await res.json();
          throw new Error(`API error (${res.status}): ${error.message}`);
        }

        let json = await res.json();
        let quranSurah = `
*Quran: The Holy Book*

*Surah ${json.data.number}: ${json.data.asma.ar.long} (${json.data.asma.en.long})*
Type: ${json.data.type.en}
Number of Verses: ${json.data.ayahCount}

*Tafsir (Explanation):*
${json.data.tafsir.id}
        `.trim();

        reply(quranSurah);

        if (json.data.recitation.full) {
          await Jinwoo.sendMessage(
            m.chat,
            {
              audio: { url: json.data.recitation.full },
              mimetype: "audio/mp4",
              ptt: true,
              fileName: `recitation.mp3`,
            },
            { quoted: m }
          );
        }
      } catch (error) {
        reply(`❌ Error: ${error.message}`);
      }
    }
  },
];
