// Takes any number of arguments and returns them concatenated.
UI.registerHelper('concat', function () {
    return Array.prototype.slice.call(arguments, 0, -1).join('');
});
