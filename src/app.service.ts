import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, Menu } from './menu.model';

@Injectable()
export class AppService {
  constructor(@InjectModel('Menu') private readonly menuModel: Model<Menu>) {}

  NAME = [
    'Mr Robert',
    'Mr Rober',
    'Mr Roberto',
    'Mr.Rober',
    'Mr.Roberto',
    'Mr.Robert',
    'Robert',
    'Roberto',
    'Rober',
  ];

  WELCOME = [
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

  MOOD = [
    'How are you',
    'How is everything',
    'How are things',
    'Is everything okay',
    'Are you okay',
    'Are you fine',
    'Is everything fine',
    'what is going on',
  ];

  SuperFeelings = [
    `is Lit`,
    `is super`,
    `is extraordinary`,
    `is feeling amazing`,
    `is feeling super duper`,
    `is feeling marvelous`,
  ];

  GoodFeelings = [`is good`, `is fine`, `is feeling good`, `is happy`];

  NeutralFeelings = [`is okay`, `is not bad`];

  BadFeelings = [
    `is feeling bad`,
    `is feeling sick`,
    `is not okay`,
    `had better days`,
    `is feeling terrible`,
    `had a bad day`,
  ];

  request(message: string): { response: string } {
    let response = '';
    message = message.toLowerCase().trim();

    // Checking for Name & Greetings & How are you & if message is empty!
    const name = this.contains(message, this.NAME);
    const greeting = this.contains(message, this.WELCOME);
    const mood = this.contains(message, this.MOOD);
    console.log(name, greeting, mood);
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
      return this.SuperFeelings[
        Math.floor(Math.random() * this.SuperFeelings.length)
      ];
    } else if (randomNumber > 20) {
      return this.GoodFeelings[
        Math.floor(Math.random() * this.GoodFeelings.length)
      ];
    } else if (randomNumber > 5) {
      return this.NeutralFeelings[
        Math.floor(Math.random() * this.NeutralFeelings.length)
      ];
    } else {
      return this.BadFeelings[
        Math.floor(Math.random() * this.BadFeelings.length)
      ];
    }
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
