interface User {
  id: string
  name: string
  email: string
}

class AuthManager {
  private static readonly STORAGE_KEY = 'studycore_user'

  static register(email: string, _password: string, name: string): User {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user))
    return user
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static login(email: string, _password: string): User | null {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (stored) {
      const user = JSON.parse(stored) as User
      if (user.email === email) {
        return user
      }
    }
    return null
  }

  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  static loadUser(): User | null {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  }

  static updateUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user))
  }
}

export default AuthManager
