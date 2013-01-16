(function($){
        
    var methods = {
        
        init : function( options ) {
            
            var config =  {
                'rules' : {},
                'displayTo' : null,
                'success' : false,
                'default': ''
            };
            
            for(key in options)
            {
                config[key] = options[key];
            }
            
            this.data('validate', config);
            
            if(!this.attr('id'))
            {
                var id;
                do {
                    id = "id" + Math.round(Math.random()*1000);
                } while($("#" + id));
                this.attr('id', id);
            }
            
            if(this.data('validate').displayTo == null)
            {
                var id = this.attr('id');
                this.after('<label for="'+id+'" class="actionLabel"></label>');
                this.data('validate').displayTo = $("label[for=" + id + "]");
            }
            
            this.bind('change keyup', methods.validateRules);
            this.change();
            
            return this;
 
        },
        
        validateRules : function( e ) {
            
            var datas = ($(this)).data('validate');
            
            var rules = datas.rules;
            
            var error = false;
            var string = datas['default'];
            
            for(key in rules)
            {
                if ( typeof methods[key] === 'function' || key.substr(0,9) == "function_" )
                {
                    var bool = true;
                    if(key.substr(0,9) == "function_")
                    {
                        bool = window[key.substr(9)]( $(e.target).val(), rules[key] );
                    }
                    else
                    {
                        bool = methods[key]( $(e.target).val(), rules[key] )
                    }
                    if(!bool)
                    {
                        error = true;
                        string = rules[key].msg;
                        break;
                    }
                }
            }
            
            if(error)
            {
                ($(this)).removeClass('success').addClass('error');
                ($(this)).data('validate').displayTo.removeClass('success').addClass('error');
                datas.success = false;
            }
            else
            {
                ($(this)).removeClass('error').addClass('success');
                ($(this)).data('validate').displayTo.removeClass('error').addClass('success');
                datas.success = true;
            }
            ($(this)).data('validate').displayTo.html(string);
            ($(this)).data('validate',datas);
        },
        
        success: function(  ) {
            return this.data('validate').success;
        },
        
        // Validate Functions
        
        required : function(str, options) {
            return (str != undefined && str != '' && str );
        },
        
        length : function(str, options) {
            var res = true;
            if(options.max)
            {
                res = res && str.length <= options.max;
            }
            if(options.min)
            {
                res = res && str.length >= options.min;
            }
            if(options.not_equal)
            {
                res = res && str.length != options.not_equal;
            }
            if(options.not_equals)
            {
                for(i=0;i<options.not_equal.length;i++)
                {
                    res = res && str.length != options.not_equals[i];
                }
            }
            if(options.equal)
            {
                res = res && str.length == options.equal;
            }
            if(options.equals)
            {
                var local_res = false;
                for(i=0;i<options.equals.length;i++)
                {
                    local_res = local_res || str.length == options.equals[i];
                }
                res = res && local_res;
            }
            return res;
        }
        
    };
 
    $.fn.validate = function( method ) {
            
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Метод ' +  method + ' не существует в jQuery.tooltip' );
        }
   
    };
        
})(jQuery);