const moment = require('moment');

const MAP_NUMBER = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
const ONE_NAME = 'đồng';
const ONE_NAME_2 = 'mốt';
const ONE_DOZENS = 10;
const ODD_NAME = 'lẻ';
const ONE_DOZENS_NAME = 'mươi';
const ONE_DOZENS_NAME_UNIT = 'mười';
const ONE_HUNDRED = 100;
const ONE_HUNDRED_NAME = 'trăm';
const ONE_THOUSAND = 1000;
const ONE_THOUSAND_NAME = 'nghìn';
const ONE_MILLION = 1000000;
const ONE_MILLION_NAME = 'triệu';
const ONE_BILLION = 1000000000;
const ONE_BILLION_NAME = 'tỷ';
const ONE_TRILLION = 1000000000000;
const ONE_TRILLION_NAME = 'nghìn tỷ';

/**
 * Read number and return array string;
 * @param value
 * @param unit
 */
const readNumberBelowThousand = (value: number, unit: string): Array<string> => {
    let words: Array<string> = [];
    let newValue = value;
    let hundredValue = 0;
    let dozensValue = 0;
    let unitValue = 0;

    if (newValue >= ONE_HUNDRED) {
        hundredValue = Math.floor(newValue / ONE_HUNDRED);
        newValue = value - hundredValue * ONE_HUNDRED;
    }

    if (newValue >= ONE_DOZENS) {
        dozensValue = Math.floor(newValue / ONE_DOZENS);
        newValue = newValue - dozensValue * ONE_DOZENS;
    }

    if (newValue >= 1) {
        unitValue = newValue;
    }

    // ex: 110, 120, 220,
    if (words.length === 0 && hundredValue > 0 && dozensValue > 0 && unitValue === 0) {
        words.push(MAP_NUMBER[hundredValue], ONE_HUNDRED_NAME);

        // ex: 110
        if (dozensValue === 1) {
            words.push(ONE_DOZENS_NAME_UNIT, unit);
        } else {
            // ex: 120
            words.push(MAP_NUMBER[dozensValue], ONE_DOZENS_NAME, unit);
        }
    }

    // ex: 100, 200
    if (words.length === 0 && hundredValue > 0 && dozensValue === 0 && unitValue === 0) {
        words.push(MAP_NUMBER[hundredValue], ONE_HUNDRED_NAME, unit);
    }

    // ex: 101, 202
    if (words.length === 0 && hundredValue > 0 && dozensValue === 0 && unitValue !== 0) {
        words.push(MAP_NUMBER[hundredValue], ONE_HUNDRED_NAME, ODD_NAME, MAP_NUMBER[unitValue], unit);
    }

    // ex: 123, 132
    if (words.length === 0 && hundredValue > 0 && dozensValue > 0 && unitValue !== 0) {
        words.push(MAP_NUMBER[hundredValue], ONE_HUNDRED_NAME);

        if (dozensValue === 1) {
            words.push(ONE_DOZENS_NAME_UNIT);
            words.push(MAP_NUMBER[unitValue], unit);
        } else {
            words.push(MAP_NUMBER[dozensValue], ONE_DOZENS_NAME);
            if (unitValue === 1) {
                words.push(ONE_NAME_2, unit);
            } else {
                words.push(MAP_NUMBER[unitValue], unit);
            }
        }
    }

    // ex: 20, 10, 30
    if (words.length === 0 && hundredValue === 0 && dozensValue > 0 && unitValue === 0) {
        if (dozensValue === 1) {
            // ex: 10
            words.push(ONE_DOZENS_NAME_UNIT, unit);
        } else {
            words.push(MAP_NUMBER[dozensValue], ONE_DOZENS_NAME, unit);
        }
    }

    // ex: 10, 11, 22, 11, 31
    if (words.length === 0 && hundredValue === 0 && dozensValue > 0 && unitValue !== 0) {
        if (dozensValue === 1) {
            // ex: 10, 11
            words.push(ONE_DOZENS_NAME_UNIT, MAP_NUMBER[unitValue], unit);
        } else {
            // ex: greater than 19
            words.push(MAP_NUMBER[dozensValue], ONE_DOZENS_NAME);
            if (unitValue === 1) {
                words.push(ONE_NAME_2, unit);
            } else {
                words.push(MAP_NUMBER[unitValue], unit);
            }
        }
    }

    // ex: 0, 1, 2, 3, 4
    if (words.length === 0 && hundredValue === 0 && dozensValue === 0) {
        if (unitValue === 0) {
            words.push(unit);
        } else {
            words.push(MAP_NUMBER[unitValue], unit);
        }
    }

    return words;
}

