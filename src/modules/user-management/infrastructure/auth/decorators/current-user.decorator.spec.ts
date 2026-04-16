import { CurrentUser } from './current-user.decorator'

describe('CurrentUserDecorator', () => {
  describe('CurrentUser', () => {
    it('should be defined', () => {
      expect(CurrentUser).toBeDefined()
    })

    it('should be a function', () => {
      expect(typeof CurrentUser).toBe('function')
    })
  })
})
