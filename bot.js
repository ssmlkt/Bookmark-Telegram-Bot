const dotenv = require("dotenv");
const { Bot } = require("grammy");
// const { Menu } = require("@grammyjs/menu");

dotenv.config();

const TELEGRAM_BOT_API_TOKEN = process.env.TELEGRAM_BOT_API_TOKEN;
if (!TELEGRAM_BOT_API_TOKEN) {
    console.error("TELEGRAM_BOT_API_TOKEN is required");
    process.exit(1);
}

const bot = new Bot(TELEGRAM_BOT_API_TOKEN);

// Handle commands.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.command("help", (ctx) => ctx.reply("Help message should be here."));

// Handle other messages.
// bot.on("message", (ctx) => ctx.reply("Got another message!"));
bot.hears("spontan", async (ctx) => {
    await ctx.reply("uhuyyy", {
        reply_parameters: {message_id: ctx.msg.message_id},
    });
});

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start({drop_pending_updates: true});