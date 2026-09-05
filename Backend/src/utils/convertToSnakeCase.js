export const convertToSnakeCase = (text)=>{
    return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
}