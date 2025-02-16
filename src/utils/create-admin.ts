import { collection, addDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { db, auth } from "../firebase"

export const createAdminUser = async (name: string, email: string, password: string) => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Add user to Firestore with admin privileges
    await addDoc(collection(db, "users"), {
      uid: user.uid,
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

