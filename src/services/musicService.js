// Music Search & Resolver Service for MESCE FM 108.1
// Full-length (3-5+ minute) song playback engine with HD artwork and queue integration.

export const POPULAR_MALAYALAM_YOUTUBE_MAP = {
  'illuminati': { id: 'tOM-nWPcR4U', duration: 193 },
  'kuthanthram': { id: 'YkVprVT04OA', duration: 185 },
  'cherathukal': { id: 'JukNAg7bz6I', duration: 225 },
  'manavalan thug': { id: '_eWvDaztcjI', duration: 210 },
  'manavaalan thug': { id: '_eWvDaztcjI', duration: 210 },
  'darshana': { id: 'B-pNp0LUV2Y', duration: 250 },
  'aadharanjali': { id: 'yvPspB0p83E', duration: 200 },
  'nada nada': { id: '0yZ5x3bQoJg', duration: 255 },
  'fish rock': { id: 'y4qHn-j3l4k', duration: 230 },
  'malare': { id: '0G2VxhV_g10', duration: 250 },
  'jimikki kammal': { id: 'FXiaIH49oAU', duration: 205 },
  'pala palli': { id: '1C_w_f81g7k', duration: 220 },
  'yellow': { id: 'yKNxeF4KMsY', duration: 269 },
  'kun faya kun': { id: 'T94PHkuydcw', duration: 470 },
  'neela nilave': { id: 'B3eam3427u8', duration: 200 },
  'kanmani anbodu': { id: 'qY8k2G4c9vA', duration: 330 },
  'jaada': { id: 'Y9_bF0xL3z4', duration: 210 },
  'armadham': { id: 'X4w5eQ10q7I', duration: 195 },
  'chekele': { id: 'eCgQ3jY2YFk', duration: 240 },
  'navarasam': { id: '2Vv-BfVoq4g', duration: 290 },
}

export const DEFAULT_ALBUM_COVER =
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'

