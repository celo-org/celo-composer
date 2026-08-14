/**
 * How each template relates to `--wallet-provider`.
 *
 * There are two different questions here, and the first version of this file
 * answered them with one list — which broke minipay. They are:
 *
 *   1. **What must `walletProvider` be set to?** (`forcedWalletProvider`)
 *   2. **Which wallet-template files must not be written?** (`skipsWalletTemplateFiles`)
 *
 * For farcaster-miniapp, x402 and ai-chat the answers coincide: nothing is
 * written and the value is "none". For **minipay they do not**. minipay ships
 * its own `connect-button.tsx` and `wallet-provider.tsx`, so the wallet
 * templates must not write those files — but its components are *built on*
 * RainbowKit (`wallet-provider.tsx` imports `RainbowKitProvider`,
 * `WagmiProvider` and `QueryClientProvider`; `user-balance.tsx` uses wagmi
 * hooks), and the base manifest gates `@rainbow-me/rainbowkit`, `wagmi`, `viem`
 * and `@tanstack/react-query` on `walletProvider === "rainbowkit"`.
 *
 * Forcing minipay to "none" therefore produced a scaffold with its own wallet
 * components and none of the packages they import. Caught in review on #461.
 */

/**
 * Templates that require one specific provider, whatever the flag says.
 *
 * minipay is not "ignores the flag" — it *needs* rainbowkit. Forcing that value
 * also resolves the collision this list was originally added for: the rainbowkit
 * components action already skips on `templateType === "minipay"`, and both
 * thirdweb actions skip on `walletProvider !== "thirdweb"`, so no two actions
 * write the same filename.
 */
export const REQUIRES_WALLET: Record<string, string> = {
  "minipay": "rainbowkit",
};

/**
 * Templates that write their own connect button and wallet provider, under the
 * same filenames the wallet templates use.
 *
 * Letting a wallet template write as well is not a preference clash, it is a
 * collision: plop aborts the whole run with "File already exists" and leaves a
 * half-generated project.
 */
export const SHIPS_OWN_WALLET = ["farcaster-miniapp", "minipay"];

/**
 * Templates with no wallet UI at all.
 *
 * Honouring the flag here produced a navbar importing a component nothing
 * writes (#396); with that fixed it produces a project simply missing what was
 * asked for.
 */
export const SHIPS_NO_WALLET = ["ai-chat", "x402"];

/**
 * The value `walletProvider` must take for this template, or `null` when the
 * flag (or the default) is honoured as given.
 */
export function forcedWalletProvider(templateType: string | undefined): string | null {
  if (!templateType) return null;
  const required = REQUIRES_WALLET[templateType];
  if (required !== undefined) return required;
  if (SHIPS_OWN_WALLET.includes(templateType) || SHIPS_NO_WALLET.includes(templateType)) {
    return "none";
  }
  return null;
}

/**
 * True when the rainbowkit/thirdweb component actions must not write for this
 * template — because it either ships those files itself or wants none.
 *
 * Deliberately NOT the same predicate as `forcedWalletProvider`: minipay is in
 * here and still gets a real provider value.
 */
export function skipsWalletTemplateFiles(templateType: string | undefined): boolean {
  if (!templateType) return false;
  return (
    SHIPS_OWN_WALLET.includes(templateType) || SHIPS_NO_WALLET.includes(templateType)
  );
}

/**
 * Why this template will not take the provider that was asked for, as a
 * sentence fragment, so the CLI warning and the plop skip messages cannot drift
 * apart again.
 */
export function walletOverrideReason(templateType: string): string {
  const required = REQUIRES_WALLET[templateType];
  if (required !== undefined) {
    return `the ${templateType} template ships its own ${required}-based wallet components`;
  }
  return SHIPS_OWN_WALLET.includes(templateType)
    ? `the ${templateType} template ships its own wallet components`
    : `the ${templateType} template ships no wallet layer of its own`;
}

/**
 * The reason shown when a wallet action is skipped, accurate for the template
 * that caused it rather than one sentence covering both cases.
 *
 * `subject` names the action being skipped, e.g. "RainbowKit" or "Thirdweb lib".
 */
export function walletSkipReason(subject: string, templateType: string): string {
  return `Skipping ${subject} - ${walletOverrideReason(templateType)}`;
}
