import { expect } from "@playwright/test";

const IGNORED_CONSOLE_PATTERNS = [
  /favicon\.ico/i,
  /Cross-Origin-Opener-Policy/i,
  /Download the React DevTools/i,
];

const IGNORED_REQUEST_PATTERNS = [
  /googleapis\.com/i,
  /gstatic\.com/i,
  /fonts\.googleapis\.com/i,
  /fonts\.gstatic\.com/i,
  /\/sockjs-node/i,
  /\/@vite/i,
  /favicon\.ico/i,
];

export const backendHealthUrl = () => process.env.PLAYWRIGHT_BACKEND_URL || "http://127.0.0.1:4001";

export const uniqueTestUser = (prefix = "playwright") => {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

  return {
    email: `${prefix}-${suffix}@example.com`,
    fullname: `Playwright ${suffix}`,
    username: `${prefix}${suffix}`.replace(/[^a-z0-9]/gi, "").toLowerCase(),
    password: "Test@12345",
  };
};

export const createBrowserIssueTracker = (page) => {
  const issues = [];

  const addIssue = (type, message) => {
    issues.push({ type, message });
  };

  page.on("console", (message) => {
    if (message.type() !== "error") {
      return;
    }

    const text = message.text();
    if (IGNORED_CONSOLE_PATTERNS.some((pattern) => pattern.test(text))) {
      return;
    }

    addIssue("console", text);
  });

  page.on("pageerror", (error) => {
    addIssue("pageerror", error.message);
  });

  page.on("requestfailed", (request) => {
    const url = request.url();
    const errorText = request.failure()?.errorText || "failed";

    if (errorText.includes("ERR_ABORTED")) {
      return;
    }

    if (IGNORED_REQUEST_PATTERNS.some((pattern) => pattern.test(url))) {
      return;
    }

    addIssue("requestfailed", `${errorText} :: ${url}`);
  });

  page.on("response", (response) => {
    const status = response.status();
    const url = response.url();

    if (status < 400) {
      return;
    }

    if (IGNORED_REQUEST_PATTERNS.some((pattern) => pattern.test(url))) {
      return;
    }

    addIssue("response", `${status} :: ${url}`);
  });

  return {
    issues,
    expectClean: async () => {
      await expect.soft(issues, issues.map((issue) => issue.message).join("\n")).toEqual([]);
    },
  };
};
