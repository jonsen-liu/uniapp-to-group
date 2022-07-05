class UniappToProup {
  constructor (options) {
    if (options.package) {
      this.package = options.package
    }
    if (options.app) {
      this.app = options.app
    }
  }

  package = {}

  app = {}

  apply (compiler) {
    const _this = this
    compiler.hooks.emit.tapAsync('uniappToGroup', (compilation, callback) => {
      let packageFlag = true
      for (const name of Object.keys(compilation.assets)) {
        if (!Object.keys(this.app).length && !Object.keys(this.package).length) {
          break
        }
        if (name === 'app.json') {
          let appJson = JSON.parse(compilation.assets[name].source())

          for (const key in this.app) {
            if (appJson[key]) {
              if (
                Object.prototype.toString.call(appJson[key]) === '[object Object]' &&
                Object.prototype.toString.call(this.app[key]) === '[object Object]'
              ) {
                appJson[key] = {
                  ...appJson[key],
                  ...this.app[key]
                }
              }
              if (
                Array.isArray(appJson[key]) &&
                Array.isArray(this.app[key])
              ) {
                appJson[key] = appJson.pages.concat(this.app[key])
              }
            } else {
              appJson[key] = this.app[key]
            }
          }

          compilation.assets[name] = {
            source () {
              return JSON.stringify(appJson)
            },
            size () {
              return this.source().length
            }
          }
        }
        if (name === 'package.json') {
          packageFlag = false
          let packageJson = JSON.parse(compilation.assets[name].source())
          packageJson = Object.assign(packageJson, this.package)
          compilation.assets[name] = {
            source () {
              return JSON.stringify(packageJson)
            },
            size () {
              return this.source().length
            }
          }
        }
      }
      if (Object.keys(this.package).length && packageFlag) {
        compilation.assets['package.json'] = {
          source () {
            return JSON.stringify(_this.package)
          },
          size () {
            return this.source().length
          }
        }
      }
      callback()
    })
  }
}
module.exports = UniappToProup
