const {
    Message,
    Client,
    ChannelType,
    PermissionsBitField,
    EmbedBuilder
} = require('discord.js');
module.exports = {
    name: 'autologs',
    aliases: ['autolog'],
    cooldown: 5,
    category: 'logging',
    premium: false,

    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have \`MANAGE SERVER\` permissions to use this command.`
                        )
                ]
            });
        }

        if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | I don't have \`Administrator\` permissions to execute this command.`
                        )
                ]
            });
        }

        if (!client.util.hasHigher(message.member)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have a higher role than me to use this command.`
                        )
                ]
            });
        }

        let data = await client.db.get(`logs_${message.guild.id}`) || {
            voice: null,
            channel: null,
            rolelog: null,
            modlog: null,
            message: null,
            memberlog: null
        };

        if (data.voice || data.channel || data.rolelog || data.modlog || data.message || data.memberlog) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Logging System is Already Set Up')
                        .setDescription('Your server already has a configured logging system.')
                        .addFields([
                            { name: 'How to Reset Logging?', value: 'You can manage logging settings using the appropriate commands.' },
                            { name: 'Note', value: `If you want to set up logging again, use ${message.guild.prefix}logsreset & delete all existing log channels of excel` }
                        ])
                        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                ]
            });
        }

        try {
            let category = message.guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name === 'EXCEL-LOGS');

            if (!category) {
                category = await message.guild.channels.create({
                    name: 'EXCEL-LOGS',
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel]
                        }
                    ]
                });
            }

            const channels = [
                { name: 'excel-voicelog', topic: 'This channel logs voice-related events.' },
                { name: 'excel-channellog', topic: 'This channel logs channel-related events.' },
                { name: 'excel-rolelog', topic: 'This channel logs role-related events.' },
                { name: 'excel-modlog', topic: 'This channel logs moderation events.' },
                { name: 'excel-msglog', topic: 'This channel logs message events.' },
                { name: 'excel-memberlog', topic: 'This channel logs member-related events.' },
            ];

            for (const channelData of channels) {
                let check = message.guild.channels.cache.find(ch => ch.name === channelData.name);

                if (check) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setTitle('Logging System is Already Set Up')
                                .setDescription('Your server already has a configured logging system.')
                                .addFields([
                                    { name: 'How to Reset Logging?', value: 'You can manage logging settings using the appropriate commands.' },
                                    { name: 'Note', value: `If you want to set up logging again, use ${message.guild.prefix}logsreset & delete all existing log channels of excel` }
                                ])
                                .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                        ]
                    });
                }

                await message.guild.channels.create({
                    name: channelData.name,
                    type: ChannelType.GuildText,
                    topic: channelData.topic,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel]
                        }
                    ],
                    reason: 'Creating logging channels as part of autologs setup.'
                });

                await client.util.sleep(2000);
            }

            let voicelog = message.guild.channels.cache.find(channel => channel.name === 'excel-voicelog');
            let channellog = message.guild.channels.cache.find(channel => channel.name === 'excel-channellog');
            let rolelog = message.guild.channels.cache.find(channel => channel.name === 'excel-rolelog');
            let modlog = message.guild.channels.cache.find(channel => channel.name === 'excel-modlog');
            let msglog = message.guild.channels.cache.find(channel => channel.name === 'excel-msglog');
            let memberlog = message.guild.channels.cache.find(channel => channel.name === 'excel-memberlog');

            await client.db.set(`logs_${message.guild.id}`, {
                voice: voicelog.id,
                channel: channellog.id,
                rolelog: rolelog.id,
                modlog: modlog.id,
                message: msglog.id,
                memberlog: memberlog.id
            });

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle('Logging Channels Setup Complete')
                        .setDescription('All necessary logging channels have been successfully created under the "EXCEL LOGS" category.')
                        .addFields([
                            { name: 'Channels Created', value: '- **excel-modlog:** Logs moderation-related events.\n- **excel-memberlog:** Logs member-related events.\n- **excel-msglog:** Logs message-related events.\n- **excel-channellog:** Logs channel-related events.\n- **excel-voicelog:** Logs voice-related events\n- **excel-rolelog:** Logs role-related events.' },
                            { name: 'Additional Configuration', value: 'You can further customize logging settings and manage permissions as needed.' }
                        ])
                        .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
                ]
            });

        } catch (error) {
            if (error.code === 429) {
                await client.util.handleRateLimit();
            }
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription('An error occurred while creating logging channels.')
                ]
            });
        }
    }
};
