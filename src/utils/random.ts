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
