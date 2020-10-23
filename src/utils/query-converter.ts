/**
 * Functon that can replace all the 'plus' in a string and put a white space
 * @param query stores the string the many 'plus' characters
 */
export function convertQuery(query: string): string {
    return query.split('+').join(' ')
}
