// Chụp ảnh chợ 1290×2796 bằng Chrome headless + CDP (WebSocket có sẵn trong Node 22+).
// UA có DuabZooiOS => web chạy đúng chế độ app iOS (cửa mua App Store, không Zalo).
import { spawn } from 'node:child_process'
import fs from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL0 = process.env.SITE || 'https://duab.152-42-172-109.sslip.io'
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 DuabZooiOS'
const PORT = 9333
const dir = '/tmp/duab-chrome-profile'
fs.rmSync(dir, { recursive: true, force: true })
const ch = spawn(CHROME, [`--headless=new`, `--remote-debugging-port=${PORT}`, `--user-data-dir=${dir}`, '--window-size=430,932', '--force-device-scale-factor=3', `--user-agent=${UA}`, '--hide-scrollbars', '--no-first-run', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let ws, id = 0, cho = new Map()
async function ketNoi() {
  for (let i = 0; i < 40; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()
      const t = list.find((x) => x.type === 'page')
      if (t) { ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r)); break }
    } catch {}
    await sleep(300)
  }
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && cho.has(m.id)) { cho.get(m.id)(m); cho.delete(m.id) } }
}
function goi(method, params = {}) { return new Promise((res) => { const i = ++id; cho.set(i, res); ws.send(JSON.stringify({ id: i, method, params })) }) }
async function js(expr) { const r = await goi('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result?.result?.value }
async function chup(ten) {
  const r = await goi('Page.captureScreenshot', { format: 'png' })
  fs.writeFileSync(ten, Buffer.from(r.result.data, 'base64'))
  console.log('chup', ten)
}
async function den(url) { await goi('Page.navigate', { url }); await sleep(2500) }
await ketNoi()
await goi('Page.enable'); await goi('Runtime.enable')
await goi('Emulation.setDeviceMetricsOverride', { width: 430, height: 932, deviceScaleFactor: 3, mobile: true })
await den(URL0 + '/app/')
await js(`localStorage.setItem('duabzoo.lang','vi'); 'ok'`)
await den(URL0 + '/app/')
await chup('01-cong-vao.png')
await js(`localStorage.setItem('duabzoo.nguoidung', JSON.stringify({ten:'Giàng A Hùng', sdt:'0832076394'})); 'ok'`)
await den(URL0 + '/app/')
await sleep(1500)
await chup('02-trang-chu.png')
await js(`document.querySelectorAll('nav button')[1].click(); 'ok'`); await sleep(800)
await chup('03-khoi-phuc.png')
await js(`document.querySelectorAll('nav button')[3].click(); 'ok'`); await sleep(800)
await chup('04-ca-nhan.png')
await js(`(function(){var m=document.querySelector('main'); var h=[...m.querySelectorAll('h2')].find(x=>/Mua thêm ảnh/.test(x.textContent)); if(h){h.scrollIntoView(); return 'iap-co'} return 'iap-khong'})()`).then((v) => console.log('IAP tren man Ca Nhan:', v))
await sleep(600)
await chup('05-mua-app-store.png')
await js(`document.querySelector('button[aria-label^="Đổi ngôn ngữ"]').click(); document.querySelectorAll('nav button')[0].click(); 'ok'`); await sleep(800)
await chup('06-hmoob.png')
await den(URL0 + '/rieng-tu/')
await chup('07-rieng-tu.png')
console.log('kich thuoc:', await js(`window.innerWidth+'x'+window.innerHeight+' dpr '+devicePixelRatio`))
ws.close(); ch.kill()
