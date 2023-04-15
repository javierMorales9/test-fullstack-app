import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { z } from "zod";
import container from "~/server/api/dependency_injection";
import AccountInfoAdder from "~/server/Context/Accounts/application/AccountInfoAdder";
import { AccountResponse } from "~/server/Context/Accounts/domain/response/accountResponse";
import { TRPCError } from "@trpc/server";
import AccountDeleter from "~/server/Context/Accounts/application/AccountDeleter";
import PhotoUploader from "~/server/Context/Accounts/application/PhotoUploader";
import DomainAdder from "~/server/Context/Accounts/application/DomainAdder";
import DomainDeleter from "~/server/Context/Accounts/application/DomainDeleter";

export const accountsRouter = createTRPCRouter({
  get: privateProcedure.query(async ({ ctx }) => {
    return ctx.account;
  }),
  addInfo: privateProcedure
    .input(
      z.object({
        paymentType: z.string().optional(),
        privateKey: z.string().optional(),
        companyData: z
          .object({
            name: z.string().optional(),
            socialReason: z.string().optional(),
            localization: z.string().optional(),
            cif: z.string().optional(),
            address: z.string().optional(),
            postalCode: z.string().optional(),
            phone: z.string().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const account = ctx.account;

        const addInfo = container.get<AccountInfoAdder>(
          "Accounts.application.AccountInfoAdder"
        );
        const savedAccount = await addInfo.execute(input, account);

        return new AccountResponse(savedAccount);
      } catch (err: any) {
        new TRPCError(err.message);
      }
    }),
  delete: privateProcedure.mutation(async ({ ctx }) => {
    const deleteAccount = container.get<AccountDeleter>(
      "Accounts.application.AccountDeleter"
    );
    try {
      const account = ctx.account;
      await deleteAccount.execute(account);
      return "Successfully deleted Account " + account.id;
    } catch (err: any) {
      new TRPCError({ message: err.message, code: "BAD_REQUEST" });
    }
  }),
  uploadLogo: privateProcedure.mutation(async ({ ctx }) => {
    throw new TRPCError({ code: "METHOD_NOT_SUPPORTED" });
    const uploadPhoto = container.get<PhotoUploader>(
      "Accounts.application.PhotoUploader"
    );

    try {
      const account = ctx.account;
      //const accountImage = req.files!.accountImage as ImageType;
      const accountImage = "";

      const accountWithNewPhoto = await uploadPhoto.execute(
        account,
        accountImage
      );
      const accountResponse = new AccountResponse(accountWithNewPhoto);
      return accountResponse;
    } catch (err: any) {
      new TRPCError({ message: err.message, code: "BAD_REQUEST" });
    }
  }),
  addDomains: privateProcedure
    .input(
      z.object({
        domains: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const addDomains = container.get<DomainAdder>(
        "Accounts.application.DomainAdder"
      );
      try {
        const account = ctx.account;
        await addDomains.execute(account, input.domains);
      } catch (err: any) {
        throw new TRPCError({ message: err.message, code: "BAD_REQUEST" });
      }
    }),
  deleteDomain: privateProcedure
    .input(
      z.object({
        domain: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deleteDomain = container.get<DomainDeleter>(
        "Accounts.application.DomainDeleter"
      );
      try {
        const account = ctx.account;
        await deleteDomain.execute(account, input.domain);
      } catch (err: any) {
        throw new TRPCError({ message: err.message, code: "BAD_REQUEST" });
      }
    }),
});
