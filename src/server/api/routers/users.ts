import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { z } from "zod";
import container from "~/server/api/dependency_injection";
import { TRPCError } from "@trpc/server";
import { UserByEmailGetter } from "~/server/Context/Users/application/UserByEmailGetter";
import { UserRequest } from "~/server/Context/Users/domain/UserRequest";
import { UserCreator } from "~/server/Context/Users/application/UserCreator";
import { UserResponse } from "~/server/Context/Users/domain/UserResponse";
import { AccountResponse } from "~/server/Context/Accounts/domain/response/accountResponse";
import {
  issueUserJWT,
  validPassword,
} from "~/server/Context/Shared/infrastructure/security/securityUtils";
import { UserLoginData } from "~/server/Context/Users/domain/UserLoginData";

export const usersRouter = createTRPCRouter({
  get: privateProcedure.query(async ({ ctx }) => {
    const userGetter = container.get<UserByEmailGetter>(
      "Users.application.UserByEmailGetter"
    );
    try {
      const userId = ctx.userId;
      return await userGetter.execute(userId);
    } catch (err: any) {
      throw new TRPCError({ message: err.message, code: "BAD_REQUEST" });
    }
  }),
  create: privateProcedure
    .input(
      z.object({
        id: z.string().optional(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const saveUser = container.get<UserCreator>(
        "Users.application.UserCreator"
      );
      try {
        const request = new UserRequest(input);
        const user = await saveUser.execute(request);

        const userResponse = new UserResponse(user.user);
        const accountResponse = new AccountResponse(user.account);
        const jwt = issueUserJWT(user.user);

        return {
          user: { ...userResponse, account: accountResponse },
          token: jwt.token,
          expiresIn: jwt.expires,
        };
      } catch (err: any) {
        throw new TRPCError({ message: err.message, code: "BAD_REQUEST" });
      }
    }),
  login: privateProcedure.mutation(async ({ ctx, input }) => {
    const userGetter = container.get<UserByEmailGetter>(
      "Users.application.UserByEmailGetter"
    );
    try {
      const loginData = new UserLoginData(input);
      const user = await userGetter.execute(loginData.email);

      validPassword(user.user, loginData.password);
      const jwt = issueUserJWT(user.user);

      const userResponse = new UserResponse(user.user);
      const accountResponse = new AccountResponse(user.account);

      return {
        user: { ...userResponse, account: accountResponse },
        token: jwt.token,
        expiresIn: jwt.expires,
      };
    } catch (err: any) {
      if (err.message === "Not valid credentials")
        throw new TRPCError({
          message: "Not valid credentials",
          code: "BAD_REQUEST",
        });
      throw new TRPCError({ message: err.message, code: "BAD_REQUEST" });
    }
  }),
});
