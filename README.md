 [![](https://img.shields.io/badge/license-Apache%202-blue.svg)](https://github.com/appbaseio/mirage/blob/dev/LICENSE.md) [![](https://img.shields.io/badge/angular-2.0.2-red.svg)](https://github.com/appbaseio/mirage/blob/dev/package.json#L20)  [![Docker Pulls](https://img.shields.io/docker/pulls/appbaseio/mirage.svg)](https://hub.docker.com/r/appbaseio/mirage/)

![](http://i.imgur.com/RoyFbSb.png?1)

## Mirage: 🔎 GUI for Elasticsearch Queries

1. **[Mirage: Intro](#1-mirage-intro)**   
2. **[Features](#2-features)**  
3. **[Roadmap](#3-roadmap)**
4. **[Build Locally](#4-build-locally)**  
5. **[How to contribute](#5-how-to-contribute)**
6. **[Get Mirage](#6-get-mirage)**  
  a. [Hosted](#use-hosted-app)  
  b. [Chrome Extension](#get-the-chrome-extension)  
  c. [Appbase.io](#appbaseio-dashboard)  
  d. [Run with Docker](#run-with-docker)  
  e. [Elasticsearch Plugin (deprecated)](#install-as-elasticsearch-plugin)

<br>

### 1. Mirage: Intro

The Elasticsearch query DSL supports 100+ query APIs ranging from full-text search, numeric range filters, geolocation queries to nested and span queries.

Mirage is a modern, open-source web based query explorer for Elasticsearch.

[![2-min Intro to Mirage](https://i.imgur.com/mBMBdfU.png)](https://vimeo.com/185000306)

It offers a blocks based GUI for composing Elasticsearch queries and comes with an on-the-fly transformer to show the corresponding JSON query API of Elasticsearch.

<br>

### 2. Features

* Mirage's GUI building blocks offer a smart way to creating queries. It uses the index's Elasticsearch mappings and the selected field's datatype to show only the applicable queries in the dropdown.

![Watch Queries being built in realtime](http://i.imgur.com/9ActpEK.gif)  

<br>

* Mirage provides two ways to add compound query clauses,
  * `Add Conditions` allows adding additional clauses within the same query and  
  * `Nested Query` allows adding a nested query clause.

![Intuitively layer complexity to your queries](http://i.imgur.com/uFpBv4e.gif)  

<br>

* Queries can be saved for later reuse. They can also be captured and shared by copying the URL.

![Save queries for later reuse](http://i.imgur.com/NMAi5tn.gif)

* See docs for any query from within the app.

![Browse docs from within Mirage](http://i.imgur.com/9bDf6ax.gif)

<br>

### 3. Roadmap

Mirage works with any Elasticsearch 2.x, 5.x, 6.x and 7.x index currently. Below is the roadmap for query support.

✓ indicates queries already supported.  
➕ indicates queries we would like to support and see [contributions for](#5-how-to-contribute).  
❌ indicates queries that can't be supported currently.

| Full-text Queries      | Term Level Queries    | Joining Queries | Geo Queries          | Specialized Queries | Span Queries |
| :--------------------: |:---------------------:| :--------------:| :-------------------:|:-------------------:|:------------:|
| 	✓ Match               | 	✓ Term             | ✓ Nested       | ✓ GeoDistance        | ➕ MoreLikeThis     | ✓ SpanTerm   |
| 	✓ Multi-match         | 	✓ Terms            | ✓ HasChild     | ✓ GeoBoundingBox     | ➕ Template         | ➕ SpanMulti  |
| 	✓ Query String        | 	✓ Range            | ✓ HasParent    |  ✓ GeoShape          | ❌ Script           | ✓ SpanFirst  |
| 	✓ Simple Query String | 	✓ Exists           | ✓ ParentId     | ✓ GeoDistanceRange   |                     | ➕ SpanNear   |
| 	✓ Common Terms        | 	✓ Missing          |                 | ✓ GeoPolygon         |                     | ➕ SpanOr     |
|                         | 	✓ Prefix           |                 | ✓ GeoHashCell        |                     | ➕ SpanNot    |
|                         | 	✓ Wildcard         |                 |                      |                     | ➕ SpanContaining |
|                         | 	✓ Regexp           |                 |                      |                     | ➕ SpanWithin |
|                         | 	✓ Fuzzy            |                 |                      |                     |
|                         | 	✓ Ids              |                 |                      |                     |
|                         | ❌ Type              |                 |                      |                     |

Besides broadening the query support, we would like to see Mirage support Elasticsearch v5.0.

<br>

### 4. Build Locally

```sh
$ npm install
$ bower install
$ npm start
```

This will start a local webserver running on port 3030 serving mirage locally.

#### Tests

```sh
$ npm test
```

will fire up the jasmine tests.

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

1. Find a query that can be supported from the [roadmap](#3-roadmap).  
2. Fork the mirage repo and update in "dev" branch.
3. [Create the query files](https://github.com/appbaseio/mirage/blob/dev/HOW-TO-CONTRIBUTE.md).  
4. Build locally and run `npm test`.
5. Submit a PR!

<br>

### 6. Get Mirage

Mirage is available as a hosted app and as a chrome extension.

#### [Use hosted app](https://opensource.appbase.io/mirage/)  

or  

#### [Get the Chrome extension](https://chrome.google.com/webstore/detail/mirage/dcnlpfmnpoggchflmdnkgiepijgljoka)

`Note:` We're working on bringing this back.

or

#### [appbase.io dashboard](https://appbase.io/scalr/apps)

Every app in appbase.io has a query explorer view, which uses mirage.

![Mirage Gif](https://uploads.intercomcdn.com/i/o/11609686/0425a4651aab31dde481fa6c/Mirage_Gif.gif)

or

#### [Run with docker](https://hub.docker.com/r/appbaseio/mirage)

Works with Elasticsearch versions 1.x, 2.x, 5.x, 6.x and 7.x.

```sh
docker run -p 3030:3030 -d appbaseio/mirage
```
**CORS settings**: To make sure you enable CORS settings for your ElasticSearch instance, add the following lines in the ES configuration file.

```
http.port: 9200
http.cors.allow-origin: "/.*/"
http.cors.enabled: true
http.cors.allow-headers: X-Requested-With,X-Auth-Token,Content-Type, Content-Length, Authorization
http.cors.allow-credentials: true
```

#### Install as Elasticsearch Plugin

[Deprecated] Works with Elasticsearch versions 1.x and 2.x. Site plugins have been disabled starting v5.0. We recommend running mirage with docker instead.

```sh
plugin install appbaseio/mirage
```

``Note:`` Elasticsearch has a [CORS header issue](https://github.com/elastic/elasticsearch/issues/17483) with v2.3.0, use v2.3.2 and above.

```
http.port: 9200
http.cors.allow-origin: "/.*/"
http.cors.enabled: true
http.cors.allow-headers: X-Requested-With,X-Auth-Token,Content-Type, Content-Length, Authorization
http.cors.allow-credentials: true
```

After installing the plugin, start the elasticsearch service and visit the following URL to access it.

http://127.0.0.1:9200/_plugin/mirage

``Note:`` If you use Elasticsearch from a different port, the URL to access and the http.cors.allow-origin value in the configuration file would change accordingly.

Mirage can be used along with ⊞ [DejaVu](https://github.com/appbaseio/dejaVu) to browse data and perform CRUD operations inside an Elasticsearch index.

---

Proudly built with ![](https://avatars0.githubusercontent.com/u/139426?v=3&s=20)
