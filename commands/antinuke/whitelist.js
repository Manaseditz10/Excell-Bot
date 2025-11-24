const {
    StringSelectMenuBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle
} = require('discord.js')
const { Excel } = require('../../structures/Excel')
const emojis = require('../../emoji.js');
module.exports = {
    name: 'whitelist',
    aliases: ['wl'],
    category: 'security',
    premium: false,
    /**
     * @param {Excel} client
     */
    run: async (client, message, args) => {

        let own = message.author.id == message.guild.ownerId
        const check = await client.util.isExtraOwner(
            message.author,
            message.guild
        )
        if (!own && !check) {
            return message.channel.send({
                embeds: [
                    client.util.embed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Only Server Owner Or Extraowner Can Run This Command.!`
                        )
                ]
            })
        }
        if (
            !own &&
            !(
                message?.guild.members.cache.get(client.user.id).roles.highest
                    .position <= message?.member?.roles?.highest.position
            )
        ) {
            const higherole = client.util.embed()
                .setColor(client.color)
                .setDescription(
                    `${client.emoji.cross} | Only Server Owner Or Extraowner Having Higher Role Than Me Can Run This Command`
                )
            return message.channel.send({ embeds: [higherole] })
        }
        const antinuke = await client.db.get(`${message.guild.id}_antinuke`)
        if (!antinuke) {
            const dissable = client.util.embed().setColor(client.color)
                .setDescription(` ** ${message.guild.name} security settings <a:antinukecmd:1374247948312907857>
Ohh NO! looks like your server doesn't enabled security

Current Status : <:disableyes:1374248032014434335><:enableno:1374348498404769793>

To enable use antinuke enable ** `)
            message.channel.send({ embeds: [dissable] })
        } else {
            const member =
                message.mentions.users.first() ||
                message.guild.members.cache.get(args[0])
            const wl = client.util.embed()
                .setColor(client.color)
                .setTitle(`__**Whitelist Commands**__`)
                .setDescription(
                    `**Adds user to whitelisted users which means that there will be no actions taken on the whitelisted members if they trigger the antinuke module.**`
                )
                .addFields([
                    {
                        name: `__**Usage**__`,
                        value: `<:dots:1374247969016119337>  \`${message.guild.prefix}whitelist @user/id\`\n<:dots:1374247969016119337>  \`${message.guild.prefix}wl @user\``
                    }
                ])
            if (!member) return message.channel.send({ embeds: [wl] })
            let data = await client.db?.get(
                `${message.guild.id}_${member.id}_wl`
            )
            if (data !== null) {
                if (
                    data.ban &&
                    data.kick &&
                    data.prune &&
                    data.botadd &&
                    data.serverup &&
                    data.memup &&
                    data.chcr &&
                    data.chup &&
                    data.chdl &&
                    data.rlcr &&
                    data.rldl &&
                    data.rlup &&
                    data.meneve &&
                    data.mngweb &&
                    data.mngstemo
                )
                    return message.channel.send({
                        embeds: [
                            client.util.embed()
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.cross} | <@${member.id}> is already a whitelisted member.`
                                )
                        ]
                    })
            }

            await client.db?.set(`${message.guild.id}_${member.id}_wl`, {
                ban: false,
                kick: false,
                prune: false,
                botadd: false,
                serverup: false,
                memup: false,
                chcr: false,
                chup: false,
                chdl: false,
                rlcr: false,
                rldl: false,
                rlup: false,
                meneve: false,
                mngweb: false,
                mngstemo: false
            })
            let menu = [
                {
                    label: 'Ban',
                    value: 'ban',
                    description: 'Whitelistes a member with ban permission'
                },
                {
                    label: 'Kick',
                    value: 'kick',
                    description: 'Whitelistes a member with kick permission'
                },
                {
                    label: 'Prune',
                    value: 'prune',
                    description: 'Whitelistes a member with prune permission'
                },
                {
                    label: 'Bot Add',
                    value: 'botadd',
                    description: 'Whitelistes a member with bot add permission'
                },
                {
                    label: 'Server Update',
                    value: 'serverup',
                    description:
                        'Whitelistes a member with server update permission'
                },
                {
                    label: 'Member Update',
                    value: 'memup',
                    description:
                        'Whitelistes a member with member update permission'
                },
                {
                    label: 'Channel Create',
                    value: 'chcr',
                    description:
                        'Whitelistes a member with channel create permission'
                },
                {
                    label: 'Channel Delete',
                    value: 'chdl',
                    description:
                        'Whitelistes a member with channel delete permission'
                },
                {
                    label: 'Channel Update',
                    value: 'chup',
                    description:
                        'Whitelistes a member with channel update permission'
                },
                {
                    label: 'Role Create',
                    value: 'rlc',
                    description:
                        'Whitelistes a member with role create permission'
                },
                {
                    label: 'Role Update',
                    value: 'rlup',
                    description:
                        'Whitelistes a member with role update permission'
                },
                {
                    label: 'Role Delete',
                    value: 'rldl',
                    description:
                        'Whitelistes a member with role update permission'
                },
                {
                    label: 'Mention Everyone',
                    value: 'meneve',
                    description:
                        'Whitelistes a member with mention everyone permission'
                },
                {
                    label: 'Manage Webhook',
                    value: 'mngweb',
                    description:
                        'Whitelistes a member with manage webhook permission'
                },
                {
                    label: 'Manage Stickers & Emojis',
                    value: 'mngstemo',
                    description:
                        'Whitelistes a member with Manage stickers & emojis permission'
                }
            ]
            let menuSelect = new StringSelectMenuBuilder()
                .setCustomId('wl')
                .setMinValues(1)
                .setMaxValues(menu.length)
                .setOptions(menu)
                .setPlaceholder('Choose Your Options')
            let btn = new ButtonBuilder()
                .setLabel('Add This User To All Categories')
                .setStyle(ButtonStyle.Primary)
                .setCustomId('catWl')
            const row2 = new ActionRowBuilder().addComponents([btn])
            const row = new ActionRowBuilder().addComponents([menuSelect])
            let msg
            if (
                !data?.ban &&
                !data?.kick &&
                !data?.prune &&
                !data?.botadd &&
                !data?.serverup &&
                !data?.memup &&
                !data?.chcr &&
                !data?.chup &&
                !data?.chdl &&
                !data?.rlcr &&
                !data?.rldl &&
                !data?.rlup &&
                !data?.meneve &&
                !data?.mngweb &&
                !data?.mngstemo
            ) {
                msg = await message.channel.send({
                    embeds: [
                        client.util.embed()
                            .setAuthor({
                                name: message.guild.name,
                                iconURL:
                                    message.guild.iconURL({ dynamic: true }) ||
                                    client.user.displayAvatarURL()
                            })
                            .setFooter({
                                text: `Powered by  Team Excel`
                            })
                            .setColor(client.color)
                            .setDescription(
                                `<:disableyes:1374248032014434335><:enableno:1374348498404769793> : **Ban**\n<:disableyes:1374248032014434335><:enableno:1374348498404769793> : **Kick**\n<:disableyes:1374248032014434335><:enableno:1374348498404769793> : **Prune**\n<:disableyes:1374248032014434335><:enableno:1374348498404769793> : **Bot Add**\n<:disableyes:1374248032014434335><:enableno:1374348498404769793> : **Server Update\n<:disableyes:1374248032014434335><:enableno:1374348498404769793> : Member Role Update**\n<:disableyes:1374248032014434335><:enableno:1374348498404769793> : **Channel Create**\n<:disableyes:1374248032014434335><:enableno:1374348498404769793> :** Channel Delete**\n<:disableyes:1374248032014434335><:enableno:1374348498404769793> : **Channel Update**\n<:disableyes:1374248032014434335><:enableno:1374348498404769793> : **Role Create**\n<:disableyes:1374248032014434335><:enableno:1374348498404769793> : **Role Delete**\n<:disableyes:1374248032014434335><:enableno:1374348498404769793> : **Role Update**\n<:disableyes:1374248032014434335><:enableno:1374348498404769793> : **Mention** @everyone\n<:disableyes:1374248032014434335><:enableno:1374348498404769793> : **Webhook Management**\n<:disableyes:1374248032014434335><:enableno:1374348498404769793> : **Emojis & Stickers Management**`
                            )
                            .addFields(
                                {
                                    name: `**Executor**`,
                                    value: `<@!${message.author.id}>`,
                                    inline: true
                                },
                                {
                                    name: `**Target**`,
                                    value: `<@!${member.id}>`,
                                    inline: true
                                }
                            )
                            .setThumbnail(client.user.displayAvatarURL())
                    ],
                    components: [row, row2]
                })
            } else {
                msg = await message.channel.send({
                    embeds: [
                        client.util.embed()
                            .setAuthor({
                                name: message.guild.name,
                                iconURL:
                                    message.guild.iconURL({ dynamic: true }) ||
                                    client.user.displayAvatarURL()
                            })
                            .setFooter({
                                text: `Powered by  Team Excel`
                            })
                            .setColor(client.color)
                            .setDescription(
                                `${data.ban ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Ban**\n${data.kick ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Kick**\n${data.prune ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Prune**\n${data.botadd ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Bot Add**\n${data.serverup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Server Update\n${data.memup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: Member Role Update**\n${data.chcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Create**\n${data.chdl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: ** Channel Delete**\n${data.chup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Update**\n${data.rlcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Create**\n${data.rldl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Delete**\n${data.rlup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Update**\n${data.meneve ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Mention** @everyone\n${data.mngweb ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Webhook Management**\n${data.mngstemo ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Emojis & Stickers Management**`
                            )
                            .addFields(
                                {
                                    name: `**Executor**`,
                                    value: `<@!${message.author.id}>`,
                                    inline: true
                                },
                                {
                                    name: `**Target**`,
                                    value: `<@!${member.id}>`,
                                    inline: true
                                }
                            )
                            .setThumbnail(client.user.displayAvatarURL())
                    ],
                    components: [row, row2]
                })
            }
            
            const collector = msg.createMessageComponentCollector({
                filter: (i) => (i.isStringSelectMenu() || i.isButton) && i.user,
                time: 60000
            })
            collector.on('collect', async (i) => {
                i = await i
                if (i.user.id !== message.author.id)
                    return i.reply({
                        content: `Only <@${message.author.id}> Can Use This Intraction`,
                        ephemeral: true
                    })
                if (i.isButton()) {
                    if (i.customId == 'catWl') {
                        i.deferUpdate()
                        data = await client.db?.get(
                            `${i.guild.id}_${member.id}_wl`
                        )
                        data.ban = true
                        data.kick = true
                        data.prune = true
                        data.botadd = true
                        data.serverup = true
                        data.memup = true
                        data.chcr = true
                        data.chdl = true
                        data.chup = true
                        data.rlcr = true
                        data.rldl = true
                        data.rlup = true
                        data.meneve = true
                        data.mngweb = true
                        data.mngstemo = true
                        menuSelect = menuSelect.setDisabled(true)
                        btn = btn.setDisabled(true)
                        const newRow = new ActionRowBuilder().addComponents([
                            menuSelect
                        ])
                        const newRow1 = new ActionRowBuilder().addComponents([
                            btn
                        ])
                        msg.edit({
                            embeds: [
                                client.util.embed()
                                    .setAuthor({
                                        name: message.guild.name,
                                        iconURL:
                                            message.guild.iconURL({
                                                dynamic: true
                                            }) || client.user.displayAvatarURL()
                                    })
                                    .setFooter({
                                        text: `Powered by  Team Excel`
                                    })
                                    .setColor(client.color)
                                    .setDescription(
                                        `${data.ban ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Ban**\n${data.kick ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Kick**\n${data.prune ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Prune**\n${data.botadd ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Bot Add**\n${data.serverup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Server Update\n${data.memup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: Member Role Update**\n${data.chcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Create**\n${data.chdl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: ** Channel Delete**\n${data.chup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Update**\n${data.rlcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Create**\n${data.rldl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Delete**\n${data.rlup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Update**\n${data.meneve ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Mention** @everyone\n${data.mngweb ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Webhook Management**\n${data.mngstemo ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Emojis & Stickers Management**`
                                    )
                                    .addFields(
                                        {
                                            name: `**Executor**`,
                                            value: `<@!${i.user.id}>`,
                                            inline: true
                                        },
                                        {
                                            name: `**Target**`,
                                            value: `<@!${member.id}>`,
                                            inline: true
                                        }
                                    )
                                    .setThumbnail(
                                        client.user.displayAvatarURL()
                                    )
                            ],
                            components: [newRow, newRow1]
                        })
                        let wls = []
                        const wl = await client.db?.get(
                            `${i.guild.id}_${member.id}_wl`
                        )
                        if (wl)
                            if (wl.length > 0) {
                                wl.map((w) => wls.push(w))
                            }
                        wls.push(member.id)
                        let already1 = await client.db.get(
                            `${message.guild.id}_wl.whitelisted`,
                            member.id
                        )

                        if (already1) {
                            await client.db.pull(
                                `${message.guild.id}_wl.whitelisted`,
                                member.id
                            )
                            await client.db.push(
                                `${message.guild.id}_wl.whitelisted`,
                                member.id
                            )
                        } else {
                            await client.db.push(
                                `${message.guild.id}_wl.whitelisted`,
                                member.id
                            )
                        }

                        return client.db?.set(
                            `${i.guild.id}_${member.id}_wl`,
                            data
                        )
                    }
                }
                if (i.isStringSelectMenu()) {
                    data = await client.db?.get(`${i.guild.id}_${member.id}_wl`)
                    i.deferUpdate()
                    if (i.values.includes('ban')) {
                        data.ban = data.ban ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    client.util.embed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Powered by  Team Excel`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Ban**\n${data.kick ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Kick**\n${data.prune ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Prune**\n${data.botadd ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Bot Add**\n${data.serverup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Server Update\n${data.memup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: Member Role Update**\n${data.chcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Create**\n${data.chdl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: ** Channel Delete**\n${data.chup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Update**\n${data.rlcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Create**\n${data.rldl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Delete**\n${data.rlup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Update**\n${data.meneve ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Mention** @everyone\n${data.mngweb ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Webhook Management**\n${data.mngstemo ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('kick')) {
                        data.kick = data.kick ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    client.util.embed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Powered by  Team Excel`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Ban**\n${data.kick ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Kick**\n${data.prune ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Prune**\n${data.botadd ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Bot Add**\n${data.serverup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Server Update\n${data.memup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: Member Role Update**\n${data.chcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Create**\n${data.chdl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: ** Channel Delete**\n${data.chup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Update**\n${data.rlcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Create**\n${data.rldl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Delete**\n${data.rlup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Update**\n${data.meneve ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Mention** @everyone\n${data.mngweb ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Webhook Management**\n${data.mngstemo ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('prune')) {
                        //aise
                        data.prune = data.prune ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    client.util.embed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Powered by  Team Excel`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Ban**\n${data.kick ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Kick**\n${data.prune ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Prune**\n${data.botadd ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Bot Add**\n${data.serverup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Server Update\n${data.memup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: Member Role Update**\n${data.chcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Create**\n${data.chdl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: ** Channel Delete**\n${data.chup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Update**\n${data.rlcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Create**\n${data.rldl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Delete**\n${data.rlup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Update**\n${data.meneve ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Mention** @everyone\n${data.mngweb ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Webhook Management**\n${data.mngstemo ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('botadd')) {
                        data.botadd = data.botadd ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    client.util.embed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Powered by  Team Excel`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Ban**\n${data.kick ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Kick**\n${data.prune ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Prune**\n${data.botadd ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Bot Add**\n${data.serverup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Server Update\n${data.memup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: Member Role Update**\n${data.chcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Create**\n${data.chdl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: ** Channel Delete**\n${data.chup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Update**\n${data.rlcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Create**\n${data.rldl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Delete**\n${data.rlup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Update**\n${data.meneve ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Mention** @everyone\n${data.mngweb ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Webhook Management**\n${data.mngstemo ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('serverup')) {
                        data.serverup = data.serverup ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    client.util.embed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Powered by  Team Excel`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Ban**\n${data.kick ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Kick**\n${data.prune ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Prune**\n${data.botadd ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Bot Add**\n${data.serverup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Server Update\n${data.memup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: Member Role Update**\n${data.chcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Create**\n${data.chdl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: ** Channel Delete**\n${data.chup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Update**\n${data.rlcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Create**\n${data.rldl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Delete**\n${data.rlup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Update**\n${data.meneve ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Mention** @everyone\n${data.mngweb ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Webhook Management**\n${data.mngstemo ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('memup')) {
                        data.memup = data.memup ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    client.util.embed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Powered by  Team Excel`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Ban**\n${data.kick ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Kick**\n${data.prune ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Prune**\n${data.botadd ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Bot Add**\n${data.serverup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Server Update\n${data.memup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: Member Role Update**\n${data.chcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Create**\n${data.chdl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: ** Channel Delete**\n${data.chup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Update**\n${data.rlcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Create**\n${data.rldl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Delete**\n${data.rlup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Update**\n${data.meneve ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Mention** @everyone\n${data.mngweb ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Webhook Management**\n${data.mngstemo ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('chcr')) {
                        data.chcr = data.chcr ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    client.util.embed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Powered by  Team Excel`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Ban**\n${data.kick ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Kick**\n${data.prune ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Prune**\n${data.botadd ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Bot Add**\n${data.serverup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Server Update\n${data.memup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: Member Role Update**\n${data.chcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Create**\n${data.chdl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: ** Channel Delete**\n${data.chup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Update**\n${data.rlcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Create**\n${data.rldl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Delete**\n${data.rlup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Update**\n${data.meneve ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Mention** @everyone\n${data.mngweb ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Webhook Management**\n${data.mngstemo ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('chdl')) {
                        data.chdl = data.chdl ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    client.util.embed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Powered by  Team Excel`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Ban**\n${data.kick ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Kick**\n${data.prune ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Prune**\n${data.botadd ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Bot Add**\n${data.serverup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Server Update\n${data.memup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: Member Role Update**\n${data.chcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Create**\n${data.chdl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: ** Channel Delete**\n${data.chup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Update**\n${data.rlcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Create**\n${data.rldl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Delete**\n${data.rlup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Update**\n${data.meneve ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Mention** @everyone\n${data.mngweb ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Webhook Management**\n${data.mngstemo ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('chup')) {
                        data.chup = data.chup ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    client.util.embed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Powered by  Team Excel`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Ban**\n${data.kick ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Kick**\n${data.prune ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Prune**\n${data.botadd ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Bot Add**\n${data.serverup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Server Update\n${data.memup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: Member Role Update**\n${data.chcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Create**\n${data.chdl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: ** Channel Delete**\n${data.chup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Update**\n${data.rlcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Create**\n${data.rldl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Delete**\n${data.rlup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Update**\n${data.meneve ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Mention** @everyone\n${data.mngweb ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Webhook Management**\n${data.mngstemo ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('rlc')) {
                        data.rlcr = data.rlcr ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    client.util.embed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Powered by  Team Excel`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Ban**\n${data.kick ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Kick**\n${data.prune ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Prune**\n${data.botadd ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Bot Add**\n${data.serverup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Server Update\n${data.memup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: Member Role Update**\n${data.chcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Create**\n${data.chdl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: ** Channel Delete**\n${data.chup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Update**\n${data.rlcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Create**\n${data.rldl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Delete**\n${data.rlup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Update**\n${data.meneve ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Mention** @everyone\n${data.mngweb ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Webhook Management**\n${data.mngstemo ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('rldl')) {
                        data.rldl = data.rldl ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    client.util.embed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Powered by  Team Excel`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Ban**\n${data.kick ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Kick**\n${data.prune ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Prune**\n${data.botadd ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Bot Add**\n${data.serverup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Server Update\n${data.memup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: Member Role Update**\n${data.chcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Create**\n${data.chdl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: ** Channel Delete**\n${data.chup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Update**\n${data.rlcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Create**\n${data.rldl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Delete**\n${data.rlup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Update**\n${data.meneve ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Mention** @everyone\n${data.mngweb ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Webhook Management**\n${data.mngstemo ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('rlup')) {
                        data.rlup = data.rlup ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    client.util.embed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Powered by  Team Excel`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Ban**\n${data.kick ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Kick**\n${data.prune ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Prune**\n${data.botadd ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Bot Add**\n${data.serverup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Server Update\n${data.memup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: Member Role Update**\n${data.chcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Create**\n${data.chdl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: ** Channel Delete**\n${data.chup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Update**\n${data.rlcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Create**\n${data.rldl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Delete**\n${data.rlup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Update**\n${data.meneve ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Mention** @everyone\n${data.mngweb ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Webhook Management**\n${data.mngstemo ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('meneve')) {
                        data.meneve = data.meneve ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    client.util.embed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Powered by  Team Excel`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Ban**\n${data.kick ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Kick**\n${data.prune ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Prune**\n${data.botadd ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Bot Add**\n${data.serverup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Server Update\n${data.memup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: Member Role Update**\n${data.chcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Create**\n${data.chdl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: ** Channel Delete**\n${data.chup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Update**\n${data.rlcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Create**\n${data.rldl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Delete**\n${data.rlup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Update**\n${data.meneve ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Mention** @everyone\n${data.mngweb ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Webhook Management**\n${data.mngstemo ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('mngweb')) {
                        data.mngweb = data.mngweb ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    client.util.embed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Powered by  Team Excel`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Ban**\n${data.kick ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Kick**\n${data.prune ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Prune**\n${data.botadd ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Bot Add**\n${data.serverup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Server Update\n${data.memup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: Member Role Update**\n${data.chcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Create**\n${data.chdl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: ** Channel Delete**\n${data.chup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Update**\n${data.rlcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Create**\n${data.rldl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Delete**\n${data.rlup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Update**\n${data.meneve ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Mention** @everyone\n${data.mngweb ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Webhook Management**\n${data.mngstemo ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    if (i.values.includes('mngstemo')) {
                        data.mngstemo = data.mngstemo ? false : true
                        if (msg)
                            msg.edit({
                                embeds: [
                                    client.util.embed()
                                        .setAuthor({
                                            name: message.guild.name,
                                            iconURL:
                                                message.guild.iconURL({
                                                    dynamic: true
                                                }) ||
                                                client.user.displayAvatarURL()
                                        })
                                        .setFooter({
                                            text: `Powered by  Team Excel`
                                        })
                                        .setColor(client.color)
                                        .setDescription(
                                            `${data.ban ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Ban**\n${data.kick ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Kick**\n${data.prune ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Prune**\n${data.botadd ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Bot Add**\n${data.serverup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Server Update\n${data.memup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: Member Role Update**\n${data.chcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Create**\n${data.chdl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: ** Channel Delete**\n${data.chup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Update**\n${data.rlcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Create**\n${data.rldl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Delete**\n${data.rlup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Update**\n${data.meneve ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Mention** @everyone\n${data.mngweb ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Webhook Management**\n${data.mngstemo ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Emojis & Stickers Management**`
                                        )
                                        .addFields(
                                            {
                                                name: `**Executor**`,
                                                value: `<@!${message.author.id}>`,
                                                inline: true
                                            },
                                            {
                                                name: `**Target**`,
                                                value: `<@!${member.id}>`,
                                                inline: true
                                            }
                                        )
                                        .setThumbnail(
                                            client.user.displayAvatarURL()
                                        )
                                ],
                                components: [row, row2]
                            })
                    }
                    let wls = []
                    const wl = await client.db?.get(
                        `${message.guild.id}_${member.id}_wl`
                    )
                    if (wl !== null)
                        if (wl.length > 0) {
                            wl.map((w) => wls.push(w))
                        }
                    wls.push(member.id)
                    let arr = [...new Set(wls)]
                    client.db?.set(`${message.guild.id}_${member.id}_wl`, arr)
                    menuSelect = menuSelect.setDisabled(true)
                    btn = btn.setDisabled(true)
                    const newRow = new ActionRowBuilder().addComponents([
                        menuSelect
                    ])
                    const newRow1 = new ActionRowBuilder().addComponents([btn])
                    if (msg)
                        msg.edit({
                            embeds: [
                                client.util.embed()
                                    .setAuthor({
                                        name: message.guild.name,
                                        iconURL:
                                            message.guild.iconURL({
                                                dynamic: true
                                            }) || client.user.displayAvatarURL()
                                    })
                                    .setFooter({
                                        text: `Powered by  Team Excel`
                                    })
                                    .setColor(client.color)
                                    .setDescription(
                                        `${data.ban ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Ban**\n${data.kick ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Kick**\n${data.prune ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Prune**\n${data.botadd ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Bot Add**\n${data.serverup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Server Update\n${data.memup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: Member Role Update**\n${data.chcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Create**\n${data.chdl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: ** Channel Delete**\n${data.chup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Channel Update**\n${data.rlcr ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Create**\n${data.rldl ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Delete**\n${data.rlup ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Role Update**\n${data.meneve ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Mention** @everyone\n${data.mngweb ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Webhook Management**\n${data.mngstemo ? '<:disableno:1374247961776885790><:enableyes:1374348506172493896> ' : '<:disableyes:1374248032014434335><:enableno:1374348498404769793> '}: **Emojis & Stickers Management**`
                                    )
                                    .addFields(
                                        {
                                            name: `**Executor**`,
                                            value: `<@!${message.author.id}>`,
                                            inline: true
                                        },
                                        {
                                            name: `**Target**`,
                                            value: `<@!${member.id}>`,
                                            inline: true
                                        }
                                    )
                                    .setThumbnail(
                                        client.user.displayAvatarURL()
                                    )
                            ],
                            components: [newRow, newRow1]
                        })
                    let wlls = []
                    const wll = await client.db?.get(
                        `${i.guild.id}_${member.id}_wl`
                    )
                    if (wll)
                        if (wll.length > 0) {
                            wll.map((w) => wlls.push(w))
                        }
                    wls.push(member.id)

                    let already = await client.db.get(
                        `${message.guild.id}_wl.whitelisted`,
                        member.id
                    )

                    if (already) {
                        await client.db.pull(
                            `${message.guild.id}_wl.whitelisted`,
                            member.id
                        )
                        await client.db.push(
                            `${message.guild.id}_wl.whitelisted`,
                            member.id
                        )
                    } else {
                        await client.db.push(
                            `${message.guild.id}_wl.whitelisted`,
                            member.id
                        )
                    }

                    return client.db?.set(
                        `${message.guild.id}_${member.id}_wl`,
                        data
                    )
                }
            })
        }
    }
}
