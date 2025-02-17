import { createUserWithEmailAndPassword } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"
import { auth, db } from "../firebase"

export const createAdminUser = async (name: string, email: string, password: string) => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Add user to Firestore with admin privileges
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      userType: "admin",
      createdAt: new Date(),
    })

    console.log("Admin user created successfully")
    return user
  } catch (error) {
    console.error("Error creating admin user:", error)
    throw error
  }
}

