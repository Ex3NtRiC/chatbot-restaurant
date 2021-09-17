import { Args, Resolver } from '@nestjs/graphql';
import { Query } from '@nestjs/graphql';
import { AppService } from './app.service';
import { MenuType } from './menu.type';
import { response } from './response.type';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}
  @Query((returns) => response)
  request(@Args('message') message: string) {
    return this.appService.request(message);
  }
  @Query((returns) => [MenuType])
  food() {
    return this.appService.getMenu();
  }
}
