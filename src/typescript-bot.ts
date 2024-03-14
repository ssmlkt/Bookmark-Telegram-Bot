import { Bot } from "grammy";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
dotenv.config();

const TELEGRAM_BOT_API_TOKEN = process.env.TELEGRAM_BOT_API_TOKEN;
if (!TELEGRAM_BOT_API_TOKEN) {
  console.error("TELEGRAM_BOT_API_TOKEN is required");
  process.exit(1);
}

const bot = new Bot(TELEGRAM_BOT_API_TOKEN);
let action = "gatau";
console.log("Bot is running!");
const prismaClient = new PrismaClient({
  errorFormat: "pretty",
  log: ["info", "warn", "error", "query"],
});
const user = async (chat: any) => {
  const fetch = await prismaClient.user.findUnique({
    where: {
      id: chat,
    },
  });
  return fetch;
};
const updateAction = async (create: any, chat: any) => {
  return await prismaClient.user.update({
    data: {
      create: create,
    },
    where: {
      id: chat,
    },
  });
};
// Handle commands.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.command("help", (ctx) => ctx.reply("Help message should be here."));

//create
bot.command("create", async (ctx) => {
  console.log("msg: " + JSON.stringify(ctx.msg.chat.id));
  const fetchUser = await user(ctx.update.message?.from.id);
  if (fetchUser == null && ctx.update.message?.from.id !== undefined) {
    await prismaClient.user.create({
      data: {
        id: ctx.update.message?.from.id,
        create: true,
      },
    });
  } else if (fetchUser) {
    if (!fetchUser.create) {
      const update = await updateAction(true, ctx.update.message?.from.id);
      console.log(update);
    }
  }
  ctx.reply("type the todo name, type /cancel to cancel");
  action = "create";
});
//cancel
bot.command("cancel", async (ctx) => {
  action = "gatau";
  const fetchUser = await user(ctx.update.message?.from.id);
  if (fetchUser) {
    const update = await updateAction(false, ctx.update.message?.from.id);
    console.log(update);
    ctx.reply("okay nevermind", {
      reply_parameters: { message_id: ctx.msg.message_id },
    });
  } else {
    ctx.reply("mksd", {
      reply_parameters: { message_id: ctx.msg.message_id },
    });
  }
});
// updateTodos
bot.command("updateTodos", async (ctx) => {
  const fetchUser = await user(ctx.update.message?.from.id);
  console.log(fetchUser);
  if (fetchUser) {
    const posts = await prismaClient.post.findMany({
      where: {
        user_id: ctx.update.message?.from.id,
      },
    });
    if (posts.length > 0) {
      ctx.reply(
        "here's the todos\n" +
          posts
            .map(
              (post, index) =>
                `${index + 1}. ${post.chat} ${post.todo ? "✅" : "❌"}`
            )
            .join("\n") +
          "\ntype the id you want to update. type /cancel to cancel."
      );
      action = "update";
    } else {
      ctx.reply("no todo");
    }
  }
});
// deleteTodos
bot.command("deleteTodos", async (ctx) => {
  const fetchUser = await user(ctx.update.message?.from.id);
  console.log(fetchUser);
  if (fetchUser) {
    const posts = await prismaClient.post.findMany({
      where: {
        user_id: ctx.update.message?.from.id,
      },
    });
    if (posts.length > 0) {
      ctx.reply(
        "here's the todos\n" +
          posts
            .map(
              (post, index) =>
                `${index + 1}. ${post.chat} ${post.todo ? "✅" : "❌"}`
            )
            .join("\n") +
          "\ntype the id you want to delete. type /cancel to cancel."
      );
      action = "delete";
    } else {
      ctx.reply("no todo");
    }
  } else {
    ctx.reply("type the todo name, type /cancel to cancel");
  }
});
// TODOS
bot.command("todos", async (ctx) => {
  const fetchUser = await user(ctx.update.message?.from.id);
  if (fetchUser) {
    const posts = await prismaClient.post.findMany({
      where: {
        user_id: ctx.update.message?.from.id,
      },
    });
    if (posts.length > 0) {
      ctx.reply(
        "here's the todos\n" +
          posts
            .map(
              (post, index) =>
                `${index + 1}. ${post.chat} ${post.todo ? "✅" : "❌"}`
            )
            .join("\n")
      );
    } else {
      ctx.reply("no todo");
    }
  } else {
    ctx.reply("type the todo name, type /cancel to cancel");
  }
});
// Handle other messages.
bot.hears("spontan", async (ctx) => {
  await ctx.reply(`uhuyyy ${action}`, {
    reply_parameters: { message_id: ctx.msg.message_id },
  });
  action = "ngapain";
});
bot.on("message", async (ctx) => {
  const fetchUser = await user(ctx.update.message?.from.id);
  console.log(fetchUser);
  if (action == "update") {
    const posts = await prismaClient.post.findMany({
      where: {
        user_id: ctx.update.message?.from.id,
      },
    });
    if (ctx.msg.text !== undefined) {
      console.log(typeof parseInt(ctx.msg?.text), ctx.msg?.text);
      await prismaClient.post.update({
        where: {
          id: posts[parseInt(ctx.msg?.text) - 1].id,
        },
        data: {
          todo: !posts[parseInt(ctx.msg?.text) - 1].todo,
        },
      });
    }
    const newPosts = await prismaClient.post.findMany({
      where: {
        user_id: ctx.update.message?.from.id,
      },
    });
    ctx.reply(
      "here's the todos\n" +
        newPosts
          .map(
            (post, index) =>
              `${index + 1}. ${post.chat} ${post.todo ? "✅" : "❌"}`
          )
          .join("\n")
    );
    action = "gatau";
  } else if (action == "delete") {
    const posts = await prismaClient.post.findMany({
      where: {
        user_id: ctx.update.message?.from.id,
      },
    });
    if (ctx.msg.text !== undefined && parseInt(ctx.msg?.text) <= posts.length) {
      const posting = posts[parseInt(ctx.msg?.text) - 1].id;
      await prismaClient.post.delete({
        where: {
          id: posting,
        },
      });
    }
    const newPosts = await prismaClient.post.findMany({
      where: {
        user_id: ctx.update.message?.from.id,
      },
    });
    if (newPosts.length > 0) {
      ctx.reply(
        "here's the todos\n" +
          newPosts
            .map(
              (post, index) =>
                `${index + 1}. ${post.chat} ${post.todo ? "✅" : "❌"}`
            )
            .join("\n")
      );
    } else {
      ctx.reply("empty");
    }
    action = "gatau";
  } else if (action == "create") {
    await prismaClient.post.create({
      data: {
        user_id: ctx.update.message?.from.id,
        chat: `${ctx.msg.text}`,
        todo: false,
      },
    });
    ctx.reply(`todo saved`, {
      reply_parameters: { message_id: ctx.msg.message_id },
    });
    action = "gatau";
  } else {
    ctx.reply("/create /todos /updateTodos /deleteTodos /cancel");
  }
});

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start({ drop_pending_updates: true });
