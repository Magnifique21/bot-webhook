const ROLES_AUTORISES = [
  "1443386649777012736" // Admin
];
require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes
} = require("discord.js");

// -------- CONFIG --------
const TOKEN = process.env.TOKEN;

// IDs des rôles autorisés
const ROLES_AUTORISES = [
  "ID_DU_ROLE_ICI"
];
// ------------------------

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// -------- COMMANDE SLASH --------
const command = new SlashCommandBuilder()
  .setName("dire")
  .setDescription("Faire parler le bot")
  .addStringOption(option =>
    option
      .setName("message")
      .setDescription("Message à envoyer")
      .setRequired(true)
  );

// -------- ENREGISTREMENT --------
client.once("ready", async () => {
  console.log(`✅ Bot connecté : ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  await rest.put(
    Routes.applicationCommands(client.user.id),
    { body: [command.toJSON()] }
  );

  console.log("✅ Commande /dire enregistrée");
});

// -------- GESTION --------
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== "dire") return;

  // Vérification des rôles
  const rolesUtilisateur = interaction.member.roles.cache.map(r => r.id);
  const autorise = ROLES_AUTORISES.some(role =>
    rolesUtilisateur.includes(role)
  );

  if (!autorise) {
    return interaction.reply({
      content: "❌ Tu n’as pas la permission d’utiliser cette commande.",
      ephemeral: true
    });
  }

  const message = interaction.options.getString("message");

  try {
    // Le BOT parle
    await interaction.channel.send(message);

    await interaction.reply({
      content: "✅ Message envoyé par le bot",
      ephemeral: true
    });

  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "❌ Erreur lors de l’envoi du message",
      ephemeral: true
    });
  }
});

client.login(TOKEN);