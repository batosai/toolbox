import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

export default class DiffsController {

  @inject()
  async handle({ request, session, inertia, params }: HttpContext) {
    session.put('originUrl', request.url())

    return inertia.render('diffs', {
      ...params
    })
  }
}

