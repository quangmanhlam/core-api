import {Controller, Get, Render} from '@nestjs/common';

@Controller()
export class MainController {

  @Get()
  @Get('/')
  @Render('index')
  async getHomePage() {
    return {};
  }

  @Get('/docs/error-codes.html')
  @Render('error')
  async getErrorCodesPage() {
    return {};
  }

  @Get('/docs/websocket.html')
  @Render('websocket')
  async getWebsocketPage() {
    return {};
  }
}
