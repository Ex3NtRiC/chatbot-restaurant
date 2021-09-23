import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Keywords } from './keywords.service';
import { Category, Menu } from './menu.model';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Menu') private readonly menuModel: Model<Menu>,
    private readonly keywords: Keywords,
  ) {}

  async request(message: string) {
    let response = '';
    message = message.toLowerCase().trim();

    // Checking for abilities
    const ability = this.contains(message, this.keywords.getAbilities());
    if (ability) {
      response =
        '1- Show the menu 2- Show different kind of foods 3- details about meals';
      return { response };
    }

    // Checking for menu and categories
    const menu = this.contains(message, this.keywords.getShowMenu());
    const mainCategory = this.contains(
      message,
      this.keywords.getCategoryMain(),
    );
    const dessertCategory = this.contains(
      message,
      this.keywords.getCategoryDessert(),
    );
    const drinksCategory = this.contains(
      message,
      this.keywords.getCategoryDrinks(),
    );
    if (mainCategory) {
      const res = await this.getFromCategory(Category.C_Main);
      response = this.arrayToString(res);
      return { response };
    }
    if (dessertCategory) {
      const res = await this.getFromCategory(Category.C_Dessert);
      response = this.arrayToString(res);
      return { response };
    }
    if (drinksCategory) {
      const res = await this.getFromCategory(Category.C_Drink);
      response = this.arrayToString(res);
      return { response };
    }
    if (menu) {
      const res = await this.getMenu();
      response = this.arrayToString(res);
      return { response };
    }

    // Checking for Name & Greetings & How are you & if message is empty!
    const name = this.contains(message, this.keywords.getName());
    const greeting = this.contains(message, this.keywords.getWelcome());
    const mood = this.contains(message, this.keywords.getMood());
    // console.log(name, greeting, mood);
    if (greeting) {
      response += greeting;
      if (!name && !mood) {
        response += ', Robert at your service, ask me what can I do!';
      }
    }
    if (name || !message.replace(/\s/g, '').length) {
      if (greeting) {
        response += ', ' + name;
      } else {
        response += name;
      }
      if (mood) {
        response += ' ' + this.randomFeeling();
      } else {
        response += ' at your service, ask me what can I do!';
      }
    }
    if (mood && !name) {
      if (greeting) {
        response += ', Robert ' + this.randomFeeling();
      } else {
        response = 'Robert ' + this.randomFeeling();
      }
    }
    if (!response) {
      response = `Sorry I don't know, I'm still learning :)`;
    }

    return { response };
  }

  private contains = (s: string, array: string[]): string => {
    for (let i = 0; i < array.length; i++) {
      const name = array[i].toLowerCase();
      const regex = new RegExp(
        '(?:^|[\\s.,?!])' + name + '(?:$|[\\s.,?!])',
        'i',
      );
      const match = s.match(regex);
      if (match !== null) {
        return array[i];
      }
    }
    return null;
  };

  private randomFeeling(): string {
    const hour = new Date().getHours();
    let luck;
    if (hour > 19 || hour <= 6) {
      luck = 5;
    } else if (hour > 6 || hour <= 11) {
      luck = 3;
    } else if (hour > 11 || hour <= 19) {
      luck = 1;
    }
    const random = Math.random();
    const randomNumber = Math.floor(random * 10 * luck);
    if (randomNumber > 46) {
      return this.keywords.getSuperFeelings()[
        Math.floor(Math.random() * this.keywords.getSuperFeelings().length)
      ];
    } else if (randomNumber > 20) {
      return this.keywords.getGoodFeelings()[
        Math.floor(Math.random() * this.keywords.getGoodFeelings().length)
      ];
    } else if (randomNumber > 5) {
      return this.keywords.getNeutralFeelings()[
        Math.floor(Math.random() * this.keywords.getNeutralFeelings().length)
      ];
    } else {
      return this.keywords.getBadFeelings()[
        Math.floor(Math.random() * this.keywords.getBadFeelings().length)
      ];
    }
  }

  arrayToString(array: any[]): string {
    let result = '';
    for (let i = 0; i < array.length; i++) {
      result +=
        'name: ' +
        array[i].name +
        ', price: ' +
        array[i].price +
        ', description: ' +
        array[i].description +
        '\n';
    }
    return result;
  }

  async getMenu(): Promise<Menu[]> {
    const menu = await this.menuModel.find();
    // console.log(menu);
    return menu;
  }

  private async getFromCategory(category: Category): Promise<Menu[]> {
    const food = await this.menuModel.find({ category });
    return food;
  }

  private async getFromName(name: string): Promise<Menu[]> {
    const food = await this.menuModel.find({ name });
    return food;
  }

  private async getFromMaxPrice(price: number): Promise<Menu[]> {
    const food = await this.menuModel.find({ price: { $lte: price } });
    return food;
  }
}
