export const Truncate = (str, maxLength = 15) =>{
   if (!str) return ''
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
}
