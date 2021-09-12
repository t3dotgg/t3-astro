---
title: "Using Vite On Vercel"
date: "2021-06-14"
description: "Vite and Vercel are fun new technologies that sadly don't play nice. This is a guide on how to work around that"
imageURL: "https://t3.gg/images/vite-vercel/twitter.png"
readMore: true
---

<img src={"https://t3.gg/images/vite-vercel/twitter.png"} />

I like fast, simple dev environments. [Vite](https://vitejs.dev) has quickly become my go-to build tool for any new single page app project. [Vercel](https://vercel.com) is my host of choice, greatly simplifying the deployment experience for both static web apps and associated APIs.

I've been loving Vercel's [serverless function implementation](https://vercel.com/docs/serverless-functions/introduction), which enables quick deploys of lambdas by adding JS (or TS) files to the `/api` directory in your repo. You can even run these locally with the Vercel CLI.

Sadly, Vite is not quite as drop-in a solution on Vercel as other build tools (Next.js, Gatsby, Nuxt, etc). After a good bit of hacking, I have managed to get everything working consistently enough that I felt obligated to share. Here's a rough how-to on the steps to get a fresh Vite project running smoothly with Vercel's builds, deploys, and CLI.

### Step One: Init and push

Start a fresh vite project with `npm init @vitejs/app`. [If you prefer Yarn, follow along here](https://vitejs.dev/guide/).

I'll be initializing a fresh React and Typescript project, but _these instructions should work regardless of your framework or choice between JS and TS_.

Once you've initialized the project, make a fresh Github repo, cd into the dir, `npm install`, and push it up.

Rough bash:

```bash
cd !! YOUR PROJECT DIR !!
npm install
git init
git add -A
git commit -m "init"
git branch -M main
git remote add origin !! YOUR REPO URL HERE !!
git push -u origin main
```

### Step 2: Deploy to Vercel

If you are making a single page app (you likely are if using React or Vue), you will need to do a little more config.

By default, Vercel tries to resolve all requests to a file at the path. Works great in Next. Not great for SPAs. To enable non-root routes, you will have to make a `vercel.json` config file that redirects to the root index.html.

`vercel.json`

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Once this is added, you can go to [Vercel.com](https://vercel.com) and create a new project. For framework, select "other". For "Output directory", override the default with `dist`

<img src="/images/vite-vercel/vercel-config.png" alt={"Vercel config"} />

Click "deploy" and you should be live in no time!

## If you do not plan on using Vercel's serverless functions or CLI, you can stop here

Vite's built output is a simple static webapp, which vercel is more than equipped to handle. The vite dev server has a few more weird quirks that you will have to resolve before it will play nice with Vercel's CLI.

### Step 3: Wrangling the CLIs

Vercel's CLI can be installed with a quick `npm i -g vercel` [(more info here)](https://vercel.com/cli).

To assure our changes work, I will also be [creating a simple `/api/hello-world` endpoint](https://github.com/TheoBr/vercel-vite-demo/blob/main/api/hello-world.ts) to confirm the local dev environment is working.

I feel obligated to inform you that **HERE BE DRAGONS**. There's some really weird behaviors in how the Vercel CLI interacts with the vite dev server. I've managed to work around most of these issues [as long as this pr gets merged](https://github.com/vercel/vercel/pull/6359).

First, we have to modify our Vercel project settings once more to point it at a "safer dev command". If you're thinking of modifying the `"dev": "vite"` key in your package.json, _do not do this_. It will break. I have no idea why.

Toggle "override" for "DEVELOPMENT COMMAND" and set it to `npm run {vercel-special-command-name}`.

<img
src="/images/vite-vercel/vercel-dev-config.png"
alt={"Vercel dev special config"}
/>

The following is weird enough that I [stubbed out a commit with all the related changes to make it easier to apply to your project](https://github.com/TheoBr/vercel-vite-demo/commit/8fa15f3b4bfed02019a80fc68845a1e68ef5e196)

Once we have told vercel about this special command, we have to create it. Vercel CLI uses the `--port` argument for...something. 🤷‍♂️

Add the following scripts in package.json

```json
"vercel-dev-helper": "vite --port $PORT",
"vdev": "vercel dev --local-config ./vercel-dev.json"
```

You may have noticed that the `vercel dev` command is pointing to a unique local config. This is because the SPA `rewrite` in our `vercel.json` _does not work with vite's dev server_.

Easiest fix is to create a `vercel-dev.json` with a single `{}` insite to undo that config :).

**Now `npm run vdev` and you should be good to go!**

### Wrap up

Assuming [my fix for import pathing gets merged](https://github.com/vercel/vercel/pull/6359), you should now be good to go! As annoying as this is to config compared to Create React App, Next, and other build tools, it may not seem worthwhile. But man, Vite is fast and simple as _heck_ and I'll be damned if I have to give it up for a few CLI incompatibilities.

In the future, I'd hope these changes are integrated into Vercel's tools, and that we'll see a Vite option in the "frameworks" dropdown :)

Thank you for reading! [Github Repo here for those interested in the full source](https://github.com/TheoBr/vercel-vite-demo)
