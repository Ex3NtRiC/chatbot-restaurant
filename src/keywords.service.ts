import { Injectable } from '@nestjs/common';

@Injectable()
export class Keywords {
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
    'How are u',
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

  abilities = ['what can you do', 'what can u do'];

  ShowMenu = ['menu', 'show', 'view', 'have'];

  CATEGORY_MAIN = ['main', 'course', 'dish', 'meal'];

  CATEGORY_DRINKS = [
    'drinks',
    'drink',
    'beverage',
    'beverages',
    'soft',
    'juice',
    'coffee',
  ];

  CATEGORY_DESSERT = ['dessert', 'sweets', 'sweet'];

  getName() {
    return this.NAME;
  }
  getWelcome() {
    return this.WELCOME;
  }
  getMood() {
    return this.MOOD;
  }
  getSuperFeelings() {
    return this.SuperFeelings;
  }
  getGoodFeelings() {
    return this.GoodFeelings;
  }
  getNeutralFeelings() {
    return this.NeutralFeelings;
  }
  getBadFeelings() {
    return this.BadFeelings;
  }
  getShowMenu() {
    return this.ShowMenu;
  }
  getCategoryMain() {
    return this.CATEGORY_MAIN;
  }
  getCategoryDrinks() {
    return this.CATEGORY_DRINKS;
  }
  getCategoryDessert() {
    return this.CATEGORY_DESSERT;
  }
  getAbilities() {
    return this.abilities;
  }
}
