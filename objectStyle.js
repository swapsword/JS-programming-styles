(function($) {
    var miniCart = {
        /**
         * Global DOM selectors
         * used for JavaScript bindings
         */
        globals: {
            ids: {
                shopId:           shop_id,
                sessionId:        session_id
            },
            cookies: {
                createCookie:      {
                    Shop:[
                    {
                        'shop_id': shop_id,
                        'session_id': session_id,
                        'items':[] 
                    }   
                    ]
                },
                updateCookie:      {
                        'shop_id': shop_id,
                        'session_id': session_id,
                        items:[] 
                },
                newProduct: true
            },
            className: {
                buttonAddToCart:   '.product-add-to-cart',
                miniCartDropdown:  '.page-header-cart-dropdown.topbar-dropdown-content',
                aAttribute: '.page-header-cart-close.pull-right'
            },
        },

        /**
         * Main app initialization
         */
        init: function() {
            /**
             * Reference to globals` object
             * @type {miniCart.globals}
             */
            var g = this.globals;
            this.createCartCookie(g.ids.shopId, g.ids.sessionId, g.cookies.createCookie, g.cookies.updateCookie);
            this.addProduct(g.className.buttonAddToCart, g.className.miniCartDropdown, g.ids.shopId, g.cookies.newProduct, g.cookies.newProductObj);
            this.removeProduct(g.className.aAttribute);

        },


        /**
         *
         */
        createJsonObject: function() {
            var jsonStr = Cookies.get('s5-cart');
            var jsonObj = $.parseJSON(jsonStr);

            return jsonObj;
        },

        /**
         * @param jsonObj
         */
        updateCartCookie: function(jsonObj) {
            updatedCart = JSON.stringify(jsonObj);
            Cookies.set('s5-cart', updatedCart); 
        },

        /**
         *
         */
        addNewProduct: function() {
            var newProductObj =
            {   
                'product_id': product_id,
                'product_name': product_name, 
                'quantity': $('#quantity').val(),
                'price': price 
            };
            return newProductObj;
        },
        
        
        /**
         * @param shopId
         * @param sessionId
         * @param createCookie
         * @param updateCookie
         */
        createCartCookie: function(shopId, sessionId, createCookie, updateCookie) {
            if ( typeof Cookies.get('s5-cart') == 'undefined') {
                if (shop_id && session_id) {
                    Cookies.set('s5-cart', createCookie);
                }else{
                    console.log("Warning: Not getting shop_id and session_id");
                }
            }else if ( typeof Cookies.get('s5-cart') == 'string'){

                var jsonObj = this.createJsonObject();

                var shopIdMatch;
                for (var shopKey in jsonObj.Shop) {
                    if (jsonObj.Shop.hasOwnProperty(shopKey)) {
                        if (jsonObj.Shop[shopKey].shop_id == shop_id){
                            shopIdMatch = true;
                        }
                    }
                }
                // Unten code ist für multiple shops
                // Todo: cookies für multiple shop
                //     : noch nicht uberprüfen
                if(!shopIdMatch){
                    if (shop_id && session_id) {
                        jsonObj.Shop.push(updateCookie);
                        Cookies.set('s5-cart', jsonObj);
                    }
                }
            } 
        },

        /**
         *
         * @param trigger
         * @param target
         * @param shopId
         * @param newProduct
         * @param newProductObj
         */
        addProduct: function(trigger, target, shopId, newProduct, newProductObj) {
            $(trigger).click(function(event) {
                event.preventDefault();

                var jsonObj = miniCart.createJsonObject();  
                
                for (var shopKey in jsonObj.Shop) {
                    if (jsonObj.Shop.hasOwnProperty(shopKey)) {
                        if(jsonObj.Shop[shopKey].shop_id == shop_id){
                            if (!jQuery.isEmptyObject(jsonObj.Shop[shopKey].items)) {
                                for (var key in jsonObj.Shop[shopKey].items) {
                                    if (jsonObj.Shop[shopKey].items.hasOwnProperty(key)) {
                                        if (jsonObj.Shop[shopKey].items[key].product_id == product_id) {
                                            jsonObj.Shop[shopKey].items[key].quantity = parseInt(jsonObj.Shop[shopKey].items[key].quantity) + parseInt($('#quantity').val()); 
                                            newProduct = false;  
                                        }else{
                                           if(newProduct){
                                                newProductObj = miniCart.addNewProduct();
                                            }
                                        }
                                    }   
                                }     
                            }else{
                                if(newProduct){
                                    newProductObj = miniCart.addNewProduct();
                                }
                            }  
                            if(newProduct){
                                jsonObj.Shop[shopKey].items.push(newProductObj);
                            }
                            miniCart.updateCartCookie(jsonObj);
                            // console.log(jsonObj);
                        }
                    }
                }
                $(target).css('display', 'block'); 
            });
        },
        
        /**
         *
         * @param trigger
         * @param productId

         */
        removeProduct: function(trigger) {
            $(trigger).click(function() {
                var productId = $(this).attr('id');

                var jsonObj = miniCart.createJsonObject();

                for (var shopKey in jsonObj.Shop) {
                    if (jsonObj.Shop.hasOwnProperty(shopKey)) {
                        if(jsonObj.Shop[shopKey].shop_id == shop_id){
                            for (var key in jsonObj.Shop[shopKey].items) {
                                if (jsonObj.Shop[shopKey].items.hasOwnProperty(key)) {
                                    if(productId == jsonObj.Shop[shopKey].items[key].product_id){
                                        jsonObj.Shop[shopKey].items.splice(key,1);
                                    }
                                }
                            }
                        }
                    }
                }
                miniCart.updateCartCookie(jsonObj);
            });
        },
    };

    var App = Object.create(miniCart); App.init();
})(jQuery);
