import { Telegraf } from 'telegraf';
import express from 'express';

// Telegram Bot setup
const bot = new Telegraf(process.env.BOT_TOKEN);
const CHAT_ID = process.env.CHAT_ID;

const app = express();
app.use(express.json());

// 🧩 Webhook endpoint
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

    // Временная отправка на Webhook.site вместо Telegram
    fetch('https://webhook.site/365510eb-9974-4b23-8247-1849b0f24e28', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
      .then(() => console.log('✅ Данные успешно отправлены на webhook.site!'))
      .catch((err) => console.error('❌ Ошибка при отправке на webhook.site:', err));
  } else {
    console.log('ℹ️ Payload не содержит action: order');
  }

  res.status(200).send('OK');
});

// ❌ Не запускаем bot.launch() — Render работает как HTTP сервер

// 👇 Port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});
