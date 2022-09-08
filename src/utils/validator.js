

const isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss",].indexOf(title) !== -1;
  };
  module.exports.isValidTitle = isValidTitle