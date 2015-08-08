/**
 * Created by NQLDY on 2015/7/26.
 */
(function ($) {

    var numberFormat = {
        format: function (num, pattern) {//格式化数字显示方式  numberFormat.format(12345.999,'#,##0.00')|(12345.999,'#,##0.##')|(123,'000000')
            var strarr = num ? num.toString().split('.') : ['0'];
            var fmtarr = pattern ? pattern.split('.') : [''];
            var retstr = '';
            // 整数部分
            var str = strarr[0];
            var fmt = fmtarr[0];
            var i = str.length - 1;
            var comma = false;
            for (var f = fmt.length - 1; f >= 0; f--) {
                switch (fmt.substr(f, 1)) {
                    case '#':
                        if (i >= 0) retstr = str.substr(i--, 1) + retstr;
                        break;
                    case '0':
                        if (i >= 0) retstr = str.substr(i--, 1) + retstr;
                        else retstr = '0' + retstr;
                        break;
                    case ',':
                        comma = true;
                        retstr = ',' + retstr;
                        break;
                }
            }
            if (i >= 0) {
                if (comma) {
                    var l = str.length;
                    for (; i >= 0; i--) {
                        retstr = str.substr(i, 1) + retstr;
                        if (i > 0 && ((l - i) % 3) == 0) retstr = ',' + retstr;
                    }
                }
                else retstr = str.substr(0, i + 1) + retstr;
            }
            retstr = retstr + '.';
            //小数部分
            str = strarr.length > 1 ? strarr[1] : '';
            fmt = fmtarr.length > 1 ? fmtarr[1] : '';
            i = 0;
            for (var f = 0; f < fmt.length; f++) {
                switch (fmt.substr(f, 1)) {
                    case '#':
                        if (i < str.length) retstr += str.substr(i++, 1);
                        break;
                    case '0':
                        if (i < str.length) retstr += str.substr(i++, 1);
                        else retstr += '0';
                        break;
                }
            }
            return retstr.replace(/^,+/, '').replace(/\.$/, '');
        }
    };

    $.QjzdCardFormat = function ($inputObjs, opt) {
        if (typeof($inputObjs) !== 'object') {
            $inputObjs = $($inputObjs);
        }
        var options = $.extend({}, $.QjzdCardFormat.defaults);
        //设置options入参
        var setOptions = function (opt) {
            if (typeof (opt) === "string") {
                var pattern = opt;
                opt = {};
                opt.pattern = pattern;
            }else if (typeof(opt) !== 'object') {
                opt = {};
            }
            options = $.extend(options, opt);
        };
        setOptions(opt);

        var pattern = options.pattern;
        $inputObjs.each(function () {
            var that = $(this);
            var k = 0;
            var reg = /^(?=.*?\,)/g;
            if (reg.test(pattern.substr(0, $(this).val().length))) {
                k = pattern.replace(/#/g, '').length;
            }
            that.wrap('<div class="cardFormat"></div>');
            var num = numberFormat.format(that.val(), pattern).replace(/,/g, ' ');
            if (num == 0) {
                that.before('<div class="num">&nbsp;</div>');
            } else {
                that.before('<div class="num">' + num + '</div>');
            }
            that.prev().css({
                top: -that.outerHeight(false) - 3,
                width: that.outerWidth(false) - 2
            });
            that.on('focus', function () {
                $(this).prev().show();
            }).on('blur', function () {
                $(this).prev().hide();
            }).on('keyup', function (e) {
                var reg = /^(?=.*?\,)/g;
                if (!reg.test(pattern.substr(0,
                        $(this).val().length))) {
                    k = 0;
                }
                switch (pattern.substr($(this).val().length - 1 + k, 1)) {
                    case ',':
                        if (e.keyCode == 8) {
                            k--;
                        } else {
                            k++;
                        }
                        break;
                }
                var retpattern = pattern.substr(0, $(this).val().length + k);
                var num = numberFormat.format($(this).val(), retpattern).replace(/,/g, ' ');
                if (num == 0) {
                    $(this).prev().html('&nbsp;');
                } else {
                    $(this).prev().text(num);
                }
            });
        });
        var api = {};
        return api;
    };

    //默认参数
    $.QjzdCardFormat.defaults = {
        pattern: ""
    };

    $.fn.cardFormat = function (options, callback) {
        var api;
        if (this && this.length > 0) {
            api = $.QjzdCardFormat(this, options);
            if ($.isFunction(callback)) {
                callback.apply(api);
            }
        }
        return this;
    };

}(jQuery));