/**
 * Represents an emergency contact with a name and phone number.
 */
export interface EmergencyContact {
  /**
   * The name of the emergency contact.
   */
  name: string;
  /**
   * The phone number of the emergency contact.
   */
  phoneNumber: string;
}

/**
 * Sends an emergency message to a specified contact.
 *
 * @param contact The emergency contact to send the message to.
 * @param message The message to send.
 * @returns A promise that resolves to true if the message was sent successfully, false otherwise.
 */
export async function sendEmergencyMessage(contact: EmergencyContact, message: string): Promise<boolean> {
  // TODO: Implement this by calling an API.
  console.log(`Sending message: ${message} to ${contact.name} at ${contact.phoneNumber}`);
  return true;
}

/**
 * Initiates an emergency call to a specified contact.
 *
 * @param contact The emergency contact to call.
 * @returns A promise that resolves to true if the call was initiated successfully, false otherwise.
 */
export async function initiateEmergencyCall(contact: EmergencyContact): Promise<boolean> {
  // TODO: Implement this by calling an API.
  console.log(`Initiating call to ${contact.name} at ${contact.phoneNumber}`);
  return true;
}
