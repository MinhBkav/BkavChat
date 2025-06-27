
// authService.js
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from '../../../firebase'
export const signUpWithFirebase = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const idToken = await userCredential.user.getIdToken() // 🔑 lấy Firebase token
  return idToken 
}
