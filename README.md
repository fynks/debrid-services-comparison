<div align="center">
  <h1>
    <img src="./dist/favicon.svg" alt="Logo" style="height:1em; width:1em; vertical-align:middle">&nbsp;Debrid Services Comparison
  </h1>

  <p><strong>Compare leading debrid services for pricing, host coverage, features, and tools</strong></p>

  <p>
    <a href="https://github.com/fynks/debrid-services-comparison/stargazers"><img alt="GitHub Stars" src="https://img.shields.io/github/stars/fynks/debrid-services-comparison?style=for-the-badge&logo=github"></a>
    <a href="#available-hosts"><img alt="Tracked Services" src="https://img.shields.io/badge/Services-10-4caf50?style=for-the-badge&logo=rocket&logoColor=white"></a>
    <a href="https://debridcompare.xyz"><img alt="Web App" src="https://img.shields.io/badge/Interactive-Web_App-green?style=for-the-badge&logo=google-chrome&logoColor=white"></a>
  </p>

  <a href="https://debridcompare.xyz/"><img src="./dist/images/og.png" alt="Screenshot of interactive comparison web app" width="880" style="border-radius:2px"></a>

</div>

## Quick Navigation

<div align="center">

[Introduction](#what-are-debrid-services) | [Pricing](#pricing-comparison)
| [File Hosts](#file-hosts) | [Tools & Apps](#tools-and-applications)

</div><br>

## Table of Contents

<details><summary>👉 Click to expand</summary>

- [What are Debrid Services?](#what-are-debrid-services)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Pricing Comparison](#pricing-comparison)
- [Available Hosts](#available-hosts)
  - [File Hosts](#file-hosts)
  - [Usenet Support](#usenet-support)
  - [Adult Hosts](#adult-hosts)
- [Policies](#policies)
- [Speed Test](#speed-test)
- [Tools and Applications](#tools-and-applications)
- [Community Resources](#community-resources)
- [Contributing](#contributing)

</details>

## What are Debrid Services?

Debrid ("multi-hoster") services act as paid aggregation layers between you and dozens/hundreds of individual file hosts. You give them a link (or torrent/magnet) → they fetch, cache, and re‑serve it back to you at high speed (often via CDN‑like infrastructure) with fewer throttles and no host ads.

### Key Benefits

- **High-speed downloads** - no countdowns or captchas
- **One subscription** - access to hundreds of file hosts
- **Remote torrent/magnet fetching** - privacy and seedless downloading
- **Streaming-ready links** - compatible with media servers and apps
- **Cloud storage** - automatic file caching (24-72 hours)
- **API access** - automation and third-party integrations

### How It Works

<br>

```mermaid
flowchart TD
    A[User provides file link or torrent] --> B{File on supported host?}
    B -->|Yes| C[Debrid service fetches file]
    C --> D[File cached on high-speed servers]
    D --> E{Stream or download?}
    E -->|Stream| F[Direct streaming link provided]
    E -->|Download| G[High-speed download link provided]
    F --> H[Access file instantly]
    G --> H
    H --> I[File cached for 24-72 hours]
```

<br>

> [!TIP]
> Think of debrid services as a **premium bridge** between you and file-hosting sites, providing instant access to cached content at maximum speed.

## Getting Started

<div align="center">

### Support This Project

> ✨ This guide is **free, open-source, and community-run**. If it helped: starring, reporting corrections, or using a referral link helps sustain maintenance (at no extra cost to you).

| Service     | Referral                                               | Direct Signup                                                    |
| :---------- | :----------------------------------------------------- | :--------------------------------------------------------------- |
| AllDebrid   | [Referral](https://alldebrid.com/?uid=3wvya&lang=en)   | [Signup](https://alldebrid.com/register/)                        |
| Real-Debrid | [Referral](https://real-debrid.com/?id=10990901)       | [Signup](https://real-debrid.com/)                               |
| TorBox      | –                                                      | [Signup](https://torbox.app/login)                               |
| Premiumize  | –                                                      | [Signup](https://www.premiumize.me/register)                     |
| LinkSnappy  | [Referral](https://linksnappy.com/?ref=774668)         | [Signup](https://linksnappy.com/home#Register)                   |
| Debrid-Link | [Referral](https://debrid-link.com/id/7B3BO)           | [Signup](https://debrid-link.com/webapp/register)                |
| Mega-Debrid | –                                                      | [Signup](https://www.mega-debrid.eu/index.php?page=freeregister) |
| Deepbrid    | [Referral](https://www.deepbrid.com/aff/go/upward1971) | [Signup](https://www.deepbrid.com/signup)                        |
| Offcloud    | [Referral](https://offcloud.com/?=c44b1fa5)            | [Signup](https://offcloud.com/register)                          |
| High-Way    | –                                                      | [Signup](https://high-way.me/login/login)                        |

</div>

<div align="right">

[(↑ Back to Top)](#table-of-contents)

</div>

## Pricing Comparison


| **Plan Duration**     | **AllDebrid**                           | **Premiumize** | **Real-Debrid** | **TorBox**        | **Debrid-Link** | **LinkSnappy** | **Mega-Debrid** | **Deepbrid**       | **High-Way**   | **Offcloud** |
| :-------------------- | :-------------------------------------- | :------------- | :-------------- | :---------------- | :-------------- | :------------- | :-------------- | :----------------- | :------------- | :----------- |
| **Free / Trial**      | 7-day trial¹                            | ❌              | ❌               | Free tier²        | ❌               | ❌              | ❌               | Limited hosts only | Limited Hosts⁶ | ❌            |
| **7 Days**            | ❌                                       | ❌              | ❌               | ❌                 | ❌               | $4.99          | ❌               | ❌                  | ❌              | ❌            |
| **15 Days**           | €2.99 (one-time)⁴                       | ❌              | €3.00           | ❌                 | €3.00           | ❌              | ❌               | €4.50              | ❌              | ❌            |
| **30 Days**           | €2.99 (recurring)³<br>€3.99 (one-time)⁴ | $11.99         | €4.00           | From $3.00/month⁵ | €4.00           | $12.99         | €4.00           | €4.99              | From €5.99     | $9.99        |
| **90 Days**           | €8.99 (one-time)⁴                       | $29.99         | €9.00           | ❌                 | €9.00           | $29.99         | €9.00           | €12.99             | From €15.99    | $29.97       |
| **180 Days**          | €15.99 (one-time)⁴                      | ❌              | €16.00          | ❌                 | €16.00          | $54.99         | €16.00          | €19.99             | From €29.99    | ❌            |
| **300 Days**          | €24.99 (one-time)⁴                      | ❌              | ❌               | ❌                 | €25.00          | ❌              | ❌               | ❌                  | ❌              | ❌            |
| **365 Days / 1 Year** | ❌                                       | $79.99         | ❌               | ❌                 | ❌               | ❌              | ❌               | €32.99             | ❌              | $69.99       |

> [!NOTE]
> - **¹ AllDebrid Free Trial**: 7-day trial requires phone verification.
> - **² TorBox Free Tier**: Limited speed and features; no torrenting.
> - **³ AllDebrid Recurring**: Auto-renews monthly at €2.99
> - **⁴ AllDebrid / Debrid-Link One-Time**: Non-recurring payment. Often better value than recurring.
> - **⁵ TorBox Tiers**: Multiple plans starting at $3.00/month. Higher tiers unlock more features.
> - **⁶ High-Way**: Limited Hoster, FreeMB through activity in the forum

### Up-to-date Pricing

> [!TIP]  
> *Always verify prices on official sites as they change frequently.*

<details><summary>👉 Click to expand</summary>

| **Service** | **Official Pricing Page**                                                  |
| :---------- | :------------------------------------------------------------------------- |
| AllDebrid   | [alldebrid.com/offer](https://alldebrid.com/offer/)                        |
| Real-Debrid | [real-debrid.com/premium](https://real-debrid.com/premium)                 |
| TorBox      | [torbox.app/pricing](https://torbox.app/pricing)                           |
| Premiumize  | [premiumize.me/premium](https://www.premiumize.me/premium)                 |
| LinkSnappy  | [linksnappy.com/myaccount/extend](https://linksnappy.com/myaccount/extend) |
| Debrid-Link | [debrid-link.com/premium](https://debrid-link.com/premium)                 |
| Mega-Debrid | [mega-debrid.eu/offres](https://www.mega-debrid.eu/index.php?page=offres)  |
| Deepbrid    | [deepbrid.com/signup](https://www.deepbrid.com/signup)                     |
| High-Way    | [high-way.me/pages/tariffs](https://high-way.me/pages/tariffs)             |
| Offcloud    | [https://offcloud.com/#pricing](https://offcloud.com/#pricing)             |

</details><br>

> **Last updated: September 19, 2025**

<br>

<div align="right">

[(↑ Back to Top)](#table-of-contents)

</div>

## Available Hosts

### File Hosts

<br><div align="center">

| ⚡ For faster exploration (search + filter + side-by-side), use the <a href="https://debridcompare.xyz" target="_blank" rel="noopener">interactive web app</a>. |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

</div>

| **Service Name** | **Premiumize** | **Debrid-Link** | **LinkSnappy** | **Mega-Debrid** | **Deepbrid** | **High-Way** | **Offcloud** | **AllDebrid** | **Real-Debrid** | **TorBox** |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1Fichier | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 1Tv | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 24Uploading | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| 2Shared | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| 4Share | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| 4Shared | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| 4Tube | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| 4Upld | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| 5Azn | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Abcnews | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Acast | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Akafile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Alfafile | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Allmyvideos | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Annas archive | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Anonfiles | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Anzfile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Aparat | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Apkadmin | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Archive.org | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Audioboom | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Audiomack | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Auroravid | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Ausfile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Ayefiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Backin | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Baidu | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Baidu video | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Bayfiles | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Bbc | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Bdupload | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Beta hoster | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Bilibili | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Billionuploads | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Bitvid | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Bluesky | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Box | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Brfiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Buenastareas | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Bunkr | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Buzzheavier | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Bytewhale | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Calameo | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Camdemy | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Canalplus | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Catshare | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Cc.com | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Chilloutzone | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Cinemassacre | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Clicknupload | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Clipfish | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Clipsyndicate | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cloudfile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Cloudghost | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Cloudsix | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Cloudvideo | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Clubic | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Collegehumor | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Comedy central | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Comedycentral | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Coub | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Crunchyroll | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ctfile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Daclips | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Dagbladet | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Dailymail | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Dailymotion | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Dailyuploads | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Daofile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Darikibox | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Data nodes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Datafilehost | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Datei | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Datoid | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Dbr | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Dctp | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Ddl | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Ddlstorage | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Ddowload / ddl.to | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ddownload | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Ddownload10 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Deezer | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Depositfiles | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Discovery channel | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Dl.free | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Dood | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Doraupload | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Dotsub | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Douploads | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Downloadani | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Drop | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Drop.download | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Drop.download / dropapk | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Dropapk | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Dropbox | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Dropgalaxy | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Dropmefiles | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Easybytez | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Ebaumsworld | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Elephantafiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Elitefile | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ellentv | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Emload | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Erafile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Exload | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Extmatrix | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Facebook | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Fastbit | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Fastdrive | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Fastfile | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Fastshare | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Faststore | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Fikper | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| File | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| File.al | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| File4safe | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Fileaxa | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Fileblade | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Filecat | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Filecloud | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Fileden | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Filedot | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Filefactory | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Fileflyer | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Filefox | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Fileice | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Filejoker | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Fileland | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Filemoney | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Filenext | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Filepup | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Filer | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Filer.net | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Filerio | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Filesabc | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Filescdn | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Filesflash | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Filesfly | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Filesmonster | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Filespace | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Filestank | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Filestore | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Filestore.me | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Filestore.to | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Filextras | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Filezip | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Firedrop | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Fireget | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Flashbit | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Flashx | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Flipagram | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Flix555 | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Formula1 | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Foxnews | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Free | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Fshare | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Fuckingfast | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Gaia | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Gamefront | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Gamersyde | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Gamestar | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Gboxes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Gigapeta | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Gigasize | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Github | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Gofile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Google | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Google drive | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Gorillavid | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Harefile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Heroupload | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Hexload | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Hexupload / hexload | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Hitfile | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Hot4share | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Hotlink | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Hotstar | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Hulkshare | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Hzfile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Icedrive | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Icerbox | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Icerbox* | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Icloud drive | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Idnes | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Imgur | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Inclouddrive | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Indishare | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Instagram | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Interfile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Isra | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Isra.cloud | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Issuu | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Izlesene | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Jamendo | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Jumploads | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| K2s* | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Karrierevideos | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Katfile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Keek | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Keep2share | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Keepfile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Kenfiles | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Khanacademy | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Kick | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Kickstarter | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Koofr | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Krakenfiles | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Kshared | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Kvid | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Labload | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Lafiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Lcp | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Letitbit | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Limefile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Littlebyte | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Load | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Longfiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Loom | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Lunaticfiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Lynda | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Masterani | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Mediaccc | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Mediafile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Mediafire | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Mediafree | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Mega | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Megacache | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Megairon | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Megaup | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Metacafe | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Mexashare | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Minhateca | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Mirrorace | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Mixcloud | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Mixdrop | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Modsbase | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Moondl | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Movieclips | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Movpod | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Movshare | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Mp4upload | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Msnbc | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Multiup | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Myspass | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Naver | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Nbcsports | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Ndtv | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Nelion | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Nexusmods | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Nfl | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Niconico | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Nicovideo | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Ninjastream | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Nitroflare | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Novafile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Novamov | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Nowdownload | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Nowvideo | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Nytimes | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| Oboom | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Odatv | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Odnoklassniki | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Ok.ru | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Onet | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Onionstudios | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ozibox | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Pan baidu | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Panopto | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Paramount+ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Pcloud | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Periscope | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Pillowcase | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Pinkbike | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Pinterest | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Piwi+ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Pixeldrain | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Play | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Plays | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Playtvak | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Prefiles | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Promptfile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Purevid | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Putlocker | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Pyvideo | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Qiwi | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Qobuz | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Radiotunes | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Rapidfileshare | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Rapidgator | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Rapidpaid | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Rapidrar | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Rapidu | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Rarefile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Redbunker | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Reddit | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Revision3 | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Rockfile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Rosefile | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Rtbf | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Rte | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Rts | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Rtve.es | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Ruhd | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Rutube | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Ruutu | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Salefiles | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Scribd | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Sdilej | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Secureupload | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Send.cm | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Send.now | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Sendit | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Sendspace | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Shareflare | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Sharemods | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Silkfiles | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Simfileshare | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Slideshare | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Slingfile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Smotri | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Snapchat | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Snotr | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Sockshare | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Solidfiles | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Soundcloud | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ |
| Sportdeutschland | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Steam | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Steam (video) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Stream.cz | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Streamable | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Streamcloud | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Streamers | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Streamtape | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Subyshare | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Swisstransfer | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Syncs | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Sztv | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Takefile | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Teachingchannel | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Teamfourstar | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Techtalks | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ted | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Telebruxelles | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Terabox | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Terabytez | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Tezfiles | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Tf1 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Tiktok | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Tlc | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Trashbytes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Tumblr | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Turbobit | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tusfiles | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Tweakers | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Twitch | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| Twitter | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Ubiqfile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Uktv play | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Uloz | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Unibytes | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Unlimitzone | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Upasias | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Upload | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Upload.af | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Upload42 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Upload4earn | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Uploadbank | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Uploadbox | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Uploadboy | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Uploadev | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Uploadex | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Uploadgig | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Uploadhaven | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Uploading | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Uploadlux | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Uploadocean | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Uploadrar | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Uploadrocket | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Uploads | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Uploady | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Uplod | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Uppit | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Upshared | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Upstream | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Uptobox | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Upvid | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Uqload | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Userscloud | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Usersdrive | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Userupload | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ustream | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Veoh | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Verystream | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Vessel | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Vev | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Vidabc | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Video | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Videomega | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Videowood | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Vidoza | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Vidspot | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Vidto | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Vidzi | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Vimeo | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Viooz | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Vipfile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Vk | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Vodlocker | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Voe | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Vup | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Wayupload | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Webshare | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Wipfiles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Workupload | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Worldbytez | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Wupfile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Wupfile / salefiles | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Wushare | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Xenupload | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Xiaohongshu | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Xubster | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Xvidstage | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Yandex disk | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Yandex video | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Youdbox | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Youku | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Youtube | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Youwatch | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Yunfile | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Fileal | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Hexupload | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Ddownload / ddl.to | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Send.cm / send.now | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| 123Pan | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Coomer | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Darkibox | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Drtuber | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Filepress | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Files.vc | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Isracloud | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Megadb | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Send | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Viking file | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

<br>

> **Last updated: September 19, 2025**

<div align="right">

[(↑ Back to Top)](#table-of-contents)

</div>

### Usenet Support

> [!TIP]
> Usenet is a global system for sharing files and messages in topic-based groups. Think of it as a giant, searchable forum where you can find discussions and download content.

| Service         | AllDebrid | TorBox | Premiumize | Real-Debrid | Debrid-Link | LinkSnappy | Mega-Debrid | Deepbrid | High-Way | Offcloud |
|-----------------|:---------:|:------:|:----------:|:-----------:|:-----------:|:----------:|:-----------:|:--------:|:--------:|:--------:|
| **Usenet**      |    ❌     |   ✅   |     ✅     |      ❌     |      ❌     |     ❌     |      ❌     |    ❌    |    ❌    |    ✅    |


### Adult Hosts

> Support varies. Some services exclude adult content for legal/policy reasons.

👉 [See Detailed Adult Host Support](./Adult-hosts.md)

### Live Status

Service availability and host support can change in real time. Use these official status pages to check current host connectivity, server health, and service uptime.

<details><summary>👉 Click to expand contents</summary>

| **Service**     | **Live Host Status Page**                                                         |
| :-------------- | :-------------------------------------------------------------------------------- |
| **AllDebrid**   | [alldebrid.com/status/](https://alldebrid.com/status/)                            |
| **Real-Debrid** | [real-debrid.com/compare](https://real-debrid.com/compare)                        |
| **Premiumize**  | [premiumize.me/services](https://www.premiumize.me/services)                      |
| **LinkSnappy**  | [linksnappy.com/myaccount/status](https://linksnappy.com/myaccount/status)        |
| **TorBox**      | [torbox.app/hosters](https://torbox.app/hosters)                                  |
| **Debrid-Link** | [debrid-link.com/webapp/status](https://debrid-link.com/webapp/status)            |
| **Mega-Debrid** | [mega-debrid.eu/hebergeurs](https://www.mega-debrid.eu/index.php?page=hebergeurs) |
| **Deepbrid**    | [deepbrid.com/status](https://www.deepbrid.com/status)                            |
| **High-Way**    | [high-way.me/pages/status](https://high-way.me/pages/status)                      |
| **Offcloud**    | [https://offcloud.com/list](https://offcloud.com/list)                            |

</details>

<br>

<div align="right">

[(↑ Back to Top)](#table-of-contents)

</div>

## Policies

> 💡 Official Terms, Privacy, Refund, and Support pages for each provider. Refund eligibility varies widely; always verify before purchase.

| **Service** | **Terms**                                                                             | **Privacy**                                                  | **Refund Policy**                                     | **Support/Contact**                                             |
| ----------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------- | --------------------------------------------------------------- |
| AllDebrid   | [TOS](https://alldebrid.com/tos/)                                                     | [Privacy](https://alldebrid.com/privacy/)                    | See TOS                                               | [Contact](https://alldebrid.com/contact/)                       |
| Real-Debrid | [Terms](https://real-debrid.com/terms)                                                | [Privacy](https://real-debrid.com/privacy)                   | Not stated                                            | [Support](https://real-debrid.com/support)                      |
| LinkSnappy  | [TOS](https://linksnappy.com/tos)                                                     | [Privacy](https://linksnappy.com/privacy-policy)             | [Refunds](https://linksnappy.com/refund-policy)       | [Support](https://support.linksnappy.com/support/tickets/new)   |
| TorBox      | [Terms](https://torbox.app/terms)                                                     | [Privacy](https://torbox.app/privacy)                        | [Refunds](https://torbox.app/terms#refunds)           | [Support](https://support.torbox.app/)                          |
| Debrid-Link | [TOS](https://debrid-link.com/tos)                                                    | [Privacy](https://debrid-link.com/privacy)                   | See TOS                                               | [Contact](https://debrid-link.com/contact)                      |
| Premiumize  | [Legal](https://www.premiumize.me/legal#tos)                                          | [Privacy](https://www.premiumize.me/privacy)                 | [Refund](https://www.premiumize.me/legal#refund)      | [Help](https://www.premiumize.me/help)                          |
| Mega-Debrid | [Conditions](https://www.mega-debrid.eu/index.php?page=conditionsutilisation&lang=en) | [Privacy](https://www.mega-debrid.eu/index.php?page=privacy) | Check CGV                                             | [Support](https://megadebrid.freshdesk.com/support/tickets/new) |
| Deepbrid    | [Terms](https://www.deepbrid.com/page/terms)                                          | [Privacy](https://www.deepbrid.com/page/privacy)             | [Refund](https://www.deepbrid.com/page/refund-policy) | [Support](https://www.deepbrid.com/contact-form)                |
| High-Way    | [Terms](https://high-way.me/help/terms)                                               | [Privacy](https://high-way.me/help/privacy-policy)           | See Terms                                             | [Support](https://high-way.me/pages/support/)                   |
| Offcloud    | [Terms](https://offcloud.com/terms)                                                   | [Privacy](https://offcloud.com/terms)                        | See Terms                                             | [Contact](https://github.com/Offcloud/offcloud-log)             |

> If a link returns 404, try the site’s footer “Legal/Help” links or contact support.

<div align="right">

[(↑ Back to Top)](#table-of-contents)

</div>

## Speed Test

Download speeds vary based on your location, time of day, server load, and target file host. Always test performance before committing to a long-term plan.

### Official Speed Tests

Use these direct speed test links to measure real-world performance from each provider’s servers:

| **Service**     | **Speed Test Page**                                                          |
| :-------------- | :--------------------------------------------------------------------------- |
| **Real-Debrid** | [real-debrid.com/speedtest](https://real-debrid.com/speedtest)               |
| **Premiumize**  | [premiumize.me/speedtest](https://www.premiumize.me/speedtest)               |
| **TorBox**      | [torbox.app/speedtest](https://www.torbox.app/speedtest)                     |
| **Debrid-Link** | [debrid-link.com/webapp/speedtest](https://debrid-link.com/webapp/speedtest) |
| **Mega-Debrid** | [mega-debrid.eu/network](https://www.mega-debrid.eu/index.php?page=network)  |

### Real-World Speed Test Steps

<details>
<summary>👉 Click to expand</summary>

For a more accurate assessment, follow these steps:

1. **Choose a common test file** (e.g., a Linux ISO or public benchmark file) available on multiple hosts.
2. **Use the same network and device** for all tests to ensure consistency.
3. **Clear cache and cookies** between sessions or use private browsing.
4. **Run 3 tests per service** and calculate the average speed.
5. **Test during peak and off-peak hours** to gauge performance variability.

</details>

#### Factors That Affect Speed
- Geographical distance to provider’s servers  
- Time of day and network congestion  
- Performance of the original file host (e.g., Rapidgator vs. Katfile)  
- Your ISP’s routing and potential throttling  
- Local network setup (Wi-Fi vs. Ethernet, router quality)

> [!WARNING] 
> Advertised "unlimited" speeds may be subject to fair-use policies or soft caps under heavy usage.

<div align="right">

[(↑ Back to Top)](#table-of-contents)

</div>


## Tools and Applications

### Media Management

| Tool | Description | Official Link |
| :--- | :---------- | :------------ |
| **Debrid Media Manager** | Web-based manager for organizing and streaming debrid content with Trakt integration | [Website](https://debridmediamanager.com/) <br> [GitHub](https://github.com/debridmediamanager/debrid-media-manager) |
| **CineSync** | Automated media organization and symlink manager for Plex/Jellyfin/Emby with Bazarr support | [GitHub](https://github.com/sureshfizzy/CineSync) |
| **Zurg** | WebDAV server that mounts Real-Debrid as a network drive for media servers | [GitHub](https://github.com/debridmediamanager/zurg-testing) |

### Streaming Add-ons

| Tool | Description | Official Link |
| :--- | :---------- | :------------ |
| **Comet** | Advanced Stremio add-on with real-time torrent indexing and multi-debrid support | [GitHub](https://github.com/g0ldyy/comet) |
| **MediaFusion** | Universal Stremio add-on with sports, live TV, and extensive debrid service support | [GitHub](https://github.com/mhdzumair/MediaFusion) |
| **Torrentio** | Popular Stremio add-on with simple setup and reliable debrid integration | [Website](https://torrentio.strem.fun/) |

### Download Managers

| Tool | Description | Official Link |
| :--- | :---------- | :------------ |
| **RDT Client** | Web-based torrent client for Real-Debrid, AllDebrid, and Premiumize with Sonarr/Radarr integration | [GitHub](https://github.com/rogerfar/rdt-client) |
| **Seanime** | Self-hosted anime media server with AniList integration and auto-download features | [GitHub](https://github.com/5rahim/seanime) |
| **pyLoad** | Free and open-source download manager supporting 100+ file hosts with plugin system | [GitHub](https://github.com/pyload/pyload) |
| **JDownloader** | Popular download manager with extensive host support and automatic link extraction | [Website](https://jdownloader.org/) |

### Browser Extensions

| Tool | Description | Official Link |
| :--- | :---------- | :------------ |
| **Real-Debrid Torrent Plugin** | One-click torrent adding with context menu integration for Chrome and Firefox | [Chrome](https://chromewebstore.google.com/detail/real-debrid-extension/oefkkgfcahbeccgckjgbnfclcmnjgidg) |
| **AllDebrid Helper** | Quick link unrestrict with clipboard monitoring and browser notifications | [Official Link](https://alldebrid.com/tools/) |
| **Deebrid Extension** | Browser extension for easy link unrestricting and download management | [Chrome](https://chromewebstore.google.com/detail/deepbrid-%E2%80%93-browser-extens/ampccappllebdaplacfcopfdgofmohmh) <br> [Firefox](https://addons.mozilla.org/en-US/firefox/addon/deepbrid-browser-extension/) |

### Mobile Applications

| App | Description | Official Link |
| :-- | :---------- | :------------ |
| **Stremio** | Cross-platform streaming app with debrid add-on support and device sync | [Website](https://www.stremio.com/downloads) |
| **AllDebrid App** | Official AllDebrid PWA for link management and downloads | [PWA](https://alldebrid.com/m/) |
| **Unchained** | Community-driven Real-Debrid app for managing downloads | [Unchained](https://github.com/LivingWithHippos/unchained-android) |
| **VLC** | Universal media player with direct link playback and subtitle support | [Website](https://play.google.com/store/apps/details?id=org.videolan.vlc) |

## Community Resources

### Reddit Communities

- [r/Piracy](https://www.reddit.com/r/piracy) - General piracy discussion and guides
- [r/RealDebrid](https://www.reddit.com/r/RealDebrid) - Real-Debrid support and updates
- [r/AllDebrid](https://www.reddit.com/r/AllDebrid) - AllDebrid discussion
- [r/Premiumize](https://www.reddit.com/r/Premiumize) - Premiumize users
- [r/debridmediamanager](https://www.reddit.com/r/debridmediamanager) - DMM support and tutorials
- [r/StremioAddons](https://www.reddit.com/r/StremioAddons) - Stremio add-ons and configuration
- [r/usenet](https://www.reddit.com/r/usenet) - Usenet and debrid discussion
- [r/DataHoarder](https://www.reddit.com/r/DataHoarder) - Data archiving and storage


### Useful Resources

- [Awesome Debrid](https://github.com/debridmediamanager/awesome-debrid) - Curated list of tools and resources
- [TorrentFreak](https://torrentfreak.com/) - News and updates
- [GitHub Discussions](https://github.com/fynks/debrid-services-comparison/discussions) - Ask questions and share experiences
- [Is Real-Debrid Down](https://debridmediamanager.com/is-real-debrid-down-or-just-me) - Service status checker

> Join communities to get help, share experiences, and stay updated on service changes.

<div align="right">

[(↑ Back to Top)](#table-of-contents)

</div>

## Disclaimer

This project aims to provide accurate and up-to-date information, but the debrid service landscape is dynamic. Please keep the following in mind:

- **Services change frequently**: Pricing, host support, refund policies, and features change often—always check official sites before purchase.
- **Final cost may vary**: Prices are subject to exchange rates, regional taxes, or payment processing fees. Actual charge may differ.
- **Data accuracy**: Data is community-sourced and not guaranteed for accuracy, uptime, or feature availability.
- **No affiliation**: This project is independent and not affiliated with any listed service.
- **Use at your own discretion**: Choose and use debrid services at your own discretion; test with short-term plans first.
- **Legal responsibility**: Debrid services are tools. You are responsible for complying with copyright laws and terms of use when accessing content.

> [!IMPORTANT]
> **This is an open-source, community-maintained guide. It does not endorse or promote unauthorized file sharing.**

<div align="right">

[(↑ Back to Top)](#table-of-contents)

</div>

---

## Contributing
Help keep this guide accurate! We welcome:

- ✅ Price/host support updates (with source)
- ✅ Broken link fixes
- ✅ Policy clarifications
- ✅ UX/UI suggestions

> 🛡️ All PRs are verified against official sources before merging.

**[See Contribution Guidelines →](./CONTRIBUTING.md)**

<div align="right">

[(↑ Back to Top)](#table-of-contents)

</div>

## Support and Stay Updated

This guide remains **free, ad-free, and unbiased** through community support. If it helped you choose the right service or saved you time, here's how you can contribute:

### Ways to Support

[![Star on GitHub](https://img.shields.io/github/stars/fynks/debrid-services-comparison?style=for-the-badge&label=Star%20on%20GitHub&logo=github)](https://github.com/fynks/debrid-services-comparison)
[![Contribute](https://img.shields.io/badge/Contribute-Open_an_issue_or_PR-brightgreen?style=for-the-badge&logo=github)](https://github.com/fynks/debrid-services-comparison/issues)
[![Referral Links](https://img.shields.io/badge/Support-Use_referral_links-orange?style=for-the-badge&logo=buymeacoffee)](#support-this-project)

---

<div align="center">

<small>Community-Driven • No Sponsored Content • No Paid Placements</small>

---

[![Back to Top](https://img.shields.io/badge/Back_to_Top-%E2%86%91-blue?style=for-the-badge)](#table-of-contents)

</div>