const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel]
});

const prefix = '?';

client.once('ready', () => {
  console.log(`✅ บอท ${client.user.tag} พร้อมทำงานแล้ว!`);
});

// =======================================================
// 🧹 ลบข้อความ
// =======================================================
client.on('messageCreate', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'clear' || command === 'delete') {
    if (!message.member.permissions.has('ManageMessages'))
      return message.reply('❌ คุณไม่มีสิทธิ์จัดการข้อความ');

    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100)
      return message.reply('⚠️ โปรดระบุจำนวนระหว่าง 1 ถึง 100');

    await message.channel.bulkDelete(amount, true);
    message.channel.send(`✅ ลบข้อความ ${amount} ข้อความแล้ว`);
  }
});

// =======================================================
// 🏷️ ให้ยศ / ลบยศ
// =======================================================
client.on('messageCreate', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === '?ให้ยศ') {
    if (!message.member.permissions.has('ManageRoles'))
      return message.reply('❌ คุณไม่มีสิทธิ์จัดการยศ');

    const member = message.mentions.members.first();
    const roles = message.mentions.roles;

    if (!member) return message.reply('❗ โปรดแท็กผู้ใช้ที่จะให้ยศ');
    if (roles.size === 0) return message.reply('❗ โปรดแท็กยศที่ต้องการให้');

    roles.forEach(role => member.roles.add(role)
      .then(() => message.channel.send(`✅ เพิ่มยศ ${role.name} ให้กับ ${member.user.tag}`))
      .catch(() => message.channel.send(`⚠️ ไม่สามารถเพิ่มยศ ${role.name}`)));
  }

  if (command === '?ลบยศ') {
    if (!message.member.permissions.has('ManageRoles'))
      return message.reply('❌ คุณไม่มีสิทธิ์จัดการยศ');

    const member = message.mentions.members.first();
    const roles = message.mentions.roles;

    if (!member) return message.reply('❗ โปรดแท็กผู้ใช้ที่จะลบยศ');
    if (roles.size === 0) return message.reply('❗ โปรดแท็กยศที่ต้องการลบ');

    roles.forEach(role => member.roles.remove(role)
      .then(() => message.channel.send(`✅ ลบยศ ${role.name} จาก ${member.user.tag}`))
      .catch(() => message.channel.send(`⚠️ ไม่สามารถลบยศ ${role.name}`)));
  }
});

// =======================================================
// 🔑 เข้าระบบ (Token จาก Render)
// =======================================================
client.login(process.env.TOKEN);
