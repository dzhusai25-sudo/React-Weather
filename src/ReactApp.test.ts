//мокк для глобальной переменной и url
declare global {
  var PRODUCTION: boolean;
  var PREFIX: string;
}

global.PRODUCTION = false;
global.PREFIX = '/';

import { ReactApp } from './ReactApp';

declare module './interfaces/Interfaces' {
  interface EventMap {
    'testEvent': [string, string];
    'unknown': [];
    'event1': [];
    'event2': [];
    'test': [];
  }
}

let appContainer: HTMLDivElement;

global.fetch = jest.fn();
const mockedFetch = fetch as jest.Mock;


describe('Check runApp', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    appContainer = document.createElement('div');
    document.body.appendChild(appContainer);
    
    // Мок для fetch (LocationService)
    mockedFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ city: 'Moscow' }),
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
    document.body.removeChild(appContainer);
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('function test', () => expect(ReactApp).toBeInstanceOf(Function));
});