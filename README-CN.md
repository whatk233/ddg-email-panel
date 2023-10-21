# DDG Email Panel

<a href='https://github.com/whatk233/ddg-email-panel/blob/main/README.md'>English</a>

> 开源的非官方 [DuckDuckGo Email Protection](https://duckduckgo.com/email) 面板。

![GitHub Repo stars](https://img.shields.io/github/stars/whatk233/ddg-email-panel?style=social)

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=Vercel&logoColor=white) ![GitHub](https://img.shields.io/github/license/whatk233/ddg-email-panel?style=for-the-badge) ![Docker Pulls](https://img.shields.io/docker/pulls/whatk233/ddg-email-panel?style=for-the-badge)


> **Warning**   
> DDG Email Panel 是一个由社区开源的 DuckDuckGo Email Protection 管理面板，虽然不属于 DuckDuckGo 官方 ，但我们仍然会尊重您的隐私，不会存储或出售任何个人信息。
> 
> 由于 DDG Email Panel 是一个开源项目，任何人都可以部署它。因此，我们无法保证公开部署的站点能被信任。为了确保您的隐私和安全，我们强烈建议您使用我们的托管的站点或自行部署 DDG Email Panel。

## ⭐ 特性
* 无需安装 DuckDuckGo 浏览器扩展
* 支持所有现代浏览器
* PWA
* 生成新的隐私别名
* 服务端不存储任何用户信息
* 多语言支持
* 夜间模式

## 📒 Todo
* 多账户管理
* 历史别名管理、备注
* 修改转发地址
* DuckDuckGo Email 账户注销

## 🌏 在线使用
* [DDG Email Panel](http://ddgep.whatk.me/)
* [DDG Email Panel (vercel.app 子域名)](https://ddgep.vercel.app/)

## 🚀 快速部署
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwhatk233%2Fddg-email-panel&demo-title=DDG%20Email%20Panel&demo-description=DDG%20Email%20Panel%20is%20the%20open%20source%20unofficial%20DuckDuckGo%20Email%20Protection%20panel.&demo-url=https%3A%2F%2Fduckduckgo.email)

## ⚓ Docker 部署
```shell
docker run -d --restart=always -p 3000:3000 --name ddg-email-panel whatk233/ddg-email-panel
```

## 🔧 本地部署

### 环境要求
* Node.js 16 or newer

```bash
git clone https://github.com/whatk233/ddg-email-panel.git
cd ddg-email-panel

#pnpm
pnpm install
pnpm build
pnpm start

#yarn
yarn install
yarn build
yarn start

#npm
npm install
npm run build
npm run start

```

## ❤️ 支持
<a href='https://afdian.net/@whatk' target='_blank'>爱发电</a> · <a href='https://ko-fi.com/whatk' target='_blank'>Buy Me a Coffee</a>

## License
MIT

<hr />

Made with ♥ by <a href='https://whatk.me' target='_blank'>Whatk</a>