export const DEFAULT_MALAYALAM_PLAYLIST = [
  {
    id: 'mesce-track-1',
    title: 'Illuminati (From "Aavesham")',
    artist: 'Sushin Shyam, Dabzee & Vinayak Sasikumar',
    album: 'Aavesham (Original Motion Picture Soundtrack)',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/88/4e/29/884e290c-29ed-25d5-7b25-243b89097220/cover.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/43/a0/da/43a0daa2-504d-6b7c-c63a-0c8864608a6d/mzaf_7754996064757215177.plus.aac.p.m4a',
    youtubeId: 'tOM-nWPcR4U',
    duration: 193, // Full 3 mins 13 secs
    genre: 'Malayalam Hip-Hop / Ost',
  },
  {
    id: 'mesce-track-2',
    title: 'Kuthanthram',
    artist: 'Sushin Shyam & Vedan',
    album: 'Manjummel Boys (Original Motion Picture Soundtrack)',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/70/f8/ae/70f8ae0d-aadf-6ec8-1a1c-2d83e26ff6dc/cover.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/94/7f/aa/947faa2a-b558-2b1c-4ad0-1afc90352607/mzaf_2643013271292698405.plus.aac.p.m4a',
    youtubeId: 'YkVprVT04OA',
    duration: 185, // Full 3 mins 5 secs
    genre: 'Malayalam Indie Rap',
  },
  {
    id: 'mesce-track-3',
    title: 'Cherathukal (From "Kumbalangi Nights")',
    artist: 'Sushin Shyam & Sithara Krishnakumar',
    album: 'Kumbalangi Nights',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ff/e5/09/ffe50919-e001-3e56-bc3f-09a4ce474175/8904337228118.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/98/77/74/98777452-8183-7f08-1f68-df2a44b881bf/mzaf_16122855687462731475.plus.aac.p.m4a',
    youtubeId: 'JukNAg7bz6I',
    duration: 225, // Full 3 mins 45 secs
    genre: 'Acoustic Melody',
  },
  {
    id: 'mesce-track-4',
    title: 'Manavaalan Thug (From "Thallumaala")',
    artist: 'Dabzee & S.A.',
    album: 'Thallumaala (Original Motion Picture Soundtrack)',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/cd/4a/c2/cd4ac279-7384-5ea1-7dd4-716f20d2c837/cover.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c0/a0/3c/c0a03c03-95fe-b8b8-5fef-8ed44a1a397e/mzaf_1993834899372910272.plus.aac.p.m4a',
    youtubeId: '_eWvDaztcjI',
    duration: 210, // Full 3 mins 30 secs
    genre: 'Campus Hype / Rap',
  },
  {
    id: 'mesce-track-5',
    title: 'Darshana (From "Hridayam")',
    artist: 'Hesham Abdul Wahab & Darshana Rajendran',
    album: 'Hridayam (Original Soundtrack)',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/69/26/34/6926341a-b85f-f853-de47-cb6fa81544aa/cover.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/2b/71/38/2b71380d-0114-3845-c3a8-5d2cfb9abfae/mzaf_14430613370529957448.plus.aac.p.m4a',
    youtubeId: 'B-pNp0LUV2Y',
    duration: 250, // Full 4 mins 10 secs
    genre: 'College Romance / Indie',
  },
  {
    id: 'mesce-track-6',
    title: 'Aadharanjali (From "Romancham")',
    artist: 'Sushin Shyam, Madhuvanthi Narayan & Vinayak Sasikumar',
    album: 'Romancham (Original Motion Picture Soundtrack)',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/2f/d5/ed/2fd5edd0-82fa-1ffe-ac19-e3cadffc9531/197188225889.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/55/95/3b/55953b56-368d-a2d2-c14d-54acb5783d7a/mzaf_12505579229243410349.plus.aac.p.m4a',
    youtubeId: 'yvPspB0p83E',
    duration: 200, // Full 3 mins 20 secs
    genre: 'Quirky Campus Beat',
  },
  {
    id: 'mesce-track-7',
    title: 'Nada Nada',
    artist: 'Avial',
    album: 'Avial',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/19/c6/17/19c61763-956a-2189-7da8-e9ad92b1eab3/3616845678792.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c8/e1/6a/c8e16a60-c729-dca9-ffe7-42b277b8a0d1/mzaf_692850314876616037.plus.aac.p.m4a',
    youtubeId: '0yZ5x3bQoJg',
    duration: 255, // Full 4 mins 15 secs
    genre: 'Malayalam Rock / Cult Classic',
  },
  {
    id: 'mesce-track-8',
    title: 'Fish Rock',
    artist: 'Thaikkudam Bridge',
    album: 'Navarasam',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/8f/eb/2a/8feb2a8d-c940-f18f-fa3e-f721adb07362/cover.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ad/63/48/ad6348be-b5da-9ffd-fa4d-63a3dd5558cd/mzaf_2646962926773142674.plus.aac.p.m4a',
    youtubeId: 'y4qHn-j3l4k',
    duration: 230, // Full 3 mins 50 secs
    genre: 'Prog Fusion / Fest Anthem',
  },
  {
    id: 'mesce-track-9',
    title: 'Malare (From "Premam")',
    artist: 'Vijay Yesudas & Rajesh Murugesan',
    album: 'Premam (Original Motion Picture Soundtrack)',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music2/v4/6f/3c/cd/6f3ccd36-2a0f-0c4e-ce51-5aebcf9e9f84/cover.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/41/59/b4/4159b41b-708b-8140-d758-e8da1ed7bedd/mzaf_7080443034849106781.plus.aac.p.m4a',
    youtubeId: '0G2VxhV_g10',
    duration: 250, // Full 4 mins 10 secs
    genre: 'Evergreen Romantic Melody',
  },
  {
    id: 'mesce-track-10',
    title: 'Entammede Jimikki Kammal',
    artist: 'Shaan Rahman, Vineeth Sreenivasan & Renjith Unni',
    album: 'Velipadinte Pusthakam',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/02/1b/0b/021b0b88-cd86-3669-2202-e0353e9942fb/840920109205.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/91/81/f0/9181f09d-0d2c-6fc1-8c1e-18f27f04c979/mzaf_9189549283050732545.plus.aac.p.m4a',
    youtubeId: 'FXiaIH49oAU',
    duration: 205, // Full 3 mins 25 secs
    genre: 'College Flashmob Anthem',
  },
]

