const { EmbedBuilder, WebhookClient } = require('discord.js');

module.exports = async (client) => {
    const join = new WebhookClient({ url: `https://discord.com/api/webhooks/1407075072857997483/lJxt7lN1zk6ZGH1D2hK76wBfohqpcQ_5WNBlEYgmCcXWLvEhcVVsLS3q2sqmyssP4ywZ` });
    const leave = new WebhookClient({ url: `https://discord.com/api/webhooks/1407076289571065916/D35SOsQH9wUP9pEev9oJM0LjQl7xFMOL9PIOCB5S-Y2NZjm1CjviN0i90jq25k5oQfZq` });

    client.on('guildCreate', async (guild) => {
        try {
			if(!client.ready) return
            // Fetch total server and user count across shards
            const totalServers = await client.cluster
                .broadcastEval(client => client.guilds.cache.size)
                .then(results => results.reduce((prev, val) => prev + val, 0));

            const totalUsers = await client.cluster
                .broadcastEval(client => client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
                .then(results => results.reduce((acc, count) => acc + count, 0));

            let owner = await guild.fetchOwner();
            let bannerUrl = guild.bannerURL({ dynamic: true, size: 1024 });
            
            // Check for partnered and verified status
            let emoji = '';
            if (guild.partnered && guild.verified) {
                emoji = `<:partner:1375009177365254175><:verified:1375010086971244575>`;
            } else if (guild.partnered) {
                emoji = '<:partner:1375009177365254175>';
            } else if (guild.verified) {
                emoji = '<:verified:1375010086971244575>';
            } else {
                emoji = `${client.emoji.cross}`;
            }

            const embed = new EmbedBuilder()
                .setTitle(guild.name)
                .setDescription(`Id: **${guild.id}**\nName: **${guild.name}**\nDiscord Level: ${emoji}\nMemberCount: \`${guild.memberCount}\`\nCreated At: <t:${Math.round(guild.createdTimestamp / 1000)}:R>\nJoined At: <t:${Math.round(guild.joinedTimestamp / 1000)}:R>`)
                embed.addFields([
                    { name: '**Owner**', value: `Info: **${owner.user.tag} (${owner.id})**\nMentions: <@${owner.id}>\nCreated At: <t:${Math.round(owner.user.createdTimestamp / 1000)}:R>` },
                    { name: `**${client.user.username}'s Total Servers**`, value: `\`\`\`js\n${totalServers}\`\`\``, inline: true },
                    { name: `**${client.user.username}'s Total Users**`, value: `\`\`\`js\n${totalUsers}\`\`\``, inline: true },
                    { name: `**Shard Id**`, value: `\`\`\`js\n${guild.shardId}\`\`\``, inline: true }
                ])
                .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
                .setColor(client.color);

            if (guild.vanityURLCode) {
                embed.setURL(`https://discord.gg/${guild.vanityURLCode}`);
            }
            if (guild.banner) {
                embed.setImage(bannerUrl);
            }

            // Send embed using the join webhook
            await join.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error in guildCreate event:', error);
        }
    });

    client.on('guildDelete', async (guild) => {
        try {
		if(!client.ready) return
            const totalServers = await client.cluster
                .broadcastEval(client => client.guilds.cache.size)
                .then(results => results.reduce((prev, val) => prev + val, 0));

            const totalUsers = await client.cluster
                .broadcastEval(client => client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0))
                .then(results => results.reduce((acc, count) => acc + count, 0));

            let bannerUrl = guild.bannerURL({ dynamic: true, size: 1024 });

            const embed = new EmbedBuilder()
                //.setTitle(guild.name)
                .setDescription(`Id: **${guild.id}**\nName: **${guild.name}**\nMemberCount: \`${guild.memberCount}\`\nCreated At: <t:${Math.round(guild.createdTimestamp / 1000)}:R>\nJoined At: <t:${Math.round(guild.joinedTimestamp / 1000)}:R>`)
                embed.addFields([
                    { name: `**${client.user.username}'s Total Servers**`, value: `\`\`\`js\n${totalServers}\`\`\``, inline: true },
                    { name: `**${client.user.username}'s Total Users**`, value: `\`\`\`js\n${totalUsers}\`\`\``, inline: true }
                ])
                .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
                .setColor(client.color);

            if (guild.vanityURLCode) {
                embed.setURL(`https://discord.gg/${guild.vanityURLCode}`);
            }
            if (guild.banner) {
                embed.setImage(bannerUrl);

            }

            // Send embed using the leave webhook
            await leave.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error in guildDelete event:', error);
        }
    });
};


