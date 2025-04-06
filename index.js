import { Telegraf } from 'telegraf';
import express from 'express';

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHAT_ID = process.env.CHAT_ID;

const app = express();
app.use(express.json());

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
  

// ❌ УДАЛИ bot.launch();
// Render ждёт, что твой сервер ответит по HTTP, а не по long-polling

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на порту ${PORT}`);
});
