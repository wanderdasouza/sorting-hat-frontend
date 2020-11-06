// eslint-disable-next-line prettier/prettier
import {
  Model
} from '@vuex-orm/core'

export default class NonFuncReq extends Model {
  static entity = 'nonFuncReq'

  static fields() {
    return {
      id: this.string(''),
      req: this.string(''),
    }
  }
}
