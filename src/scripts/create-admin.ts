import { createAdminUser } from "../utils/admin-utils"

const createAdmin = async () => {
  const name = "Admin Name"
  const email = "admin@example.com"
  const password = "securePassword123!"

  try {
    await createAdminUser(name, email, password)
    console.log("Admin user created successfully")
  } catch (error) {
    console.error("Failed to create admin user:", error)
  }
}

createAdmin()

