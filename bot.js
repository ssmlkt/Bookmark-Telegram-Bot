const { Bot } = require("grammy");
// const { Menu } = require("@grammyjs/menu");

const bot = new Bot("");

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