/**
 * Read number and return words.
 * @param {number} value
 */
export const readNumber = (value: number) => {
    let words: Array<string> = [];
    let newValue = value;

    // read trillion
    if (newValue >= ONE_TRILLION) {
        const number = Math.floor(newValue / ONE_TRILLION);
        words.push(...readNumberBelowThousand(number, ONE_TRILLION_NAME));
        newValue = value - number * ONE_TRILLION;
    }

    // read billion
    if (newValue >= ONE_BILLION) {
        const number = Math.floor(newValue / ONE_BILLION);
        words.push(...readNumberBelowThousand(number, ONE_BILLION_NAME));
        newValue = newValue - number * ONE_BILLION;
    }

    // read one million
    if (newValue >= ONE_MILLION) {
        const number = Math.floor(newValue / ONE_MILLION);
        words.push(...readNumberBelowThousand(number, ONE_MILLION_NAME));
        newValue = newValue - number * ONE_MILLION;
    }

    // read one thousand
    if (newValue >= ONE_THOUSAND) {
        const number = Math.floor(newValue / ONE_THOUSAND);
        words.push(...readNumberBelowThousand(number, ONE_THOUSAND_NAME));
        newValue = newValue - number * ONE_THOUSAND;
    }

    // read number below one thousand
    if (newValue < ONE_THOUSAND) {
        words.push(...readNumberBelowThousand(newValue, ONE_NAME));
    }

    return words.join(' ');
}

/**
 * Format date and return date string;
 * @param {string} date: default is current date with format ISO string.
 * @param formatString
 */
export const formatDate = (
    date: Date = new Date(),
    formatString: string = 'DD-MM-YYYY'
): string => {
    return moment(date).format(formatString).toString();
}

/**
 * Format number to currency
 * @param value
 * @param fractionDigits
 */
export const formatCurrency = (value: number, fractionDigits: number = 0) => {
    let newFractionDigits = fractionDigits <= 0 ? 1 : fractionDigits;
    let currency = (value).toFixed(newFractionDigits).replace(/\d(?=(\d{3})+\.)/g, '$&,');

    if (fractionDigits === 0) currency = currency.replace('.0', '');
    return currency;
}

/**
 * Replace all with search value.
 * @param stringValue
 * @param searchValue
 * @param replaceValue
 */
export const replaceAll = (stringValue: string, searchValue: string, replaceValue: string) => {
    const searchRegExp = new RegExp(searchValue, 'g');
    return stringValue.replace(searchRegExp, replaceValue);
}

/**
 * get last date
 * @param {number} days
 */
export const getLastDate = (days: number = 1): string => {
    const currentTime = new Date(new Date().toISOString());
    let previousTime = new Date(currentTime.getTime() - days * 24 * 3600 * 1000);
    return previousTime.toISOString();
}

/**
 * Get current date.
 * @return {string}
 */
export const getCurrentDate = (): string => {
    return new Date().toISOString();
}

/**
 * Remove vietnamese tones and to lower case
 * @param str
 */
export const removeVietnameseTonesAndLowerCase = (str: string) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
    str = str.replace(/đ/g,"d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g," ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    return str.toLowerCase();
}

interface IPrefix {
    code?: string;
    codeLength?: number;
    codePrefixLength?: number;

    CODE?: string;
    CODE_LENGTH?: number;
    CODE_PREFIX_LENGTH?: number;
}

/**
 * Generate string code with prefix
 * @param prefix
 * @param increaseNumber
 */
export const generateCodeWithPrefix = (prefix: IPrefix, increaseNumber: number) => {
    const code = prefix.code || prefix.CODE || '000000';
    const codeLength = prefix.codeLength || prefix.CODE_LENGTH || 6;
    const codePrefixLength = prefix.codePrefixLength || prefix.CODE_PREFIX_LENGTH || 0;
    const numberLength = `${increaseNumber}`.length;

    let newCode = null;
    if (numberLength > codeLength) {
        newCode = code.substring(0, codePrefixLength) + `${increaseNumber}`;
    } else {
        newCode = code.substring(0, code.length - numberLength) + `${increaseNumber}`;
    }

    return newCode;
}

/**
 * Random number with length.
 * @param {number} length
 * @return {number}
 */
export const randomNumberByLength = (length: number = 6): number => {
    let min: any = 1;
    let max: any = 9;
    for (let i = 1; i < length; i++) {
        min = `${min}0`;
        max = `${max}9`;
    }
    min = Number(min);
    max = Number(max);

    return Math.floor(Math.random() * max + min);
}
