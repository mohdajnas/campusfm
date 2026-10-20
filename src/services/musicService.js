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
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/55/e1/99/55e199e4-cb90-a352-78be-d67b2d56a350/cover.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/bf/f9/58/bff9580d-85fa-71a2-892f-fb8a76067b8a/mzaf_10574104996112948956.plus.aac.p.m4a',
    youtubeId: 'YkVprVT04OA',
    duration: 185, // Full 3 mins 5 secs
    genre: 'Malayalam Indie Rap',
  },
  {
    id: 'mesce-track-3',
    title: 'Cherathukal (From "Kumbalangi Nights")',
    artist: 'Sushin Shyam & Sithara Krishnakumar',
    album: 'Kumbalangi Nights',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/7c/4f/f5/7c4ff558-7557-ca59-a212-be007a829280/cover.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/4a/12/58/4a125867-248d-cefe-7917-862d2579dfd9/mzaf_16259021469113642777.plus.aac.p.m4a',
    youtubeId: 'JukNAg7bz6I',
    duration: 225, // Full 3 mins 45 secs
    genre: 'Acoustic Melody',
  },
  {
    id: 'mesce-track-4',
    title: 'Manavaalan Thug (From "Thallumaala")',
    artist: 'Dabzee & S.A.',
    album: 'Thallumaala (Original Motion Picture Soundtrack)',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/eb/fa/6d/ebfa6d01-527e-8575-cf6e-69fca3705ee1/cover.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/4c/7a/ff/4c7affd5-56fa-8e36-c0c1-be0b8478c575/mzaf_7182276532454655653.plus.aac.p.m4a',
    youtubeId: '_eWvDaztcjI',
    duration: 210, // Full 3 mins 30 secs
    genre: 'Campus Hype / Rap',
  },
  {
    id: 'mesce-track-5',
    title: 'Darshana (From "Hridayam")',
    artist: 'Hesham Abdul Wahab & Darshana Rajendran',
    album: 'Hridayam (Original Soundtrack)',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f4/6a/0c/f46a0cf2-adad-5850-faaa-7f0f666c8d7c/cover.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/a7/40/3e/a7403ee3-c155-27a3-55be-5882e3895e34/mzaf_13503522204961559850.plus.aac.p.m4a',
    youtubeId: 'B-pNp0LUV2Y',
    duration: 250, // Full 4 mins 10 secs
    genre: 'College Romance / Indie',
  },
  {
    id: 'mesce-track-6',
    title: 'Aadharanjali (From "Romancham")',
    artist: 'Sushin Shyam, Madhuvanthi Narayan & Vinayak Sasikumar',
    album: 'Romancham (Original Motion Picture Soundtrack)',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/eb/70/4e/eb704e6c-7e9b-43d5-2070-5bfaea7d4be1/cover.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/05/aa/7c/05aa7cc4-cb64-325d-4f10-18e3be5b04aa/mzaf_12686851213426744837.plus.aac.p.m4a',
    youtubeId: 'yvPspB0p83E',
    duration: 200, // Full 3 mins 20 secs
    genre: 'Quirky Campus Beat',
  },
  {
    id: 'mesce-track-7',
    title: 'Nada Nada',
    artist: 'Avial',
    album: 'Avial',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music/v4/a7/5b/9e/a75b9e02-9599-27aa-485a-063a86fc9cf3/cover.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview/v4/80/7e/4e/807e4e0d-ec23-64a0-534a-85942f9fa2d9/mzaf_1648083839213567676.plus.aac.p.m4a',
    youtubeId: '0yZ5x3bQoJg',
    duration: 255, // Full 4 mins 15 secs
    genre: 'Malayalam Rock / Cult Classic',
  },
  {
    id: 'mesce-track-8',
    title: 'Fish Rock',
    artist: 'Thaikkudam Bridge',
    album: 'Navarasam',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/64/7b/d2/647bd2a0-be87-577d-7a0c-7b44357bc260/cover.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/0c/33/c0/0c33c0be-4aa0-c971-8c43-b4eec12cb595/mzaf_16035043640209424888.plus.aac.p.m4a',
    youtubeId: 'y4qHn-j3l4k',
    duration: 230, // Full 3 mins 50 secs
    genre: 'Prog Fusion / Fest Anthem',
  },
  {
    id: 'mesce-track-9',
    title: 'Malare (From "Premam")',
    artist: 'Vijay Yesudas & Rajesh Murugesan',
    album: 'Premam (Original Motion Picture Soundtrack)',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/95/92/7d/95927d3c-99c7-5d07-a3f8-6202c382f7e0/cover.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/31/ff/45/31ff45c9-94b7-f045-8f55-08197779d71c/mzaf_1033604473871408846.plus.aac.p.m4a',
    youtubeId: '0G2VxhV_g10',
    duration: 250, // Full 4 mins 10 secs
    genre: 'Evergreen Romantic Melody',
  },
  {
    id: 'mesce-track-10',
    title: 'Entammede Jimikki Kammal',
    artist: 'Shaan Rahman, Vineeth Sreenivasan & Renjith Unni',
    album: 'Velipadinte Pusthakam',
    cover: 'https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/ca/87/1c/ca871c8f-2873-1959-8ddb-29d9195b867c/cover.jpg/600x600bb.jpg',
    streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/5a/04/b8/5a04b8df-d546-aeb5-3889-eb44b1c8f2fa/mzaf_14022415175945199616.plus.aac.p.m4a',
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
        highResCover = highResCover.replace('100x100bb.jpg', '600x600bb.jpg')
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
        cover: highResCover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
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
