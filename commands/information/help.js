const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const emojis = require('../../emoji.js');
this.config = require(`${process.cwd()}/config.json`)

module.exports = {
    name: 'help',
    aliases: ['h'],
    category: 'info',
    cooldown: 5,
    premium: false,
    run: async (client, message, args) => {
        let prefix = message.guild?.prefix || '$'; // Default prefix if not set

        const row1 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('helpop')
                .setPlaceholder(`❯ ${client.user.username} Get Started!`)
                .addOptions([
                    {
                        label: 'AntiNuke',
                        description: 'Get All AntiNuke Command List',
                        value: 'antinuke',
                        emoji: emojis.antinuke
                    },
                    {
                        label: 'Moderation',
                        description: 'Get All Moderation Command List',
                        value: 'moderation',
                        emoji: emojis.moderation
                    },
                    {
                        label: 'Automod',
                        description: 'Get All Automod Command List',
                        value: 'automod',
                        emoji: emojis.automod
                    },
                    {
                        label: 'Logger',
                        description: 'Get All Logger Command List',
                        value: 'logger',
                        emoji: emojis.logger
                    },
                    {
                        label: 'Utility',
                        description: 'Get All Utility Command List',
                        value: 'utility',
                        emoji: emojis.utility
                    }
                ])
        );

        const row2 = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('helpop2')
                .setPlaceholder(`❯ ${client.user.username} Get Started!`)
                .addOptions([
                    {
                        label: 'Join To Create',
                        description: 'Get All Join To Create Command List',
                        value: 'jointocreate',
                        emoji: emojis.JoinToCreate
                    },
                    {
                        label: 'Voice',
                        description: 'Get All Voice Command List',
                        value: 'voice',
                        emoji: emojis.voice
                    },
                    {
                        label: 'Custom Role',
                        description: 'Get All Custom Role Command List',
                        value: 'customrole',
                        emoji: emojis.customrole
                    },
                    {
                        label: 'Welcomer',
                        description: 'Get All Welcomer Command List',
                        value: 'welcomer',
                        emoji: emojis.welcomer
                    },
                    {
                        label: 'Ticket',
                        description: 'Get All Ticket Command List',
                        value: 'ticket',
                        emoji: emojis.ticket
                    },
                ])
        );

        const categories = {
            category1: [
                `**${emojis.antinuke} \`:\` AntiNuke**`,
                `**${emojis.moderation} \`:\` Moderation**`,
                `**${emojis.automod} \`:\` Automod**`,
                `**${emojis.logger} \`:\` Logger**`,
                `**${emojis.utility} \`:\` Utility**`,
            ],
            category2: [
                `**${emojis.JoinToCreate} \`:\` Join To Create**`,
                `**${emojis.voice} \`:\` Voice**`,
                `**${emojis.customrole} \`:\` Custom Role**`,
                `**${emojis.welcomer} \`:\` Welcomer**`,
                `**${emojis.ticket} \`:\` Ticket**`
            ]
        };

        let developerUser = client.users.cache.get('870040788539678791') || await client.users.fetch('870040788539678791').catch(() => null);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(
                `${emojis.dot} **Prefix for this server:** \`${prefix}\`\n` +
                `${emojis.dot} **Total Commands:** \`${client.util.countCommandsAndSubcommands(client)}\`\n` +
                `${emojis.dot} **Type \`${prefix}antinuke enable\` to get started!**\n\n${client.config.baseText}`
            )
            .addFields(
                {
                    name: `${emojis.Categories} **__Categories__**`,
                    value: categories.category1.join('\n'),
                    inline: true
                },
                {
                    name: '\u200B',
                    value: categories.category2.join('\n'),
                    inline: true
                },
                {
                    name: `${emojis.link} **__Links__**`,
                    value: `**[Invite Me](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot) | [Support Server](https://discord.gg/ExcelBot)**`
                }
            )
            .setFooter({
                text: `Powered by  Team Excel`,
                iconURL: developerUser ? developerUser.displayAvatarURL({ dynamic: true }) : null
            });

        if (!client.config.owner.includes(message.author.id) && !client.config.admin.includes(message.author.id)) {
            await message.channel.send({ embeds: [embed], components: [row1, row2] });
        } else {
            await message.channel.send({ embeds: [embed], components: [row1, row2], content: `Hey Owner, How Can I Help You Today?` });
        }
    }
};
