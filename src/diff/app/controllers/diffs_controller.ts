import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

export default class DiffsController {

  @inject()
  async handle({ inertia, params }: HttpContext) {
    return inertia.render('diffs', {
      ...params
    })
  }
}

