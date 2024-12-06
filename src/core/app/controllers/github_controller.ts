import type { HttpContext } from '@adonisjs/core/http'

export default class HealthChecksController {
  async redirect({ ally }: HttpContext) {
    return ally.use('github').redirect()
  }

  async callback({ response, ally, session }: HttpContext) {
    const gh = ally.use('github')

    let error

    /**
     * User has denied access by canceling
     * the login flow
     */
    if (gh.accessDenied()) {
      error = 'You have cancelled the login process'
    }

    /**
     * OAuth state verification failed. This happens when the
     * CSRF cookie gets expired.
     */
    if (gh.stateMisMatch()) {
      error = 'We are unable to verify the request. Please try again'
    }

    /**
     * GitHub responded with some error
     */
    if (gh.hasError()) {
      error = gh.getError()
    }

    if (error) {
      session.flash('errors', error)
    }

    /**
     * Access user info
     */
    const user = await gh.user()

    session.put('githubToken', user.token.token)
    return response.redirect(session.get('originUrl', '/'))
  }
}
