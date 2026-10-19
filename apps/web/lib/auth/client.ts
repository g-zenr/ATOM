"use client";

import { createAuthClient } from "@neondatabase/auth/next";

/** Browser client — talks to the same-origin /api/auth/* proxy routes. */
export const authClient = createAuthClient();
