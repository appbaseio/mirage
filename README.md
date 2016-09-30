[![](https://img.shields.io/badge/License-Apache%202.0-green.svg)](https://github.com/appbaseio/mirage/blob/dev/LICENSE.md) [![](https://img.shields.io/badge/angular-2.0.0--rc.4-blue.svg)](https://github.com/appbaseio/mirage/blob/dev/package.json#L20)


![](http://i.imgur.com/RoyFbSb.png?1)

## Mirage: The missing query explorer for Elasticsearch

1. **[Mirage: Intro](#1-mirage-intro)**   
2. **[Features](#2-features)**  
3. **[Roadmap](#3-roadmap)** 
4. **[Build Locally](#4-build-locally)**  
5. **[How to contribute](#5-how-to-contribute)** 


<br>

### 1. Mirage: Intro

The Elasticsearch query DSL supports 150+ query APIs ranging from full-text search, numeric range filters, geolocation queries to nested and span queries. 

Mirage is a modern, open-source web based query explorer for Elasticsearch. 

[![2-min Intro to Mirage](https://i.imgur.com/mBMBdfU.png)](https://vimeo.com/185000306)

It provides the GUI building blocks for different Elasticsearch queries, and transforms them on-the-fly into the JSON query API of Elasticsearch.

<br>

### 2. Features



<br>

### 3. Roadmap

<br>

### 4. Build Locally

```sh
$ npm install 
$ bower install
$ npm start
```

This will start a local webserver running on port 3000 serving mirage locally.

#### `master` branch: Elasticsearch Plugin

```sh
$ npm run build_es_plugin
```

#### `chrome-extension` branch: Chrome extension

```sh
$ npm run build_chrome_extension
```

<br>

### 5. How to Contribute
1. Fork the mirage repo
2. Apply changes on "dev" branch
3. npm run test
4. Do pull request

<br>

![](https://avatars0.githubusercontent.com/u/139426?v=3&s=20) Proudly built with Angular 2!
