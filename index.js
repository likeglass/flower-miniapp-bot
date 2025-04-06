import { Telegraf } from 'telegraf';
import express from 'express';

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHAT_ID = process.env.CHAT_ID;

const app = express();
app.use(express.json());

// 🧩 Кнопка MiniApp в Telegram
bot.telegram.setMyCommands([
  {
    command: 'start',
    description: 'Открыть мини-приложение',
  },
]);

bot.on('message', (ctx) => {
  return ctx.reply('Открыть Mini App', {
    reply_markup: {
      keyboard: [
        [
          {
            text: '🌸 Перейти в мини-приложение',
            web_app: {
              url: 'https://flower-miniapp-bot.onrender.com', // 🔁 ЗАМЕНИ на СВОЙ URL
            },
          },
        ],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
});

// 🔔 Webhook
app.post('/webhook', (req, res) => {
  const payload


// ❌ УДАЛИ bot.launch();
// Render ждёт, что твой сервер ответит по HTTP, а не по long-polling

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});
