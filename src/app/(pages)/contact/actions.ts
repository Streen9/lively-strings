"use server";

import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export async function submitContactForm(formData: FormData) {
  const validatedFields = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Here you would typically send an email or store the message in a database
  // For this example, we'll just simulate a delay and return a success message
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { success: true, message: "Your message has been sent successfully!" };
}
