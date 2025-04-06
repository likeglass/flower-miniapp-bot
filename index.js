import { Telegraf } from 'telegraf';
import express from 'express';

const bot = new Telegraf('7879654087:AAEuXQw6_7Dk06zoQ1std1UFDz2ZjOMGhDM');
const CHAT_ID = '992675620';

const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  const payload = req.body;

  if (payload?.action === 'order') {
    const { product, customer, city } = payload;

    const message = `🌸 Новый заказ из Mini App:

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

// Выше уже нужно использовать process.env.PORT
const PORT = process.env.PORT || 3000;  // Используем переменную окружения PORT, если она есть
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

bot.launch();
