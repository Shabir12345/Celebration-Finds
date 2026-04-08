const token = 'skskFvmTTYq0e9kDpUaswODiol9vT53MmXXZPGrJC79CWf3eHEeH2CDd46oCoIIGBZkua7oCd8Y7NZdocjXOTFQX8YqBmL3LeS7lJNcQz5yMek5oMDULjnCccgM2snVtFZvEr8Ta6g0lxvCCuoGd1p0MFKrIq9VPYNGlzx1BTB9yub6rOoliH5';
console.log('Length:', token.length);
const half = token.length / 2;
const first = token.slice(0, half);
const second = token.slice(half);
console.log('First half:', first);
console.log('Second half:', second);
console.log('Same:', first === second);
