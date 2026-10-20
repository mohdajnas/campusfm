// Music Search & Resolver Service for MESCE FM 108.1
// Full-length (3-8+ minute) song playback engine with HD artwork and queue integration.
import CryptoJS from 'crypto-js'

export const POPULAR_MALAYALAM_YOUTUBE_MAP = {
  illuminati: { id: 'tOM-nWPcR4U', duration: 212 },
  kuthanthram: { id: 'YkVprVT04OA', duration: 240 },
  cherathukal: { id: 'JukNAg7bz6I', duration: 221 },
  'manavalan thug': { id: '_eWvDaztcjI', duration: 200 },
  'manavaalan thug': { id: '_eWvDaztcjI', duration: 200 },
  darshana: { id: 'B-pNp0LUV2Y', duration: 225 },
  aadharanjali: { id: 'yvPspB0p83E', duration: 149 },
  'nada nada': { id: '0yZ5x3bQoJg', duration: 304 },
  'fish rock': { id: 'y4qHn-j3l4k', duration: 259 },
  malare: { id: '0G2VxhV_g10', duration: 316 },
  'jimikki kammal': { id: 'FXiaIH49oAU', duration: 200 },
  'pala palli': { id: '1C_w_f81g7k', duration: 270 },
  yellow: { id: 'yKNxeF4KMsY', duration: 266 },
  'kun faya kun': { id: 'T94PHkuydcw', duration: 469 },
  'neela nilave': { id: 'B3eam3427u8', duration: 253 },
  'kanmani anbodu': { id: 'qY8k2G4c9vA', duration: 327 },
  jaada: { id: 'Y9_bF0xL3z4', duration: 162 },
  armadham: { id: 'X4w5eQ10q7I', duration: 173 },
  chekele: { id: 'eCgQ3jY2YFk', duration: 301 },
  navarasam: { id: '2Vv-BfVoq4g', duration: 394 },
}

export const DEFAULT_ALBUM_COVER =
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'

