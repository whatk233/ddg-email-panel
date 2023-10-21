# DDG Email Panel

<a href='https://github.com/whatk233/ddg-email-panel/blob/main/README-CN.md'>简体中文</a>

> Open source unofficial [DuckDuckGo Email Protection](https://duckduckgo.com/email) panel.

![GitHub Repo stars](https://img.shields.io/github/stars/whatk233/ddg-email-panel?style=social)

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=Vercel&logoColor=white) ![GitHub](https://img.shields.io/github/license/whatk233/ddg-email-panel?style=for-the-badge) ![Docker Pulls](https://img.shields.io/docker/pulls/whatk233/ddg-email-panel?style=for-the-badge)


> **Warning**   
> DDG Email Panel is a community open-source management panel for DuckDuckGo Email Protection. Although it is not officially owned by DuckDuckGo, we still respect your privacy and will not store or sell any personal information.
> 
> DDG Email Panel is an open-source project, anyone can deploy it. Therefore, we cannot guarantee that publicly deployed sites can be trusted. To ensure your privacy and security, we strongly recommend that you use our hosted site or self-host DDG Email Panel.

## ⭐ Features
* No need to install DuckDuckGo browser extension
* Supports all modern browsers
* PWA
* Generate new privacy aliases
* No user information is stored on the server side
* Multi-language support
* Night Mode

## 📒 Todo
* Multi-account management
* History alias management, notes
* Change forwarding address
* DuckDuckGo Email account cancellation

## 🌏 Our hosted
* [DDG Email Panel](http://ddgep.whatk.me/)
* [DDG Email Panel (vercel.app subdomain)](https://ddgep.vercel.app/)


## 🚀 Quick Deployment
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwhatk233%2Fddg-email-panel&demo-title=DDG%20Email%20Panel&demo-description=DDG%20Email%20Panel%20is%20the%20open%20source%20unofficial%20DuckDuckGo%20Email%20Protection%20panel.&demo-url=https%3A%2F%2Fddgep.whatk.me)

## ⚓ Docker Deployment
```shell
docker run -d --restart=always -p 3000:3000 --name ddg-email-panel whatk233/ddg-email-panel
```

## 🔧 Local Deployment

### Environment
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

## ❤️ Donate
<a href='https://ko-fi.com/whatk' target='_blank'>Buy Me a Coffee</a> · <a href='https://afdian.net/@whatk' target='_blank'>爱发电</a>

## License
MIT

<hr />

Made with ♥ by <a href='https://whatk.me' target='_blank'>Whatk</a>
