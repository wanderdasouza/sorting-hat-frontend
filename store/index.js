import VuexORM from '@vuex-orm/core'
import System from './models/system'
import NonFuncReq from './models/nonFuncReq'

const database = new VuexORM.Database()
database.register(System, {})
database.register(NonFuncReq, {})

const plugin = VuexORM.install(database)

export default {
  plugins: [plugin],
}
