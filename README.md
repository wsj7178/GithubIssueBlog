# GithubIssueBlog

> This blog uses Github's Issue tracker and Github Pages with Nuxt.js

## quick setup

1. fork this repository
2. edit static/config/github.json  
edit `user` and `repo` like this, github.com/{user}/{repo}  
Please write github user id for `writers`.
3. You can change your page's title and description in nuxt.config.js

## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

# deploy

## When using Github Pages of user or group accounts (* .github.io repository)
https://medium.com/@robertodev/nuxt-js-and-user-github-pages-fb4c82d7b84e  
I referenced the post above. I recommend reading the above post first.

1. generate static web application
``` bash
$ npm run generate
```

2. clone your Github Pages repository on `../dist` directory
``` bash
$ git clone https://github.com/username/username.github.io deploy
```

3. deploy your website
``` bash
$ make deploy
```

## when using Repository's Github Pages
https://nuxtjs.org/faq/github-pages  
I referenced the guide above.

``` bash
$ npm run generate
$ npm run deploy
```
