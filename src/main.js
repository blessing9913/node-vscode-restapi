// @ts-check

// 프레임워크 없이 간단한 토이프로젝트 웹 서버 만들어보기
// 1. http client 도구 : httpie 설치(사용: http localhost:4000/posts  || http POST localhost:4000/posts title=foo content=bar --print=hHbB)
// 2. node 서버 수정 자동적용 : nodemon
// 3. type safe : jsdoc

/**
 * 블로그 포스팅 서비스
 * - 로컬 파일을 데이터베이스로 활용할 예정(JSON)
 * - 인증 로직은 넣지 않음
 * - RESTful API를 사용
 */

const http = require('http')
const { routes } = require('./api')

const server = http.createServer((req, res) => {
  async function main() {
    const route = routes.find(
      (_route) =>
        req.url &&
        req.method &&
        _route.url.test(req.url) &&
        _route.method === req.method
    )

    if (!req.url || !route) {
      // TODO: implements
      res.statusCode = 404
      res.end('Not found')
      return
    }

    const regexResult = route.url.exec(req.url)
    if (!regexResult) {
      // TODO: implements
      res.statusCode = 404
      res.end('Not found')
      return
    }

    /** @type {Object.<string, *> | undefined} */
    const reqBody =
      (req.headers['content-type'] === 'application/json' &&
        (await new Promise((resolve, reject) => {
          req.setEncoding('utf-8')
          req.on('data', (data) => {
            try {
              resolve(JSON.parse(data))
            } catch {
              reject(new Error('Ill-formed json'))
            }
          })
        }))) ||
      undefined

    const result = await route.callback(regexResult, reqBody)
    res.statusCode = result.statusCode

    if (typeof result.body === 'string') {
      res.end(result.body)
    } else {
      res.setHeader('Content-Type', 'application/json; charset=UTF-8')
      res.end(JSON.stringify(result.body))
    }
  }

  main()
})

const PORT = 4000

server.listen(PORT, () => {
  console.log(`The server is listening at port: ${PORT}`)
})
