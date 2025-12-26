const { Client, GatewayIntentBits, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

// ⚠️ Une seule déclaration du client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const WEBHOOK_URL = process.env.WEBHOOK_URL;

client.once("ready", async () => {
  console.log(`✅ Bot connecté : ${client.user.tag}`);

  // Enregistrement de la commande slash
  const command = new SlashCommandBuilder()
    .setName("partage")
    .setDescription("Partager un lien via le webhook")
    .addStringOption(option =>
      option.setName("lien")
        .setDescription("Lien Spotify / YouTube / SoundCloud")
        .setRequired(true)
    );

  await client.application.commands.set([command]);
  console.log("✅ Commande /partage enregistrée");
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "partage") {
    const lien = interaction.options.getString("lien");

    try {
      // Réponse immédiate pour éviter "délai dépassé"
      await interaction.reply({ content: "⏳ Envoi de la musique...", ephemeral: true });

      // Envoi du message au webhook
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: `🎵 Musique partagée : ${lien}` })
      });

      // Mise à jour du message initial
      await interaction.editReply({ content: "✅ Musique envoyée via le webhook !" });

    } catch (err) {
      console.error(err);
      await interaction.editReply({ content: "❌ Erreur lors de l’envoi. Vérifie ton webhook !" });
    }
  }
});

client.login(process.env.TOKEN);
