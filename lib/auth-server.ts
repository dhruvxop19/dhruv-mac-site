import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { convexSiteUrl, convexUrl, isConvexConfigured } from "@/lib/convex-config";

const disabledAuthHandler = {
  GET: () => Response.json({ error: "Auth is not configured." }, { status: 503 }),
  POST: () => Response.json({ error: "Auth is not configured." }, { status: 503 }),
};

const auth = isConvexConfigured
  ? convexBetterAuthNextJs({
      convexUrl,
      convexSiteUrl,
    })
  : {
      handler: disabledAuthHandler,
      preloadAuthQuery: async () => null,
      isAuthenticated: async () => false,
      getToken: async () => null,
      fetchAuthQuery: async () => null,
      fetchAuthMutation: async () => null,
      fetchAuthAction: async () => null,
    };

export const {
  handler,
  preloadAuthQuery,
  isAuthenticated,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = auth;
