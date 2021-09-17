import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, Menu } from './menu.model';

@Injectable()
export class AppService {
  constructor(@InjectModel('Menu') private readonly menuModel: Model<Menu>) {}

  welcome = [
    'Hello',
    'Hey',
    'Heya',
    'Hoi',
    'Hola',
    'Hi',
    'Good morning',
    'Good afternoon',
    'Good evening',
  ];

  request(message: string): { response: string } {
    let response = '';
    message = message.toLowerCase().trim();
    // let query = '';
    const greeting = this.contain(message, this.welcome);
    if (greeting) {
      response = greeting + ' :)';
    }
    if (!response) {
      response = "Sorry I didn't understand that, I'm still learning :)";
    }
    return { response };
  }
  private contain = (s: string, array: string[]): string => {
    for (let i = 0; i < array.length; i++) {
      const word = array[i].toLowerCase();
      const reg = '^' + word + '(?:\\s|[!?]*|$)';
      const regex = new RegExp(reg, 'i');
      const match = s.match(regex);
      if (match !== null) {
        return array[i];
      }
    }
    return null;
  };

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
