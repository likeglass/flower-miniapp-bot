import { Telegraf } from 'telegraf';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// 👇 нужно для корректного path.resolve в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHAT_ID = process.env.CHAT_ID;

const app = express();
app.use(express.json());

// 📦 Раздача фронта из public
app.use(express.static(path.join(__dirname, 'public')));

// 🔔 Webhook
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

    fetch('https://webhook.site/365510eb-9974-4b23-8247-1849b0f24e28', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
      .then(() => console.log('✅ Данные успешно отправлены на webhook.site!'))
      .catch((err) => console.error('❌ Ошибка при отправке на webhook.site:', err));
  }

  res.status(200).send('OK');
});

// ✅ Отдача index.html по GET /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});
