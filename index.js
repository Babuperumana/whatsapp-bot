const { decryptMedia } = require('@open-wa/wa-decrypt');
const fs = require('fs-extra');
const moment = require('moment-timezone');
const fetch = require('node-fetch');
const bent = require('bent');
const get = require('got');
const axios = require('axios');
const { wallpaperanime, liriklagu, quotemaker, wall, changelog } = require('./lib/functions');
const msgFilter = require('./lib/msgFilter');
const akaneko = require('akaneko');
const { exec } = require('child_process');
const animeNeko = require('./lib/animeNeko');
const nsfwgrp = JSON.parse(fs.readFileSync('./lib/nsfw.json'));
/*
const { liriklagu, quotemaker, randomNimek, fb, sleep, jadwalTv, ss } = require('./lib/functions')
*/
const { help, snk, info, donate, readme, listChannel } = require('./lib/help');
/*
const welkom = JSON.parse(fs.readFileSync('./lib/welcome.json'));
*/
module.exports = msgHandler = async (client, message) => {
    try {
        const prefix = ".";
        const { type, id, from, t, sender, isGroupMsg, chat, chatId, caption, isMedia, mimetype, quotedMsg, mentionedJidList, author, quotedMsgObj } = message;
        let { body } = message;
        const { name } = chat;
        let { pushname, verifiedName } = sender;
        body = (type === 'chat' && body.startsWith(".")) ? body : ((type === 'image' && caption || type === 'video' && caption) && caption.startsWith(prefix)) ? caption : '';
        pushname = pushname || verifiedName;
        const command = body.slice(".".length).trim().split(/ +/).shift().toLowerCase();
        const args = body.slice(".".length).trim().split(/ +/).slice(1);
        const isCmd = body.startsWith(".");
        const msgs = (message) => {
            if(command.startsWith(".")) {
                if(message.length >= 10) {
                    return `${message.substr(0, 15)}`
                } else {
                    return `${message}`
                }
            };
        };
        const mess = {
            wait: "[-] Command Received. Please Wait.",
            error: {
                St: '[❗] Kirim gambar dengan caption *.sticker* atau tag gambar yang sudah dikirim',
                Qm: '[❗] Terjadi kesalahan, mungkin themenya tidak tersedia!',
                Yt3: '[❗] Terjadi kesalahan, tidak dapat meng konversi ke mp3!',
                Yt4: '[❗] Terjadi kesalahan, mungkin error di sebabkan oleh sistem.',
                Ig: '[❗] Terjadi kesalahan, mungkin karena akunnya private',
                Ki: '[❗] Bot tidak bisa mengeluarkan admin group!',
                Ad: '[❗] Tidak dapat menambahkan target, mungkin karena di private',
                Iv: '[❗] Link yang anda kirim tidak valid!',
                Ii: "[❗] Anda tidak mengirim foto yang valid!",
                Ia: "[❗] Anda tidak menyediakan arguments.",
                Ir: "[❗] Invalid Result.",
                disabled: "Mohon maaf, tetapi command ini telah di matikan untuk sementara.",
                Nr: "Tidak ada hasil.",
                Ip: "Anda tidak memiliki hak untuk melakukan ini!"
            }
        };

        const color = require('./lib/color');
        const botNumber = await client.getHostNumber();
        const groupId = isGroupMsg ? chat.groupMetadata.id : '';
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : '';
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false;
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false;
        const ownerNumber = ["62895620060410@c.us"];
        const { isOwner, isOwnerBot } = sender.id == "62895620060410@c.us";
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36';
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi);
        const time = moment(t * 1000).format('DD/MM HH:mm:ss');

        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) {
            return console.log(color('[SPAM!]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname));
        };
        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) {
            return console.log(color('[SPAM!]', 'red'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name));
        };
        if (!isCmd && !isGroupMsg) {
            return console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname))
        };
        if (!isCmd && isGroupMsg) {
            return console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname), 'in', color(name))
        };/*
        if (isGroupMsg && isRule && (type === 'chat' && message.body.includes('chat.whatsapp.com') && isBotGroupAdmins) && !isGroupAdmins) {
            return await client.removeParticipant(chat.id, author);
        };*/
        if (isCmd && !isGroupMsg) {
            console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname));
        };
        if (isCmd && isGroupMsg) {
            console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name));
        };
        if(sender.id === botNumber) return;

        msgFilter.addFilter(from);

        const banned = JSON.parse(fs.readFileSync('./settings/banned.json'));

        const isBanned = banned.includes(from);

        const pingBanned = JSON.parse(fs.readFileSync('./settings/pingBan.json'));

        const isPingBanned = pingBanned.includes(from);

        const nsfw = JSON.parse(fs.readFileSync('./lib/nsfw.json'));

        const { isNSFW, isnsfw} = nsfw.includes(from);

        if (isBanned) {
            return console.log(color('[BAN]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname));
        };

        switch (command) {
            case 'sticker':
            case 'stiker':
                if (isMedia && type === 'image') {
                    client.sendText(from, mess.wait, id);
                    const mediaData = await decryptMedia(message, uaOverride);
                    const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`;
                    await client.sendImageAsSticker(from, imageBase64);
                } else if (quotedMsg && quotedMsg.type == 'image') {
                    client.sendText(from, mess.wait, id);
                    const mediaData = await decryptMedia(quotedMsg, uaOverride);
                    const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`;
                    await client.sendImageAsSticker(from, imageBase64);
                } else if (args.length === 2) {
                    client.sendText(from, mess.wait, id);
                    const url = args[1]
                    if (url.match(isUrl)) {
                        await client.sendStickerfromUrl(from, url, { method: 'get' });
                    } else {
                        client.reply(from, mess.error.Ii, id);
                    }
                } else {
                    client.reply(from, mess.error.St, id);
                }
                break;

            case 'donate':
            case 'donasi':
                return client.reply(from, `Anda bisa donate dengan mengirim pulsa ke nomor \`0895620060140\``, id);
                break;

            case 'say':
                arg = body.replace(".say", "")
                if(!arg) {
                    return client.reply(from, mess.error.Ia, id);
                } else {
                    client.sendText(from, arg, id);
                }
                break;

            case 'anime':
                let keyword = message.body.replace('.anime', '')
                try {
                    client.reply(from, mess.wait, id);
                    const data = await fetch(
                   `https://api.jikan.moe/v3/search/anime?q=${keyword}`
                    )
                    const parsed = await data.json()
                    if (!parsed) {
                        await client.sendFileFromUrl(from, mess.error.Ir, id)
                        console.log("Sent!")
                        return null
                    }
                    const { title, synopsis, episodes, url, rated, score, image_url } = parsed.results[0]
                    const content = `
         >* Anime Found! *<
✨️ *Title:* ${title}
🎆️ *Episodes:* ${episodes}
💌️ *Rating:* ${rated}
❤️ *Score:* ${score}
💚️ *Synopsis:*${synopsis}
🌐️ *URL:* ${url}`

                    const image = await bent("buffer")(image_url)
                    const base64 = `data:image/jpg;base64,${image.toString("base64")}`
                    /*client.sendImage(from, base64, title, content)*/
                    client.sendText(from, content)
                } catch (err) {
                    console.error(err.message)
                    await client.sendText(from, mess.error.Ir, from)
                }
                break;

            case 'covid':
                arg = body.replace('.covid', '');
                if(arg.length === 1) {
                    const response2 = await axios.get('https://coronavirus-19-api.herokuapp.com/countries/Indonesia/')
                    const { cases, todayCases, deaths, todayDeaths, active } = response2.data
                    await client.sendText(
                        from,
                        '🌎️Covid Info - Indonesia 🌍️\n\n✨️Total Cases: ' + `${cases}` + '\n📆️Today\'s Cases: ' + `${todayCases}` + '\n☣️Total Deaths: ' + `${deaths}` + '\n☢️Today\'s Deaths: ' + `${todayDeaths}` + '\n⛩️Active Cases: ' + `${active}` + '.'
                        )
                } else {
                    var slicedArgs = Array.prototype.slice.call(arg, 1);
                    console.log(slicedArgs)
                    const country = await slicedArgs.join(' ')
                    console.log(country)
                    const response2 = await axios.get('https://coronavirus-19-api.herokuapp.com/countries/' + country + '/')
                    const { cases, todayCases, deaths, todayDeaths, active } = response2.data
                    await client.sendText(
                        from,
                        '🌎️Covid Info -' + country + ' 🌍️\n\n✨️Total Cases: ' + `${cases}` + '\n📆️Today\'s Cases: ' + `${todayCases}` + '\n☣️Total Deaths: ' + `${deaths}` + '\n☢️Today\'s Deaths: ' + `${todayDeaths}` + '\n⛩️Active Cases: ' + `${active}` + '.'
                        )
                    
                }
                break;

            case 'ban-ping':
                if (sender.id === "62895620060410@c.us" || isOwner){
                    if (args.length == 0) return client.reply(from, `Untuk banned seseorang agar tidak bisa menggunakan commands\n\nCaranya ketik: \n${prefix}ban add 628xx --untuk mengaktifkan\n${prefix}ban del 628xx --untuk nonaktifkan\n\ncara cepat ban banyak digrup ketik:\n${prefix}ban @tag @tag @tag`, id)
                    if (args[0] == 'add') {
                        pingBanned.push(args[1]+'@c.us')
                        fs.writeFileSync('./settings/pingBan.json', JSON.stringify(pingBanned))
                        client.reply(from, 'Success banned target from using ping.')
                    } else if (args[0] == 'del') {
                        let xx = pingBanned.indexOf(args[1]+'@c.us')
                        pingBanned.splice(xx,1)
                        fs.writeFileSync('./settings/pingBan.json', JSON.stringify(pingBanned))
                        client.reply(from, 'Success unbanned target from using ping')
                    } else {
                     for (let i = 0; i < mentionedJidList.length; i++) {
                        pingBanned.push(mentionedJidList[i])
                        fs.writeFileSync('./settings/pingBan.json', JSON.stringify(pingBanned))
                        client.reply(from, 'Success ban target from using ping', id)
                        };
                    };
                } else {
                    return client.reply(from, 'Perintah ini hanya untuk Owner bot!', id);
                }
                break;

            case 'ping':
                if(pingBanned){
                    return client.reply(from, 'Anda telah di larang untuk memakai command ini!', id);
                };
                if (!isGroupMsg) return client.reply(from, 'Sorry, This command can only be used in groups', message.id)
                if (!isGroupAdmins) return client.reply(from, 'Well, only admins can use this command', message.id)
                client.reply(from, mess.wait);
                const groupMem = await client.getGroupMembers(groupId)
                let hehe = `${body.slice(6)} - ${pushname} \n`
                for (let i = 0; i < groupMem.length; i++) {
                    hehe += '✨️'
                    hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
                }
                hehe += '----------------------'
                await client.sendTextWithMentions(from, hehe)
                break;

            case 'play':
                if (args.length == 0) return client.reply(from, `Untuk mencari lagu dari youtube\n\nPenggunaan: ${prefix}play judul lagu`, id)
                client.reply(from, mess.wait, id);
                axios.get(`https://arugaytdl.herokuapp.com/search?q=${body.slice(6)}`)
                .then(async(res) => {
                    client.sendFileFromUrl(
                        from,
                        `${res.data[0].thumbnail}`,
                        ``,
                        `Lagu ditemukan\n\nJudul: ${res.data[0].title}\nDurasi: ${res.data[0].duration}detik\nUploaded: ${res.data[0].uploadDate}\nView: ${res.data[0].viewCount}\n\nsedang dikirim`, id)
                    axios.get(`https://arugaz.herokuapp.com/api/yta?url=https://youtu.be/${res.data[0].id}`)
                    .then(async(rest) => {
                        await client.sendPtt(from, rest.data.result, id)
                    });
                });
                break;

            case 'randomquotes':
                client.reply(from, mess.wait, id);
                axios.get('https://arugaz.herokuapp.com/api/randomquotes')
                .then((res) => {
                    client.reply(from, "\"" + res.data.quotes + "\"\n" + "- " + res.data.author, id);
                });
                break;

            case 'mp3':
                client.reply(from, mess.wait, id);
                yt.mp3(message)
                break;

            case 'lyrics':
            case 'lirik':
                if (args.length == 0) return client.reply(from, mess.error.Ia, id)
                
                try {
                    client.reply(from, mess.wait, id);
                    const lagu = body.slice(7)
                    console.log(lagu)
                    const lirik = await liriklagu(lagu);
                    client.sendText(from, lirik);
                } catch (err) {
                    client.reply(from, mess.error.Nr, id);
                    return null;
                };
                break;

            case 'meme':
                client.reply(from, mess.wait, id);
                const response = await axios.get('https://meme-api.herokuapp.com/gimme/wholesomeanimemes');
                const { postlink, title, subreddit, url, nsfw, spoiler } = response.data
                await client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
                break;

            case 'help':
                client.reply(from, mess.wait, id);
                client.reply(from, help.replace(undefined, pushname), id)
                break;

            case 'wallpaper':
                client.reply(from, mess.wait, id);
                axios.get('https://akaneko-api.herokuapp.com/api/mobileWallpapers').then(res => {
                    client.sendFileFromUrl(from, res.data.url, 'Desktop Wallpaper.jpeg', 'Enjoy :>', id);
                });
                break;

            case 'desktopwallpaper':
                client.reply(from, mess.wait, id);
                axios.get('https://akaneko-api.herokuapp.com/api/wallpapers').then(res => {
                    client.sendFileFromUrl(from, res.data.url, 'Desktop Wallpaper.jpeg', 'Enjoy :>', id);
                });
                break;

            case 'artinama':
                return client.reply(from, mess.error.disabled, id);
                /*
                if(!args[0]) {
                    return client.reply(from, mess.error.Ia, id);
                }
                client.reply(from, mess.wait, id);
                console.log(args[0])
                axios.get('arugaz.herokuapp.com/api/artinama?nama=' + args[0]).then(res => {
                    client.reply(from, res.data.result, id);
                });*/
                break;

            case 'animeneko':
                try {
                    client.reply(from, mess.wait, id)
                    axios.get('https://akaneko-api.herokuapp.com/api/neko').then(res => {
                        client.sendFileFromUrl(from, res.data.url, 'neko.jpeg', 'Neko *Nyaa*~');
                    });
                } catch (err) {
                    console.log(err);
                    throw(err);
                };
                break;

            case 'doggo':
                client.reply(from, mess.wait, id);
                axios.get('https://nekos.life/api/v2/img/woof').then(res => {
                    result = res.data.url;
                    stringResult = result.toString();
                    client.sendFileFromUrl(from, stringResult, 'Dog.jpeg', 'Doggo ✨️', id)
                });
                break;

            case 'neko':
                client.reply(from, mess.wait, id);      
                q2 = Math.floor(Math.random() * 900) + 300;
                q3 = Math.floor(Math.random() * 900) + 300;
                client.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'neko.png','Neko 🌠️', id)
                break;

            case 'baka':
                client.reply(from, mess.wait, id);
                axios.get('https://nekos.life/api/v2/img/baka').then(res => {
                    client.sendFileFromUrl(from, res.data.url, 'baka');
                });
                break;

            case 'roll':
                client.reply(from, mess.wait, id);
                const dice = Math.floor(Math.random() * 6) + 1
                await client.sendStickerfromUrl(from, 'https://www.random.org/dice/dice' + dice + '.png')
                break;

            case 'waifu':
                client.reply(from, mess.wait, id);
                axios.get('https://nekos.life/api/v2/img/waifu').then(res => {
                    client.sendFileFromUrl(from, res.data.url, 'Waifu UwU');
                });
                break;

            case 'animeavatar':
                client.reply(from, mess.wait, id);
                axios.get('https://nekos.life/api/v2/img/avatar').then(res => {
                    client.sendFileFromUrl(from, res.data.url, 'Avatar UwU');
                });
                break;

            case 'flip':
                client.reply(from, mess.wait, id);
                const side = Math.floor(Math.random() * 2) + 1
                if (side == 1) {
                   client.sendStickerfromUrl(from, 'https://i.ibb.co/LJjkVK5/heads.png')
                } else {
                   client.sendStickerfromUrl(from, 'https://i.ibb.co/wNnZ4QD/tails.png')
                }
                break;

            case 'slap':
                client.reply(from, mess.wait, id);
                arg = body.trim().split(' ')
                const person = author.replace('@c.us', '')
                await client.sendGiphyAsSticker(from, 'https://media.giphy.com/media/S8507sBJm1598XnsgD/source.gif')
                client.sendTextWithMentions(from, '@' + person + ' *slapped* ' + arg[1])
                break;

            case 'loli':
                client.reply(from, mess.wait, id);
                axios.get('http://lolis-life-api.herokuapp.com/getLoli').then(res => {
                    client.sendFileFromUrl(from, res.data.url, 'loli.jpeg', "Enjoy these Lolis!", id);
                });
                break;

            case 'lolinsfw':
                if(isGroupMsg) {
                    return client.reply(from, "This command only available for Private Messages!", id);
                } else if(sender.id === "62895620060410@c.us"){
                    return console.log("That's my owner ;-;");
                } else {
                    client.sendText(from, mess.wait);
                    axios.get('http://lolis-life-api.herokuapp.com/getNSFWLoli').then(res => {
                        link = res.data.url.toString();
                        client.sendFileFromUrl(from, link, 'Pedo ;-;');
                    });
                }
                break;

            case 'changelog':
                client.reply(from, changelog, id);
                break;

            case 'nulis':
                if (!args) return client.reply(from, 'Kirim perintah *.nulis [teks]*', id)
                client.reply(from, mess.wait, id);
                const nulisq = body.slice(7)
                const tulis = async (teks) => new Promise((resolve, reject) => {
                    axios.get(`https://arugaz.herokuapp.com/api/nulis?text=${encodeURIComponent(teks)}`)
                    .then((res) => {
                        resolve(`${res.data.result}`)
                    })
                    .catch((err) => {
                        reject(err)
                    });
                });
                const nulisp = await tulis(nulisq)
                await client.sendImage(from, `${nulisp}`, '', 'Nih...', id)
                .catch(() => {
                    client.reply(from, 'Error', id)
                });
                break;

            case 'search':
                arg = body.replace('.search', '');
                if(!arg) return client.reply(from, mess.error.Ia, id);
                client.reply(from, mess.wait, id);
                axios.get('https://api.fdci.se/rep.php?gambar=' + arg).then((res) => {
                    jsonRes= JSON.parse(JSON.stringify(res.data));
                    strRes = jsonRes[1].toString();
                    client.sendFileFromUrl(from, strRes, `${arg}.jpeg`, '', id);
                });
                break;

            case 'broadcast':
                if (isOwner || sender.id == "62895620060410@c.us"){
                    let msg = body.slice(command.length + prefix.length)
                    chatz = await client.getAllChatIds()
                    for (let ids of chatz) {
                        var cvk = await client.getChatById(ids)
                        if (!cvk.isReadOnly) await client.sendText(ids, `[ BOT Broadcast ]\n\n${msg}`)
                    }
                    client.reply(from, 'Broadcast Success!', id)
                } else {
                    return client.reply(from, mess.error.Ip, id);
                };
                break;

            case 'ban':
                console.log(sender.id);
                if (isOwnerBot || sender.id == "62895620060410@c.us"){
                    if (args.length == 0) return client.reply(from, `Untuk banned seseorang agar tidak bisa menggunakan commands\n\nCaranya ketik: \n${prefix}ban add 628xx --untuk mengaktifkan\n${prefix}ban del 628xx --untuk nonaktifkan\n\ncara cepat ban banyak digrup ketik:\n${prefix}ban @tag @tag @tag`, id)
                    if (args[0] == 'add') {
                        banned.push(args[1]+'@c.us');
                        fs.writeFileSync('./settings/banned.json', JSON.sringify(banned));
                        client.reply(from, 'Success banned target!');
                    } else if (args[0] == 'del') {
                        let xx = banned.indexOf(args[1]+'@c.us');
                        banned.splice(xx,1);
                        fs.writeFileSync('./settings/banned.json', JSON.stringify(banned));
                        client.reply(from, 'Success unbanned target!');
                    } else {
                     for (let i = 0; i < mentionedJidList.length; i++) {
                        banned.push(mentionedJidList[i]);
                        fs.writeFileSync('./settings/banned.json', JSON.stringify(banned));
                        client.reply(from, 'Success ban target!', id);
                        };
                    };
                } else {
                    return client.reply(from, 'Perintah ini hanya untuk Owner bot!', id);
                };
                break;

            case 'join':
                if (args.length == 0) return client.reply(from, `Jika kalian ingin mengundang bot kegroup silahkan invite atau dengan\nketik ${prefix}join [link group]`, id);
                let linkgrup = body.slice(6);
                let islink = linkgrup.match(/(https:\/\/chat.whatsapp.com)/gi);
                let chekgrup = await client.inviteInfo(linkgrup);
                if (!islink) return client.reply(from, 'Maaf link group-nya salah! silahkan kirim link yang benar', id);
                if (isOwnerBot) {
                    await client.joinGroupViaLink(linkgrup)
                        .then(async () => {
                            await client.sendText(from, 'Berhasil join grup via link!');
                            await client.sendText(chekgrup.id, `Hai minna~, Im Raphiel BOT. To find out the commands on this bot type ${prefix}help`)
                        });
                } else {
                    let cgrup = await client.getAllGroups();
                    if (cgrup.length > groupLimit) return client.reply(from, `Sorry, the group on this bot is full\nMax Group is: ${groupLimit}`, id);
                    if (cgrup.size < memberLimit) return client.reply(from, `Sorry, BOT wil not join if the group members do not exceed ${memberLimit} people`, id);
                    await client.joinGroupViaLink(linkgrup)
                          .then(async () =>{
                              await client.reply(from, 'Berhasil join grup via link!', id);
                          }) .catch(() => {
                              client.reply(from, 'Error', id);
                          });
                };
                break;

            case 'youtube':
                arg = body.replace(".youtube", "");
                if(arg.length == 0) return client.reply(from, mess.error.Ia, id);
                client.sendText(from, mess.wait);
                axios.get(`https://arugaytdl.herokuapp.com/search?q=${arg}`).then(res => {
                    resp = JSON.parse(JSON.stringify(res.data));
                    content = `
                        *Video Found*
*Title* : ${resp[0]["title"]}
*Duration* : ${resp[0]["duration"]} S / Detik
*Uploaded By* : ${resp[0]["channel"]["name"]}
*Upload Date* : ${resp[0]["uploadDate"]}
*Channel URL* : https://youtube.com/channel/${resp[0]["channel"]["id"]}
*URL* : https://www.youtube.com/watch?v=${resp[0]["id"]}
`

                    client.reply(from, content, id);
                });

            case 'nsfw':
                if (isGroupAdmins){
                    if (args.length == 0) return client.reply(from, `Untuk banned seseorang agar tidak bisa menggunakan commands\n\nCaranya ketik: \n${prefix}ban add 628xx --untuk mengaktifkan\n${prefix}ban del 628xx --untuk nonaktifkan\n\ncara cepat ban banyak digrup ketik:\n${prefix}ban @tag @tag @tag`, id)
                    if (args[0] == 'on') {
                        nsfw.push(from, 1);
                        fs.writeFileSync('./nsfw/nsfw.json', JSON.sringify(nsfw));
                        client.reply(from, 'Success NSFW Enabled in this guild.!', id);
                    } else if (args[0] == 'off') {
                        let xx = nsfw.indexOf(from);
                        nsfw.splice(xx,1);
                        fs.writeFileSync('./lib/nsfw.json', JSON.stringify(nsfw));
                        client.reply(from, 'NSFW Successfully Disabled on this guild.!', id);
                    } else {
                        return client.reply(from, Ia, id);
                    };
                } else {
                    return client.reply(from, 'Perintah ini hanya untuk Admin Guild!', id);
                };
                break;

        };

    } catch (err) {
        console.log("[ERROR] ", err)
        throw err;
    }
require('./server')();
}
