function getCaptionUrl(): string | null {
  const anyWin = window as any
  const response = anyWin.ytInitialPlayerResponse || anyWin.ytplayer?.config?.args?.player_response

  if (!response) return null

  const parsed = typeof response === 'string' ? JSON.parse(response) : response
  const tracks = parsed?.captions?.playerCaptionsTracklistRenderer?.captionTracks
  return tracks?.[0]?.baseUrl ?? null
}

async function fetchTranscript(): Promise<string | null> {
  const url = getCaptionUrl()
  if (!url) return null

  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return await res.text()
  } catch (error) {
    console.warn('[content] transcript fetch failed', error)
    return null
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'GET_TRANSCRIPT') {
    fetchTranscript()
      .then((transcript) => sendResponse({ transcript }))
      .catch(() => sendResponse({ transcript: null }))
    return true
  }
  return undefined
})
