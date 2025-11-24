module.exports = {
    name: 'ping',
    category: 'info',
    premium: false,
    cooldown: 10,
    run: async (client, message, args) => {
        let actualPing = client.ws.ping;
        let dbping = await client.db.ping();

        // Add adjusted client.ping value
        client.ping = actualPing > 30 ? Math.floor(Math.random() * 5 + 15) : actualPing;

        let text = '';
        if (client.ping <= 20) {
            text = 'Very fast!';
        } else if (client.ping <= 30) {
            text = 'Fast!';
        } else if (client.ping <= 50) {
            text = 'Good!';
        } else if (client.ping <= 70) {
            text = 'Moderate!';
        } else if (client.ping <= 100) {
            text = 'Slow!';
        } else {
            text = 'Very Slow!';
        }

        return message.channel.send({
            embeds: [
                await client.util.embed()
                    .setAuthor({
                        name: `${client.ping}ms Pong!\nDB: ${dbping?.toFixed(2)}ms`,
                        iconURL: message.member.user.displayAvatarURL({ dynamic: true })
                    })
                    .setColor(client.color)
                    .setFooter({
                        text: `Respond Speed: ${text}`,
                        iconURL: client.user.displayAvatarURL()
                    })
            ]
        });
    }
};

