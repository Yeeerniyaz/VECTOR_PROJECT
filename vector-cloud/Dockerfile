FROM node:18-alpine

# Рабочая папка внутри контейнера
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем библиотеки
RUN npm install --production

# Копируем весь исходный код папки vector-cloud
COPY . .

# Открываем порт
EXPOSE 5000

# Команда запуска
CMD ["node", "server.js"]