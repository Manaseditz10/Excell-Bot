const { ActivityType } = require('discord.js')
module.exports = async (client) => {
    client.on('ready', async () => {
	client.ready = true
    client.user.setPresence({
        activities: [
            {
                name: `FasterThanLight..!!`, 
                type: ActivityType.Listening // Can be Playing, Streaming, Listening, Watching
            }
        ],
        status: 'online' // Can be 'online', 'idle', 'dnd', 'invisible'
    });
        client.logger.log(`Logged in to ${client.user.tag}`, 'ready')

    })
    

}
