const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'list',
    aliases: ['l'],
    subcommand: ['admin','mod','bot','inrole','booster','roles','noroles','muted','joinpos','bans'],
    category: 'mod',
    premium: false,
    run: async (client, message, args) => {
        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setDescription(
                            `You didn't provide the list type.\nList Options: \`admin\`,\`mod\`,\`bot\`,\`inrole\`,\`booster\`,\`noroles\`,\`roles\`,\`muted\`,\`joinpos\`,\`bans\``
                        )
                ]
            });
        }

        const require = args[0].toLowerCase();
        let membersList = [];
        let title = '';
        let index = 0;

        try {
            if (require === 'joinpos') {
                const members = await message.guild.members.fetch();
                const joinpos = members.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
                membersList = joinpos.map((member) => `${++index}. <@${member.id}> | ${member.id} | <t:${Math.floor(member.joinedTimestamp/1000)}:R>`);
                title = 'User Join Positions';
            }
            else if (require === 'muted') {
                const members = await message.guild.members.fetch();
                const muted = members.filter(member => member.isCommunicationDisabled());
                membersList = muted.map((member) => `${++index}. <@${member.id}> | ${member.id} | Ends <t:${Math.floor(member.communicationDisabledUntilTimestamp/1000)}:R>`);
                title = 'Muted Members';
            }
            else if (require === 'noroles') {
                const members = await message.guild.members.fetch();
                const noroles = members.filter(member => member.roles.cache.size <= 1); // <=1 to account for @everyone
                membersList = noroles.map((member) => `${++index}. <@${member.id}> | ${member.id}`);
                title = 'Members Without Roles';
            }
            else if (require === 'roles') {
                const roles = message.guild.roles.cache
                    .filter(role => role.name !== '@everyone')
                    .sort((a, b) => b.position - a.position);
                membersList = roles.map((role) => `${++index}. <@&${role.id}> | ${role.id} | ${role.members.size} members`);
                title = 'Roles in the Server';
            }
            else if (require === 'admin') {
                const members = await message.guild.members.fetch();
                const admin = members.filter(member => member.permissions.has('Administrator'));
                membersList = admin.map((member) => `${++index}. <@${member.id}> | ${member.id}`);
                title = 'Admins in the Server';
            }
            else if (require === 'mod') {
                const members = await message.guild.members.fetch();
                const mod = members.filter(member =>
                    member.permissions.has('KickMembers') &&
                    member.permissions.has('ManageMessages') &&
                    member.permissions.has('ManageRoles') &&
                    member.permissions.has('ModerateMembers')
                );
                membersList = mod.map((member) => `${++index}. <@${member.id}> | ${member.id}`);
                title = 'Moderators in the Server';
            }
            else if (require === 'bot') {
                const members = await message.guild.members.fetch();
                const bot = members.filter(member => member.user.bot);
                membersList = bot.map((member) => `${++index}. <@${member.id}> | ${member.id}`);
                title = 'Bots in the Server';
            }
            else if (require === 'inrole') {
                if (!args[1]) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(`${client.emoji.cross} | Please provide a role mention or ID.`)
                        ]
                    });
                }

                const role = message.mentions.roles.first() || 
                            message.guild.roles.cache.get(args[1]) || 
                            await message.guild.roles.fetch(args[1]).catch(() => null);

                if (!role) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(`${client.emoji.cross} | Role not found.`)
                        ]
                    });
                }

                const members = await message.guild.members.fetch();
                const inrole = members.filter(member => member.roles.cache.has(role.id));
                membersList = inrole.map((member) => `${++index}. <@${member.id}> | ${member.id}`);
                title = `Members with ${role.name} Role (${inrole.size})`;
            }
            else if (require === 'booster') {
                const boosterRole = message.guild.roles.premiumSubscriberRole;
                if (!boosterRole) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(`${client.emoji.cross} | This server has no boosters.`)
                        ]
                    });
                }
                
                const members = await message.guild.members.fetch();
                const boosters = members.filter(member => member.roles.cache.has(boosterRole.id));
                membersList = boosters.map((member) => `${++index}. <@${member.id}> | ${member.id}`);
                title = 'Server Boosters';
            }
            else if (require === 'bans') {
                const bans = await message.guild.bans.fetch().catch(() => new Map());
                if (bans.size === 0) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(`${client.emoji.cross} | No users are banned.`)
                        ]
                    });
                }
                membersList = Array.from(bans.values()).map((ban) => 
                    `${++index}. [${ban.user.tag}](https://discord.com/users/${ban.user.id}) | ${ban.user.id}`
                );
                title = `Banned Members (${bans.size})`;
            }
            else {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.cross} | Invalid list type provided.`)
                    ]
                });
            }

            if (membersList.length === 0) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.cross} | No members found matching the criteria.`)
                    ]
                });
            }

            // Call the pagination function
            if (client.util?.ExcelPagination) {
                client.util.ExcelPagination(membersList, title, client, message);
            } else {
                // Fallback if pagination isn't available
                const firstPage = membersList.slice(0, 10).join('\n');
                message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color)
                            .setTitle(title)
                            .setDescription(firstPage)
                            .setFooter({ text: `Showing 1-10 of ${membersList.length} items` })
                    ]
                });
            }
        } catch (error) {
            console.error('Error in list command:', error);
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor('#FF0000')
                        .setDescription(`${client.emoji.cross} | An error occurred while processing the list.`)
                ]
            });
        }
    }
};