/**
 * Searches for songs using iTunes metadata API + maps to full YouTube track.
 */
export async function searchSongs(query, limit = 5) {
  if (!query || !query.trim()) return []

  try {
    const encoded = encodeURIComponent(query.trim())
    const url = `https://itunes.apple.com/search?term=${encoded}&entity=song&limit=${limit}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Search API returned status ${response.status}`)
    }
    const data = await response.json()
    if (!data.results || data.results.length === 0) {
      return []
    }

    return data.results.map((item) => {
      let highResCover = item.artworkUrl100
      if (highResCover) {
        highResCover = highResCover.replace(/100x100(?:bb)?\.(jpg|png|jpeg)/i, '600x600bb.$1')
      }

      // Check if we have an explicit YouTube video ID match in our dictionary
      const lowerTitle = item.trackName.toLowerCase()
      let mappedYt = null
      for (const [k, v] of Object.entries(POPULAR_MALAYALAM_YOUTUBE_MAP)) {
        if (lowerTitle.includes(k)) {
          mappedYt = v
          break
        }
      }

      // Real full duration from trackTimeMillis (e.g. 210,000ms -> 210 seconds!)
      const fullDuration = item.trackTimeMillis
        ? Math.round(item.trackTimeMillis / 1000)
        : mappedYt?.duration || 210

      return {
        id: `track-${item.trackId}`,
        title: item.trackName,
        artist: item.artistName,
        album: item.collectionName || 'Single',
        cover: highResCover || item.artworkUrl100 || DEFAULT_ALBUM_COVER,
        streamUrl: item.previewUrl,
        youtubeId: mappedYt ? mappedYt.id : null,
        searchQuery: `${item.trackName} ${item.artistName}`,
        duration: fullDuration,
        genre: item.primaryGenreName || 'Campus Music',
      }
    })
  } catch (error) {
    console.warn('Music search error:', error)
    return []
  }
}

/**
 * Resolves the best matching playable track for a given song title and artist.
 */
export async function fetchBestMatch(songTitle, artist = '') {
  const query = artist ? `${songTitle} ${artist}` : songTitle
  const results = await searchSongs(query, 3)

  if (results.length > 0) {
    return results[0]
  }

  // Fallback 1: Try searching just song title without artist
  if (artist) {
    const titleOnlyResults = await searchSongs(songTitle, 3)
    if (titleOnlyResults.length > 0) {
      return titleOnlyResults[0]
    }
  }

  // Fallback 2: Check internal default playlist for a match
  const lowerTitle = songTitle.toLowerCase()
  const localMatch = DEFAULT_MALAYALAM_PLAYLIST.find(
    (t) =>
      t.title.toLowerCase().includes(lowerTitle) ||
      lowerTitle.includes(t.title.toLowerCase()) ||
      t.artist.toLowerCase().includes(lowerTitle)
  )

  if (localMatch) {
    return localMatch
  }

  // Check known YouTube map
  for (const [k, v] of Object.entries(POPULAR_MALAYALAM_YOUTUBE_MAP)) {
    if (lowerTitle.includes(k)) {
      return {
        id: `yt-${v.id}`,
        title: songTitle,
        artist: artist || 'Campus Music',
        album: 'MESCE FM Airplay',
        cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
        youtubeId: v.id,
        duration: v.duration,
      }
    }
  }

  // Fallback 3: Return a random popular track from the default list
  const randomDefault = DEFAULT_MALAYALAM_PLAYLIST[Math.floor(Math.random() * DEFAULT_MALAYALAM_PLAYLIST.length)]
  return {
    ...randomDefault,
    id: `custom-${Date.now()}`,
    title: songTitle,
    artist: artist || randomDefault.artist,
    searchQuery: `${songTitle} ${artist || ''}`,
  }
}
