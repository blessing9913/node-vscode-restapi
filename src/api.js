// @ts-check

/**
 * @typedef Post
 * @property {string} id
 * @property {string} title
 * @property {string} content
 */

/**
 * @typedef APIResponse
 * @property {number} statusCode
 * @property {string | Object} body
 */

/**
 * @typedef Route
 * @property {RegExp} url
 * @property {'GET' | 'POST'} method
 * @property {(matches: string[], body: Object.<string, *> | undefined) => Promise<APIResponse>} callback
 */

const fs = require('fs')

const DB_JSON_FILE = 'database.json'

/** @returns {Promise<Post[]>} */
async function getPosts() {
  const json = await fs.promises.readFile(DB_JSON_FILE, 'utf-8')
  return JSON.parse(json).posts
}

/**
 * @param {Post[]} posts
 */
async function savePosts(posts) {
  const content = {
    posts,
  }

  return fs.promises.writeFile(DB_JSON_FILE, JSON.stringify(content), 'utf-8')
}

/** @type {Route[]} */
const routes = [
  {
    url: /^\/posts$/,
    method: 'GET',
    callback: async () => ({
      // TODO: implements
      statusCode: 200,
      body: await getPosts(),
    }),
  },
  {
    url: /^\/posts\/([a-zA-Z0-9-_]+)$/,
    method: 'GET',
    callback: async (matches) => {
      const postId = matches[1]
      if (!postId) {
        return {
          // TODO: implements
          statusCode: 404,
          body: 'Not found',
        }
      }

      const posts = await getPosts()
      const post = posts.find((_post) => _post.id === postId)
      if (!post) {
        return {
          // TODO: implements
          statusCode: 404,
          body: 'Not found',
        }
      }

      return {
        // TODO: implements
        statusCode: 200,
        body: post,
      }
    },
  },
  {
    url: /^\/posts$/,
    method: 'POST',
    callback: async (_, body) => {
      if (!body) {
        return {
          statusCode: 400,
          body: 'Ill-formed request',
        }
      }

      const posts = await getPosts()

      /** @type {string} */
      /* eslint-disable-next-line prefer-destructuring */
      const title = body.title
      const newPost = {
        // id: title.replace(/\s/g, '_'),
        id: String(posts.length + 1),
        title,
        content: body.content,
      }

      posts.push(newPost)
      savePosts(posts)

      return {
        // TODO: implements
        statusCode: 200,
        body: newPost,
      }
    },
  },
]

module.exports = {
  routes,
}
