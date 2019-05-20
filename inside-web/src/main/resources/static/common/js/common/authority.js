(function ($, window) {
    function checkAuthority(codeList, classNameArray) {
        for (var i in classNameArray) {
            var className = classNameArray[i];
            $("." + className).each(function () {
                var codeSplit = $(this).attr("authority_code");
                if (Utils.isNotNull(codeSplit) && $.trim(codeSplit) != "") {
                    var codeArray = codeSplit.split(",");
                    for (var i in codeArray) {
                        var code = codeArray[i];
                        if (Utils.isNotNull(code) && $.trim(code) != "") {
                            if (Utils.isContain(codeList, $.trim(code))) {
                                var n_codeSplit = $(this).attr("n_authority_code");
                                if (Utils.isNotNull(n_codeSplit) && $.trim(n_codeSplit) != "") {
                                    var n_codeArray = n_codeSplit.split(",");
                                    var isContailN = false;
                                    for (var j in n_codeArray) {
                                        var nCode = n_codeArray[i];
                                        if (Utils.isNotNull(nCode) && $.trim(nCode) != "") {
                                            if (Utils.isContain(codeList, $.trim(nCode))) {
                                                isContailN=true;
                                                break;
                                            }
                                        }
                                    }
                                    if(isContailN){
                                        $(this).remove();
                                    }
                                } else {
                                    $(this).show();
                                }

                            } else {
                                $(this).remove();
                            }
                        }
                    }
                }
            })
        }
    }
    window.checkAuthority = checkAuthority;
})
(jQuery, window)