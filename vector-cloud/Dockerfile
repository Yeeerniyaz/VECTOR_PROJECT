# Используем легкий Node.js
FROM node:18-alpine

# Создаем папку внутри контейнера
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Ставим библиотеки
RUN npm install

# Копируем остальной код
COPY . .

# Открываем порт
EXPOSE 5000

# Запускаем сервер
CMD ["node", "server.js"]