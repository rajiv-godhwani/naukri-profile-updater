const chromium = require('chrome-aws-lambda');
var request = require('request-promise');

exports.handler = async (event, context, callback) => {
  let result = null;
  let browser = null;

  try {
    var response = await request(event.sheetsUrl,{json:true})

    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless
    });
        
    console.log("Starting")

    for(const cred of response){
      await updateProfile(cred.Username,cred.Password,browser)
    }

    console.log("Completed")
    await browser.close();

  } catch (error) {
    return callback(error);
  } finally {
    if (browser !== null) {
      console.log('Finally closing browser')
      await browser.close();
    }
  }

  return callback(null, result);
};

naukri = {
  home : {
    url : 'https://naukri.com',
    loginMenu : '#login_Layer > div',
    username : '#root > div.naukri-drawer.right.open > div.drawer-wrapper > div > form > div:nth-child(2) > input',
    password : '#root > div.naukri-drawer.right.open > div.drawer-wrapper > div > form > div:nth-child(3) > input',
    loginSubmit : '#root > div.naukri-drawer.right.open > div.drawer-wrapper > div > form > div:nth-child(5) > button'
  },
  profile : {
    url : 'https://www.naukri.com/mnjuser/profile?id=&orgn=homepage',
    editButton : '#root > div > div:nth-child(1) > span > div > div > div > div > div > div.dashboard-component > div.dashboard.blue-bg.card > div > div.col.s8.pad0 > div > div.txt-wrapper.pr0.col.s10.white-text > div:nth-child(1) > div > div.hdn.mb5 > em',
    saveButton : '#saveBasicDetailsBtn'
  },
  logout : {
    url : 'https://www.naukri.com/nlogin/logout'
  }

}

async function updateProfile(username,password,context){
  console.log('Updating profile for '+username)
  let page = await context.newPage();

  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (request.resourceType() === 'image') request.abort();
    else request.continue();
  });

  await page.goto(naukri.home.url);

  console.log("Clicking login")

  await page.click(naukri.home.loginMenu)
  await page.waitForSelector(naukri.home.username)
  await page.type(naukri.home.username,username)

  await page.type(naukri.home.password,password)

  await page.click(naukri.home.loginSubmit)

  await page.waitForNavigation()

  console.log("Going to profile page")

  await page.goto(naukri.profile.url)
  await page.waitForSelector(naukri.profile.editButton)

  console.log('Edit profile')
  await page.click(naukri.profile.editButton)

  console.log('Save profile')
  await page.waitForSelector(naukri.profile.saveButton)

  await page.click(naukri.profile.saveButton)

  await page.waitFor(1000)
  
  console.log('Logging out')

  await page.goto(naukri.logout.url)
  
  await page.waitFor(500)
}



exports.handler({sheetsUrl:'https://sheet.best/api/sheets/90336906-1a0a-4665-a277-694662b8785f'},null,function(e){
  console.log(e)
})