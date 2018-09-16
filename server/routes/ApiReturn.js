class ApiReturn {

    constructor (){

    }

    /**
     * SUCESS MESSAGES
     */

    successMessage ( description ) {
        let message = new Object();
            message.object = 'message';
            message.code = 202;
            message.type = 'Success';
            message.description = description;
        return message;
    }

    /**
     * ERROR MESSAGES
     */

    amcpErrorMessage ( amcpErrorMessage  ) {
        let error = new Error();
            error.object = 'message';
            error.code = 500;
            error.type = 'AMCP protocol error';
            error.description = amcpErrorMessage;
        return error;
    }

    notFoundMessage ( description ) {
        let error = new Error();
            error.object = 'message';
            error.code = 404;
            error.type = 'Ressource not found';
            error.description = description;
        return error;
    }

    clientErrorMessage ( description ) {
        let error = new Error();
            error.object = 'message';
            error.code = 406;
            error.type = 'Not Acceptable';
            error.description = description;
        return error;
    }

    errorMessage ( description ){
        let error = new Error();
        error.object = 'message';
        error.code = 400;
        error.type = 'Request Error';
        error.description = description;
    return error;
    }

    /**
     * CUSTOM MESSAGE
     */
    customMessage( code, type, description ){
        let message = new Object();
            message.object = 'message';
            message.code = code;
            message.type = type;
            message.description = description;
        return message;
    }

}

module.exports = ApiReturn;
