export class BaseUtils {
    private static instance: BaseUtils;

    private constructor() {
    }

    static getInstance(): BaseUtils {
        if (!BaseUtils.instance) {
            BaseUtils.instance = new BaseUtils();
        }
        return BaseUtils.instance;
    }

    /**
     * @description Generates a random numerical string with the specified prefix and length.
     * @param prefix The prefix to use for the generated string.
     * @param length The length of the generated string.
     * @returns The generated random numerical string.
     */
    static generateRandomNumericalString(prefix: string, length: number): string {
        const characters = "0123456789";
        const charactersLength = characters.length;
        let result = prefix;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    /**
     * @description Generates a random hexadecimal string with the specified length.
     * @param length The length of the generated string.
     * @returns The generated random hexadecimal string.
     */
    static generateRandomHexString(length: number): string {
        const characters = "0123456789ABCDEF";
        const charactersLength = characters.length;
        let result = "";
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    /**
     * @description Checks if the given email is valid.
     * @param email The email to check.
     * @returns True if the email is valid, false otherwise.
     */
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * @description Checks if the given password is valid.
     * @param password The password to check.
     * @returns True if the password is valid, false otherwise.
     */
    static isValidPassword(password: string): boolean {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    }

    /**
     * @description Checks if the given username is valid.
     * @param username The username to check.
     * @returns True if the username is valid, false otherwise.
     */
    static isValidUsername(username: string): boolean {
        const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
        return usernameRegex.test(username);
    }

    /**
     * @description Checks if the given phone number is valid.
     * @param phoneNumber The phone number to check.
     * @returns True if the phone number is valid, false otherwise.
     */
    static isValidPhoneNumber(phoneNumber: string): boolean {
        const phoneNumberRegex = /^\+[1-9]\d{1,14}$/;
        return phoneNumberRegex.test(phoneNumber);
    }

    /**
     * @description Checks if the given URL is valid.
     * @param url The URL to check.
     * @returns True if the URL is valid, false otherwise.
     */
    static isValidUrl(url: string): boolean {
        const urlRegex = /^(http|https):\/\/[^ "]+$/;
        return urlRegex.test(url);
    }

    /**
     * @description Checks if the given date is valid.
     * @param date The date to check.
     * @returns True if the date is valid, false otherwise.
     */
    static isValidDate(date: string): boolean {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(date);
    }

    /**
     * @description Returns the current timestamp in milliseconds.
     * @returns The current timestamp in milliseconds.
     */
    static getCurrentTimestamp(): number {
        return Date.now();
    }

    /**
     * @description Generates a random alphanumeric string with the specified prefix and length.
     * @param prefix The prefix to use for the generated string.
     * @param length The length of the generated string.
     * @returns The generated random alphanumeric string.
     */
    generateRandomAlphanumericString(prefix: string, length: number): string {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        let result = prefix;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}