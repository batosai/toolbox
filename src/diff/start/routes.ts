import router from '@adonisjs/core/services/router'

const HomeController = () => import('#diff/controllers/home_controller')
const DiffsController = () => import('#diff/controllers/diffs_controller')

router.group(() => {
  router.get('/', [HomeController])
  router.get('/:owner/:repo/:sourceVersion/:targetVersion', [DiffsController])
  router.get('/:owner/:repo', [DiffsController])
})
// .prefix('diff')
// .as('diff')
