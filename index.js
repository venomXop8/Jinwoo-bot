
require('./settings')
const makeWASocket = require("@whiskeysockets/baileys").default
const { makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, generateForwardMessageContent, generateWAMessageFromContent, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto, Browsers, normalizeMessageContent } = require("@whiskeysockets/baileys")
const { color } = require('./lib/color')
const fs = require("fs");
const pino = require("pino");
const path = require('path')
const NodeCache = require("node-cache");
const msgRetryCounterCache = new NodeCache();
const fetch = require("node-fetch")
const FileType = require('file-type')
const _ = require('lodash')
const chalk = require('chalk')
const os = require('os');
const express = require('express')
const app = express();
const moment = require("moment-timezone")
const { File } = require('megajs');
const PhoneNumber = require("awesome-phonenumber");
const readline = require("readline");
const { formatSize, runtime, sleep, serialize, smsg, getBuffer } = require("./lib/myfunc")
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { toAudio, toPTT, toVideo } = require('./lib/converter')

const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) }); 

const low = require('./lib/lowdb');
const yargs = require('yargs/yargs');
const { Low, JSONFile } = low;
const port = process.env.PORT || 3000;
const versions = require("./package.json").version
const PluginManager = require('./lib/PluginManager');
const modeStatus = 
  global.mode === 'public' ? "Public" : 
  global.mode === 'private' ? "Private" : 
  global.mode === 'group' ? "Group Only" : 
  global.mode === 'pm' ? "PM Only" : "Unknown"; 

const pluginManager = new PluginManager(path.resolve(__dirname, './src/plugins'));

// Database
const dbName = "Jinwoo-db";
const dbPath = `${ownernumber}.json`;
const localDb = path.join(__dirname, "src", "database.json");

global.db = new Low(new JSONFile(localDb));

global.loadDatabase = async function loadDatabase() {
    if (global.db.READ) return new Promise(resolve => setInterval(() => {
        if (!global.db.READ) {
            clearInterval(this);
            resolve(global.db.data ?? global.loadDatabase());
        }
    }, 1000));

    if (global.db.data !== null) return;

    global.db.READ = true;

    try {
        await global.db.read();
        
        if (!global.db.data || Object.keys(global.db.data).length === 0) {
            console.log("[Jinwoo-v2] Syncing local database...");
            await readDB();
            await global.db.read();
        }

    } catch (error) {
        console.error("❌ Error loading database:", error);
    }

    global.db.READ = false;

    global.db.data = {
    chats: {},
    settings: {},
    blacklist: { blacklisted_numbers: [] }, 
    ...(global.db.data || {}),
  };
  global.db.chain = _.chain(global.db.data);
};

// GitHub Functions
async function getOctokit() {
    const { Octokit } = await import("@octokit/rest");
    return new Octokit({ auth: global.dbToken });
}

async function getOwner(octokit) {
    const user = await octokit.rest.users.getAuthenticated();
    return user.data.login;
}

async function createDB() {
    if (!global.dbToken) return;
    try {
        const octokit = await getOctokit();
        const owner = await getOwner(octokit);
        await octokit.repos.createForAuthenticatedUser({ name: dbName, private: true });
        console.log("[Jinwoo-bot] Database created successfully.");
    } catch (error) {
        if (error.status === 422) {
            return;
        } else {
            console.error("❌ Error creating repository database:", error);
        }
    }
}

async function readDB() {
    if (!global.dbToken) return;
    try {
        const octokit = await getOctokit();
        const owner = await getOwner(octokit);
        const { data } = await octokit.repos.getContent({ owner, repo: dbName, path: dbPath });

        const content = Buffer.from(data.content, "base64").toString("utf-8");

        if (!content || content.trim() === "{}") {
            return;
        }

        fs.writeFileSync(localDb, content);
        console.log("[Jinwoo-bot] Synced local database successfully.");
    } catch (error) {
        if (error.status === 404) {
            console.log("[Jinwoo-bot] Creating database....");
            await writeDB();
        } else {
            console.error("❌ Error reading database from GitHub:", error);
        }
    }
}