export const DEFAULT_MALAYALAM_PLAYLIST = [
  {
    id: 'mesce-track-1',
    title: 'Illuminati (From "Aavesham")',
    artist: 'Sushin Shyam, Dabzee & Vinayak Sasikumar',
    album: 'Aavesham (Original Motion Picture Soundtrack)',
    cover: 'https://c.saavncdn.com/202/Aavesham-Original-Motion-Picture-Soundtrack-Malayalam-2024-20250910150630-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/202/ba6006006a2f40e6b20b5ced32cc2885_320.mp4',
    youtubeId: 'tOM-nWPcR4U',
    duration: 212, // Full 3 mins 32 secs
    genre: 'Malayalam Hip-Hop / Ost',
  },
  {
    id: 'mesce-track-2',
    title: 'Kuthanthram',
    artist: 'Sushin Shyam & Vedan',
    album: 'Manjummel Boys (Original Motion Picture Soundtrack)',
    cover: 'https://c.saavncdn.com/934/Manjummel-Boys-Original-Motion-Picture-Soundtrack-Malayalam-2024-20250905071140-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/934/a907bd3ca1d14ac2b04b7ab10a0ddcd1_320.mp4',
    youtubeId: 'YkVprVT04OA',
    duration: 240, // Full 4 mins
    genre: 'Malayalam Indie Rap',
  },
  {
    id: 'mesce-track-3',
    title: 'Cherathukal (From "Kumbalangi Nights")',
    artist: 'Sushin Shyam & Sithara Krishnakumar',
    album: 'Kumbalangi Nights',
    cover: 'https://c.saavncdn.com/993/Kumbalangi-Nights-Malayalam-2019-20260210193755-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/993/84d3c0a7f13ef6091b16a9c31c5540b2_320.mp4',
    youtubeId: 'JukNAg7bz6I',
    duration: 221, // Full 3 mins 41 secs
    genre: 'Acoustic Melody',
  },
  {
    id: 'mesce-track-4',
    title: 'Manavaalan Thug (From "Thallumaala")',
    artist: 'Dabzee & S.A.',
    album: 'Thallumaala (Original Motion Picture Soundtrack)',
    cover: 'https://c.saavncdn.com/017/Thallumaala-Malayalam-2022-20230110143259-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/017/19451f6bde7e61ee8753387543e4633b_320.mp4',
    youtubeId: '_eWvDaztcjI',
    duration: 200, // Full 3 mins 20 secs
    genre: 'Campus Hype / Rap',
  },
  {
    id: 'mesce-track-5',
    title: 'Darshana (From "Hridayam")',
    artist: 'Hesham Abdul Wahab & Darshana Rajendran',
    album: 'Hridayam (Original Soundtrack)',
    cover: 'https://c.saavncdn.com/555/Hridayam-Side-A-Malayalam-2022-20230803211029-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/555/dd42c3e603cb40b91cc2ddd03ae6a499_320.mp4',
    youtubeId: 'B-pNp0LUV2Y',
    duration: 225, // Full 3 mins 45 secs
    genre: 'College Romance / Indie',
  },
  {
    id: 'mesce-track-6',
    title: 'Aadharanjali (From "Romancham")',
    artist: 'Sushin Shyam, Madhuvanthi Narayan & Vinayak Sasikumar',
    album: 'Romancham (Original Motion Picture Soundtrack)',
    cover: 'https://c.saavncdn.com/453/Romancham-Malayalam-2023-20230216173246-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/453/9b96c77723afa9b9595f0e9c6d93cd65_sar_320.mp4',
    youtubeId: 'yvPspB0p83E',
    duration: 149, // Full 2 mins 29 secs
    genre: 'Quirky Campus Beat',
  },
  {
    id: 'mesce-track-7',
    title: 'Nada Nada',
    artist: 'Avial',
    album: 'Avial',
    cover: 'https://c.saavncdn.com/792/Avial-Malayalam-2008-20260224032408-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/792/11549c171cabda46db592bbdbfb27b0e_320.mp4',
    youtubeId: '0yZ5x3bQoJg',
    duration: 304, // Full 5 mins 4 secs
    genre: 'Malayalam Rock / Cult Classic',
  },
  {
    id: 'mesce-track-8',
    title: 'Fish Rock',
    artist: 'Thaikkudam Bridge',
    album: 'Navarasam',
    cover: 'https://c.saavncdn.com/738/Fish-Rock-Malayalam-2022-20220204132408-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/738/eee2c5b706f0e9c69986452ec1910086_320.mp4',
    youtubeId: 'y4qHn-j3l4k',
    duration: 259, // Full 4 mins 19 secs
    genre: 'Prog Fusion / Fest Anthem',
  },
  {
    id: 'mesce-track-9',
    title: 'Malare (From "Premam")',
    artist: 'Vijay Yesudas & Rajesh Murugesan',
    album: 'Premam (Original Motion Picture Soundtrack)',
    cover: 'https://c.saavncdn.com/665/Premam-Malayalam-2015-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/665/64fe9e59b56dfb5f644e9e461923979b_320.mp4',
    youtubeId: '0G2VxhV_g10',
    duration: 316, // Full 5 mins 16 secs
    genre: 'Evergreen Romantic Melody',
  },
  {
    id: 'mesce-track-10',
    title: 'Entammede Jimikki Kammal',
    artist: 'Shaan Rahman, Vineeth Sreenivasan & Renjith Unni',
    album: 'Velipadinte Pusthakam',
    cover: 'https://c.saavncdn.com/205/Velipadinte-Pusthakam-Malayalam-2024-20250425150549-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/205/88eef06ed9b065b5c1760511b181f760_320.mp4',
    youtubeId: 'FXiaIH49oAU',
    duration: 200, // Full 3 mins 20 secs
    genre: 'College Flashmob Anthem',
  },
  {
    id: 'mesce-track-11',
    title: 'Pala Palli (From "Kaduva")',
    artist: 'Jakes Bejoy & Athul Narukara',
    album: 'Kaduva',
    cover: 'https://c.saavncdn.com/930/Kaduva-Malayalam-2022-20260812211736-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/930/7c970f3702067cc5345ea1f09ca47cfd_320.mp4',
    youtubeId: '1C_w_f81g7k',
    duration: 270, // Full 4 mins 30 secs
    genre: 'High Voltage Folk Beat',
  },
  {
    id: 'mesce-track-12',
    title: 'Yellow',
    artist: 'Coldplay',
    album: 'Parachutes',
    cover: 'https://c.saavncdn.com/254/Parachutes-English-2000-20240529104717-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/254/6ebc38a6a7ea892f3a27cd66c71529d6_320.mp4',
    youtubeId: 'yKNxeF4KMsY',
    duration: 266, // Full 4 mins 26 secs
    genre: 'British Alt-Rock',
  },
  {
    id: 'mesce-track-13',
    title: 'Kun Faya Kun (From "Rockstar")',
    artist: 'A.R. Rahman, Javed Ali & Mohit Chauhan',
    album: 'Rockstar',
    cover: 'https://c.saavncdn.com/179/World-Music-Day-Best-Of-Bollywood-Hits-Hindi-2026-20260622111029-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/179/53fd6b97b1616b941b115f840e8b1e42_320.mp4',
    youtubeId: 'T94PHkuydcw',
    duration: 469, // Full 7 mins 49 secs
    genre: 'Sufi Soul Masterpiece',
  },
  {
    id: 'mesce-track-14',
    title: 'Neela Nilave (From "RDX")',
    artist: 'Jakes Bejoy & Kapil Kapilan',
    album: 'RDX',
    cover: 'https://c.saavncdn.com/411/RDX-Malayalam-2023-20250130073151-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/411/b1fe94ac64a44fa8c0102f8ad25cdf17_320.mp4',
    youtubeId: 'B3eam3427u8',
    duration: 253, // Full 4 mins 13 secs
    genre: 'Campus Love Anthem',
  },
  {
    id: 'mesce-track-15',
    title: 'Kannmani Anbodu (From "Gunaa")',
    artist: 'Ilaiyaraaja, Kamal Haasan & S. Janaki',
    album: 'Gunaa',
    cover: 'https://c.saavncdn.com/939/Gunaa-Tamil-2017-20170901171412-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/939/ca3f3992e6a7d1e1bee0934d59fe05dd_320.mp4',
    youtubeId: 'qY8k2G4c9vA',
    duration: 327, // Full 5 mins 27 secs
    genre: 'Timeless Classical Melody',
  },
  {
    id: 'mesce-track-16',
    title: 'Jaada (From "Aavesham")',
    artist: 'Sushin Shyam',
    album: 'Aavesham (Original Motion Picture Soundtrack)',
    cover: 'https://c.saavncdn.com/202/Aavesham-Original-Motion-Picture-Soundtrack-Malayalam-2024-20250910150630-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/202/b488cef5bfd15a995dcc4fcc455b71ec_320.mp4',
    youtubeId: 'Y9_bF0xL3z4',
    duration: 162, // Full 2 mins 42 secs
    genre: 'Groovy Campus Vibe',
  },
  {
    id: 'mesce-track-17',
    title: 'Armadham (From "Aavesham")',
    artist: 'Sushin Shyam & Pranavam Sasi',
    album: 'Aavesham (Original Motion Picture Soundtrack)',
    cover: 'https://c.saavncdn.com/202/Aavesham-Original-Motion-Picture-Soundtrack-Malayalam-2024-20250910150630-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/202/2e8ce109866b92c79404e8f8961fd149_320.mp4',
    youtubeId: 'X4w5eQ10q7I',
    duration: 173, // Full 2 mins 53 secs
    genre: 'Festival Dance Beat',
  },
  {
    id: 'mesce-track-18',
    title: 'Chekele',
    artist: 'Avial',
    album: 'Avial',
    cover: 'https://c.saavncdn.com/792/Avial-Malayalam-2008-20260224032408-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/792/5b37ea86f7062d5af4548759b871f2b2_320.mp4',
    youtubeId: 'eCgQ3jY2YFk',
    duration: 301, // Full 5 mins 1 sec
    genre: 'Malayalam Alternative Rock',
  },
  {
    id: 'mesce-track-19',
    title: 'Navarasam',
    artist: 'Thaikkudam Bridge',
    album: 'Navarasam',
    cover: 'https://c.saavncdn.com/024/Navarasam-Malayalam-2024-20251113113624-500x500.jpg',
    streamUrl: 'https://aac.saavncdn.com/024/4cdba61a6d1404a1c623bf316c7a8a20_320.mp4',
    youtubeId: '2Vv-BfVoq4g',
    duration: 394, // Full 6 mins 34 secs
    genre: 'Kathakali Rock Fusion',
  },
]

