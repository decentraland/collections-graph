export function toLowerCase(str: string): string {
  let result = ''

  for (let i = 0; i < str.length; i++) {
    let character = str[i]
    let charCode = character.charCodeAt(0)
    if (charCode > 64 && charCode < 91) {
      result += String.fromCharCode(charCode + 32)
    } else {
      result += character
    }
  }

  return result
}

// List of allowed committee function selectors
// 0x07bd3522: forwardMetaTx(address _target, bytes calldata _data)
// 0xad718d2a: sponsoredCallV2(address _target,bytes _data,bytes32 _correlationId,bytes32 _r,bytes32 _vs)
// 0x81c9308e: manageCollection(address,address,address,bytes[]) selector
export const ALLOWED_SELECTORS: string[] = ['0x07bd3522', '0xad718d2a', '0x81c9308e']

/**
 * Verify if it's an allowed committee transaction input.
 * @param txInput - The transaction input data as a hexadecimal string.
 * @returns True if the input starts with an allowed selector, false otherwise.
 */
export function isAllowedCommitteeTxInput(txInput: string): boolean {
  for (let i = 0; i < ALLOWED_SELECTORS.length; i++) {
    if (txInput.startsWith(ALLOWED_SELECTORS[i])) {
      return true
    }
  }
  return false
}
