import {
  login,
  logout,
  handleIncomingRedirect,
  getDefaultSession,
  fetch
} from '@inrupt/solid-client-authn-browser'

import {
  getSolidDataset,
  saveSolidDatasetAt,
  createSolidDataset,
  getThing,
  setThing,
  createThing,
  getStringNoLocale,
  setStringNoLocale,
  getSourceUrl
} from '@inrupt/solid-client'

// Custom predicate for clipboard data
const CLIPBOARD_PREDICATE = 'urn:solid:clip#clipboard'

// DOM elements
const welcomeSection = document.getElementById('welcome')
const appSection = document.getElementById('app')
const userLink = document.getElementById('user-link')
const clipboardInput = document.getElementById('clipboard')
const storageUriInput = document.getElementById('storage-uri')
const loginBtn = document.getElementById('login-btn')
const logoutBtn = document.getElementById('logout-btn')
const saveBtn = document.getElementById('save-btn')
const loadBtn = document.getElementById('load-btn')
const idpInput = document.getElementById('idp')
const notification = document.getElementById('notification')

// Show notification
function notify(message, type = 'success') {
  notification.className = `notification notification-toast is-${type === 'error' ? 'danger' : 'success'}`
  notification.textContent = message
  notification.style.display = 'block'
  setTimeout(() => {
    notification.style.display = 'none'
  }, 3000)
}

// Render logged-in state
function renderLogin(webId) {
  welcomeSection.style.display = 'none'
  appSection.style.display = 'block'
  userLink.textContent = webId
  userLink.href = webId

  // Set default storage URI based on WebID
  const podRoot = webId.replace(/profile\/card#me$/, '').replace(/#me$/, '').replace(/\/+$/, '')
  const defaultStorage = `${podRoot}/clip/data`

  // Check URL params for storage URI
  const params = new URLSearchParams(window.location.search)
  storageUriInput.value = params.get('storageURI') || defaultStorage

  // Auto-load clipboard data
  loadClipboard()
}

// Render logged-out state
function renderLogout() {
  welcomeSection.style.display = 'block'
  appSection.style.display = 'none'
  userLink.textContent = ''
  clipboardInput.value = ''
  storageUriInput.value = ''
}

// Load clipboard data from Pod
async function loadClipboard() {
  const storageUri = storageUriInput.value.trim()
  if (!storageUri) {
    notify('Please enter a storage URI', 'error')
    return
  }

  try {
    const dataset = await getSolidDataset(storageUri, { fetch })
    const clipThing = getThing(dataset, `${storageUri}#this`)

    if (clipThing) {
      const clipboardValue = getStringNoLocale(clipThing, CLIPBOARD_PREDICATE)
      clipboardInput.value = clipboardValue || ''
      notify('Clipboard loaded')
    } else {
      clipboardInput.value = ''
      notify('No clipboard data found')
    }
  } catch (error) {
    if (error.response?.status === 404) {
      clipboardInput.value = ''
      notify('No existing clipboard - ready to save new data')
    } else {
      console.error('Error loading clipboard:', error)
      notify('Could not load clipboard', 'error')
    }
  }
}

// Save clipboard data to Pod
async function saveClipboard() {
  const clipboardValue = clipboardInput.value.trim()
  const storageUri = storageUriInput.value.trim()

  if (!clipboardValue) {
    notify('Clipboard is empty', 'error')
    return
  }

  if (!storageUri) {
    notify('Please enter a storage URI', 'error')
    return
  }

  try {
    // Try to get existing dataset or create new one
    let dataset
    try {
      dataset = await getSolidDataset(storageUri, { fetch })
    } catch {
      dataset = createSolidDataset()
    }

    // Create or update the clip thing
    let clipThing = getThing(dataset, `${storageUri}#this`) || createThing({ url: `${storageUri}#this` })
    clipThing = setStringNoLocale(clipThing, CLIPBOARD_PREDICATE, clipboardValue)
    dataset = setThing(dataset, clipThing)

    // Save to Pod
    await saveSolidDatasetAt(storageUri, dataset, { fetch })

    // Update URL for bookmarking
    const url = new URL(window.location)
    url.searchParams.set('storageURI', storageUri)
    window.history.replaceState({}, '', url)

    notify('Clipboard saved!')
  } catch (error) {
    console.error('Error saving clipboard:', error)
    notify('Could not save clipboard', 'error')
  }
}

// Handle login
loginBtn.addEventListener('click', async () => {
  const issuer = idpInput.value.trim()
  if (!issuer) {
    notify('Please enter an Identity Provider URL', 'error')
    return
  }

  await login({
    oidcIssuer: issuer,
    redirectUrl: window.location.href,
    clientName: 'Solid Clip'
  })
})

// Handle logout
logoutBtn.addEventListener('click', async () => {
  await logout()
  renderLogout()
  notify('Logged out')
})

// Handle save
saveBtn.addEventListener('click', saveClipboard)

// Handle load
loadBtn.addEventListener('click', loadClipboard)

// Initialize app
async function init() {
  await handleIncomingRedirect({ restorePreviousSession: true })

  const session = getDefaultSession()

  if (session.info.isLoggedIn) {
    renderLogin(session.info.webId)
  } else {
    renderLogout()
  }
}

init()
