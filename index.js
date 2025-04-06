import { Telegraf } from 'telegraf';
import express from 'express';

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHAT_ID = process.env.CHAT_ID;

const app = express();
app.use(express.json());

// 🧩 Команда /start и кнопка Mini App
bot.telegram.setMyCommands([
  {
    command: 'start',
    description: 'Открыть мини-приложение',
  },
]);

bot.start((ctx) => {
  ctx.reply('Открыть мини-приложение:', {
    reply_markup: {
      keyboard: [
        [
          {
            text: '🌸 Перейти в Mini App',
            web_app: {
              url: 'https://flower-miniapp-bot.onrender.com', // 👈 твой URL
            },
          },
        ],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  });
});

// 🔔 Webhook
app.post('/webhook', (req, res) => {
  const payload = req.body;

  console.log('📩 Webhook получен:', JSON.stringify(payload, null, 2));

  if (payload?.action === 'order') {
    const { product, customer, city } = payload;

    const message = `🌸 Новый заказ из Mini App:

🏙 Город: ${city}
🌺 Букет: ${product.title}
💲 Цена: ${product.price}

👤 Имя: ${customer.name}
☎️ Телефон: ${customer.phone}
📍 Адрес: ${customer.address}`;

    bot.telegram.sendMessage(CHAT_ID, message)
      .then(() => console.log('✅ Сообщение отправлено!'))
      .catch((err) => console.error('❌ Ошибка отправки:', err));
  }

  res.status(200).send('OK');
});

// Запуск сервера (без bot.launch!)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});
