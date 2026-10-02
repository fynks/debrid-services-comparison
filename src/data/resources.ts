import type { ResourceGroup } from '@/types/data';

/**
 * Curated tools, apps, and community links, checked on 2026-10-02.
 */

export const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    id: 'media-centers',
    title: 'Media Centers & Streaming Apps',
    icon: 'Tv',
    items: [
      {
        name: 'Stremio',
        url: 'https://www.stremio.com/downloads',
        description:
          'Modern media center with debrid add-on ecosystem for seamless streaming',
        tags: ['All Platforms', 'Add-ons'],
      },
      {
        name: 'Kodi',
        url: 'https://kodi.tv/',
        description:
          'Veteran media center with powerful debrid add-ons like Seren, Fen Light, Umbrella',
        tags: ['All Platforms', 'Add-ons'],
      },
      {
        name: 'Plex',
        url: 'https://www.plex.tv/',
        description:
          'Premium media server with debrid integration via Zurg + Rclone mount',
        tags: ['All Platforms', 'Zurg/Rclone'],
      },
      {
        name: 'Jellyfin',
        url: 'https://jellyfin.org/',
        description:
          'Free open-source media server; perfect alternative to Plex with debrid support',
        tags: ['Open-source', 'Self-hosted'],
      },
      {
        name: 'Infuse',
        url: 'https://firecore.com/infuse',
        description:
          'Premium Apple media player with WebDAV debrid streaming',
        tags: ['Apple TV', 'iOS/macOS'],
      },
      {
        name: 'Syncler',
        url: 'https://syncler.net/',
        description:
          'Android TV app with native debrid support and Netflix-like UI',
        tags: ['Android/ATV', 'Debrid Native'],
      },
    ],
  },
  {
    id: 'media-management',
    title: 'Media Management & Automation',
    icon: 'Database',
    items: [
      {
        name: 'Debrid Media Manager',
        url: 'https://debridmediamanager.com/',
        description:
          'Web-based manager for organizing and streaming debrid content with Trakt integration',
        tags: ['Web-based', 'Trakt'],
      },
      {
        name: 'Riven',
        url: 'https://github.com/rivenmedia/riven',
        description:
          'All-in-one media automation: list polling, indexer search, debrid integration, symlinks',
        tags: ['Automation', 'Plex/Jellyfin'],
      },
      {
        name: 'CineSync',
        url: 'https://github.com/sureshfizzy/CineSync',
        description:
          'Automated media organization and symlink manager for Plex/Jellyfin/Emby with Bazarr support',
        tags: ['Automation', 'Plex', 'Jellyfin'],
      },
      {
        name: 'Zurg',
        url: 'https://github.com/debridmediamanager/zurg-public',
        description:
          'WebDAV server that mounts Real-Debrid as a network drive for media servers',
        tags: ['WebDAV', 'Mount'],
      },
      {
        name: 'CLI-Debrid',
        url: 'https://github.com/godver3/cli_debrid',
        description:
          'Lightweight CLI-based debrid downloader and media manager with Trakt integration',
        tags: ['CLI', 'Automation'],
      },
      {
        name: 'DUMB',
        url: 'https://github.com/I-am-PUID-0/DUMB',
        description:
          'Debrid Unlimited Media Bridge - Docker AIO stack (Zurg+Rclone+Riven+Plex/Jellyfin)',
        tags: ['Docker', 'All-in-One'],
      },
    ],
  },
  {
    id: 'streaming-addons',
    title: 'Streaming Add-ons',
    icon: 'Play',
    items: [
      {
        name: 'Comet',
        url: 'https://github.com/g0ldyy/comet',
        description:
          "Stremio's fastest torrent/debrid add-on with CometNet P2P, proxy, and 10+ scraper support",
        tags: ['Stremio', 'Fastest'],
      },
      {
        name: 'AIOStreams',
        url: 'https://github.com/Viren070/AIOStreams',
        description:
          'Consolidates Torrentio, Comet, MediaFusion into one add-on with advanced filtering',
        tags: ['Stremio', 'Meta-Addon'],
      },
      {
        name: 'Torrentio',
        url: 'https://torrentio.strem.fun/',
        description:
          'Most popular Stremio add-on; simple setup with reliable debrid integration',
        tags: ['Stremio', 'Popular'],
      },
      {
        name: 'MediaFusion',
        url: 'https://github.com/mhdzumair/MediaFusion',
        description:
          'Universal add-on for Movies, Series, Sports & Live TV; private tracker support',
        tags: ['Stremio', 'Sports', 'Live TV'],
      },
      {
        name: 'Jackettio',
        url: 'https://github.com/arvida42/jackettio',
        description:
          'Integrates Jackett with debrid for private tracker support in Stremio',
        tags: ['Stremio', 'Private Trackers'],
      },
      {
        name: 'StremThru',
        url: 'https://github.com/MunifTanjim/stremthru',
        description:
          'Proxy middleware wrapping Stremio addons; supports RD, AD, TB, PM, DL, Offcloud',
        tags: ['Proxy', 'Multi-Debrid'],
      },
    ],
  },
  {
    id: 'download-managers',
    title: 'Download Managers',
    icon: 'Download',
    items: [
      {
        name: 'RDT Client',
        url: 'https://github.com/rogerfar/rdt-client',
        description:
          'Web-based torrent client for RD/AD/PM/TB/DL with qBittorrent API and Usenet support',
        tags: ['Web UI', 'Sonarr/Radarr'],
      },
      {
        name: 'Decypharr',
        url: 'https://github.com/sirrobot01/decypharr',
        description:
          'Go-based bridge between Sonarr/Radarr and debrid; qBittorrent-compatible API',
        tags: ['Go', '*Arr Bridge'],
      },
      {
        name: 'Seanime',
        url: 'https://github.com/5rahim/seanime',
        description:
          'Self-hosted anime media server with AniList integration and auto-download features',
        tags: ['Anime', 'AniList'],
      },
      {
        name: 'pyLoad',
        url: 'https://github.com/pyload/pyload',
        description:
          'Free and open-source download manager supporting 100+ file hosts with plugin system',
        tags: ['Open-source', '100+ Hosts'],
      },
      {
        name: 'JDownloader',
        url: 'https://jdownloader.org/',
        description:
          'Popular download manager with extensive host support and automatic link extraction',
        tags: ['Popular', 'Auto-extract'],
      },
    ],
  },
  {
    id: 'browser-extensions',
    title: 'Browser Extensions',
    icon: 'Globe',
    items: [
      {
        name: 'Magnetar',
        url: 'https://github.com/ArrCee76/magnetar',
        description:
          'Hash detection & one-click adding to RD/TB/AD/PM with popup blocker',
        tags: ['Chrome', 'Firefox', 'Multi-Debrid'],
      },
      {
        name: 'Real-Debrid Extension',
        url: 'https://chromewebstore.google.com/detail/real-debrid-extension/oefkkgfcahbeccgckjgbnfclcmnjgidg',
        description:
          'One-click torrent adding with context menu integration for Chrome and Firefox',
        tags: ['Chrome', 'Firefox'],
      },
      {
        name: 'AllDebrid Helper',
        url: 'https://alldebrid.com/tools/',
        description:
          'Quick link unrestrict with clipboard monitoring and browser notifications',
        tags: ['Quick unrestrict', 'Clipboard'],
      },
      {
        name: 'Deepbrid Extension',
        url: '#',
        description:
          'Browser extension for easy link unrestricting and download management',
        tags: ['Chrome', 'Firefox'],
        extraLinks: [
          {
            label: 'Chrome',
            url: 'https://chromewebstore.google.com/detail/deepbrid-%E2%80%93-browser-extens/ampccappllebdaplacfcopfdgofmohmh',
          },
          {
            label: 'Firefox',
            url: 'https://addons.mozilla.org/en-US/firefox/addon/deepbrid-browser-extension/',
          },
        ],
      },
    ],
  },
  {
    id: 'mobile-applications',
    title: 'Mobile & Desktop Apps',
    icon: 'Smartphone',
    items: [
      {
        name: 'Stremio',
        url: 'https://www.stremio.com/downloads',
        description:
          'Streaming app with debrid add-ons; iOS availability is limited and varies by region',
        tags: ['Cross-platform', 'Streaming'],
      },
      {
        name: 'Syncler',
        url: 'https://syncler.net/',
        description:
          'Android TV app with native debrid support and beautiful Netflix-like interface',
        tags: ['Android/ATV', 'Netflix UI'],
      },
      {
        name: 'Debrify',
        url: 'https://github.com/varunsalian/debrify',
        description:
          'Open-source Flutter debrid manager for Android, iOS, Windows, macOS, Linux',
        tags: ['Cross-platform', 'Open-source'],
      },
      {
        name: 'Unchained',
        url: 'https://github.com/LivingWithHippos/unchained-android',
        description:
          'Community-driven Real-Debrid app for managing downloads',
        tags: ['Android', 'Open-source'],
      },
      {
        name: 'AllDebrid App',
        url: 'https://alldebrid.com/m/',
        description: 'Official AllDebrid PWA for link management and downloads',
        tags: ['PWA', 'Official'],
      },
      {
        name: 'Ferrite',
        url: 'https://github.com/Ferrite-iOS/Ferrite',
        description:
          'iOS media search engine with Real-Debrid integration',
        tags: ['iOS', 'RD'],
      },
      {
        name: 'VLC',
        url: 'https://play.google.com/store/apps/details?id=org.videolan.vlc',
        description:
          'Universal media player with direct link playback and subtitle support',
        tags: ['Media Player', 'Universal'],
      },
      {
        name: 'Premiumize Web',
        url: 'https://www.premiumize.me/features',
        description:
          'Official overview of cloud storage, remote upload, WebDAV, RSS, and API features',
        tags: ['Web', 'Official'],
      },
    ],
  },
  {
    id: 'proxy-infrastructure',
    title: 'Proxy & Infrastructure',
    icon: 'Network',
    items: [
      {
        name: 'MediaFlow Proxy',
        url: 'https://github.com/mhdzumair/mediaflow-proxy',
        description:
          'High-performance proxy for HTTP(S)/HLS/DASH streams with DRM decryption',
        tags: ['Proxy', 'DRM'],
      },
      {
        name: 'StremThru',
        url: 'https://github.com/MunifTanjim/stremthru',
        description:
          'Wraps Stremio addons, proxies streams, manages debrid library across services',
        tags: ['Proxy', 'Multi-Debrid'],
      },
      {
        name: 'Rclone',
        url: 'https://rclone.org/',
        description:
          'Mount cloud/debrid storage as local drive; VFS cache for optimal Plex performance',
        tags: ['Mount', 'Cloud'],
      },
      {
        name: 'DavDebrid',
        url: 'https://github.com/arvida42/davdebrid',
        description:
          'WebDAV for DebridLink/AllDebrid with auto media organization',
        tags: ['WebDAV', 'Auto-organize'],
      },
    ],
  },
  {
    id: 'reddit-communities',
    title: 'Reddit Communities',
    icon: 'Users',
    items: [
      {
        name: 'r/Piracy',
        url: 'https://www.reddit.com/r/piracy',
        description: 'General piracy discussion and guides',
        tags: ['Reddit', 'General'],
      },
      {
        name: 'r/RealDebrid',
        url: 'https://www.reddit.com/r/RealDebrid/',
        description: 'Real-Debrid support and updates',
        tags: ['Reddit'],
      },
      {
        name: 'r/AllDebrid',
        url: 'https://www.reddit.com/r/AllDebrid/',
        description: 'AllDebrid discussion and support',
        tags: ['Reddit'],
      },
      {
        name: 'r/TorBoxApp',
        url: 'https://www.reddit.com/r/TorBoxApp/',
        description: 'TorBox ecosystem, updates, and community support',
        tags: ['Reddit', 'Official'],
      },
      {
        name: 'r/Premiumize',
        url: 'https://www.reddit.com/r/Premiumize/',
        description: 'Premiumize users and discussions',
        tags: ['Reddit'],
      },
      {
        name: 'r/debridmediamanager',
        url: 'https://www.reddit.com/r/debridmediamanager/',
        description: 'DMM support and tutorials',
        tags: ['Reddit'],
      },
      {
        name: 'r/StremioAddons',
        url: 'https://www.reddit.com/r/StremioAddons/',
        description: 'Stremio add-ons and configuration',
        tags: ['Reddit'],
      },
      {
        name: 'r/Addons4Kodi',
        url: 'https://www.reddit.com/r/Addons4Kodi/',
        description: 'Kodi debrid add-on discussions and support',
        tags: ['Reddit', 'Kodi'],
      },
      {
        name: 'r/usenet',
        url: 'https://www.reddit.com/r/usenet/',
        description: 'Usenet and debrid discussion',
        tags: ['Reddit'],
      },
      {
        name: 'r/seedboxes',
        url: 'https://www.reddit.com/r/seedboxes/',
        description: 'Seedbox and cloud torrent discussions',
        tags: ['Reddit'],
      },
      {
        name: 'r/DataHoarder',
        url: 'https://www.reddit.com/r/DataHoarder/',
        description: 'Data archiving and storage',
        tags: ['Reddit'],
      },
      {
        name: 'r/SynclerApp',
        url: 'https://www.reddit.com/r/SynclerApp/',
        description: 'Syncler streaming app community',
        tags: ['Reddit'],
      },
    ],
  },
  {
    id: 'useful-links',
    title: 'Useful Resources',
    icon: 'Star',
    items: [
      {
        name: 'Awesome Debrid',
        url: 'https://github.com/debridmediamanager/awesome-debrid',
        description:
          'Comprehensive curated list of 200+ debrid tools, services, and resources',
        tags: ['Curated', 'GitHub'],
      },
      {
        name: 'TorrentFreak',
        url: 'https://torrentfreak.com/',
        description: 'News and updates about debrid and torrent landscape',
        tags: ['News'],
      },
      {
        name: 'StreamStack',
        url: 'https://streamstack.media/',
        description:
          '20+ apps compared with Plex/Kodi/TorBox/Infuse setup guides',
        tags: ['Guides', 'Comparison'],
      },
      {
        name: 'Savvy Guides',
        url: 'https://savvyguides.wiki/',
        description:
          "Sailarr's Guide, Zurg setup, and debrid recommendations",
        tags: ['Guides', 'Setup'],
      },
      {
        name: 'GitHub Issues',
        url: 'https://github.com/fynks/debrid-services-comparison/issues',
        description: 'Report questions, corrections, and broken links',
        tags: ['Feedback', 'Community'],
      },
      {
        name: 'Is Real-Debrid Down',
        url: 'https://debridmediamanager.com/is-real-debrid-down-or-just-me',
        description: 'Community-driven Real-Debrid service status checker',
        tags: ['Status'],
      },
      {
        name: 'Stremio Addons Directory',
        url: 'https://stremio-addons.net/',
        description: 'Community-maintained directory of Stremio add-ons',
        tags: ['Directory', 'Community'],
      },
      {
        name: 'LeechListing',
        url: 'https://leechlisting.com/',
        description: 'Directory of free premium link generators',
        tags: ['Directory', 'Free PLGs'],
      },
      {
        name: 'Real-Debrid Terms of Service',
        url: 'https://real-debrid.com/terms',
        description: 'Official account-use, sharing, and service terms',
        tags: ['Official', 'Terms'],
      },
    ],
  },
];
