import router from '@adonisjs/core/services/router'

const HealthChecksController = () => import('#core/controllers/health_checks_controller')
const GithubController = () => import('#core/controllers/github_controller')

router.get('/health', [HealthChecksController])
router.get('/github/redirect', [GithubController, 'redirect'])
router.get('/github/callback', [GithubController, 'callback'])
