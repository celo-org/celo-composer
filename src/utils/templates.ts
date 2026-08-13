/**
 * Which templates cannot honour an explicit `--wallet-provider`, and why.
 *
 * This lived in four places before — the forcing in `create.ts`, two comments
 * next to it, and the skip strings in `plopfile.ts` — and the copies had
 * drifted apart: the strings claimed every affected template "uses its own
 * wallet components", which is false for half of them, and `minipay` was
 * missing from the forcing entirely (see below). One list, read by everything.
 *
 * The two reasons are different and the difference is user-facing:
 *
 * - `SHIPS_OWN_WALLET` writes its own connect button and provider, under the
 *   *same filenames* the wallet templates use. Letting a wallet template write
 *   too is not a preference clash, it is a collision: plop aborts the whole
 *   run with "File already exists" and leaves a half-generated project.
 *
 * - `SHIPS_NO_WALLET` writes no wallet UI at all. Honouring the flag there
 *   produced a navbar importing a component nothing writes (#396); with that
 *   fixed it produces a project simply missing what was asked for.
 */
export const SHIPS_OWN_WALLET = ["farcaster-miniapp", "minipay"];
export const SHIPS_NO_WALLET = ["ai-chat", "x402"];

/** True when an explicit `--wallet-provider` cannot be applied to this template. */
export function ignoresWalletProvider(templateType: string | undefined): boolean {
  if (!templateType) return false;
  return (
    SHIPS_OWN_WALLET.includes(templateType) ||
    SHIPS_NO_WALLET.includes(templateType)
  );
}

/**
 * Why this template ignores `--wallet-provider`, as a sentence fragment, so the
 * CLI warning and the plop skip messages cannot drift apart again.
 */
export function walletOverrideReason(templateType: string): string {
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
