import { spawn } from 'node:child_process'
import fs from 'node:fs'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL0 = 'https://duab.152-42-172-109.sslip.io'
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 DuabZooiOS'
const PORT = 9334, dir = '/tmp/duab-chrome-6'
fs.rmSync(dir, { recursive: true, force: true })
const ch = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${dir}`, '--window-size=430,932', '--force-device-scale-factor=2', `--user-agent=${UA}`, '--hide-scrollbars', '--no-first-run', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let ws, id = 0, cho = new Map()
for (let i = 0; i < 40 && !ws; i++) { try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const t = l.find((x) => x.type === 'page'); if (t) { ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r)) } } catch {} if (!ws) await sleep(300) }
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && cho.has(m.id)) { cho.get(m.id)(m); cho.delete(m.id) } }
const goi = (method, params = {}) => new Promise((res) => { const i = ++id; cho.set(i, res); ws.send(JSON.stringify({ id: i, method, params })) })
const js = async (e) => (await goi('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.result?.value
const chup = async (f) => { const r = await goi('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(f, Buffer.from(r.result.data, 'base64')) }
await goi('Page.enable'); await goi('Runtime.enable')
await goi('Emulation.setDeviceMetricsOverride', { width: 430, height: 932, deviceScaleFactor: 2, mobile: true })
await goi('Page.navigate', { url: URL0 + '/app/' }); await sleep(2500)
await js(`localStorage.setItem('duabzoo.nguoidung', JSON.stringify({ten:'Yaj Huas', sdt:'0832076394'})); 'ok'`)
for (const l of ['hmn', 'vi', 'en', 'lo', 'th', 'zh']) {
  await js(`localStorage.setItem('duabzoo.lang','${l}'); 'ok'`)
  await goi('Page.navigate', { url: URL0 + '/app/' }); await sleep(2200)
  await chup(`6-tieng/${l}-trang-chu.png`)
  await js(`document.querySelectorAll('nav button')[3].click(); 'ok'`); await sleep(600)
  await chup(`6-tieng/${l}-ca-nhan.png`)
  const tt = await js(`document.querySelector('h1')?.textContent + ' | ' + [...document.querySelectorAll('nav button')].map(b=>b.textContent.trim()).join(' · ') + ' | html=' + document.documentElement.lang`)
  console.log(l, '=>', tt)
}
// menu ngon ngu mo ra
await js(`document.querySelector('header button[aria-haspopup]').click(); 'ok'`); await sleep(400)
await chup('6-tieng/menu-ngon-ngu.png')
ws.close(); ch.kill()
