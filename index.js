import { Telegraf } from 'telegraf';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Переменные окружения (настроены в Render)
const bot = new Telegraf(process.env.BOT_TOKEN);
const CHAT_ID = process.env.CHAT_ID;

// Express сервер
const app = express();
app.use(express.json());

// 📁 Раздаём статику (например, index.html и стили)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// 🔔 Webhook — при заказе
app.post('/webhook', (req, res) => {
  const payload = req.body;

  console.log('📩 Webhook получен. Payload:', JSON.stringify(payload, null, 2));

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
      .then(() => console.log('✅ Сообщение отправлено в Telegram!'))
      .catch((err) => console.error('❌ Ошибка отправки сообщения:', err));
  } else {
    console.log('ℹ️ Получен payload без действия order');
  }

  res.status(200).send('OK');
});

// 🧩 Кнопка запуска Mini App
bot.telegram.setMyCommands([
  {
    command: 'start',
    description: 'Открыть мини-приложение',
  },
]);

// Когда пользователь пишет боту
bot.on('message', (ctx) => {
  return ctx.reply('Открыть Mini App:', {
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

// 🟢 Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});
