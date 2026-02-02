/**
 * Replaces all occurrences of 'ß' with 'ss' to comply with Swiss German orthography.
 */
export function toSwiss(text: string): string {
    return text.replace(/ß/g, 'ss');
}

/**
 * Recursively traverses an object or array and applies toSwiss to all strings.
 */
export function swissifyData<T>(data: T): T {
    if (typeof data === 'string') {
        return toSwiss(data) as unknown as T;
    }

    if (Array.isArray(data)) {
        return data.map(item => swissifyData(item)) as unknown as T;
    }

    if (data !== null && typeof data === 'object') {
        const result: any = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                result[key] = swissifyData((data as any)[key]);
            }
        }
        return result as T;
    }

    return data;
}