global.writeDB = async function () {
    if (!global.dbToken) return;
    try {
        await global.db.write();

        const octokit = await getOctokit();
        const owner = await getOwner(octokit);
        const content = fs.readFileSync(localDb, "utf-8");
        let sha;

        try {
            const { data } = await octokit.repos.getContent({ owner, repo: dbName, path: dbPath });
            sha = data.sha;
        } catch (error) {
            if (error.status !== 404) throw error;
        }

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo: dbName,
            path: dbPath,
            message: `Updated database`,
            content: Buffer.from(content).toString("base64"),
            sha,
        });

        console.log("[Jinwoo-bot] Successfully synced database.");
    } catch (error) {
        console.error("❌ Error writing database to GitHub:", error);
    }
};

(async () => {
    if (global.dbToken) {
        await createDB();
        await readDB();
    }
    await global.loadDatabase();
})();

if (global.dbToken) {
    setInterval(writeDB, 30 * 60 * 1000);
}

if (global.db) setInterval(async () => {
    if (global.db.data) await global.db.write();
}, 30 * 1000);

let phoneNumber = "263780166288"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")
const usePairingCode = true
const question = (text) => {
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});
return new Promise((resolve) => {
rl.question(text, resolve)
})
};

const storeFile = "./src/store.json";
const maxMessageAge = 24 * 60 * 60; //24 hours

function loadStoredMessages() {
    if (fs.existsSync(storeFile)) {
        try {
            return JSON.parse(fs.readFileSync(storeFile));
        } catch (err) {
            console.error("⚠️ Error loading store.json:", err);
            return {};
        }
    }
    return {};
}

function saveStoredMessages(chatId, messageId, messageData) {
    let storedMessages = loadStoredMessages();

    if (!storedMessages[chatId]) storedMessages[chatId] = {};
    if (!storedMessages[chatId][messageId]) {
        storedMessages[chatId][messageId] = messageData;
        fs.writeFileSync(storeFile, JSON.stringify(storedMessages, null, 2));
    }
} 

function cleanupOldMessages() {
    let now = Math.floor(Date.now() / 1000);
    let storedMessages = {};

    if (fs.existsSync(storeFile)) {
        try {
            storedMessages = JSON.parse(fs.readFileSync(storeFile));
        } catch (err) {
            console.error("❌ Error reading store.json:", err);
            return;
        }
    }

    let totalMessages = 0, oldMessages = 0, keptMessages = 0;

    for (let chatId in storedMessages) {
        let messages = storedMessages[chatId];

        for (let messageId in messages) {
            let messageTimestamp = messages[messageId].timestamp;

            if (typeof messageTimestamp === "object" && messageTimestamp.low !== undefined) {
                messageTimestamp = messageTimestamp.low;
            }

            if (messageTimestamp > 1e12) {
                messageTimestamp = Math.floor(messageTimestamp / 1000);
            }

            totalMessages++;

            if (now - messageTimestamp > maxMessageAge) {
                delete storedMessages[chatId][messageId];
                oldMessages++;
            } else {
                keptMessages++;
            }
        }
        
        if (Object.keys(storedMessages[chatId]).length === 0) {
            delete storedMessages[chatId];
        }
    }

    fs.writeFileSync(storeFile, JSON.stringify(storedMessages, null, 2));

    console.log("[Jinwoo-bot] 🧹 Cleaning up:");
    console.log(`- Total messages processed: ${totalMessages}`);
    console.log(`- Old messages removed: ${oldMessages}`);
    console.log(`- Remaining messages: ${keptMessages}`);
}

async function loadAllPlugins() {
  try {
    await pluginManager.unloadAllPlugins();
    await pluginManager.loadPlugins();
  } catch (error) {
    console.log(`[Jinwoo-bot] Error loading plugins: ${error.message}`);
  }
}

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

async function downloadSessionData() {
  try {
    await fs.promises.mkdir(sessionDir, { recursive: true });
    
    if (!fs.existsSync(credsPath) && global.SESSION_ID) {
      const sessdata = global.SESSION_ID.split("jinwoo:~")[1];
      const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
      
      filer.download(async (err, data) => {
        if (err) throw err;
        await fs.promises.writeFile(credsPath, data);
        console.log(color(`[Jinwoo-bot] Session saved successfully`, 'green'));
        await startJinwoo();
      });
    }
  } catch (error) {
    console.error('Error downloading session data:', error);
  }
}


