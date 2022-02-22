import AppController from './controller';

class App {
  controller: AppController;

  constructor() {
    this.controller = new AppController();
  }

  async start(): Promise<void> {
    await this.controller.init();
  }
}

export default App;
