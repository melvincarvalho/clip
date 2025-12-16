# Solid Clip

A clipboard app for the [Solid](https://solidproject.org/) decentralized web platform.

[Live Demo](https://melvincarvalho.github.io/clip/)

## Features

- Login with any Solid Identity Provider (OIDC)
- Save text to your personal Solid Pod
- Load clipboard data from any accessible location
- Shareable URLs with bookmarkable storage locations
- Works with any Solid-compliant Pod

## Tech Stack

- [@inrupt/solid-client-authn-browser](https://www.npmjs.com/package/@inrupt/solid-client-authn-browser) - Authentication
- [@inrupt/solid-client](https://www.npmjs.com/package/@inrupt/solid-client) - Data access
- [Vite](https://vitejs.dev/) - Build tool
- [Bulma](https://bulma.io/) - CSS framework
- [Material Design Icons](https://pictogrammers.com/library/mdi/) - Icons

## Getting Started

### Prerequisites

- Node.js 18+
- A Solid Pod ([get one here](https://solidproject.org/users/get-a-pod))

### Install

```bash
git clone https://github.com/melvincarvalho/clip
cd clip
npm install
```

### Development

```bash
npm run dev
```

Opens at http://localhost:3000

### Build

```bash
npm run build
```

Output is in `dist/` folder.

## How It Works

1. **Login** with your Solid Identity Provider
2. **Enter text** in the clipboard field
3. **Save** to store it in your Pod
4. **Share** the URL - the storage location is in the query string

Data is stored as RDF in your Pod:

```turtle
<#this> <urn:solid:clip#clipboard> "your text here" .
```

## Storage Location

By default, clipboard data is saved to:

```
https://your-pod/clip/data
```

You can change the storage URI to any location you have write access to.

## License

MIT
