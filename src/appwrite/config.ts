import config from "@/config/config";
import { Client, Account, ID, Storage } from "appwrite";

type CreateUserAccount = {
  email: string;
  password: string;
  name: string;
};

type LoginUserAccount = {
  email: string;
  password: string;
};

type UpdateUserDetails = {
  userId: string;
  password?: string;
  phoneNumber?: string;
  currentPassword?: string;
};

const appwriteClient = new Client();

const storage = new Storage(appwriteClient);

appwriteClient
  .setEndpoint(config.appwriteUrl)
  .setProject(config.appwriteProjectId);

export const account = new Account(appwriteClient);

export class AppwriteService {
  //create a new record of user inside appwrite
  async createUserAccount({ email, password, name }: CreateUserAccount) {
    try {
      const userAccount = await account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (userAccount) {
        await this.createUserInNeo4j(userAccount.$id, email, name);
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error: any) {
      throw error;
    }
  }

  // Call Neo4j API to create the user in the database
  async createUserInNeo4j(userId: string, email: string, name: string) {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          email,
          name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user in Neo4j");
      }

      const data = await response.json();
      console.log("User created in Neo4j:", data);
    } catch (error) {
      console.error("Error creating user in Neo4j:", error);
    }
  }

  async login({ email, password }: LoginUserAccount) {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error: any) {
      throw error;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const data = await this.getCurrentUser();
      return Boolean(data);
    } catch (error) {}

    return false;
  }

  async isAdmin(): Promise<boolean> {
    try {
      const data = await this.getCurrentUser();
      return Boolean(data?.labels && data.labels.includes("admin"));
    } catch (error) {}

    return false;
  }

  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error: any) {
      if (error.code === 401) {
        // User is not authenticated
        return null;
      }
      console.error("getCurrentUser error:", error);
      throw error; // Rethrow other errors
    }
  }

  async updateDetails({
    userId,
    password,
    phoneNumber,
    currentPassword,
  }: UpdateUserDetails) {
    try {
      let updates: any = {};

      if (password) {
        if (!currentPassword) {
          throw new Error("Current password is required to update password");
        }
        await account.updatePassword(password, currentPassword);
        updates.password = "updated";
      }

      if (phoneNumber) {
        const user = await this.getCurrentUser();
        if (!user) throw new Error("User not found");

        if (user.phone) {
          throw new Error("Phone number can only be updated once");
        }

        if (!currentPassword) {
          throw new Error(
            "Current password is required to update phone number"
          );
        }

        await account.updatePhone(phoneNumber, currentPassword);
        updates.phoneNumber = phoneNumber;

        // Update phone number in Neo4j
        await this.updateUserInNeo4j(userId, { phoneNumber });
      }

      return updates;
    } catch (error: any) {
      throw error;
    }
  }
  async updateUserInNeo4j(userId: string, updates: { phoneNumber?: string }) {
    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...updates,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user in Neo4j");
      }

      const data = await response.json();
      console.log("User updated in Neo4j:", data);
    } catch (error) {
      console.error("Error updating user in Neo4j:", error);
    }
  }
  async logout() {
    try {
      return await account.deleteSession("current");
    } catch (error) {
      console.log("logout error: " + error);
    }
  }

  async getFileFromBucket({ key }: { key: string }) {
    try {
      return await storage.getFileDownload(config.appwriteBucketId, key);
    } catch (error) {
      console.error("Error fetching file");
    }
  }
  getFileUrl(fileId: string): string {
    return storage.getFileView(config.appwriteBucketId, fileId).href;
  }

  async uploadFileToBucket({ file, fileId }: { file: File; fileId?: string }) {
    try {
      if (!fileId) {
        throw Error("fileId is required");
      }

      const result = await storage.createFile(
        config.appwriteBucketId,
        fileId,
        file
      );

      return result;
    } catch (error) {
      console.error("Error uploading file to bucket:", error);
      throw error;
    }
  }
}

const appwriteService = new AppwriteService();

export default appwriteService;
