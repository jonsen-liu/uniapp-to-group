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
          if (this.app.pages) {
            appJson.pages = appJson.pages.concat(this.app.pages)
          }
          if (Object.keys(this.app.fallbackPluginPages).length) {
            const obj = appJson.fallbackPluginPages || {}
            appJson.fallbackPluginPages = Object.assign(obj, this.app.fallbackPluginPages)
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
