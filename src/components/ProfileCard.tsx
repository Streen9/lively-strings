"use client";
import React, { useEffect, useState } from "react";
import { Models } from "appwrite";
import Link from "next/link";
import appwriteService from "@/appwrite/config";
import Avatar from "./Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProfileCard = () => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      const userData = await appwriteService.getCurrentUser();
      if (userData) {
        setUser(userData);
        setNewPhoneNumber(userData.phone || "");
      }
    })();
  }, []);

  const handleUpdate = async () => {
    setError("");
    setSuccess("");
    try {
      const updates = await appwriteService.updateDetails({
        userId: user?.$id || "",
        password: newPassword || undefined,
        phoneNumber: newPhoneNumber || undefined,
        currentPassword: currentPassword,
      });

      if (updates.password) setSuccess("Password updated successfully");
      if (updates.phoneNumber) setSuccess("Phone number updated successfully");

      // Refresh user data
      const updatedUser = await appwriteService.getCurrentUser();
      if (updatedUser) setUser(updatedUser);

      setIsEditing(false);
      setNewPassword("");
      setCurrentPassword("");
    } catch (err: any) {
      setError(err.message || "An error occurred during update");
    }
  };

  if (!user) return null;

  return (
    <div className="flex gap-y-6 flex-wrap">
      <div className="flex w-full gap-x-4 items-center">
        <div className="shrink-0 w-20">
          <Avatar img="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
        </div>
        <div className="relative">
          <p className="font-bold text-xl w-full mb-1">{user.name}</p>
          {/* <div className="text-[12px] p-0.5 inline-block rounded-md bg-gradient-to-tr from-primary to-secondary">
            <button className="px-2 rounded-md font-bold bg-black">FREE</button>
          </div> */}
        </div>
      </div>
      <div className="bg-white rounded-xl px-8 py-8 w-full flex gap-y-4 flex-wrap">
        <div className="relative w-full">
          <p className="text-sm text-black">Name</p>
          <p className="font-semibold text-black">{user.name}</p>
        </div>
        <div className="relative w-full">
          <p className="text-sm text-black">Email Id</p>
          <p className="font-semibold text-black">{user.email}</p>
        </div>
        <div className="relative w-full">
          <p className="text-sm text-black">Phone Number</p>
          {isEditing ? (
            <Input
              type="tel"
              value={newPhoneNumber}
              onChange={(e) => setNewPhoneNumber(e.target.value)}
              placeholder="Enter new phone number"
            />
          ) : (
            <p className="font-semibold text-black">
              {user.phone || "Not set"}
            </p>
          )}
        </div>
        {isEditing && (
          <>
            <div className="relative w-full">
              <p className="text-sm text-black">New Password</p>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="relative w-full">
              <p className="text-sm text-black">Current Password</p>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>
          </>
        )}
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      <div className="w-full flex justify-center gap-4">
        {isEditing ? (
          <>
            <Button onClick={handleUpdate}>Save Changes</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
        <Link href="/logout">
          <Button variant="destructive">Logout</Button>
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
