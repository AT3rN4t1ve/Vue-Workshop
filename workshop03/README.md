# Workshop03 — Krua TamSang (ครัวตามสั่ง)

Front-end ร้านอาหารตามสั่ง เขียนด้วย **Vue 2 + Vuex 3 + Vue Router 3 + Vuetify 2** ต่อกับ REST API ที่ `http://localhost:3000/api/v1`

ฝั่งลูกค้าดูเมนู เลือกตัวเลือก (เช่น ระดับความเผ็ด, เพิ่มไข่ดาว) ใส่ตะกร้า สั่งอาหาร และติดตามสถานะออเดอร์ได้
ฝั่ง Admin จัดการเมนูและสต็อก รับออเดอร์ผ่านบอร์ด และอนุมัติผู้ใช้ใหม่ได้

เอกสารนี้เป็น **Code Review** ไล่ทีละไฟล์ว่าแต่ละส่วนและแต่ละฟังก์ชันทำอะไร

---

## สารบัญ

1. [วิธีรัน](#1-วิธีรัน)
2. [โครงสร้างโปรเจกต์](#2-โครงสร้างโปรเจกต์)
3. [Entry point — main.js / plugins](#3-entry-point--mainjs--plugins)
4. [Router — router/index.js](#4-router--routerindexjs)
5. [Services — ชั้นเรียก API](#5-services--ชั้นเรียก-api)
6. [Store — Vuex](#6-store--vuex)
7. [Utils — ฟังก์ชันช่วย](#7-utils--ฟังก์ชันช่วย)
8. [Views — หน้าจอ](#8-views--หน้าจอ)
9. [Components](#9-components)
10. [Flow สำคัญ](#10-flow-สำคัญ)
11. [ข้อสังเกตจากการรีวิว](#11-ข้อสังเกตจากการรีวิว)

---

## 1. วิธีรัน

```bash
npm install
npm run serve     # dev server (hot reload)
npm run build     # build สำหรับ production
npm run lint      # ตรวจและแก้ lint
```

ต้องเปิด Back-end ไว้ก่อน ถ้า API ไม่ได้อยู่ที่ `http://localhost:3000/api/v1` ให้สร้างไฟล์ `.env.local`:

```
VUE_APP_API_URL=http://your-host:port/api/v1
```

---

## 2. โครงสร้างโปรเจกต์

```
src/
├── main.js                 # สร้าง Vue instance, ผูก http กับ store, ลง filter
├── App.vue                 # layout หลัก: Header / router-view / Footer / Snackbar / MobileNav
├── plugins/vuetify.js      # ตั้งค่าธีมสี
├── router/index.js         # route + navigation guard
├── services/               # เรียก API (http, auth, product, order)
├── store/                  # Vuex: auth, cart, ui
├── utils/                  # ฟังก์ชันช่วย: format, options, orderRows, productVisual, image, constants
├── views/                  # หน้าจอ (1 route = 1 view)
│   ├── auth/               # Login, Register
│   └── admin/              # ManageProducts, ManageUsers
├── components/             # คอมโพเนนต์ย่อยแยกตามหมวด
│   ├── layout/  common/  auth/  product/  cart/  order/  admin/
└── styles/                 # main.css (design token), variables.scss
```

แนวคิดหลักที่ใช้ทั้งโปรเจกต์:

- **แยกชั้นชัดเจน** — View ไม่เรียก `fetch` เอง แต่เรียกผ่าน `services/*` และ `services/http.js` เป็นที่เดียวที่รู้เรื่อง URL, token และการแปล error
- **Logic ที่ใช้หลายที่อยู่ใน `utils/`** เช่น คำนวณราคาตามตัวเลือก (`unitPrice`) ใช้ทั้งในหน้า detail, ตะกร้า และ getter `cart/total`
- **Component ส่วนใหญ่เป็นแบบ presentational** — รับ `props` แล้ว `$emit` event กลับขึ้นไป ให้ View เป็นคนจัดการ state/เรียก API

---

## 3. Entry point — main.js / plugins

### `main.js`

| ส่วน | หน้าที่ |
|---|---|
| `configureHttp({ getToken, onUnauthorized })` | ฉีด dependency ให้ `http.js` — `getToken` อ่าน token จาก store, `onUnauthorized` ถูกเรียกเมื่อ API ตอบ 401 → logout, แจ้งเตือน "เซสชันหมดอายุ" และพาไปหน้า login (เช็ค `isLoggedIn` ก่อนเพื่อไม่ให้ทำซ้ำถ้ามีหลาย request 401 พร้อมกัน) |
| `Vue.filter('price' / 'number' / 'date')` | ลง global filter ให้ template ใช้ได้ เช่น `{{ total \| price }}` |
| `new Vue({ vuetify, router, store })` | mount แอปที่ `#app` |

> การใช้ `configureHttp` แทนการ import store เข้า `http.js` ตรงๆ ช่วยตัด circular dependency (store → service → http → store)

### `plugins/vuetify.js`

ตั้งค่าธีม light (primary `#C8441F` โทนส้มอิฐ ฯลฯ) และเปิด `customProperties` เพื่อให้ใช้สีของ Vuetify ผ่าน CSS variable ได้ สีถูกเลือกให้ผ่าน contrast WCAG AA

### `App.vue`

Layout หลัก: `AppHeader` + `<router-view>` + `AppFooter` + `AppSnackbar` + `MobileNav` (แถบเมนูล่างบนมือถือ)

---

## 4. Router — `router/index.js`

### Routes

| Path | Name | View | meta |
|---|---|---|---|
| `/login` | login | LoginView | `guest` |
| `/register` | register | RegisterView | `guest` |
| `/` | shop | ShopView | — |
| `/products/:id` | product-detail | ProductDetailView (`props: true`) | — |
| `/cart` | cart | CartView | — |
| `/orders` | orders | OrdersView | — |
| `/profile` | profile | ProfileView | — |
| `/admin/products` | manage-products | ManageProductsView | `admin` |
| `/admin/users` | manage-users | ManageUsersView | `admin` |
| `*` | — | redirect ไป `/` | — |

### `router.beforeEach` — Navigation guard

1. ถ้าเป็นหน้า `guest` (login/register) แต่ login อยู่แล้ว → เด้งไปหน้า shop
2. ถ้ายังไม่ login → ไปหน้า login พร้อมแนบ `?redirect=<path เดิม>` (ยกเว้น path `/` ไม่ต้องแนบ) เพื่อให้ login เสร็จแล้วกลับมาหน้าเดิมได้
3. ถ้าเป็นหน้า `admin` แต่ user ไม่ใช่ admin → เด้งไปหน้า shop
4. นอกนั้นผ่าน

### `router.afterEach`

ตั้ง `document.title` เป็น `<meta.title> | Krua TamSang`

`scrollBehavior` คืน `{ x: 0, y: 0 }` ทุกครั้งที่เปลี่ยนหน้าให้เลื่อนขึ้นบนสุด

---

## 5. Services — ชั้นเรียก API

### `services/http.js` — HTTP client กลาง

| ฟังก์ชัน | หน้าที่ |
|---|---|
| `configureHttp(options)` | รวม `getToken` / `onUnauthorized` เข้า `handlers` (ค่า default เป็นฟังก์ชันว่าง) |
| `translate(body)` | แปลง error message ภาษาอังกฤษจาก Back-end เป็นภาษาไทย ทำงาน 3 ขั้น: (1) ถ้าเป็น `validation error` จะแปลทุกข้อใน `body.data` แล้วต่อด้วย `, ` (2) ลองจับกับ `PATTERNS` (regex ที่มีค่าแปรผัน เช่น `quantity exceeds stock (stock: 3)` → "เมนูนี้เหลือไม่พอ (เหลือ 3 จาน)", เปลี่ยนสถานะออเดอร์ไม่ได้ → ใช้ `orderStatus()` แปลชื่อสถานะ) (3) หาใน `MESSAGES` แบบตรงตัว ถ้าไม่เจอคืนข้อความเดิม หรือข้อความ default |
| `request(method, path, body)` | ตัวหลักที่ใช้ `fetch` — ใส่ `Content-Type: application/json` เมื่อมี body, ใส่ `Authorization: Bearer <token>` เมื่อมี token; ถ้า network ล่มโยน error "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้"; ถ้าสำเร็จคืน `result.data` (unwrap envelope ให้เลย); ถ้า 401 และมี token และไม่ใช่กรณี `forbidden: admin only` → เรียก `onUnauthorized()`; สุดท้ายโยน `Error` ที่ message แปลแล้ว และแนบ `error.status` |
| default export | `get / post / put / delete` ห่อ `request` ให้เรียกสั้นลง |

> จุดเด่น: ทุก view แค่ `catch (e)` แล้วโชว์ `e.message` ได้เลย เพราะแปลเป็นไทยมาแล้วจากที่เดียว

### `services/authService.js`

| ฟังก์ชัน | Endpoint | หมายเหตุ |
|---|---|---|
| `register({ email, password, firstName, lastName })` | `POST /register` | `trim` อีเมลก่อนส่ง |
| `login({ email, password })` | `POST /login` | คืน `{ token, user }` |
| `getUsers()` | `GET /users` | admin |
| `approveUser(id)` | `PUT /users/:id/approve` | admin |
| `getMe()` | `GET /me` | ดึงข้อมูลตัวเองล่าสุด |
| `updateMe({ firstName, lastName })` | `PUT /me` | |
| `updateAvatar(avatar)` | `PUT /me/avatar` | ส่งเป็น data URL |
| `removeAvatar()` | `DELETE /me/avatar` | |
| `changePassword({ currentPassword, newPassword })` | `PUT /me/password` | |

### `services/productService.js`

| ฟังก์ชัน | หน้าที่ |
|---|---|
| `clean(payload)` (ภายใน) | ทำความสะอาดข้อมูลก่อนส่ง: `trim` ข้อความทุกช่อง, หมวดหมู่ว่างให้เป็น `'อื่นๆ'`, แปลง `price/stock` เป็น Number, แปลง `optionGroups` ให้ `isRequired/isMultiple` เป็น boolean และราคาตัวเลือกเป็น Number (ว่าง = 0) |
| `getAll()` / `getById(id)` | `GET /products`, `GET /products/:id` |
| `create(payload)` / `update(id, payload)` | `POST` / `PUT` ผ่าน `clean()` |
| `remove(id)` | `DELETE /products/:id` |

### `services/orderService.js`

| ฟังก์ชัน | หน้าที่ |
|---|---|
| `getAll()` | `GET /orders` (Back-end กรองให้เอง: ลูกค้าเห็นของตัวเอง, admin เห็นทั้งหมด) |
| `getByProduct(productId)` | `GET /products/:id/orders` |
| `create(productId, { quantity, options, note })` | `POST /products/:id/orders` — แปลง quantity เป็น Number, ตัด options ให้เหลือแค่ `{ group, choice }`, trim note |
| `updateStatus(id, status)` | `PUT /orders/:id/status` |

---

## 6. Store — Vuex

### `store/index.js`

รวม 3 module (`auth`, `cart`, `ui` — ทั้งหมด `namespaced`) และใช้ `store.subscribe` ดักทุก mutation:
- mutation ที่ขึ้นต้นด้วย `cart/` → `saveCart()` ลง localStorage
- mutation ที่ขึ้นต้นด้วย `auth/` → `saveSession()` ลง localStorage

> ทำแบบนี้ทำให้ mutation เองไม่ต้องสนใจเรื่อง persistence เลย

### `store/modules/auth.js`

| ส่วน | รายละเอียด |
|---|---|
| `loadSession()` | อ่าน `ws3_auth` จาก localStorage (ห่อ try/catch กัน JSON พัง) |
| `saveSession(state)` | มี token → บันทึก `{ token, user }`, ไม่มี → ลบ key |
| **state** | `token`, `user` (โหลดจาก session ตอนเริ่ม) |
| **getters** | `isLoggedIn` (มี token), `isAdmin` (`user.role === 'admin'`), `displayName` (ชื่อ-นามสกุล ถ้าไม่มีใช้อีเมล) |
| **mutations** | `SET_SESSION`, `SET_USER`, `CLEAR_SESSION` |
| **actions** | `login` → เรียก API แล้ว `SET_SESSION`; `fetchMe` / `updateProfile` / `updateAvatar` / `removeAvatar` → เรียก API แล้ว `SET_USER` ด้วย user ที่ Back-end คืนมา; `logout` → `CLEAR_SESSION` และล้างตะกร้า (`cart/CLEAR` แบบ `root: true`) |

### `store/modules/cart.js`

แต่ละรายการในตะกร้า: `{ key, product, quantity, options: [{ group, choice }], note }`

**`key`** สร้างจาก `lineKey(productId, options, note)` — เมนูเดียวกันแต่เลือกตัวเลือกหรือหมายเหตุต่างกันจะเป็นคนละบรรทัด

| ส่วน | รายละเอียด |
|---|---|
| `loadItems()` | อ่าน `ws3_cart` และเติม `options/note/key` ให้ข้อมูลเก่าที่อาจไม่มีฟิลด์เหล่านี้ (backward compatible) |
| `saveCart(state)` | เขียน `items` ลง localStorage |
| getter `count` | จำนวนจานรวมทุกบรรทัด |
| getter `total` | ราคารวม = Σ `unitPrice(product, options) × quantity` |
| getter `quantityOf(productId)` | จำนวนจานของเมนูนั้นรวมทุกบรรทัด (ใช้เทียบกับสต็อก) |
| getter `problemOf(item)` | ตรวจว่ารายการนี้มีปัญหาไหม: เมนูหมด / ตัวเลือกไม่ถูกต้องแล้ว (admin แก้เมนู) / จำนวนรวมเกินสต็อก — คืนข้อความ หรือ `''` |
| getter `hasProblem` | มีรายการไหนมีปัญหาบ้าง (ใช้ปิดปุ่มสั่ง) |
| `ADD` | ถ้า key ซ้ำ → บวกจำนวนและอัปเดต product, ไม่ซ้ำ → push บรรทัดใหม่ |
| `SET_QUANTITY` / `REMOVE` / `CLEAR` | ตั้งจำนวน / ลบตาม key / ล้างทั้งหมด |
| `REMOVE_PRODUCT(productId)` | ลบทุกบรรทัดของเมนูนั้น (ใช้ตอน admin ลบเมนู) |
| `SYNC(products)` | แทน product ในตะกร้าด้วยข้อมูลล่าสุดจาก API และตัดรายการที่เมนูถูกลบไปแล้วทิ้ง |
| action `add` | ตรวจตัวเลือกด้วย `optionProblem` → ตรวจสต็อกที่เหลือ (`stock - quantityOf`) → ใส่ได้ไม่เกินที่เหลือ (`Math.min`) → แจ้งเตือนผ่าน `ui/notify` และคืน `true/false` ให้ผู้เรียกรู้ผล |

### `store/modules/ui.js`

state `snackbar: { show, text, color }`
- `SHOW_SNACKBAR` / `HIDE_SNACKBAR`
- action `notify(payload)` รับได้ทั้ง string (`'บันทึกแล้ว'`) หรือ object (`{ text, color }`) — ใช้เป็นช่องทางแจ้งเตือนกลางของทั้งแอป

---

## 7. Utils — ฟังก์ชันช่วย

### `utils/constants.js`

| ค่า | ความหมาย |
|---|---|
| `APP_NAME`, `APP_NAME_TH` | ชื่อร้าน |
| `LOW_STOCK = 5` | เกณฑ์ "ใกล้หมด" |
| `DEFAULT_CATEGORY = 'อื่นๆ'` | หมวดหมู่ default |
| `NOTE_MAX_LENGTH = 200` | ความยาวหมายเหตุสูงสุด |
| `ORDER_STATUS` | map สถานะ → `{ text, color, tint, icon }` (pending, cooking, done, delivered, cancelled) |
| `orderStatus(status)` | คืนข้อมูลสถานะ ถ้าไม่รู้จักคืนค่า fallback สีเทา ไม่ทำให้ UI พัง |

### `utils/format.js`

- `formatPrice(value)` → `฿1,234.5` (locale th-TH, ทศนิยมไม่เกิน 2)
- `formatNumber(value)` → ใส่ comma
- `formatDate(value)` → วันที่ + เวลาแบบไทย, ไม่มีค่าคืน `-`

### `utils/options.js` — ตัวเลือกเมนู

| ฟังก์ชัน | หน้าที่ |
|---|---|
| `findChoice(product, option)` (ภายใน) | หา choice ใน `product.optionGroups` จากชื่อกลุ่ม + ชื่อตัวเลือก |
| `unitPrice(product, selected)` | ราคาต่อจาน = `product.price` + ราคาของทุก choice ที่เลือก |
| `optionProblem(product, selected)` | ตรวจความถูกต้อง: ตัวเลือกที่เลือกยังมีอยู่ไหม, กลุ่ม `isRequired` ต้องเลือกอย่างน้อย 1, กลุ่มที่ไม่ใช่ `isMultiple` เลือกได้ไม่เกิน 1 — คืนข้อความ error หรือ `''` |
| `lineKey(productId, selected, note)` | สร้าง key ไม่ซ้ำของบรรทัดในตะกร้า รูปแบบ `id\|group=choice&...\|note` |
| `optionsText(selected)` | จัดกลุ่มแล้วแปลงเป็นข้อความอ่านง่าย เช่น `ความเผ็ด: เผ็ดมาก · เพิ่ม: ไข่ดาว, ไข่เจียว` |

> `unitPrice` และ `optionProblem` ใช้ร่วมกันทั้งตอนเลือก (ProductDetail), ตอนใส่ตะกร้า (`cart/add`) และตอนตรวจตะกร้า (`problemOf`) ทำให้กฎเหมือนกันทุกจุด

### `utils/orderRows.js` — แปลงออเดอร์ให้แสดงผล

| ส่วน | หน้าที่ |
|---|---|
| `NEXT_STEP` | ขั้นถัดไปของสถานะ pending → cooking → done → delivered พร้อมข้อความปุ่ม |
| `ACTIVE_STATUSES` | `pending, cooking, done` = ออเดอร์ที่ยังไม่จบ |
| `CANCELLABLE_STATUSES` | `pending, cooking` = ร้านยังยกเลิกได้ |
| `toOrderRow(order, admin)` | แปลงออเดอร์จาก API เป็น row เดียวที่ใช้ร่วมกันทั้งตาราง/การ์ด/บอร์ด: สร้าง `code` (6 ตัวท้ายของ `_id`), ชื่อเมนู (ถ้าเมนูถูกลบใช้ `productName` ที่ snapshot ไว้), `productDeleted`, `optionsText`, ชื่อลูกค้า, `statusInfo/statusText`, `next` (เฉพาะ admin), `canCancel` (admin ยกเลิกได้ตอน pending/cooking ส่วนลูกค้ายกเลิกได้แค่ pending) |
| `matchesOrder(row, keyword)` | ค้นหาจาก code, ชื่อเมนู, ลูกค้า, ตัวเลือก, หมายเหตุ (ไม่สนตัวพิมพ์) |
| `byNewest(a, b)` | ตัวเรียงใหม่ → เก่า |

### `utils/productVisual.js` — ภาพแทนเมนูเมื่อไม่มีรูป

| ฟังก์ชัน | หน้าที่ |
|---|---|
| `hashOf(text)` (ภายใน) | hash ชื่อเมนูเป็นตัวเลข เพื่อเลือกสีจาก `PALETTE` แบบคงที่ (ชื่อเดิมได้สีเดิมเสมอ) |
| `productEmoji(name, category)` | เดา emoji จากหมวด/ชื่อ: เครื่องดื่ม 🥤, ของหวาน 🍨, เส้น 🍜, ต้ม/แกง 🍲, ยำ 🥗, กุ้ง 🍤, ไก่ทอด 🍗, ข้าว/ผัด 🍛, ไข่ 🍳, อื่นๆ 🍽️ |
| `productVisual(name, category)` | คืน `{ bg, fg, initial, emoji }` — `initial` รองรับสระนำภาษาไทย (เ แ โ ใ ไ) โดยตัด 2 ตัวอักษร |
| `menuRank` / `isDrink` | ลำดับประเภทเมนูจาก emoji / เช็คว่าเป็นเครื่องดื่ม |
| `categoryRank(name, category)` | จัดกลุ่มตามหมวดหมู่: จานเดียว(0) → กับข้าว(1) → ทานเล่น/ของหวาน(2) → เครื่องดื่ม(3); ถ้าหมวดไม่ตรงจะเดาจากชื่อเมนูแทน |
| `compareRecommended(a, b)` | ตัวเรียง "แนะนำ": `categoryRank` → `menuRank` → ชื่อ (localeCompare ภาษาไทย) |

### `utils/image.js` — รูปโปรไฟล์

- `AVATAR_ACCEPT` (png/jpeg/webp), `AVATAR_MAX_FILE_SIZE` (5 MB)
- `loadImage(file)` — โหลดไฟล์เป็น `Image` ผ่าน object URL แล้ว `revokeObjectURL` เสมอ (กัน memory leak)
- `toAvatarDataUrl(file, size = 256)` — ครอปกลางภาพเป็นสี่เหลี่ยมจัตุรัส ย่อเหลือ 256×256 บน canvas, เติมพื้นขาวแทนส่วนโปร่งใส แล้ว export เป็น JPEG คุณภาพ 0.85 (~20–40 KB) ก่อนส่งขึ้น API

### `components/layout/menu.js`

`mainMenu(isAdmin)` คืนรายการเมนูหลักที่ใช้ร่วมกันทั้ง Header, UserMenu, MobileNav และ Footer
- ลูกค้า: เมนูอาหาร, ออเดอร์ของฉัน
- Admin: เมนูอาหาร, จัดการเมนู, ออเดอร์, ผู้ใช้

---

## 8. Views — หน้าจอ

### `auth/LoginView.vue`

- `created()` — ถ้ามี `?email=` (มาจากหน้าสมัคร) เติมอีเมลให้อัตโนมัติ
- computed `registered` — อ่าน `?registered=` เพื่อโชว์ข้อความ "สมัครสำเร็จ" / "รออนุมัติ"
- `submit()` — validate ฟอร์ม → `auth/login` → ไปหน้า `?redirect=` (ถ้าเป็น string) หรือ `/` ด้วย `router.replace` (กดย้อนกลับจะไม่กลับมาหน้า login); error แสดงใน `this.error`

### `auth/RegisterView.vue`

- `rules` — required, รูปแบบอีเมล (regex), รหัสผ่าน ≥ 6 ตัว, ยืนยันรหัสผ่านต้องตรงกัน
- `submit()` — validate → `authService.register` → ไปหน้า login พร้อม `query: { registered: 'approved' | '1', email }` แยกกรณีบัญชีที่อนุมัติทันทีกับที่ต้องรอ admin

### `ShopView.vue` — หน้าเมนูอาหาร

- `SORTERS` — ตัวเรียง 5 แบบ: แนะนำ, ใหม่ล่าสุด, ราคาต่ำ→สูง, สูง→ต่ำ, ชื่อ ก-ฮ
- computed `categories` — หมวดหมู่ที่ไม่ซ้ำ เรียงตามภาษาไทย
- computed `visibleProducts` — กรองตาม "เฉพาะที่มีของ", หมวดหมู่, คำค้น (ชื่อ/คำอธิบาย/หมวด) แล้วเรียงตาม sort ที่เลือก
- `load()` — โหลดเมนูทั้งหมด พร้อม state `loading` / `error`
- `addToCart(product)` — ถ้าเมนูมีตัวเลือก → พาไปหน้า detail ให้เลือกก่อน; ไม่มี → `cart/add` ทันที 1 จาน
- `resetFilter()` — คืนค่าตัวกรองเริ่มต้น

### `ProductDetailView.vue` — รายละเอียดเมนู

- `watch: id (immediate)` → `load()` ทำให้เปลี่ยนจากเมนูหนึ่งไปอีกเมนูโดยไม่ unmount ก็โหลดใหม่ได้
- `load()` — ดึงเมนู แล้วสร้าง `picked` ตามกลุ่มตัวเลือก (`isMultiple` → `[]`, ไม่ใช่ → `null`) และรีเซ็ตจำนวน/หมายเหตุ
- computed `selectedOptions` — แปลง `picked` ให้เป็น `[{ group, choice }]`
- computed `optionError` / `unit` — ใช้ `optionProblem` / `unitPrice`
- computed `inCart`, `available`, `canAdd` — จำนวนที่อยู่ในตะกร้าแล้ว, ที่ยังใส่เพิ่มได้, ปุ่มกดได้ไหม
- `addToCart()` — `cart/add` ถ้าสำเร็จรีเซ็ตจำนวนและหมายเหตุ คืนผลลัพธ์
- `buyNow()` — ใส่ตะกร้าแล้วไปหน้าตะกร้าทันที

### `CartView.vue` — ตะกร้า

- `created()` → `syncWithLatestProducts()` ดึงเมนูล่าสุดมา `cart/SYNC` เพื่อให้ราคา/สต็อก/ตัวเลือกในตะกร้าเป็นข้อมูลปัจจุบัน
- `maxOf(item)` — จำนวนสูงสุดของบรรทัดนี้ = สต็อก − จำนวนในบรรทัดอื่นของเมนูเดียวกัน
- `updateQuantity` / `remove` / `clear` — commit ไปที่ cart store
- `checkout()` — วนสั่งทีละรายการ (`orderService.create`) สำเร็จก็ลบออกจากตะกร้า ไม่สำเร็จเก็บไว้ใน `failed` พร้อมเหตุผล จากนั้น sync ใหม่แล้วเปิด `CheckoutResultDialog` สรุปผล — **สั่งสำเร็จบางส่วนได้** รายการที่ล้มเหลวยังอยู่ในตะกร้า

### `OrdersView.vue` — ออเดอร์ (ใช้ร่วมกันทั้งลูกค้าและ admin)

- data `view` — admin สลับได้ระหว่าง `board` (คัมบัง) กับตาราง
- computed `productOptions` / `statusOptions` — ตัวเลือก dropdown กรองเมนู/สถานะ
- computed `visibleOrders` — กรองตามเมนูและสถานะ
- computed `searchedOrders` — กรองต่อด้วยคำค้นผ่าน `matchesOrder` (ใช้กับบอร์ดและการ์ด; ตารางใช้ search ของ `v-data-table` เอง)
- computed `customerOrders` — ฝั่งลูกค้าแบ่ง `active` (ยังไม่จบ) กับ `past` เรียงใหม่สุดก่อน
- computed `stats` — การ์ดสถิติ: จำนวนออเดอร์, รอรับ/กำลังทำ, จำนวนจาน, ยอดรวม (ไม่นับที่ยกเลิก) ข้อความเปลี่ยนตาม role
- `load()` — โหลดออเดอร์และเมนูพร้อมกันด้วย `Promise.all`
- `changeStatus({ order, status })` — ถ้าเป็นการยกเลิก เปิด ConfirmDialog ก่อน; นอกนั้นอัปเดตทันที
- `confirmCancel()` — ยืนยันยกเลิก
- `updateStatus(order, status)` — เรียก API แล้วแทนออเดอร์ตัวเดิมใน list (ไม่ต้องโหลดใหม่ทั้งหมด); ถ้า error แจ้งเตือนและ `load()` ใหม่เพื่อให้ข้อมูลตรงกับ server; `updatingId` ใช้โชว์ loading บนปุ่มของออเดอร์นั้น

### `ProfileView.vue` — โปรไฟล์

- `created()` — ตั้งฟอร์มจาก user ใน store แล้ว `auth/fetchMe` ดึงข้อมูลล่าสุด; ถ้าระหว่างรอผู้ใช้ยังไม่ได้แก้ฟอร์ม (`untouched`) ค่อยรีเซ็ตฟอร์มด้วยข้อมูลใหม่ — กันการเขียนทับสิ่งที่ผู้ใช้กำลังพิมพ์
- computed `profileChanged` — ใช้เปิด/ปิดปุ่มบันทึก
- `pickAvatar()` — กด `<input type="file">` ที่ซ่อนอยู่
- `onAvatarSelected(event)` — ตรวจชนิดไฟล์และขนาด (≤ 5 MB) → `toAvatarDataUrl` → `auth/updateAvatar`; reset `event.target.value` เพื่อให้เลือกไฟล์เดิมซ้ำได้
- `removeAvatar()` — `auth/removeAvatar`
- `resetProfile()` — คืนค่าฟอร์มจาก store และ reset validation
- `saveProfile()` — validate → `auth/updateProfile`
- `savePassword()` — validate (≥ 6 ตัว, ไม่ซ้ำรหัสเดิม, ยืนยันตรงกัน) → `authService.changePassword` → ล้างฟอร์ม
- `logout()` — `auth/logout` แล้วไปหน้า login

### `admin/ManageProductsView.vue` — จัดการเมนู

- `STOCK_TESTS` — เงื่อนไขกรอง all / low (1–5) / out (≤ 0)
- computed `stockFilters` — ปุ่มกรองพร้อมจำนวนในแต่ละกลุ่ม
- computed `filteredProducts` — กรองตามสต็อก + คำค้น
- computed `categories` — ส่งให้ฟอร์มเป็นตัวเลือก autocomplete หมวดหมู่
- computed `stats` — เมนูทั้งหมด, ใกล้หมด, หมดแล้ว, มูลค่าที่ยังขายได้ (Σ price × stock)
- `openCreate()` / `openEdit(product)` / `openDelete(product)` — เปิด dialog ตามโหมด
- `save(payload)` — มี `editing` → update, ไม่มี → create แล้วโหลดใหม่
- `remove()` — ลบเมนู และ `cart/REMOVE_PRODUCT` ลบออกจากตะกร้าในเครื่องด้วย

### `admin/ManageUsersView.vue` — อนุมัติผู้ใช้

- computed `pendingCount` / `visibleUsers` — นับและกรองผู้ใช้ที่ยังไม่อนุมัติ (default แสดงเฉพาะที่รออนุมัติ)
- `load()` — โหลดผู้ใช้ทั้งหมด
- `approve(user)` — อนุมัติ แจ้งเตือน แล้วโหลดรายชื่อใหม่; `approvingId` โชว์ loading บนแถวนั้น

---

## 9. Components

### layout/

| Component | หน้าที่ |
|---|---|
| `AppHeader` | แถบบนสุด เมนูหลักจาก `mainMenu()`, badge จำนวนในตะกร้า — `watch cartCount` เพิ่ม `bumpKey` เมื่อจำนวนเพิ่มขึ้น เพื่อ re-render ให้ badge เล่นแอนิเมชัน "เด้ง" |
| `UserMenu` | เมนู dropdown ผู้ใช้ (avatar/ตัวอักษรแรกของชื่อ, ลิงก์โปรไฟล์, `logout()`) |
| `MobileNav` | bottom navigation บนมือถือ — ลูกค้ามีเพิ่ม ตะกร้า (พร้อม badge) และโปรไฟล์ |
| `AppFooter` | footer ลิงก์เมนู (ฝั่งลูกค้าแทรก "ตะกร้า" เป็นลิงก์ที่ 2) |
| `AppSnackbar` | แสดง `ui.snackbar` เลือก icon ตามสี; computed `visible` เป็น getter/setter ปิดแล้ว commit `ui/HIDE_SNACKBAR` |
| `BrandLogo` | โลโก้ร้าน ปรับขนาดไอคอนและมุมโค้งตาม prop `size` |

### common/

| Component | หน้าที่ |
|---|---|
| `PageHeader` | หัวข้อหน้า + subtitle + slot ปุ่ม |
| `EmptyState` | หน้าว่าง (icon, title, text, slot) |
| `ConfirmDialog` | dialog ยืนยัน ใช้ `v-model`, emit `confirm` |
| `ProductThumb` | แสดงรูปเมนู ถ้าไม่มีรูปหรือโหลดไม่ขึ้น (`failed`) ใช้ `productVisual` (สี + emoji) แทน; `watch src` reset `failed` เมื่อเปลี่ยนรูป |
| `QuantityInput` | ปุ่ม −/+ และช่องตัวเลข; `change(raw, event)` ปัดลงเป็นจำนวนเต็ม, ค่าไม่ใช่ตัวเลขให้เป็น `min`, จำกัดในช่วง `min..max`, เขียนค่าที่ถูกต้องกลับลง input แล้ว emit `input` เมื่อค่าเปลี่ยนจริง |
| `StockChip` | ป้ายสต็อก: หมดแล้ว / ใกล้หมด (หรือ "เหลือ N จาน" เมื่อ `showAmount`) / พร้อมสั่ง |

### auth/

| Component | หน้าที่ |
|---|---|
| `AuthCard` | กรอบการ์ดของหน้า login/register |
| `PasswordField` | ช่องรหัสผ่าน รองรับ `v-model` และปุ่มแสดง/ซ่อน (`visible`) |

### product/

| Component | หน้าที่ |
|---|---|
| `MenuStrip` | แถบเมนูแนะนำแบบเลื่อนอัตโนมัติ — `items` เลือกเฉพาะที่มีของ อาหารเรียงแบบแนะนำ + เครื่องดื่มไม่เกิน 2 รายการ รวมไม่เกิน 10; `mounted` ตั้ง `setInterval` ทุก 3.5 วินาที (ไม่ตั้งถ้าผู้ใช้เปิด `prefers-reduced-motion`); `tick()` ข้ามถ้า hover อยู่ (`paused`) หรือแท็บถูกซ่อน; `step(direction)` เลื่อนทีละการ์ด สุดทางแล้ววนกลับ; `beforeDestroy` ล้าง timer |
| `ProductFilterBar` | ช่องค้นหา, หมวดหมู่, การเรียง, เฉพาะที่มีของ — `update(key, val)` emit object ใหม่ทั้งก้อน (ไม่แก้ prop ตรงๆ) ใช้กับ `v-model` |
| `ProductGrid` | grid ของ `ProductCard` + skeleton ตอนโหลด, ส่งต่อ event `add` |
| `ProductCard` | การ์ดเมนู: `soldOut`, `showStock` (≤ LOW_STOCK), `hasOptions` (เปลี่ยนข้อความปุ่มเป็น "เลือกตัวเลือก"), emit `add` |

### cart/

| Component | หน้าที่ |
|---|---|
| `CartItem` | หนึ่งบรรทัดในตะกร้า: ราคาต่อจาน (`unitPrice`), ข้อความตัวเลือก (`optionsText`), แสดง `problem`, emit `update-quantity` / `remove` |
| `CartSummary` | สรุปจำนวน/ยอดรวม ปุ่มสั่ง (ปิดเมื่อ `disabled` พร้อม `hint`) emit `checkout` |
| `CheckoutResultDialog` | สรุปผลการสั่ง: `allSuccess`, ยอดรวมของออเดอร์ที่สำเร็จ, รายการที่ล้มเหลวพร้อมเหตุผล |

### order/

| Component | หน้าที่ |
|---|---|
| `OrderBoard` | บอร์ดคัมบังของ admin 3 คอลัมน์ (รอรับ / กำลังทำ / เสร็จรอส่ง) เรียงเก่าก่อน (มาก่อนทำก่อน) ปุ่มเลื่อนสถานะไปขั้นถัดไปตาม `ACTIONS` และปุ่มยกเลิก — emit `change-status`; ออเดอร์ที่ส่งแล้วจะไม่อยู่บนบอร์ด |
| `OrderCard` | การ์ดออเดอร์ฝั่งลูกค้า: `headline` ตามสถานะ, `OrderProgress`, ปุ่มยกเลิก (เฉพาะ pending) และปุ่ม "สั่งอีกครั้ง" (`reorderable` = จบแล้วและเมนูยังไม่ถูกลบ) ลิงก์ไปหน้า detail |
| `OrderProgress` | stepper 4 ขั้น — `stateOf(index)` คืน `done` / `current` / `todo` ตามตำแหน่งสถานะปัจจุบัน (สถานะ cancelled จะเป็น `todo` ทั้งหมด) |

### admin/

| Component | หน้าที่ |
|---|---|
| `StatCard` | การ์ดตัวเลขสถิติ (label, value, icon, สี) |
| `ProductTable` | `v-data-table` เมนู emit `edit` / `delete` |
| `ProductFormDialog` | ฟอร์มเพิ่ม/แก้เมนู — ดูรายละเอียดด้านล่าง |
| `OrderTable` | `v-data-table` ออเดอร์ แปลงด้วย `toOrderRow`; ซ่อนคอลัมน์ "ผู้สั่ง" ถ้าไม่ใช่ admin; emit `change-status` |
| `UserTable` | ตารางผู้ใช้ สร้าง `fullName` (ไม่มีชื่อใช้อีเมล) emit `approve` |

#### `ProductFormDialog` (ละเอียด)

- `emptyForm()` — ฟอร์มว่าง (เป็นฟังก์ชันเพื่อได้ object ใหม่ทุกครั้ง)
- `hasDuplicate(names)` — เช็คชื่อซ้ำด้วย `Set`
- `watch value` — ทุกครั้งที่เปิด dialog: โหมดแก้ไข copy ข้อมูลเมนูเข้าฟอร์ม (`optionGroups` ใช้ `JSON.parse(JSON.stringify())` deep copy เพื่อไม่ให้แก้ไขไปโดน object ต้นฉบับก่อนกดบันทึก) โหมดเพิ่มใช้ฟอร์มว่าง แล้ว reset validation ใน `$nextTick`
- `addGroup()` — เพิ่มกลุ่มตัวเลือกใหม่พร้อม choice ว่าง 1 อัน
- `isSortedByPrice(group)` / `sortChoices(group)` — ปุ่มเรียงตัวเลือกตามราคา กดซ้ำสลับ น้อย→มาก / มาก→น้อย
- `findOptionError()` — ตรวจชื่อกลุ่มซ้ำ และชื่อ choice ซ้ำในกลุ่มเดียวกัน
- `submit()` — validate ฟอร์ม + ตรวจตัวเลือก แล้ว emit `save` พร้อมแปลง price/stock เป็น Number

---

## 10. Flow สำคัญ

### Login และหมดอายุ session

```
LoginView.submit()
  → store auth/login → authService.login → http.request (POST /login)
  → SET_SESSION → store.subscribe → saveSession (localStorage)
  → router.replace(redirect || '/')

request ใดก็ได้ตอบ 401
  → http.request → handlers.onUnauthorized (main.js)
  → auth/logout (ล้าง session + ตะกร้า) → snackbar → ไปหน้า login
```

### สั่งอาหาร

```
ShopView.addToCart
  ├─ เมนูมีตัวเลือก → ไปหน้า ProductDetailView
  │     เลือก picked → selectedOptions → optionProblem / unitPrice
  │     → cart/add
  └─ ไม่มีตัวเลือก → cart/add ทันที

cart/add: ตรวจตัวเลือก → ตรวจสต็อกที่เหลือ → ADD (รวมบรรทัดถ้า lineKey ซ้ำ) → notify

CartView: created → SYNC ข้อมูลเมนูล่าสุด → problemOf ตรวจแต่ละบรรทัด
  → checkout(): สั่งทีละรายการ → ลบที่สำเร็จ → สรุปผลใน CheckoutResultDialog
```

### สถานะออเดอร์

```
pending ──รับออเดอร์──▶ cooking ──เสร็จแล้ว──▶ done ──ส่งให้ลูกค้า──▶ delivered
   │                      │
   └──────ยกเลิก──────────┴──▶ cancelled      (ลูกค้ายกเลิกได้เฉพาะ pending)
```

---

## 11. ข้อสังเกตจากการรีวิว

**จุดที่ทำได้ดี**

- แยกชั้น service / store / view ชัดเจน และ error ถูกแปลเป็นไทยที่ `http.js` จุดเดียว
- กฎราคาและตัวเลือก (`unitPrice`, `optionProblem`) อยู่ที่เดียว ใช้ซ้ำทุกจุด ไม่มีโอกาสคำนวณไม่ตรงกัน
- ตะกร้า sync กับข้อมูลเมนูล่าสุดก่อนสั่ง และตรวจปัญหาแต่ละบรรทัด (หมด/เกินสต็อก/ตัวเลือกเปลี่ยน)
- Persistence แยกออกจาก mutation ด้วย `store.subscribe`
- `toOrderRow` รวม logic แสดงผลออเดอร์ไว้ที่เดียว ใช้ทั้งตาราง บอร์ด และการ์ด
- ใส่ใจ UX/Accessibility: `prefers-reduced-motion`, สีผ่าน WCAG AA, `updatingId`/`approvingId` แสดง loading เฉพาะแถว

**จุดที่ปรับปรุงได้**

- `CartView.checkout()` สั่งทีละรายการแบบ sequential — ถ้าตะกร้ายาวจะช้า แต่ข้อดีคือคุมลำดับและสต็อกได้แน่นอน (Back-end ยังไม่มี endpoint สั่งหลายรายการพร้อมกันแบบ transaction)
- `OrderBoard` กำหนด `hidden: 0` ตายตัว ทำให้ข้อความ "และอีก N รายการ" ใน template ไม่มีวันแสดง (ยังไม่ได้จำกัดจำนวนการ์ดต่อคอลัมน์)
- `orderService.getByProduct` ยังไม่มีหน้าไหนเรียกใช้
- token เก็บใน localStorage — เหมาะกับ workshop แต่ production ควรพิจารณา httpOnly cookie
- `http.js` บรรทัด `const BASE_URL =process.env...` ขาดช่องว่างหลัง `=` (เรื่อง format เล็กน้อย)
