import chalk from 'chalk';
import pad from 'pad-component';
import wrap from 'wrap-ansi';
import stringWidth from 'string-width';
import stripAnsi from 'strip-ansi';
import ansiStyles from 'ansi-styles';
import _ansi_regex from 'ansi-regex';
import cliBoxes from 'cli-boxes';
var defaultExport = {};
var __exports;
const ansiRegex = _ansi_regex();
const border = cliBoxes.round;
const leftOffset = 17;
const defaultGreeting = '\n     _-----_     ' + '\n    |       |    ' + '\n    |' + chalk.red('--(o)--') + '|    ' + '\n   `---------\xB4   ' + '\n    ' + chalk.yellow('(') + ' _' + chalk.yellow('\xB4U`') + '_ ' + chalk.yellow(')') + '    ' + '\n    /___A___\\   /' + '\n     ' + chalk.yellow('|  ~  |') + '     ' + '\n   __' + chalk.yellow('\'.___.\'') + '__   ' + '\n \xB4   ' + chalk.red('`  |') + '\xB0 ' + chalk.red('\xB4 Y') + ' ` ';
__exports = (message, options) => {
    message = (message || 'Welcome to Yeoman, ladies and gentlemen!').trim();
    options = options || {};
    const styledIndexes = {};
    let maxLength = 24;
    let topOffset = 4;
    let completedString = '';
    const YEOMAN_CHARACTER_WIDTH = 17;
    const DEFAULT_TOP_FRAME_WIDTH = 28;
    const MAX_MESSAGE_LINES_BEFORE_OVERFLOW = 7;
    let TOTAL_CHARACTERS_PER_LINE = YEOMAN_CHARACTER_WIDTH + DEFAULT_TOP_FRAME_WIDTH;
    if (options.maxLength) {
        maxLength = stripAnsi(message).toLowerCase().split(' ').sort()[0].length;
        if (maxLength < options.maxLength) {
            maxLength = options.maxLength;
            TOTAL_CHARACTERS_PER_LINE = maxLength + YEOMAN_CHARACTER_WIDTH + topOffset;
        }
    }
    const regExNewLine = new RegExp(`\\s{${ maxLength }}`);
    const borderHorizontal = border.horizontal.repeat(maxLength + 2);
    const frame = {
        top: border.topLeft + borderHorizontal + border.topRight,
        side: ansiStyles.reset.open + border.vertical + ansiStyles.reset.open,
        bottom: ansiStyles.reset.open + border.bottomLeft + borderHorizontal + border.bottomRight
    };
    message.replace(ansiRegex, (match, offset) => {
        Object.keys(styledIndexes).forEach(key => {
            offset -= styledIndexes[key].length;
        });
        styledIndexes[offset] = styledIndexes[offset] ? styledIndexes[offset] + match : match;
    });
    const strippedMessage = stripAnsi(message);
    const spacesIndex = [];
    strippedMessage.split(' ').reduce((accu, cur) => {
        spacesIndex.push(accu + cur.length);
        return spacesIndex[spacesIndex.length - 1] + 1;
    }, 0);
    return wrap(strippedMessage, maxLength, { hard: true }).split(/\n/).reduce((greeting, str, index, array) => {
        if (!regExNewLine.test(str)) {
            str = str.trim();
        }
        completedString += str;
        let offset = 0;
        for (let i = 0; i < spacesIndex.length; i++) {
            const char = completedString[spacesIndex[i] - offset];
            if (char) {
                if (char !== ' ') {
                    offset += 1;
                }
            } else {
                break;
            }
        }
        str = completedString.substr(completedString.length - str.length).replace(/./g, (char, charIndex) => {
            charIndex += completedString.length - str.length + offset;
            let hasContinuedStyle = 0;
            let continuedStyle;
            Object.keys(styledIndexes).forEach(offset => {
                if (charIndex > offset) {
                    hasContinuedStyle++;
                    continuedStyle = styledIndexes[offset];
                }
                if (hasContinuedStyle === 1 && charIndex < offset) {
                    hasContinuedStyle++;
                }
            });
            if (styledIndexes[charIndex]) {
                return styledIndexes[charIndex] + char;
            }
            if (hasContinuedStyle >= 2) {
                return continuedStyle + char;
            }
            return char;
        }).trim();
        const paddedString = pad({
            length: stringWidth(str),
            valueOf() {
                return ansiStyles.reset.open + str + ansiStyles.reset.open;
            }
        }, maxLength);
        if (index === 0) {
            if (array.length === 2) {
                topOffset -= 1;
            }
            if (array.length >= 3) {
                topOffset -= 2;
            }
            if (array.length > MAX_MESSAGE_LINES_BEFORE_OVERFLOW) {
                const emptyLines = Math.ceil((array.length - MAX_MESSAGE_LINES_BEFORE_OVERFLOW) / 2);
                for (let i = 0; i < emptyLines; i++) {
                    greeting.unshift('');
                }
                frame.top = pad.left(frame.top, TOTAL_CHARACTERS_PER_LINE);
            }
            greeting[topOffset - 1] += frame.top;
        }
        greeting[index + topOffset] = (greeting[index + topOffset] || pad.left('', leftOffset)) + frame.side + ' ' + paddedString + ' ' + frame.side;
        if (array.length === index + 1) {
            greeting[index + topOffset + 1] = (greeting[index + topOffset + 1] || pad.left('', leftOffset)) + frame.bottom;
        }
        return greeting;
    }, defaultGreeting.split(/\n/)).join('\n') + '\n';
};
defaultExport = __exports;
export default defaultExport;