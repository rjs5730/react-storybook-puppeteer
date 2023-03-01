import * as path from 'path';
import puppeteer from 'puppeteer';
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';

let browser: puppeteer.Browser;
let page: puppeteer.Page;

const HOST_BASE_URL = 'http://localhost:6006'

const getCustomBrowser = async (): Promise<puppeteer.Browser> => {
  // browser = await puppeteer.connect({
  //   browserURL: 'http://chrome:3000/',
  // });
   // 크로미움 브라우저 실행
   browser = await puppeteer.launch()
   // 크로미움 페이지 열기
   page = await browser.newPage()
    // 테스트용 페이지 로드
    const response: any = await page.goto(HOST_BASE_URL)
      // 페이지 정상로드 확인
  expect(response.status()).toBe(200)
     // 페이지 로드 완료 확인
  await page.waitForSelector('#root')
  return browser;
};

const beforeScreenshot = async (page: puppeteer.Page) => {
  await page.evaluate(() => {
    document.body.classList.add('no-animations');
  });
};


initStoryshots({
  suite: 'storyshots',
  test: imageSnapshot({
    getCustomBrowser,
    beforeScreenshot,
    // storybookUrl: `file://${path.resolve(__dirname, '../storybook-static')}`,
    storybookUrl: HOST_BASE_URL,
  }),
});

afterAll(async () => {
  await page.close()
  await browser.close()
});