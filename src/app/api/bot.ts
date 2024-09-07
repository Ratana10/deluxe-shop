import { NextApiRequest, NextApiResponse } from 'next';
import { Telegraf } from 'telegraf';

const BOT_TOKEN = process.env.BOT_BOT_TOKEN;

if(!BOT_TOKEN){
  throw new Error('TELEGRAM_BOT_TOKEN is required');
 }

const bot = new Telegraf(BOT_TOKEN);

// Define bot commands

bot.start((ctx) => ctx.reply('Welcome to the Deluxe Store Bot!'));
bot.help((ctx) =>
  ctx.reply('You can ask about products, services, or anything else.')
);