async function startJinwoo() {
const {  state, saveCreds } =await useMultiFileAuthState(`./session`)
    const msgRetryCounterCache = new NodeCache(); 
    const Jinwoo = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode,
       version: [2, 3000, 1017531287],
      browser: Browsers.ubuntu('Edge'),
     auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      markOnlineOnConnect: true, 
      generateHighQualityLinkPreview: true,
      getMessage: async (key) => {
      
         let jid = jidNormalizedUser(key.remoteJid)
         let msg = await store.loadMessage(jid, key.id)

         return msg?.message || ""
      },
      msgRetryCounterCache,
      defaultQueryTimeoutMs: undefined, // for this issues https://github.com/WhiskeySockets/Baileys/issues/276
   })
   
   store.bind(Jinwoo.ev)
   
if(usePairingCode && !Jinwoo.authState.creds.registered) {
    if (useMobile) throw new Error('Cannot use pairing code with mobile API');

        let phoneNumber;
       phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Number to be connected to Jinwoo Bot?\n🔵 Example 26371475785x:- `)))
        phoneNumber = phoneNumber.trim();

        setTimeout(async () => {
            const code = await Jinwoo.requestPairingCode(phoneNumber);
      console.log(chalk.black(chalk.bgWhite(`[Jinwoo-bot]id:- ${code}`)));
        }, 3000);
    }


Jinwoo.ev.on('connection.update', async (update) => {
  const { connection, lastDisconnect } = update;

  try {
    if (
      connection === "close" &&
      lastDisconnect &&
      lastDisconnect.error &&
      lastDisconnect.error.output.statusCode != 401
    ) {
      if (lastDisconnect.error.output.statusCode === DisconnectReason.loggedOut)
        console.log("⚠️ Logged out. Please link again.");
      if (lastDisconnect.error.output.statusCode === DisconnectReason.badSession)
        console.log("🔁 Bad session. Log out and link again.");
      startJinwoo();
    }

    if (update.connection == "connecting") {
      console.log(color(`[Jinwoo-bot] 🟠 Connecting...`, 'red'));
    }

    if (update.connection == "open") {
      console.log(color(`[Jinwoo-bot] 🟢 Connected`, 'green'));

      await sleep(2000);

      await Jinwoo.sendMessage(Jinwoo.user.id, {
        text: `┏━━─『 *Jinwoo Bot Connected* 』─
┃ 👤 Username: ${Jinwoo.user.name}
┃ 💻 Platform: ${os.platform()}
┃ 🔣 Prefix: [ ${global.prefixz} ]
┃ 🧭 Mode: ${modeStatus}
┃ ⚙️ Version: [ ${versions} ]
┗━━━━━━━━━━━━─····`,
      }, { ephemeralExpiration: 20 });

      // ✅ Auto-follow channel
      await Jinwoo.newsletterFollow('120363398430045533@newsletter');
      console.log(color(`[Jinwoo-bot] 📣 Auto-followed channel: Jinwoo Updates`, 'cyan'));
    }
  } catch (err) {
    console.log('Error in Connection.update ' + err);
    startJinwoo();
  }
});



Jinwoo.ev.on('creds.update', saveCreds);

Jinwoo.ev.on('messages.upsert', async (chatUpdate) => {
  try {
    const messages = chatUpdate.messages;
    
    for (const kay of messages) {
      if (!kay.message) continue;
      
     kay.message = normalizeMessageContent(kay.message);

      if (kay.key && kay.key.remoteJid === 'status@broadcast') {
        if (global.autoviewstatus === 'true') {
          await Jinwoo.readMessages([kay.key]);
        }
        
        if (global.autoreactstatus === 'true' && global.autoviewstatus === 'true') {
          const reactionEmoji = global.statusemoji || '💚';
          const participant = kay.key.participant || kay.participant;
          const botJid = await Jinwoo.decodeJid(Jinwoo.user.id);
          const messageId = kay.key.id;
          
          if (participant && messageId && kay.key.id && kay.key.remoteJid) {
            await Jinwoo.sendMessage(
              'status@broadcast',
              {
                react: {
                  key: {
                    id: kay.key.id, 
                    remoteJid: kay.key.remoteJid, 
                    participant: participant,
                  },
                  text: reactionEmoji,
                },
              },
              { statusJidList: [participant, botJid] }
            );
          }
        }
        
        continue; 
      }

if (

  kay.key.id.startsWith('BAE5') ||

  (kay.key.id.startsWith('3EBO') && kay.key.id.length === 22) ||

  (!kay.key.id.startsWith('3EBO') && kay.key.id.length === 22) ||

  (kay.key.id.length !== 32 && kay.key.id.length !== 20)

) continue;



const processedMessages = new Set();
const messageId = kay.key.id;
if (processedMessages.has(messageId)) continue;
processedMessages.add(messageId);
      
      const m = smsg(Jinwoo, kay, store);
      require('./jinwoo')(Jinwoo, m, chatUpdate, store);
    }
  } catch (err) {
    console.error('Error handling messages.upsert:', err);
  }
});

Jinwoo.ev.on("messages.upsert", async (chatUpdate) => {
    for (const msg of chatUpdate.messages) {
        if (!msg.message) return;

        let chatId = msg.key.remoteJid;
        let messageId = msg.key.id;

        saveStoredMessages(chatId, messageId, msg);
    }
});

setInterval(() => {
  try {
    const sessionPath = path.join(__dirname, 'session');
    fs.readdir(sessionPath, (err, files) => {
      if (err) {
        console.error("Unable to scan directory:", err);
        return;
      }

      const now = Date.now();
      const filteredArray = files.filter((item) => {
        const filePath = path.join(sessionPath, item);
        const stats = fs.statSync(filePath);

        return (
          (item.startsWith("pre-key") ||
           item.startsWith("sender-key") ||
           item.startsWith("session-") ||
           item.startsWith("app-state")) &&
          item !== 'creds.json' &&
          now - stats.mtimeMs > 2 * 24 * 60 * 60 * 1000
        );
      });

      if (filteredArray.length > 0) {
        console.log(`Found ${filteredArray.length} old session files.`);
        console.log(`Clearing ${filteredArray.length} old session files...`);

        filteredArray.forEach((file) => {
          const filePath = path.join(sessionPath, file);
          fs.unlinkSync(filePath);
        });
      } else {
        console.log("No old session files found.");
      }
    });
  } catch (error) {
    console.error('Error clearing old session files:', error);
  }
}, 7200000); 

setInterval(cleanupOldMessages, 60 * 60 * 1000);

function createTmpFolder() {
const folderName = "tmp";
const folderPath = path.join(__dirname, folderName);

if (!fs.existsSync(folderPath)) {
fs.mkdirSync(folderPath);
   }
 }
 
createTmpFolder();

setInterval(() => {
let directoryPath = path.join();
fs.readdir(directoryPath, async function (err, files) {
var filteredArray = await files.filter(item =>
item.endsWith("gif") ||
item.endsWith("png") || 
item.endsWith("mp3") ||
item.endsWith("mp4") || 
item.endsWith("opus") || 
item.endsWith("jpg") ||
item.endsWith("webp") ||
item.endsWith("webm") ||
item.endsWith("zip") 
)
if(filteredArray.length > 0){
let teks =`Detected ${filteredArray.length} junk files,\nJunk files have been deleted🚮`
Jinwoo.sendMessage(Jinwoo.user.id, {text : teks })
setInterval(() => {
if(filteredArray.length == 0) return console.log("Junk files cleared")
filteredArray.forEach(function (file) {
let sampah = fs.existsSync(file)
if(sampah) fs.unlinkSync(file)
})
}, 15_000)
}
});
}, 30_000)

Jinwoo.decodeJid = (jid) => {
if (!jid) return jid;
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {};
return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
} else return jid;
};

Jinwoo.ev.on("contacts.update", (update) => {
for (let contact of update) {
let id = Jinwoo.decodeJid(contact.id);
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify };
}
});

Jinwoo.ev.on('group-participants.update', async ({ id, participants, action }) => {
  if (global.welcome === 'true') {
    try {
      const groupData = await Jinwoo.groupMetadata(id);
      const groupMembers = groupData.participants.length;
      const groupName = groupData.subject;

      for (const participant of participants) {
        const userPic = await getUserPicture(participant);
        const groupPic = await getGroupPicture(id);

        if (action === 'add') {
          sendWelcomeMessage(id, participant, groupName, groupMembers, userPic);
        } else if (action === 'remove') {
          sendGoodbyeMessage(id, participant, groupName, groupMembers, userPic);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
});

async function getUserPicture(userId) {
  try {
    return await Jinwoo.profilePictureUrl(userId, 'image');
  } catch {
    return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60';
  }
}

async function getGroupPicture(groupId) {
  try {
    return await Jinwoo.profilePictureUrl(groupId, 'image');
  } catch {
    return 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60';
  }
}

async function sendWelcomeMessage(groupId, participant, groupName, memberCount, profilePic) {
const welcomeMessage = `✨ *Welcome to ${groupName}!* ✨ @${participant.split('@')[0]}

You're our ${memberCount}th member!

Join time: ${moment.tz(`${timezones}`).format('HH:mm:ss')},  ${moment.tz(`${timezones}`).format('DD/MM/YYYY')}

Stay awesome!😊

> ${global.wm}`;
 Jinwoo.sendMessage(groupId, {
    text: welcomeMessage,
    contextInfo: {
      mentionedJid: [participant],
      externalAdReply: {
        title: global.botname,
        body: ownername,
        previewType: 'PHOTO',
        thumbnailUrl: '',
        thumbnail: await getBuffer(profilePic),
        sourceUrl: plink
      }
    }
  });
}

async function sendGoodbyeMessage(groupId, participant, groupName, memberCount, profilePic) {
const goodbyeMessage = `✨ *Goodbye @${participant.split('@')[0]}!* ✨

You'll be missed in ${groupName}!🥲

We're now ${memberCount} members.

Left at: ${moment.tz(timezones).format('HH:mm:ss')},  ${moment.tz(timezones).format('DD/MM/YYYY')}

> ${global.wm}`;

  Jinwoo.sendMessage(groupId, {
    text: goodbyeMessage,
    contextInfo: {
      mentionedJid: [participant],
      externalAdReply: {
        title: global.botname,
        body: ownername,
        previewType: 'PHOTO',
        thumbnailUrl: '',
        thumbnail: await getBuffer(profilePic),
        sourceUrl: plink
      }
    }
  });
}
//------------------------------------------------------
//anticall
Jinwoo.ev.on('call', async (incomingCalls) => {
    let botId = await Jinwoo.decodeJid(Jinwoo.user.id);
    
    if (!["decline", "block"].includes(global.anticall)) return;

    console.log(incomingCalls);

    for (let call of incomingCalls) {
        if (!call.isGroup && call.status === "offer") { 
            let message = `🚨 *𝙲𝙰𝙻𝙻 𝙳𝙴𝚃𝙴𝙲𝚃𝙴𝙳!* 🚨\n\n`;
            message += `@${call.from.split('@')[0]}, my owner cannot receive ${call.isVideo ? `video` : `audio`} calls at the moment.\n\n`;

            if (global.anticall === "block") {
                message += `❌ You are being *blocked* for causing a disturbance. If this was a mistake, contact my owner to be unblocked.`;
            } else {
                message += `⚠️ Your call has been *declined*. Please avoid calling.`;
            }

            await Jinwoo.sendTextWithMentions(call.from, message);
            await Jinwoo.rejectCall(call.id, call.from);

            if (global.anticall === "block") {
                await sleep(8000);
                await Jinwoo.updateBlockStatus(call.from, "block");
            }
        }
    }
});

Jinwoo.serializeM = (m) => smsg(Jinwoo, m, store)

Jinwoo.getName = (jid, withoutContact = false) => {
id = Jinwoo.decodeJid(jid);
withoutContact = Jinwoo.withoutContact || withoutContact;
let v;
if (id.endsWith("@g.us"))
return new Promise(async (resolve) => {
v = store.contacts[id] || {};
if (!(v.name || v.subject)) v = Jinwoo.groupMetadata(id) || {};
resolve(v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"));
});
else
v =
id === "0@s.whatsapp.net"
? {
id,
name: "WhatsApp",
}
: id === Jinwoo.decodeJid(Jinwoo.user.id)
? Jinwoo.user
: store.contacts[id] || {};
return (withoutContact ? "" : v.name) || v.subject || v.verifiedName || PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international");
};

Jinwoo.getFile = async (PATH, returnAsFilename) => {
    let res, filename;
    const data = Buffer.isBuffer(PATH) 
        ? PATH 
        : /^data:.*?\/.*?;base64,/i.test(PATH) 
        ? Buffer.from(PATH.split`, `[1], 'base64') 
        : /^https?:\/\//.test(PATH) 
        ? await (res = await fetch(PATH)).buffer() 
        : fs.existsSync(PATH) 
        ? (filename = PATH, fs.readFileSync(PATH)) 
        : typeof PATH === 'string' 
        ? PATH 
        : Buffer.alloc(0);

    if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer');
    
    const type = await FileType.fromBuffer(data) || { mime: 'application/octet-stream', ext: '.bin' };
    
    if (returnAsFilename && !filename) {
        filename = path.join(__dirname, './tmp/' + new Date() * 1 + '.' + type.ext);
        await fs.promises.writeFile(filename, data);
    }
    
    const deleteFile = async () => {
        if (filename && fs.existsSync(filename)) {
            await fs.promises.unlink(filename).catch(() => {}); 
        }
    };

    setImmediate(deleteFile);
    data.fill(0); 
    
    return { res, filename, ...type, data, deleteFile };
};

Jinwoo.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];

    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    const data = Buffer.from(buffer); 
    buffer.fill(0); 
    buffer = null;

    return data;
};

Jinwoo.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
let type = await Jinwoo.getFile(path, true)
let { res, data: file, filename: pathFile } = type
if (res && res.status !== 200 || file.length <= 65536) {
try { throw { json: JSON.parse(file.toString()) } }
catch (e) { if (e.json) throw e.json }
}
let opt = { filename }
if (quoted) opt.quoted = quoted
if (!type) options.asDocument = true
let mtype = '', mimetype = type.mime, convert
if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
else if (/video/.test(type.mime)) mtype = 'video'
else if (/audio/.test(type.mime)) (
convert = await (ptt ? toPTT : toAudio)(file, type.ext),
file = convert.data,
pathFile = convert.filename,
mtype = 'audio',
mimetype = 'audio/ogg; codecs=opus'
)
else mtype = 'document'
if (options.asDocument) mtype = 'document'

let message = {
...options,
caption,
ptt,
[mtype]: { url: pathFile },
mimetype
}
let m
try {
m = await Jinwoo.sendMessage(jid, message, { ...opt, ...options })
} catch (e) {
console.error(e)
m = null
} finally {
if (!m) m = await Jinwoo.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })
return m
}
}

Jinwoo.copyNForward = async (jid, message, forceForward = false, options = {}) => {
let vtype
if (options.readViewOnce) {
message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
vtype = Object.keys(message.message.viewOnceMessage.message)[0]
delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
delete message.message.viewOnceMessage.message[vtype].viewOnce
message.message = {
...message.message.viewOnceMessage.message
}
}
let mtype = Object.keys(message.message)[0]
let content = await generateForwardMessageContent(message, forceForward)
let ctype = Object.keys(content)[0]
let context = {}
if (mtype != "conversation") context = message.message[mtype].contextInfo
content[ctype].contextInfo = {
...context,
...content[ctype].contextInfo
}
const waMessage = await generateWAMessageFromContent(jid, content, options ? {
...content[ctype],
...options,
...(options.contextInfo ? {
contextInfo: {
...content[ctype].contextInfo,
...options.contextInfo
}
} : {})
} : {})
await Jinwoo.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
return waMessage
}

Jinwoo.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)
}
await Jinwoo.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

Jinwoo.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];

    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }

    let type = await FileType.fromBuffer(buffer);
    let trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
    let savePath = path.join(__dirname, 'tmp', trueFileName); // Save to 'tmp' folder

    await fs.writeFileSync(savePath, buffer);

    buffer = null; 
    global.gc?.(); 

    return savePath;
};

Jinwoo.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}
await Jinwoo.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}
Jinwoo.sendText = (jid, text, quoted = '', options) => Jinwoo.sendMessage(jid, { text: text, ...options }, { quoted })

Jinwoo.sendTextWithMentions = async (jid, text, quoted, options = {}) => Jinwoo.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

return Jinwoo;
}

async function malvin() {
    await cleanupOldMessages();
    await loadAllPlugins();
    if (fs.existsSync(credsPath)) {
        await startJinwoo();
    } else {
        const sessionDownloaded = await downloadSessionData();
        if (sessionDownloaded) {
            await startJinwoo();
        } else {
            if (!fs.existsSync(credsPath)) {
                if (!global.SESSION_ID) {
                    console.log(color("Please wait for a few seconds to enter your number!", 'red'));
             await startJinwoo();
                }
            }
        }
    }
}

const porDir = path.join(__dirname, 'media');
const porPath = path.join(porDir, 'jinwoo.html');

// get runtime
function getUptime() {
    return runtime(process.uptime());
}

app.get("/", (req, res) => {
    res.sendFile(porPath);
});

app.get("/uptime", (req, res) => {
    res.json({ uptime: getUptime() });
});

app.listen(port, (err) => {
    if (err) {
        console.error(color(`Failed to start server on port: ${port}`, 'red'));
    } else {
        console.log(color(`[Jinwoo-bot] Running on port:🟢 ${port}`, 'white'));
    }
});

malvin();

module.exports.pluginManager = pluginManager