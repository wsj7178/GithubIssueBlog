import Github from 'github-api'
import axios from 'axios'
import Log from '../scripts/Log'

export const state = () => ({
  list: [],
  categories: []
})

export const getters = {
  getPost: (state) => (id) => state.list.find(post => id == post.id)
}

export const mutations = {
  setList(state, list) {
    Log.log('setList list=', list)
    state.list = list
  },
  setCategories(state, categories) {
    Log.log('setCategories categories=', categories)
    state.categories = categories
  }
}

export const actions = {
  initPost(context) {
    return new Promise(async (resolve, reject) => {
      if (process.server) return  // server process에서 generate 시에는 실행 안됨
      const gh = new Github()
      let response = await axios({
        url: '/config/github.json',
      })
      let githubConfig = response.data
      Log.debug('githubConfig: ', githubConfig)
      const issueManager = gh.getIssues(githubConfig.user, githubConfig.repo)
      let promises = []
      let list = []
      promises.push(new Promise((resolve, reject) => {
        issueManager.listIssues(null, (error, result, request) => {
          if (error) reject(error)
          Log.log('initPost listIssues result=', result)
          result.forEach(issue => {
            if (!isPostIssue(issue) || !hasWriterPermission(issue, githubConfig)) return
            let post = {
              id: issue.number,
              title: issue.title,
              writer: issue.user,
              create_date: issue.created_at,
              update_date: issue.updated_at,
              content: issue.body,
              categories: getCategories(issue.labels)
            }
            Log.log(issue.title, 'initPost listIssues labels=', issue.labels)
            list.push(post)
          })
          context.commit('setList', list)
          resolve()
        })
      }))
      promises.push(new Promise((resolve, reject) => {
        issueManager.listLabels(null, (error, result, request) => {
          if (error) reject(error)
          Log.log('initPost listLabels result=', result)
          context.commit('setCategories', result.filter(value => value.name.startsWith('categories:')))
          resolve()
        })
      }))
      Promise.all(promises).then(() => {
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  }
}

/**
 * categories: 로 시작하는 label list 반환
 */
const getCategories = (labels) => {
  return labels.filter(label => /categories:.+/.test(label.name))
}

/**
 * 해당 Issue 가 Post 인지 반환
 * @param {Object} issue
 *
 * @return {Boolean}
 */
const isPostIssue = (issue) => {
  /** @type {*[]} */
  let labels = issue.labels
  return labels.findIndex(label => label.name === 'githubblog:post') >= 0
}

/**
 * issue 의 작성자가 글 작성 권한을 가지고 있는지 확인
 *
 * @param {*} issue
 * @param {*} config
 */
const hasWriterPermission = (issue, config) => {
  /** @type {String[]} */
  let writers = config.writer
  return writers.findIndex(writer => writer === issue.user.login) >= 0
}
