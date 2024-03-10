"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const TELEGRAM_BOT_API_TOKEN = process.env.TELEGRAM_BOT_API_TOKEN;
if (!TELEGRAM_BOT_API_TOKEN) {
    console.error("TELEGRAM_BOT_API_TOKEN is required");
    process.exit(1);
}
const bot = new grammy_1.Bot(TELEGRAM_BOT_API_TOKEN);
// Handle commands.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.command("help", (ctx) => ctx.reply("Help message should be here."));
// Handle other messages.
// bot.on("message", (ctx) => ctx.reply("Got another message!"));
bot.hears("spontan", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply("uhuyyy", {
        reply_parameters: { message_id: ctx.msg.message_id },
    });
}));
// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.
// Start the bot.
bot.start({ drop_pending_updates: true });
