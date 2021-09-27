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

    // If message is empty
    if (!message.replace(/\s/g, '').length) {
      response = 'Robert at your service, ask me what can I do!';
      return { response };
    }

    // Checking for abilities
    const ability = this.contains(message, this.keywords.getAbilities());
    if (ability) {
      response =
        '1- Show the menu 2- Show different kind of foods 3- details about meals';
      return { response };
    }

    // Checking for filters
    const priceFilter = this.contains(message, this.keywords.getPriceFilters());
    const nameFilter = this.contains(message, this.keywords.getNameFilters());

    // Checking for meals' names
    const foodNames = await this.getFoodNames();
    const foodName = this.contains(message, foodNames);
    if (foodName) {
      const foodDetails = await this.getFoodByName(foodName);
      if (priceFilter) {
        response = '' + foodDetails.price;
        return { response };
      }
      const tempArr = [foodDetails];
      response = this.arrayToString(tempArr);
      return { response };
    }

    // Check for partial meal names in the message
    const foods = await this.keywordsMatch(message);
    if (foods.length > 0) {
      if (priceFilter) {
        response = this.arrayToNamesAndPriceString(foods);
        return { response };
      }
      if (nameFilter) {
        response = this.arrayToNamesString(foods);
        return { response };
      }
      response = this.arrayToString(foods);
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
    let flag = false;
    let res: Menu[];
    if (mainCategory) {
      flag = true;
      res = await this.getFromCategory(Category.C_Main);
    } else if (dessertCategory) {
      flag = true;
      res = await this.getFromCategory(Category.C_Dessert);
    } else if (drinksCategory) {
      flag = true;
      res = await this.getFromCategory(Category.C_Drink);
    } else if (menu) {
      flag = true;
      res = await this.getMenu();
    }
    if (flag) {
      if (priceFilter) {
        response = this.arrayToNamesAndPriceString(res);
        return { response };
      }
      if (nameFilter) {
        response = this.arrayToNamesString(res);
        return { response };
      }
      response = this.arrayToString(res);
      return { response };
    }

    // Checking for Name & Greetings & How are you & if message is empty!
    const name = this.contains(message, this.keywords.getName());
    const askName = this.contains(message, this.keywords.getAskName());
    const greeting = this.contains(message, this.keywords.getWelcome());
    const mood = this.contains(message, this.keywords.getMood());
    if (greeting) {
      response += greeting;
      if (!name && !mood && !askName) {
        response += ', Robert at your service, ask me what can I do!';
      }
    }
    if (name) {
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
    if (askName) {
      if (greeting) {
        response += ', ';
      }
      response += 'My name is Robert';
    }
    // Checking if such orders are not available or is it truly Iam just a very stupid chatbot!
    if (!response) {
      if (priceFilter || nameFilter) {
        response =
          'No such meals available in the menu, you could always check the menu list by asking to view the menu';
      } else if (this.contains(message, this.keywords.getQuestionsDenial())) {
        response = 'No, Sorry :(';
      } else {
        response = `Sorry I don't know, I'm still learning :)`;
      }
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
    console.log(array);
    let result = '';
    let i = 0;
    for (i; i < array.length; i++) {
      result +=
        i +
        1 +
        '- name: ' +
        array[i].name +
        ', price: ' +
        array[i].price +
        ', description: ' +
        array[i].description +
        ' ';
    }
    return result;
  }

  arrayToNamesAndPriceString(array: Menu[]) {
    let result = '';
    let i = 0;
    for (i; i < array.length; i++) {
      result += i + 1 + '- ' + array[i].name + ': $' + array[i].price + ' ';
    }
    return result;
  }
  arrayToNamesString(array: Menu[]) {
    let result = '';
    let i = 0;
    for (i; i < array.length; i++) {
      result += i + 1 + '- ' + array[i].name + ' ';
    }
    return result;
  }

  async getMenu(): Promise<Menu[]> {
    const menu = await this.menuModel.find();
    return menu;
  }

  private async getFromCategory(category: Category): Promise<Menu[]> {
    const food = await this.menuModel.find({ category });
    return food;
  }

  private async getFoodByName(name: string): Promise<Menu> {
    const food = await this.menuModel.findOne({ name });
    return food;
  }

  private async getFoodNames(): Promise<string[]> {
    // const arr = string.split(/[\s,!?.:;]+/);
    const food = await this.menuModel.find().select('name -_id');
    const names: string[] = [];
    for (let i = 0; i < food.length; i++) {
      names.push(food[i].name);
    }
    // const foorName = this.contains(string)
    return names;
  }

  private async keywordsMatch(message: string): Promise<null | Menu[]> {
    const arr: string[] = message.split(/[\s,!?.:;~]+/);
    const food = await this.menuModel.find({ keywords: { $in: arr } });
    // console.log(food);
    if (food) {
      return food;
    }
    return null;
  }
}
