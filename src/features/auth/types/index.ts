/** Credenciales del formulario de login */
export interface LoginCredentials {
  email: string
  password: string
}

/** Errores de login mapeados a claves de los locales (t.auth.*) */
export type LoginErrorKey =
  | 'errorInvalidCredentials'
  | 'errorGeneric'
  | 'errorEmailInvalid'
  | 'errorPasswordRequired'

export interface LoginResult {
  ok: boolean
  errorKey?: LoginErrorKey
}