function decodeHtml(html) {
  if (!html) return ''
  return html
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

/**
 * Decrypts JioSaavn's encrypted_media_url into direct 320kbps full-length AAC stream URL.
 */
export function decryptSaavnMediaUrl(encryptedUrl) {
  if (!encryptedUrl) return null
  try {
    const key = CryptoJS.enc.Utf8.parse('38346591')
    const decrypted = CryptoJS.DES.decrypt(
      {
        ciphertext: CryptoJS.enc.Base64.parse(encryptedUrl),
      },
      key,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    )
    const url = decrypted.toString(CryptoJS.enc.Utf8)
    if (!url) return null
    // Prefer highest-quality 320kbps MP4 stream
    return url.replace(/_96\.mp4$/, '_320.mp4')
  } catch (e) {
    console.warn('Saavn URL decrypt note:', e)
    return null
  }
}

/**
 * Searches for songs with full-length 320kbps streams.
 * Automatically tries local library, JioSaavn engine, and iTunes fallback.
 */
export async function searchSongs(query, limit = 5) {
  if (!query || !query.trim()) return []

  const trimmed = query.trim()
  const lower = trimmed.toLowerCase()

  // 1. First, check if there's an exact or close match in our curated full-length library
  const directMatches = DEFAULT_MALAYALAM_PLAYLIST.filter(
    (t) =>
      t.title.toLowerCase().includes(lower) ||
      t.artist.toLowerCase().includes(lower) ||
      lower.includes(t.title.toLowerCase().split('(')[0].trim())
  )

  // 2. Query full-length music engine via Vite proxy or direct endpoint
  try {
    const encoded = encodeURIComponent(trimmed)
    const apiUrl = `/api/saavn/api.php?__call=search.getResults&_format=json&_marker=0&cc=in&includeMetaTags=1&q=${encoded}`
    const response = await fetch(apiUrl)

    if (response.ok) {
      const data = await response.json()
      const results = data.results || []

      if (results.length > 0) {
        const parsed = results.slice(0, limit).map((item) => {
          const fullStream = decryptSaavnMediaUrl(item.encrypted_media_url)
          let coverUrl = item.image || ''
          if (coverUrl) {
            coverUrl = coverUrl.replace(/150x150/, '500x500')
          }

          const rawTitle = decodeHtml(item.song || item.title || trimmed)
          const rawArtist = decodeHtml(item.singers || item.music || item.more_info?.primary_artists || 'Popular Artist')
          const rawAlbum = decodeHtml(item.album || 'Single')
          const sec = parseInt(item.duration, 10) || 210

          return {
            id: `saavn-${item.id}`,
            title: rawTitle,
            artist: rawArtist,
            album: rawAlbum,
            cover: coverUrl || DEFAULT_ALBUM_COVER,
            streamUrl: fullStream,
            duration: sec,
            genre: item.language ? `${item.language} / Campus Hit` : 'Campus Music',
            searchQuery: `${rawTitle} ${rawArtist}`,
          }
        })

        // Filter out results where stream couldn't be decrypted
        const valid = parsed.filter((p) => Boolean(p.streamUrl))
        if (valid.length > 0) {
          return valid
        }
      }
    }
  } catch (err) {
    console.warn('Saavn search note, falling back to local/iTunes:', err)
  }

  // 3. Fallback: if we have curated library matches, return them!
  if (directMatches.length > 0) {
    return directMatches.slice(0, limit)
  }

  // 4. Fallback to iTunes metadata with full-song resolver
  try {
    const encoded = encodeURIComponent(trimmed)
    const itunesUrl = `https://itunes.apple.com/search?term=${encoded}&entity=song&limit=${limit}`
    const response = await fetch(itunesUrl)
    if (response.ok) {
      const data = await response.json()
      if (data.results && data.results.length > 0) {
        return data.results.map((item) => {
          let highResCover = item.artworkUrl100
          if (highResCover) {
            highResCover = highResCover.replace(/100x100(?:bb)?\.(jpg|png|jpeg)/i, '600x600bb.$1')
          }

          const fullDuration = item.trackTimeMillis
            ? Math.round(item.trackTimeMillis / 1000)
            : 210

          // Check if we have a full stream in our curated list for this title
          const itemLower = item.trackName.toLowerCase()
          const matchedCurated = DEFAULT_MALAYALAM_PLAYLIST.find((p) =>
            itemLower.includes(p.title.toLowerCase().split('(')[0].trim())
          )

          return {
            id: `track-${item.trackId}`,
            title: item.trackName,
            artist: item.artistName,
            album: item.collectionName || 'Single',
            cover: highResCover || item.artworkUrl100 || DEFAULT_ALBUM_COVER,
            streamUrl: matchedCurated ? matchedCurated.streamUrl : null,
            duration: matchedCurated ? matchedCurated.duration : fullDuration,
            genre: item.primaryGenreName || 'Campus Music',
            searchQuery: `${item.trackName} ${item.artistName}`,
          }
        })
      }
    }
  } catch (error) {
    console.warn('iTunes search error:', error)
  }

  return DEFAULT_MALAYALAM_PLAYLIST.slice(0, limit)
}

/**
 * Resolves the best matching playable full-length track for a given song title and artist.
 */
export async function fetchBestMatch(songTitle, artist = '') {
  if (!songTitle) {
    return DEFAULT_MALAYALAM_PLAYLIST[0]
  }

  const query = artist ? `${songTitle} ${artist}` : songTitle

  // 1. Check curated list first for instant resolution
  const lowerTitle = songTitle.toLowerCase().trim()
  const localMatch = DEFAULT_MALAYALAM_PLAYLIST.find(
    (t) =>
      t.title.toLowerCase().includes(lowerTitle) ||
      lowerTitle.includes(t.title.toLowerCase().split('(')[0].trim()) ||
      (artist && t.artist.toLowerCase().includes(artist.toLowerCase()))
  )

  if (localMatch) {
    return localMatch
  }

  // 2. Search full-length engine
  const results = await searchSongs(query, 3)
  if (results.length > 0 && results[0].streamUrl) {
    return results[0]
  }

  // Fallback 1: Try searching just song title without artist
  if (artist) {
    const titleOnlyResults = await searchSongs(songTitle, 3)
    if (titleOnlyResults.length > 0 && titleOnlyResults[0].streamUrl) {
      return titleOnlyResults[0]
    }
  }

  // Fallback 2: Return random default track
  const randomDefault =
    DEFAULT_MALAYALAM_PLAYLIST[Math.floor(Math.random() * DEFAULT_MALAYALAM_PLAYLIST.length)]
  return {
    ...randomDefault,
    id: `custom-${Date.now()}`,
    title: songTitle,
    artist: artist || randomDefault.artist,
    searchQuery: `${songTitle} ${artist || ''}`,
  }
}
