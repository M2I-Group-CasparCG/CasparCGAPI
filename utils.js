"use strict";

module.exports = {

    debug : function(_color, message) {

        const color             = {}
        color['reset']          = "\x1b[0m";
        color['bright']         = "\x1b[1m";
        color['dim']            = "\x1b[2m";
        color['underscore']     = "\x1b[4m";
        color['blink']          = "\x1b[5m";
        color['reverse']        = "\x1b[7m";
        color['hidden']         = "\x1b[8m";
    
        color['black']        = "\x1b[30m";
        color['red']          = "\x1b[31m";
        color['green']        = "\x1b[32m";
        color['yellow']       = "\x1b[33m";
        color['blue']         = "\x1b[34m";
        color['magenta']      = "\x1b[35m";
        color['cyan']         = "\x1b[36m";
        color['white']        = "\x1b[37m";
    
        color['bgBlack']        = "\x1b[40m";
        color['bgRed']          = "\x1b[41m";
        color['bgGreen']        = "\x1b[42m";
        color['bgYellow']       = "\x1b[43m";
        color['bgBlue']         = "\x1b[44m";
        color['bgMagenta']      = "\x1b[45m";
        color['bgCyan']         = "\x1b[46m";
        color['bgWhite']        = "\x1b[47m";

        const toPrint = `${color[_color]}${message}${color['reset']}`
        console.log(toPrint);
    }
}

