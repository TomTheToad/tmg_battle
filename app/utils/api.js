// Oath - if necessary
const id = ''
const sec = ''
const oauthParams = `?client_id=${id}&client_secret=${sec}`

// Methods
function getErrorMsg(message, username) {
  if (message === 'Not Found') {
    return `${username} doesn't exist`
  }

  return message
}

function getProfile(username) {
  // TODO: refactor base url & params
  return fetch(`https://api.github.com/users/${username}${oauthParams}`)
    .then((res) => res.json())
    .then((profile) => {
      if (profile.message) {
        throw new Error(getErrorMsg(profile.message, username))
      }

      return profile
    })
}

function getRepos(username) {
  return fetch(`https://api.github.com/users/${username}/repos${oauthParams}&per_page=100`)
    .then((res) => res.json())
    .then((repos) => {
      if (repos.message) {
        throw new Error(getErrorMsg(repos.message, username))
      }

      return repos
    })
}

function getStarCount(repos) {
  return repos.reduce((count, { stargazers_count }) => count + stargazers_count, 0)
}

function calculateScore(followers, repos) {
  return (followers * 3) + getStarCount(repos)
}

function getUserData(player) {
  return Promise.all([
    getProfile(player),
    getRepos(player)
  ]).then(([profile, repos]) => ({
    profile,
    score: calculateScore(profile.followers, repos)
  }))
}

function sortPlayers(players) {
  return players.sort((a, b) => b.score - a.score)
}

export function battle(players) {
  return Promise.all([
    getUserData(players[0]),
    getUserData(players[1])
  ]).then((results) => sortPlayers(results))
}

export function fetchPopularRepos(language) {
  // Fields
  const baseURL = 'https://api.github.com/search/repositories?'
  const query = 'q=stars:>1+' + language
  const sort = '&sort=stars'
  const order = '&order=desc'
  const type = '&type=Repositories'

  // Complete url
  const url = baseURL + query + sort + order + type
  const endpoint = window.encodeURI(url)

  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      if (!data.items) {
        throw new Error(data.message)
      }

      return data.items
    })
}