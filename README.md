# BRIGADABOT

Прекрасный, незабываемый, универсальный бот для ламповых бригадных посиделок в дискордике UwU

### Как эту хуйню-то запустить бля
* [Необходимые штуки](#requirements)
* [Начало](#getting-started)
* [Команды бота](#features--commands)

### Необходимые штуки
- [Node](https://nodejs.org/en/) - Версия 16 или дальше (в бою работает под 18)
- [NPM](https://www.npmjs.com/)
- [FFMPEG](https://www.ffmpeg.org/)

### Начало
Для начала стоит установть все, что нужно для работы этого куска кода


### Установка
```bash
# Клонирование репозитория
git clone https://github.com/maximmc/brigadabot.git

# Переход в папку репозитория
cd brigadabot/

# Установка зависимостей
npm install

# Конфигурирование токена для бота (он есть только у меня ха-ха хе-хе)
 echo "DISCORD_TOKEN='СЮДА НАДО ТОКЕН ЕБАНУТЬ'" > .env
```
# Необходимые разрешения
У бота должен быть скоуп `applications.commands`. Также надо выбрать в настройках бота `Server Members Intent` и `Message Content Intent`
Также стоит дать разрешения:
`Read Messages/View Channels`, 
`Send Messages`, 
`Read Message History` , 
`Use Slash Commaands`,
`Connect`,
`Speak`

# Запуск приложения
```bash
node index.js
```
