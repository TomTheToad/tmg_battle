export function fetchPopularRepos(language) {

  // Fields
  const baseURL = 'https://api.github.com/search/repositories?'
  const query = 'q=stars:>1+' + language
  const sort = '&sort=stars'
  const order = '&order=desc'
  const type = '&type=Repositories'
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