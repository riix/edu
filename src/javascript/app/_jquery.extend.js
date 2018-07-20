(function($) {

    var $window = $window || $(window),
        $document = $document || $(document),
        $html = $html || $('html'),
        $body = $body || $('body');

    $.fn.placeHolder = function(options) {
        var opts = $.extend({
            checkFormSubmit: false
        }, options);
        if (!("placeholder" in document.createElement("input"))) {
            this.each(function() {
                var $this = $(this);
                $this.on({
                    'focus': function() {
                        if ($this.val() == $this.attr('placeholder')) {
                            $this.val('').removeClass('placeholder');
                        }
                    },
                    'blur': function() {
                        if ($this.val() === '' || $this.val() == $this.attr('placeholder')) {
                            $this.addClass('placeholder').val($this.attr('placeholder'));
                        }
                    }
                });
                if (opts.checkFormSubmit === true) {
                    $this.parents('form').submit(function() {
                        $(this).find('input[placeholder]').each(function() {
                            var $input = $(this);
                            if ($input.val() == $input.attr('placeholder')) {
                                $input.val('');
                            }
                        });
                    });
                }
            });
            this.blur();
        }
    };

})(window.jQuery);

$(function(){

    $('input[placeholder], textarea[placeholder]').placeHolder({ // placeholder
        checkFormSubmit: true
    });
    
});
