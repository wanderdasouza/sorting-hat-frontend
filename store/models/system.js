// eslint-disable-next-line prettier/prettier
import {
  Model
} from '@vuex-orm/core'

export default class System extends Model {
  static entity = 'system'

  static fields() {
    return {
      id: this.string(''),
      name: this.string(''),
      description: this.string(''),
    }
  }
}
