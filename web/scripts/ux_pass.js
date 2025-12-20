const { chromium } = require('playwright')
const { spawn } = require('child_process')

function startDevServer(){
  return new Promise((resolve, reject) => {
    const dev = spawn('npm', ['run','dev'], { cwd: __dirname + '..', shell: true })
    dev.stdout.setEncoding('utf8')
    dev.stderr.setEncoding('utf8')
    function onData(d){
      process.stdout.write(d)
      if (d.includes('Local:') || d.includes('ready in')){
        dev.stdout.off('data', onData)
        resolve(dev)
      }
    }
    dev.stdout.on('data', onData)
    dev.stderr.on('data', (d)=> process.stderr.write(d))
    dev.on('error', reject)
  })
}

;(async ()=>{
  const SKIP = !!process.env.SKIP_SERVER
  const BASE_URL = process.env.BASE_URL || 'http://localhost:5173/'

  let devProc = null
  if (!SKIP){
    console.log('Starting dev server...')
    devProc = await startDevServer()
    console.log('Dev server reported ready')
  } else {
    console.log('SKIP_SERVER set — not starting dev server. Using', BASE_URL)
  }

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const url = BASE_URL
  console.log('Opening', url)
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  // Wait for decks list (be more patient and capture debug output on failure)
  try {
    await page.waitForSelector('text=Baralhos', { timeout: 60000 })
  } catch (err){
    console.error('Timed out waiting for deck heading. Dumping page content to ux_fail.html')
    const html = await page.content()
    const fs = require('fs')
    fs.writeFileSync('ux_fail.html', html)
    throw err
  }

  // Click first deck
  await page.click('button:has-text("Autenticação e Identidade")')
  console.log('Selected deck')

  // Wait for card to be present and find the card control (role=button with aria-pressed)
  await page.waitForSelector('[role="button"][aria-pressed]')
  const cardButton = await page.$('[role="button"][aria-pressed]')
  const pressedBefore = await cardButton.getAttribute('aria-pressed')
  console.log('Pressed before:', pressedBefore)

  // Flip card via Enter
  await cardButton.press('Enter')
  await page.waitForTimeout(250)
  const pressedAfter = await cardButton.getAttribute('aria-pressed')
  console.log('Pressed after flip:', pressedAfter)

  // Accept the card
  await page.click('button[aria-label^="Aceitar risco"]')
  console.log('Clicked accept')

  // Wait for backlog update: header should show (1)
  await page.waitForSelector('text=Backlog de Segurança (1)', { timeout: 5000 })
  console.log('Backlog updated (1) present')

  // Read live region
  const live = await page.$eval('#a11y-live', el => el.textContent.trim())
  console.log('Live region:', live)

  await page.screenshot({ path: 'ux_pass.png', fullPage: true })
  console.log('Screenshot saved to ux_pass.png')

  await browser.close()
  console.log('UX pass complete')

  // kill dev server if we started it
  if (devProc){
    try { devProc.kill('SIGINT') } catch(e){}
  }
  process.exit(0)
})().catch(err => { console.error(err); process.exit(1) })
