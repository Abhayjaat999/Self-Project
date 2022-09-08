const { default: mongoose } = require("mongoose")


//check if data is present in body or not
function checkbody(value) {
    return (Object.keys(value).length > 0)
}


//check if data is present in query param or not
function checkquery(value) {
    return (Object.keys(value).length > 0)
}

const isValidTitle = function (title,inp) {
    return inp.indexOf(title) !== -1;
  };

module.exports.isValidTitle = isValidTitle
module.exports.validation = {checkbody , checkquery ,}