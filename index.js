const { create, Client } = require('@open-wa/wa-automate');
const welcome = require('./lib/welcome');
const msgHandler = require('./msgHndlr');
const options = require('./options');

const start = async (client = new Client()) => {
    console.log('[SERVER] Server Started!')
    // Force it to keep the current session
    client.onStateChanged((state) => {
        console.log('[Client State]', state)
        if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
    })
    // listening on message
    client.onMessage((async (message) => {
        client.getAmountOfLoadedMessages()
        .then((msg) => {
            if (msg >= 3000) {
                client.cutMsgCache()
            }
        })
        msgHandler(client, message)
    }));

    client.onGlobalParicipantsChanged((async (heuh) => {
        await welcome(client, heuh)
        //left(client, heuh)
        }));
}

create('Bot', options(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))