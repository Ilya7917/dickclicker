import { skins } from '@/components/skins/skinBase';
import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    account: {
      yourBalance: "Your balance",
      youDontHaveEnough: "You don't have enough coins to buy this",
      yourDonateBalance: "Your donate balance"
    },
    slots: {
      bottom: 'Slots',
    },
    referrals: {
      title: "Referrals",
      subtitle: "Your friends register using a personal link, you get 50% of the coins they earn",
      message: "Yo, check out new Notcoin!",
      button: "Invite friends",
    },
    bottomMenu: {
      top: "Top",
      earn: "Tasks",
      skins: "Skins",
      posts: "Posts",
      boosts: "Boosts",
      referrals: "Referrals",
      market: 'Market',
      tasks: 'Tasks'
    },
    top: {
      day: "Day",
      topToday: "Top growth today",
      month: "Month",
      topMonth: "Top growth this month",
      balance: "Balance",
      topBalance: "Top users by balance",
      yourPlace: "Your place is {place}"
    },
    earn: {
      name: "Tasks",
      channels: "Channels",
      rewardReached: "Reward reached",
      selectedChannel: `Subscribe to the channel and get`,
      startRewardButton: "Start",
      waitRewardText: "Wait 1 hours for moderation check to claim the prize.",
      getRewardButton: "Claim",
      notEnoughTime: "Give us 1 hour, the task is still being reviewed"
    },
    whales: {
      channels: "Whales",
    },
    boosts: {
      level: "level",
      maxLevelShort: "max",
      upgrade: "Upgrade",
      buy: "Buy",
      open: "Open",
      available: "Available",
      multitap: {
        name: "Multitap",
        description: "Increase amount of coins you can earn per one tap",
        nextLevelSpec: "+1 per tap for each level.",
      },
      energy: {
        name: "Energy Recharging",
        description: "Increase the energy recharging speed. Max level is 4",
        nextLevelSpec: "+1 / sec for each level.",
      },
      maxEnergy: {
        name: "Energy Capacity",
        description: 'Increase your energy limit, so you can mine more per session',
        nextLevelSpec: "+500 energy points for each level.",
      },
      dailyLootbox: {
        name: "Daily Lootbox",
        description: "One of the listed gifts",
        nextLevelSpec: {
          balance: "🪙 from 500 to 5000",
          energy: "⚡️ from 1000 to full"
        },
      },
      autoFarmer: {
        name: 'Auto Farmer',
        description: 'One of the listed gifts',
        nextLevelSpec: {
          value: "Mining value = Energy Recharning level.",
          max: "Maxium 12 hours"
        },
      }
    }
  },
  ru: {
    account: {
      yourBalance: "Ваш баланс",
      youDontHaveEnough: "У вас недостаточно монет для покупки этого",
      yourDonateBalance: "Ваш донатный баланс"
    },
    slots: {
      bottom: 'Слоты',
    },
    referrals: {
      title: "Рефералы",
      subtitle: "Твои друзья регистрируются по персональной ссылке, ты получаешь 50% от заработанных ими монет",
      message: "Скорее залетай в новый ноткоин!",
      button: "Пригласить друзей",
    },
    bottomMenu: {
      top: "Статистика",
      earn: "Задачи",
      skins: "Скины",
      posts: "Посты",
      boosts: "Бустеры",
      referrals: "Рефералы",
      market: 'Маркет',
      tasks: 'Задачи'
    },
    top: {
      day: "День",
      topToday: "Лучший рост сегодня",
      month: "Месяц",
      topMonth: "Лучший рост в этом месяце",
      balance: "Баланс",
      topBalance: "Лучшие пользователи по балансу",
      yourPlace: "Ваше место {place}"
    },
    earn: {
      name: "Задачи",
      channels: "Каналы",
      rewardReached: "Получено",
      selectedChannel: `Подпишитесь на канал и получите`,
      startRewardButton: "Начать",
      waitRewardText: "Подождите 1 час, пока пройдет проверка модерации, чтобы получить приз.",
      getRewardButton: "Получить",
      notEnoughTime: "Дайте нам 1 час, задание ещё на проверке"
    },
    whales: {
      channels: "Киты",
    },
    boosts: {
      level: "уровень",
      maxLevelShort: "макс",
      upgrade: "Улучшить",
      buy: "Купить",
      open: "Открыть",
      available: "Доступно",
      multitap: {
        name: "Мультитап",
        description: "Увеличивает количество монет, которые вы можете заработать за одно нажатие",
        nextLevelSpec: "+1 за нажатие на каждом уровне."
      },
      energy: {
        name: "Восстановление энергии",
        description: "Увеличивает скорость восстановления энергии. Максимальный уровень - 4",
        nextLevelSpec: "+1 / сек на каждом уровне."
      },
      maxEnergy: {
        name: "Емкость энергии",
        description: "Увеличивает лимит вашей энергии, позволяя добывать больше за сессию",
        nextLevelSpec: "+500 очков энергии на каждом уровне."
      },
      dailyLootbox: {
        name: "Ежедневный лутбокс",
        description: "Один из перечисленных подарков",
        nextLevelSpec: {
          balance: "🪙 от 500 до 5000",
          energy: "⚡️ от 1000 до полного"
        }
      },
      autoFarmer: {
        name: "Авто Фармер",
        description: "Один из перечисленных подарков",
        nextLevelSpec: {
          value: "Значение добычи = уровень восстановления энергии.",
          max: "Максимум 12 часов"
        }
      }
    }
  },
  uk: {
    account: {
      yourBalance: "Ваш баланс",
      youDontHaveEnough: "У вас недостатньо монет для покупки цього",
    },
    referrals: {
      title: "Рефералы",
      subtitle: "Твои друзья регистрируются по персональной ссылке, ты получаешь 50% от заработанных ими монет",
      message: "Скорее залетай в новый ноткоин!",
      button: "Пригласить друзей",
    },
    bottomMenu: {
      top: "Топ",
      earn: "Заробити",
      boosts: "Підсилення",
      referrals: "Рефералы"
    },
    top: {
      day: "День",
      topToday: "Найкращий приріст сьогодні",
      month: "Місяць",
      topMonth: "Найкращий приріст цього місяця",
      balance: "Баланс",
      topBalance: "Топ користувачів за балансом",
      yourPlace: "Ваше місце {place}"
    },
    earn: {
      name: "Заробіток",
      channels: "Канали",
      rewardReached: "Отримано",
    },
    boosts: {
      level: "рівень",
      maxLevelShort: "макс",
      upgrade: "Оновити",
      buy: "Купити",
      open: "Відкрити",
      available: "Доступно",
      multitap: {
        name: "Мультитап",
        description: "Збільшує кількість монет, які ви можете заробити за один дотик",
        nextLevelSpec: "+1 за дотик на кожному рівні."
      },
      energy: {
        name: "Відновлення енергії",
        description: "Збільшує швидкість відновлення енергії. Максимальний рівень - 4",
        nextLevelSpec: "+1 / сек на кожному рівні."
      },
      maxEnergy: {
        name: "Ємність енергії",
        description: "Збільшує ваш ліміт енергії, дозволяючи видобувати більше за сесію",
        nextLevelSpec: "+500 одиниць енергії на кожному рівні."
      },
      dailyLootbox: {
        name: "Щоденний лутбокс",
        description: "Один з перелічених подарунків",
        nextLevelSpec: {
          balance: "🪙 від 500 до 5000",
          energy: "⚡️ від 1000 до повного"
        }
      },
      autoFarmer: {
        name: "Авто Фармер",
        description: "Один з перелічених подарунків",
        nextLevelSpec: {
          value: "Розмір видобутку = рівень відновлення енергії.",
          max: "Максимум 12 годин"
        }
      }
    }
  }
};

const i18n = createI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
});

export default i18n;