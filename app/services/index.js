
module.exports = function(ngModule){
    require('./interval-service')(ngModule);
    require('./note-service')(ngModule);
    require('./scale-service')(ngModule);
    require('./tuning-service')(ngModule);
};