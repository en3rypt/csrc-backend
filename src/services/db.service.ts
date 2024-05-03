import { Prisma, PrismaClient, ContactFormSubmission } from "@prisma/client";
import prisma from "../utils/db";

export class DBService {
  async createContactFormSubmission(
    data: Prisma.ContactFormSubmissionCreateInput
  ): Promise<ContactFormSubmission> {
    try {
      const contactFormSubmission = await prisma.contactFormSubmission.create({
        data,
      });
      return contactFormSubmission;
    } catch (error) {
      console.error("Error creating contact form submission:", error);
      throw new Error("Internal Server Error");
    }
  }

  async getAllContactFormSubmissions(): Promise<ContactFormSubmission[]> {
    try {
      const contactFormSubmissions =
        await prisma.contactFormSubmission.findMany();
      return contactFormSubmissions;
    } catch (error) {
      console.error("Error fetching contact form submissions:", error);
      throw new Error("Internal Server Error");
    }
  }

  async getContactFormSubmissionsByEmail(
    email: string
  ): Promise<ContactFormSubmission[]> {
    try {
      const contactFormSubmissions =
        await prisma.contactFormSubmission.findMany({
          where: { email },
        });
      return contactFormSubmissions;
    } catch (error) {
      console.error(
        `Error fetching contact form submissions for email ${email}:`,
        error
      );
      throw new Error("Internal Server Error");
    }
  }

  async getContactFormSubmissionByUUID(
    uuid: string
  ): Promise<ContactFormSubmission | null> {
    try {
      const contactFormSubmission =
        await prisma.contactFormSubmission.findUnique({
          where: { uuid },
        });
      return contactFormSubmission;
    } catch (error) {
      console.error(
        `Error fetching contact form submission with id ${uuid}:`,
        error
      );
      throw new Error("Internal Server Error");
    }
  }

  // Implement other CRUD methods similarly

  // Example update method
  async updateContactFormSubmission(
    id: number,
    data: Prisma.ContactFormSubmissionUpdateInput
  ): Promise<ContactFormSubmission | null> {
    try {
      const updatedSubmission = await prisma.contactFormSubmission.update({
        where: { id },
        data,
      });
      return updatedSubmission;
    } catch (error) {
      console.error(
        `Error updating contact form submission with id ${id}:`,
        error
      );
      throw new Error("Internal Server Error");
    }
  }

  // Example delete method
  async deleteContactFormSubmission(id: number): Promise<boolean> {
    try {
      await prisma.contactFormSubmission.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error(
        `Error deleting contact form submission with id ${id}:`,
        error
      );
      throw new Error("Internal Server Error");
    }
  }
}
