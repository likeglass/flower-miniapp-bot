import express from 'express';
import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHAT_ID = process.env.CHAT_ID;

const app = express();
app.use(express.json());

// 📦 Добавь это 👇
app.use(express.static('public'));

// Webhook
app.post('/webhook', (req, res) => {
  const payload = req.body;

  if (payload?.action === 'order') {
    const { product, customer, city } = payload;

    const message = `🌸 Новый заказ:
🏙 Город: ${city}
🌺 Букет: ${product.title}
💲 Цена: ${product.price}
👤 Имя: ${customer.name}
☎️ Телефон: ${customer.phone}
📍 Адрес: ${customer.address}`;

    bot.telegram.sendMessage(CHAT_ID, message);
  }

  res.status(200).send('OK');
});

// Команда start для Telegram
bot.start((ctx) => {
  ctx.reply('Открыть мини-приложение:', {
    reply_markup: {
      keyboard: [
        [
          {
            text: '🌸 Перейти в Mini App',
            web_app: {
              url: 'https://flower-miniapp-bot.onrender.com',
            },
          },
        ],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});
