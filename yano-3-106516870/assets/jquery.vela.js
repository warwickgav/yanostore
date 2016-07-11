/* Jonathan Snook - MIT License - https://github.com/snookca/prepareTransition */
(function(a){a.fn.prepareTransition=function(){return this.each(function(){var b=a(this);b.one("TransitionEnd webkitTransitionEnd transitionend oTransitionEnd",function(){b.removeClass("is-transitioning")});var c=["transition-duration","-moz-transition-duration","-webkit-transition-duration","-o-transition-duration"];var d=0;a.each(c,function(a,c){d=parseFloat(b.css(c))||d});if(d!=0){b.addClass("is-transitioning");b[0].offsetWidth}})}})(jQuery);
/* replaceUrlParam - http://stackoverflow.com/questions/7171099/how-to-replace-url-parameter-with-javascript-jquery */
function replaceUrlParam(e,r,a){var n=new RegExp("("+r+"=).*?(&|$)"),c=e;return c=e.search(n)>=0?e.replace(n,"$1"+a+"$2"):c+(c.indexOf("?")>0?"&":"?")+r+"="+a};
if ((typeof Shopify) === 'undefined') { Shopify = {}; }
if (!Shopify.formatMoney) {
    Shopify.formatMoney = function(cents, format) {
        var value = '',
            placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
            formatString = (format || this.money_format);
        if (typeof cents == 'string') {
            cents = cents.replace('.','');
        }
        function defaultOption(opt, def) {
            return (typeof opt == 'undefined' ? def : opt);
        }
        function formatWithDelimiters(number, precision, thousands, decimal) {
            precision = defaultOption(precision, 2);
            thousands = defaultOption(thousands, ',');
            decimal   = defaultOption(decimal, '.');
            if (isNaN(number) || number == null) {
                return 0;
            }
            number = (number/100.0).toFixed(precision);
            var parts   = number.split('.'),
                dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
                cents   = parts[1] ? (decimal + parts[1]) : '';
            return dollars + cents;
        }
        switch(formatString.match(placeholderRegex)[1]) {
            case 'amount':
                value = formatWithDelimiters(cents, 2);
                break;
            case 'amount_no_decimals':
                value = formatWithDelimiters(cents, 0);
                break;
            case 'amount_with_comma_separator':
                value = formatWithDelimiters(cents, 2, '.', ',');
                break;
            case 'amount_no_decimals_with_comma_separator':
                value = formatWithDelimiters(cents, 0, '.', ',');
                break;
        }
        return formatString.replace(placeholderRegex, value);
    };
}
Shopify.optionsMap = {};
Shopify.updateOptionsInSelector = function(selectorIndex) {
    switch (selectorIndex) {
        case 0:
            var key = 'root';
            var selector = jQuery('.single-option-selector:eq(0)');
            break;
        case 1:
            var key = jQuery('.single-option-selector:eq(0)').val();
            var selector = jQuery('.single-option-selector:eq(1)');
            break;
        case 2:
            var key = jQuery('.single-option-selector:eq(0)').val();
            key += ' / ' + jQuery('.single-option-selector:eq(1)').val();
            var selector = jQuery('.single-option-selector:eq(2)');
    }
    var initialValue = selector.val();
    selector.empty();
    var availableOptions = Shopify.optionsMap[key];
    for (var i=0; i<availableOptions.length; i++) {
        var option = availableOptions[i];
        var newOption = jQuery('<option></option>').val(option).html(option);
        selector.append(newOption);
    }
    jQuery('.swatch[data-option-index="' + selectorIndex + '"] .swatch-element').each(function() {
        if (jQuery.inArray($(this).attr('data-value'), availableOptions) !== -1) {
            $(this).removeClass('soldout').show().find(':radio').removeAttr('disabled','disabled').removeAttr('checked');
        }
        else {
            $(this).addClass('soldout').hide().find(':radio').removeAttr('checked').attr('disabled','disabled');
        }
    });
    if (jQuery.inArray(initialValue, availableOptions) !== -1) {
        selector.val(initialValue);
    }
    selector.trigger('change');
};
Shopify.linkOptionSelectors = function(product) {
    // Building our mapping object.
    for (var i=0; i<product.variants.length; i++) {
        var variant = product.variants[i];
        if (variant.available) {
            // Gathering values for the 1st drop-down.
            Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];
            Shopify.optionsMap['root'].push(variant.option1);
            Shopify.optionsMap['root'] = Shopify.uniq(Shopify.optionsMap['root']);
            // Gathering values for the 2nd drop-down.
            if (product.options.length > 1) {
                var key = variant.option1;
                Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
                Shopify.optionsMap[key].push(variant.option2);
                Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
            }
            // Gathering values for the 3rd drop-down.
            if (product.options.length === 3) {
                var key = variant.option1 + ' / ' + variant.option2;
                Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
                Shopify.optionsMap[key].push(variant.option3);
                Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
            }
        }
    }
    // Update options right away.
    Shopify.updateOptionsInSelector(0);
    if (product.options.length > 1) Shopify.updateOptionsInSelector(1);
    if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
    // When there is an update in the first dropdown.
    jQuery(".single-option-selector:eq(0)").change(function() {
        Shopify.updateOptionsInSelector(1);
        if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
        return true;
    });
    // When there is an update in the second dropdown.
    jQuery(".single-option-selector:eq(1)").change(function() {
        if (product.options.length === 3) Shopify.updateOptionsInSelector(2);
        return true;
    });
};
window.vela = window.vela || {};
vela.cacheSelectors = function () {
    vela.cache = {
        $html                    : $('html'),
        $body                    : $('body'),
        $recoverPasswordLink     : $('#RecoverPassword'),
        $hideRecoverPasswordLink : $('#HideRecoverPasswordLink'),
        $recoverPasswordForm     : $('#RecoverPasswordForm'),
        $customerLoginForm       : $('#CustomerLoginForm'),
        $passwordResetSuccess    : $('#ResetSuccess'),
        $velaSlideShow    		 : $('#velaSlider'),
        $productImage    	 : $('#js-productFeaturedImage')
    };
};
vela.init = function () {
    FastClick.attach(document.body);
    vela.cacheSelectors();
    vela.startTheme();
    vela.drawersInit();
    vela.responsiveVideos();
    vela.loginForms();
    vela.productThumbImage();
    vela.accordion();
    vela.wishlist();
    //vela.quickview();
    vela.ajaxFilter();
};
vela.drawersInit = function () {
    vela.LeftDrawer = new vela.Drawers('menuDrawer', 'Left', false);
    vela.RightDrawer = new vela.Drawers('cartDrawer', 'Right', true, {
    {% if settings.ajax_cart_method == "modal" or settings.ajax_cart_method == "drawer" %}'onDrawerOpen': ajaxCart.load{% endif %}
});
};
vela.getHash = function () {
    return window.location.hash;
};
vela.startTheme = function () {
    $(".swatch :radio").change(function() {
        var t = $(this).closest(".swatch").attr("data-option-index");
        var n = $(this).val();
        $(this).closest("form").find(".single-option-selector").eq(t).val(n).trigger("change")
    });
};
vela.productPage = function (options) {
    var moneyFormat = options.money_format,
        variant = options.variant,
        selector = options.selector;
    var $addToCart = $('#AddToCart'),
        $productPrice = $('#ProductPrice'),
        $comparePrice = $('#ComparePrice'),
        $quantityElements = $('.qtySelector, label + .velaJsQty'),
        $addToCartText = $('#AddToCartText');
    if (variant) {
        if (variant.available) {
            $addToCart.removeClass('disabled').prop('disabled', false);
            $addToCartText.html({{ 'products.product.add_to_cart' | t | json }});
            $quantityElements.show();
        } else {
            $addToCart.addClass('disabled').prop('disabled', true);
            $addToCartText.html({{ 'products.product.sold_out' | t | json }});
            $quantityElements.hide();
        }
        $productPrice.html( Shopify.formatMoney(variant.price, moneyFormat) );
        if (variant.compare_at_price > variant.price) {
            $comparePrice
                .html(Shopify.formatMoney(variant.compare_at_price, moneyFormat))
                .show();
        } else {
            $comparePrice.hide();
        }
        //if (window.swatch_enable) {
        var form = $('#' + selector.domIdPrefix).closest('form');
        for (var i=0,length=variant.options.length; i<length; i++) {
            var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + variant.options[i] +'"]');
            if (radioButton.size()) {
                radioButton.get(0).checked = true;
            }
        }
        //}
        if (variant.available) {
            $('.productAvailability').removeClass('out-of-stock');
            $('.productAvailability').addClass('in-stock');
            $('.productAvailability')
                .html('<label>' + {{ 'products.product.availability' | t | json }} + '</label>: ' + {{'products.product.available' | t | json }});
        } else{
            $('.productAvailability').removeClass('in-stock');
            $('.productAvailability').addClass('out-of-stock');
            $('.productAvailability').html('<label>' + {{ 'products.product.availability' | t | json }} + '</label>: ' + {{'products.product.unavailable' | t | json }});
        }
    } else {
        $addToCart.addClass('disabled').prop('disabled', true);
        $addToCartText.html({{ 'products.product.unavailable' | t | json }});
        $quantityElements.hide();
    }
    if (variant && variant.featured_image) {
        var originalImage = $(".product__photo-main > img");
        var newImage = variant.featured_image;
        var element = originalImage[0];
        Shopify.Image.switchImage(newImage, element, function (newImageSizedSrc, newImage, element) {
            $('#productThumbs img').each(function() {
                var parentThumbImg = $(this).parent();
                var idProductImage = $(this).parent().data("imageid");
                if (idProductImage == newImage.id) {
                    $(this).parent().trigger('click');
                    return false;
                }
            });
        });
    }
};
vela.responsiveVideos = function () {
    var $iframeVideo = $('iframe[src*="youtube.com/embed"], iframe[src*="player.vimeo"]');
    var $iframeReset = $iframeVideo.add('iframe#admin_bar_iframe');
    $iframeVideo.each(function () {
        $(this).wrap('<div class="videoContainer"></div>');
    });
    $iframeReset.each(function () {
        this.src = this.src;
    });
};
vela.loginForms = function() {
    function showRecoverPasswordForm() {
        vela.cache.$recoverPasswordForm.show();
        vela.cache.$customerLoginForm.hide();
    }
    function hideRecoverPasswordForm() {
        vela.cache.$recoverPasswordForm.hide();
        vela.cache.$customerLoginForm.show();
    }
    vela.cache.$recoverPasswordLink.on('click', function(evt) {
        evt.preventDefault();
        showRecoverPasswordForm();
    });
    vela.cache.$hideRecoverPasswordLink.on('click', function(evt) {
        evt.preventDefault();
        hideRecoverPasswordForm();
    });
    if (vela.getHash() == '#recover') {
        showRecoverPasswordForm();
    }
};
vela.resetPasswordSuccess = function() {
    vela.cache.$passwordResetSuccess.show();
};
vela.slideShow = function() {
    vela.cache.$velaSlideShow.nivoSlider({
        effect: 'fade',
        slices: 15,
        boxCols: 8,
        boxRows: 4,
        animSpeed: 0,
        pauseTime: 0,
        startSlide: 0,
        directionNav: true,
        controlNav: true,
        controlNavThumbs: false,
        pauseOnHover: true,
        manualAdvance: false,
        prevText: 'Prev',
        nextText: 'Next',
        randomStart: false,
        beforeChange: function(){},
        afterChange: function(){},
        slideshowEnd: function(){},
        lastSlide: function(){},
        afterLoad: function(){
            $(".slideshowLoading").hide();
        }
    });
};
vela.productImage = function(){
    if (vela.cache.$productImage.length > 0) {
        vela.cache.$productImage.elevateZoom({
            zoomEnabled: false,
            gallery: 'productThumbs',
            cursor: 'pointer',
            galleryActiveClass: 'active',
            imageCrossfade: false,
            scrollZoom:false,
            onImageSwapComplete: function() {
                $(".zoomWrapper div").hide();
            },
            loadingIcon: window.loading_url
        });
        vela.cache.$productImage.bind("click", function(e) {
            var ez = vela.cache.$productImage.data('elevateZoom');
            $.fancybox(ez.getGalleryList());
            return false;
        });
    }
};
vela.productThumbImage = function(){
    if ($("#productThumbs").length > 0) {
        $('#productThumbs .owl-carousel').owlCarousel({
            navigation: true,
            items: 4,
            itemsDesktop: [1199, 4],
            itemsDesktopSmall: [979, 4],
            itemsTablet: [768, 4],
            itemsTabletSmall: [540, 4],
            itemsMobile: [360, 4]
        });
    }
};
vela.accordion = function(){
    function accordionSidebar(){
        if ( $(window).width() <= 768){
            if(!$('.velaSidebar').hasClass('accordion')){
                $('.velaSidebar .titleSidebar').on('click', function(){
                    $(this).toggleClass('active').parent().find('.velaContent').stop().slideToggle('medium');
                })
            }
            $('.velaSidebar').addClass('accordion').find('.velaContent').slideUp('fast');
        }
        else {
            $('.velaSidebar .titleSidebar').removeClass('active').off().parent().find('.velaContent').removeAttr('style').slideDown('fast');
            $('.velaSidebar').removeClass('accordion');
        }
    }
    function accordionFooter(){
        if ( $(window).width() <= 768){
            if(!$('.velaFooter').hasClass('accordion')){
                $('.velaFooter .velaFooterTitle').on('click', function(){
                    $(this).toggleClass('active').parent().find('.velaContent').stop().slideToggle('medium');
                })
            }
            $('.velaFooter').addClass('accordion').find('.velaContent').slideUp('fast');
        }
        else {
            $('.velaFooter .velaFooterTitle').removeClass('active').off().parent().find('.velaContent').removeAttr('style').slideDown('fast');
            $('.velaFooter').removeClass('accordion');
        }
    }
    accordionSidebar();
    accordionFooter();
    $(window).resize(accordionSidebar);
    $(window).resize(accordionFooter);
};
vela.ajaxFilter = function(){
    var isAjaxFilterClick =  false;
    if ($(".template-collection")) {
        History.Adapter.bind(window, 'statechange', function() {
            var State = History.getState();
            if (!isAjaxFilterClick) {
                ajaxFilterParams();
                var newurl = ajaxFilterCreateUrl();
                ajaxFilterGetContent(newurl);
                reActivateSidebar();
            }
            vela.isSidebarAjaxClick = false;
        });
    }
    ajaxFilterParams = function () {
        Shopify.queryParams = {};
        if (location.search.length) {
            for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
                aKeyValue = aCouples[i].split('=');
                if (aKeyValue.length > 1) {
                    Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
                }
            }
        }
    }
    ajaxFilterCreateUrl = function(baseLink) {
        var newQuery = $.param(Shopify.queryParams).replace(/%2B/g, '+');
        if (baseLink) {
            if (newQuery != "")
                return baseLink + "?" + newQuery;
            else
                return baseLink;
        }
        return location.pathname + "?" + newQuery;
    }
    ajaxFilterClick = function(baseLink) {
        delete Shopify.queryParams.page;
        var newurl = ajaxFilterCreateUrl(baseLink);
        isAjaxFilterClick = true;
        History.pushState({
            param: Shopify.queryParams
        }, newurl, newurl);
        ajaxFilterGetContent(newurl);
    }
    ajaxFilterSortby = function() {
        if (Shopify.queryParams.sort_by) {
            var sortby = Shopify.queryParams.sort_by;
            $("#SortBy").val(sortby);
        }
        $("#SortBy").change(function(event){
            Shopify.queryParams.sort_by = $(this).val();
            ajaxFilterClick();
        });
    }
    ajaxFilterView = function() {
        $(".changeView").click(function(event) {
            event.preventDefault();
            if (!$(this).hasClass("changeViewActive")) {
                if ($(this).data('view') == 'list' ) {
                    Shopify.queryParams.view = "list";
                } else {
                    Shopify.queryParams.view = "grid";
                }
                $(".changeView").removeClass('changeViewActive');
                $(this).addClass('changeViewActive');
                ajaxFilterClick();
            }
        });
    }
    ajaxFilterTags = function(){
        $('.ajaxFilter li > a').click(function(event) {
            event.preventDefault();
            var currentTags = [];
            if (Shopify.queryParams.constraint) {
                currentTags = Shopify.queryParams.constraint.split('+');
            }
            if (!window.sidebar_multichoise && !$(this).parent().hasClass("active")) {
                var otherTag = $(this).parents('.listFilter').find("li.active");
                if (otherTag.length > 0) {
                    var tagName = otherTag.data("filter");
                    if (tagName) {
                        var tagPos = currentTags.indexOf(tagName);
                        if (tagPos >= 0) {
                            currentTags.splice(tagPos, 1);
                        }
                    }
                }
            }
            var dataHandle = $(this).parent().data("filter");
            if (dataHandle) {
                var tagPos = currentTags.indexOf(dataHandle);
                if (tagPos >= 0) {
                    currentTags.splice(tagPos, 1);
                } else {
                    currentTags.push(dataHandle);
                }
            }
            if (currentTags.length) {
                Shopify.queryParams.constraint = currentTags.join('+');
            } else {
                delete Shopify.queryParams.constraint;
            }
            ajaxFilterClick();
        });
    }
    ajaxFilterPaging = function() {
        $('#pagination .pagination a').click(function(event){
            event.preventDefault();
            var linkPage = $(this).attr("href").match(/page=\d+/g);
            if (linkPage) {
                Shopify.queryParams.page = parseInt(linkPage[0].match(/\d+/g));
                if (Shopify.queryParams.page) {
                    var newurl = ajaxFilterCreateUrl();
                    isAjaxFilterClick = true;
                    History.pushState({
                        param: Shopify.queryParams
                    }, newurl, newurl);
                    ajaxFilterGetContent(newurl);
                    $('body,html').animate({
                        scrollTop: 400
                    }, 600);
                }
            }
        });
    }
    ajaxFilterClear = function() {
        $(".ajaxFilter").each(function() {
            var sidebarTag = $(this);
            if (sidebarTag.find(".listFilter > li.active").length > 0) {
                sidebarTag.find(".velaClear").show().click(function(e) {
                    var currentTags = [];
                    if (Shopify.queryParams.constraint) {
                        currentTags = Shopify.queryParams.constraint.split('+');
                    }
                    sidebarTag.find(".listFilter > li.active").each(function() {
                        var selectedTag = $(this);
                        var tagName = selectedTag.data("filter");
                        if (tagName) {
                            var tagPos = currentTags.indexOf(tagName);
                            if (tagPos >= 0) {
                                currentTags.splice(tagPos, 1);
                            }
                        }
                    });
                    if (currentTags.length) {
                        Shopify.queryParams.constraint = currentTags.join('+');
                    } else {
                        delete Shopify.queryParams.constraint;
                    }
                    ajaxFilterClick();
                    e.preventDefault();
                });
            }
        });
    }
    ajaxFilterClearAll = function() {
        $('.velaFilter a.velaClearAll').click(function(e) {
            delete Shopify.queryParams.constraint;
            delete Shopify.queryParams.q;
            ajaxFilterClick();
            e.preventDefault();
        });
    }
    ajaxFilterAddToCart = function(){
        ajaxCart.init({
            formSelector: '.formAddToCart',
            cartContainer: '#cartContainer',
            addToCartSelector: '.js-add-to-cart',
            cartCountSelector: '#CartCount',
            cartCostSelector: '#CartCost',
            moneyFormat: {{ shop.money_format | json }}
    });
    }
    ajaxFilterData = function(data){
        var currentList = $("#listCollection");
        var dataList = $(data).find("#listCollection");
        currentList.replaceWith(dataList);
        if ($("#pagination").length > 0) {
            $("#pagination").replaceWith($(data).find("#pagination"));
        } else {
            $("#listCollection").append($(data).find("#pagination"));
        }
        var currentSidebarFilter = $("#sidebarAjaxFilter");
        var dataSidebarFilter = $(data).find("#sidebarAjaxFilter");
        currentSidebarFilter.replaceWith(dataSidebarFilter);
    }
    ajaxFilterGetContent = function(newurl) {
        $.ajax({
            type: 'get',
            url: newurl,
            beforeSend: function() {
                $('#loading').show();
            },
            success: function(data) {
                ajaxFilterData(data);
                ajaxFilterSortby();
                ajaxFilterView();
                ajaxFilterTags();
                ajaxFilterPaging();

                ajaxFilterClear();
                ajaxFilterClearAll();

                $('#loading').hide();
                ajaxFilterAddToCart();
                vela.wishlist();
                //vela.quickview();
            },
            error: function(xhr, text) {
                $('#loading').hide();

            }
        });
    }
    ajaxFilterParams();
    ajaxFilterSortby();
    ajaxFilterView();
    ajaxFilterTags();
    ajaxFilterPaging();
    ajaxFilterClear();
    ajaxFilterClearAll();
};
vela.wishlist = function(){
    function postToWishlist() {
        $(".wishlistForm").submit(function(e) {
            e.preventDefault();
            var postData = $(this).serializeArray();
            var formURL = $(this).attr("action");
            var d = $(this).parent();
            $.ajax({
                url : formURL,
                type: "POST",
                data : postData,
                beforeSend: function() {
                    $('#loading').show();
                },
                success:function(data, textStatus) {
                    console.log(textStatus);
                    $('#loading').hide();
                    d.empty().html('<a class="btn btnProduct added" href="' + window.wishlist_url + '"><i class="fa fa-heart-o"></i><span>{{ 'wishlist.general.added_to_wishlist' | t }}</span></a>');
                    if (!!$.prototype.fancybox)
                        $.fancybox.open([{
                            type: 'inline',
                            autoScale: true,
                            minHeight: 30,
                            content: '<p class="fancybox-error">' + '{{ 'wishlist.ajax_wishlist.success_text' | t }}' + '</p>'
                }], {
                        padding: 0
                    });
                    else
                    alert('{{ 'wishlist.ajax_wishlist.success_text' | t }}');
                },
                error: function() {
                    $('#loading').hide();
                    if (!!$.prototype.fancybox)
                        $.fancybox.open([{
                            type: 'inline',
                            autoScale: true,
                            minHeight: 30,
                            content: '<p class="fancybox-error">I`m afraid that did not work</p>'
                        }], {
                            padding: 0
                        });
                    else
                        alert('I`m afraid that did not work');
                }
            });
        });
    }
    function removeFromWishlist($this) {
        var $elem = $this.closest("tr");
        var tagID = $elem.attr("id");
        var $form = $("#removeWishlist");
        $("#remove-value").attr("value", tagID);
        var postData = $form.serializeArray();
        var formURL = $form.attr("action");
        $.ajax({
            url : formURL,
            type: "POST",
            data : postData,
            beforeSend: function() {
                $('#loading').show();
            },
            success:function(data, textStatus) {
                console.log(textStatus);
                $('#loading').hide();
                $elem.remove();
                if($(".wishlist-product tbody tr").length == 0) {
                    $("#wishlist-email-link").empty().html("<p>{{ 'wishlist.general.empty' | t }}</p>");
                } else {
                    updateEmailList();
                }
            },
            error: function() {
                $('#loading').hide();
                if (!!$.prototype.fancybox)
                    $.fancybox.open([{
                        type: 'inline',
                        autoScale: true,
                        minHeight: 30,
                        content: '<p class="fancybox-error">I`m afraid that did not work</p>'
                    }], {
                        padding: 0
                    });
                else
                    alert('I`m afraid that did not work');
            }
        });
    }
    function updateEmailList() {
        var currentURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
        $.ajax({
            url : currentURL,
            type: "GET",
            success:function(data, textStatus) {
                console.log(textStatus);
                var newEmailLink = $(data).find("#wishlist-email-link a");
                $("#wishlist-email-link").html(newEmailLink);
            }
        });
    }
    postToWishlist();
    $(".btnRemoveWishlist").on("click", function(e) {
        e.preventDefault();
        removeFromWishlist($(this));
    });
};
vela.quickview = function(){
    var product = {};
    var option1 = '';
    var option2 = '';
    Shopify.doNotTriggerClickOnThumb = false;
    selectCallbackQuickView = function(variant, selector) {
        var productItem = jQuery('.jsQuickview .js-productDetails'),
            addToCart = productItem.find('.js-add-to-cart'),
            productPrice = productItem.find('.pricePrimary'),
            comparePrice = productItem.find('.priceCompare');
        if (variant) {
            if (variant.available) {
                addToCart.removeClass('disabled').removeAttr('disabled');
                $(addToCart).find("span").text("{{ 'products.product.add_to_cart' | t }}");
            } else {
                addToCart.addClass('disabled').attr('disabled', 'disabled');
                $(addToCart).find("span").text("{{ 'products.product.sold_out' | t }}");
            }
            productPrice.html(Shopify.formatMoney(variant.price, "{{ shop.money_format }}"));
            if ( variant.compare_at_price > variant.price ) {
                comparePrice
                    .html(Shopify.formatMoney(variant.compare_at_price, "{{ shop.money_format }}")).show();
            } else {
                comparePrice.hide();
            }
            {% if settings.quickview_swatch_enable %}
            var form = jQuery('#' + selector.domIdPrefix).closest('form');
            for (var i=0,length=variant.options.length; i<length; i++) {
                var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + variant.options[i] +'"]');
                if (radioButton.size()) {
                    radioButton.get(0).checked = true;
                }
            }
            {% endif %}
            if (variant && variant.featured_image) {
                var originalImage = $(".proImageQuickview");
                var newImage = variant.featured_image;
                var element = originalImage[0];
                Shopify.Image.switchImage(newImage, element, function (newImageSizedSrc, newImage, element) {
                    $('.js-productThumbnails img').each(function() {
                        var parentThumbImg = $(this).parent();
                        var productImage = $(this).parent().data("image");
                        if (newImageSizedSrc.includes(productImage)) {
                            $(this).parent().trigger('click');
                            return false;
                        }
                    });
                });
            }
        } else {
            addToCart.addClass('disabled').attr('disabled', 'disabled');
            $(addToCart).find("span").text("{{ 'products.product.sold_out' | t }}");
        }
    }
    changeImageQuickView = function (img, selector) {
        var src = $(img).attr("src");
        src = src.replace("_compact", "");
        $(selector).attr("src", src);
    }
    velaUpdateOptionsInSelector = function (t) {
        switch (t) {
            case 0:
                var n = "root";
                var r = $(".jsQuickview .single-option-selector:eq(0)");
                break;
            case 1:
                var n = $(".jsQuickview .single-option-selector:eq(0)").val();
                var r = $(".jsQuickview .single-option-selector:eq(1)");
                break;
            case 2:
                var n = $(".jsQuickview .single-option-selector:eq(0)").val();
                n += " / " + $(".jsQuickview .single-option-selector:eq(1)").val();
                var r = $(".jsQuickview .single-option-selector:eq(2)")
        }
        var i = r.val();
        r.empty();
        var s = Shopify.optionsMapQuickview[n];
        if(typeof s != "undefined"){
            for (var o = 0; o < s.length; o++) {
                var u = s[o];
                var a = $("<option></option>").val(u).html(u);
                r.append(a)
            }
        }
        $('.jsQuickview .swatch[data-option-index="' + t + '"] .swatch-element').each(function() {
            if ($.inArray($(this).attr("data-value"), s) !== -1) {
                $(this).removeClass("soldout").show().find(":radio").removeAttr("disabled", "disabled");
            } else {
                //$(this).addClass("soldout").hide().find(":radio").removeAttr("checked").attr("disabled", "disabled")
            }
        });
        if ($.inArray(i, s) !== -1) {
            r.val(i)
        }
        r.trigger("change")
    }
    velaLinkOptionSelectors = function (t) {
        for (var n = 0; n < t.variants.length; n++) {
            var r = t.variants[n];
            if (r.available) {
                Shopify.optionsMapQuickview["root"] = Shopify.optionsMapQuickview["root"] || [];
                Shopify.optionsMapQuickview["root"].push(r.option1);
                Shopify.optionsMapQuickview["root"] = Shopify.uniq(Shopify.optionsMapQuickview["root"]);
                if (t.options.length > 1) {
                    var i = r.option1;
                    Shopify.optionsMapQuickview[i] = Shopify.optionsMapQuickview[i] || [];
                    Shopify.optionsMapQuickview[i].push(r.option2);
                    Shopify.optionsMapQuickview[i] = Shopify.uniq(Shopify.optionsMapQuickview[i])
                }
                if (t.options.length === 3) {
                    var i = r.option1 + " / " + r.option2;
                    Shopify.optionsMapQuickview[i] = Shopify.optionsMapQuickview[i] || [];
                    Shopify.optionsMapQuickview[i].push(r.option3);
                    Shopify.optionsMapQuickview[i] = Shopify.uniq(Shopify.optionsMapQuickview[i])
                }
            }
        }
        velaUpdateOptionsInSelector(0);
        if (t.options.length > 1)
            velaUpdateOptionsInSelector(1);
        if (t.options.length === 3)
            velaUpdateOptionsInSelector(2);
        $(".single-option-selector:eq(0)").change(function() {
            velaUpdateOptionsInSelector(1);
            if (t.options.length === 3)
                velaUpdateOptionsInSelector(2);
            return true
        });
        $(".single-option-selector:eq(1)").change(function() {
            if (t.options.length === 3)
                velaUpdateOptionsInSelector(2);
            return true
        });
    }
    loadQuickViewSlider = function (n, r) {
        var loadingImgQuickView = $('.loadingImage');
        var s = Shopify.resizeImage(n.featured_image, "grande");
        loadingImgQuickView.hide();
        if (n.images.length > 0) {
            var o = r.find(".js-productThumbnailsQuickview .owl-carousel");
            for (i in n.images) {
                var u = Shopify.resizeImage(n.images[i], "grande");
                var a = Shopify.resizeImage(n.images[i], "compact");
                var f = '<div class="thumbnail__item"><a href="javascript:void(0)" data-imageid="' + n.id + '" data-image="' + n.images[i] + '" data-zoom-image="' + u + '" ><img src="' + a + '" alt="Produc Image" /></a></div>';
                o.append(f)
            }
            o.find("a").click(function() {
                var t = r.find(".proImageQuickview");
                if (t.attr("src") != $(this).attr("data-image")) {
                    t.attr("src", $(this).attr("data-image"));
                    loadingImgQuickView.show();
                    t.load(function(t) {
                        $(this).unbind("load");
                        loadingImgQuickView.hide()
                    })
                }
            });
            o.owlCarousel({
                navigation: true,
                items: 4,
                itemsDesktop: [1199, 4],
                itemsDesktopSmall: [979, 4],
                itemsTablet: [768, 4],
                itemsTabletSmall: [540, 4],
                itemsMobile: [360, 4]
            }).css("visibility", "visible")
        } else {
            r.find(".jsQuickview .js-productThumbnailsQuickview").remove();
        }
    }
    convertToSlug = function (e) {
        return e.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
    }
    addCheckedSwatch = function (){
        $('.swatch .color label').on('click', function () {
            $('.swatch .color').each(function(){
                $(this).find('label').removeClass('checkedBox');
            });
            $(this).addClass('checkedBox');
        });
    }
    quickViewVariantsSwatch = function (t, quickview) {
        if (t.variants.length > 1) {
            for (var r = 0; r < t.variants.length; r++) {
                var i = t.variants[r];
                var s = '<option value="' + i.id + '">' + i.title + "</option>";
                quickview.find("form.formQuickview .proVariantsQuickview > select").append(s)
            }
            new Shopify.OptionSelectors( 'productSelectQuickview', {
                product: t,
                onVariantSelected: selectCallbackQuickView
            });
            if (t.options.length == 1) {
                $("form.formQuickview .selector-wrapper:eq(0)").prepend("<label>" + t.options[0].name + "</label>")
            }
            quickview.find("form.formQuickview .selector-wrapper label").each(function(n, r) {
                $(this).html(t.options[n].name)
            })
            {% if settings.quickview_swatch_enable %}
            var o = window.file_url.substring(0, window.file_url.lastIndexOf("?"));
            var u = window.asset_url.substring(0, window.asset_url.lastIndexOf("?"));
            var a = "";
            for (var r = 0; r < t.options.length; r++) {
                a += '<div class="swatch clearfix" data-option-index="' + r + '">';
                a += '<div class="header">' + t.options[r].name + "</div>";
                var f = false;
                if (/Color|Colour/i.test(t.options[r].name)) { f = true }
                var l = new Array;
                for (var c = 0; c < t.variants.length; c++) {
                    var i = t.variants[c]; var h = i.options[r];
                    var p = this.convertToSlug(h);
                    var d = "quickview-swatch-" + r + "-" + p;
                    if (l.indexOf(h) < 0) {
                        a += '<div data-value="' + h + '" class="swatch-element ' + (f ? "color " : "") + p + (i.available ? " available " : " soldout ") + '">';
                        if (f) {
                            a += '<div class="tooltip">' + h + "</div>"
                        }
                        a += '<input id="' + d + '" type="radio" name="option-' + r + '" value="' + h + '" ' + (c == 0 ? " checked " : "") + (i.available ? "" : " disabled") + " />";
                        if (f) {
                            a += '<label class="'+ p +'" for="' + d + '" style="background-color: ' + p + "; background-image: url(" + o + p + '.png)"><img class="crossed-out" src="' + u + 'soldout.png" /><i></i></label>'
                        }
                        else {
                            a += '<label class="'+ p +'" for="' + d + '">' + h + '<img class="crossed-out" src="' + u + 'soldout.png" /></label>'
                        }
                        a += "</div>";
                        if (i.available) {
                            $('.jsQuickview .swatch[data-option-index="' + r + '"] .' + p).removeClass("soldout").addClass("available").find(":radio").removeAttr("disabled")
                        } l.push(h)
                    }
                } a += "</div>"
            }
            quickview.find("form.formQuickview .proVariantsQuickview > select").after(a);
            quickview.find(".swatch :radio").change(function () {
                var t = $(this).closest(".swatch").attr("data-option-index");
                var q = $(this).val();
                $(this).closest("form").find(".single-option-selector").eq(t).val(q).trigger("change");

            });
            addCheckedSwatch();
            {% endif %}
            if (t.available) {
                Shopify.optionsMapQuickview = {};
                velaLinkOptionSelectors(t);
            }
        }
        else {
            quickview.find("form.formQuickview .proVariantsQuickview > select").remove();
            var v = '<input type="hidden" name="id" value="' + t.variants[0].id + '">';
            quickview.find("form.formQuickview").append(v)
        }
    }
    validateQty = function (qty) {
        if((parseFloat(qty) == parseInt(qty)) && !isNaN(qty)) {

        } else {
            qty = 1;
        }
        return qty;
    };
    $(document).on("click", ".js-productThumbnailsQuickview li", function() {
        changeImageQuickView($(this).find("img:first-child"), ".proImageQuickview");
    });
    $(document).on('click', '.quickviewClose, .quickviewOverlay', function(e){
        $("#velaQuickView").fadeOut(500);
        $(".jsQuickview").html("");
        $(".jsQuickview").fadeOut(500);
    });
    $(document).on('click', '.btnProductQuickview', function(e){
        $('#loading').show();
        var producthandle = $(this).data("handle");
        Shopify.getProduct(producthandle,function(product) {
            var qvhtml = $("#quickviewModal").html();
            $(".jsQuickview").html(qvhtml);
            var quickview= $(".jsQuickview");
            var productdes = product.description.replace(/(<([^>]+)>)/ig,"");
            var featured_image = product.featured_image;
            productdes = productdes.split(" ").splice(0,30).join(" ")+"...";
            quickview.find(".proImageQuickview").attr("src",featured_image);
            quickview.find(".pricePrimary").html(Shopify.formatMoney(product.price, window.money_format));
            quickview.find(".js-productDetails").attr("id", "product-" + product.id);
            quickview.find(".formQuickview").attr("id", "product-actions-" + product.id);
            quickview.find(".formQuickview select").attr("id", "productSelectQuickview");
            quickview.find(".js-productDetails .quickviewName").text(product.title);
            quickview.find(".js-productDetails .quickViewVendor").append("<label>{{ 'products.product.vendor' | t }}</label>: " + product.vendor);
            if(product.available){
                quickview.find(".js-productDetails .quickviewAvailability").append("<label>{{ 'products.product.availability' | t }}</label>: {{'products.product.available' | t }}");
            }else{
                quickview.find(".js-productDetails .quickviewAvailability").append("{{ 'products.product.availability' | t }}</label>: {{'products.product.unavailable' | t }}");
            }
            quickview.find(".proShortDescription").text(productdes);
            if (product.compare_at_price > product.price) {
                quickview.find(".priceCompare").html(Shopify.formatMoney(product.compare_at_price_max, window.money_format)).show();
            }
            else {
                quickview.find(".priceCompare").html("");
            }
            if (!product.available) {
                quickview.find("select, input, .dec, .inc").remove();
                quickview.find(".js-add-to-cart").text("{{ 'products.product.sold_out' | t }}").addClass("disabled").attr("disabled", "disabled");
                $(".proQuantity").css("display", "none");
            }
            else {
                quickViewVariantsSwatch(product, quickview);
            }
            loadQuickViewSlider(product, quickview);
            $('#velaQuickView').fadeIn(500);
            $('.jsQuickview').fadeIn(500);
            $('#loading').hide();
            $('.velaQtyAdjust').on('click', function() {
                var $el = $(this),
                    id = $el.data('id'),
                    $qtySelector = $el.siblings('.js-quantityNumber'),
                    qty = parseInt($qtySelector.val().replace(/\D/g, ''));
                var qty = validateQty(qty);
                if ($el.hasClass('velaQtyAdjustPlus')) {
                    qty += 1;
                } else {
                    qty -= 1;
                    if (qty <= 1) qty = 1;
                }
                $qtySelector.val(qty);
            });
        });
        return false;
    });
};
vela.Drawers = (function () {
    var Drawer = function (id, position, iscart, options) {
        var defaults = {
            close: '.jsDrawerClose',
            open: '.jsDrawerOpen' + position,
            openClass: 'jsDrawerOpen',
            dirOpenClass: 'jsDrawerOpen' + position
        };
        this.$nodes = {
            parent: $('body, html'),
            page: $('#pageContainer'),
            moved: $('.isMoved')
        };
        this.config = $.extend(defaults, options);
        this.position = position;
        this.iscart = iscart;
        this.$drawer = $('#' + id);
        if (!this.$drawer.length) {
            return false;
        }
        this.drawerIsOpen = false;
        this.init();
    };
    Drawer.prototype.init = function () {
        $(this.config.open).on('click', $.proxy(this.open, this));
        this.$drawer.find(this.config.close).on('click', $.proxy(this.close, this));
    };
    Drawer.prototype.open = function (evt) {
        if (window.ajaxcart_type == 'modal' && this.iscart ) {
            var externalCall = false;
            this.$drawer.modal();//Use modal Bootstrap
            if (evt) {
                evt.preventDefault();
            } else {
                externalCall = true;
            }
            if (evt && evt.stopPropagation) {
                evt.stopPropagation();
                this.$activeSource = $(evt.currentTarget);
            }
            if (this.config.onDrawerOpen && typeof(this.config.onDrawerOpen) == 'function') {
                if (!externalCall) {
                    this.config.onDrawerOpen();
                }
            }
        } else {
            var externalCall = false;
            if (evt) {
                evt.preventDefault();
            } else {
                externalCall = true;
            }
            if (evt && evt.stopPropagation) {
                evt.stopPropagation();
                this.$activeSource = $(evt.currentTarget);
            }
            if (this.drawerIsOpen && !externalCall) {
                return this.close();
            }
            this.$nodes.page.addClass('is-transitioning');
            this.$drawer.prepareTransition();
            this.$nodes.parent.addClass(this.config.openClass + ' ' + this.config.dirOpenClass);
            this.drawerIsOpen = true;
            this.trapFocus(this.$drawer, 'drawer_focus');
            if (this.config.onDrawerOpen && typeof(this.config.onDrawerOpen) == 'function') {
                if (!externalCall) {
                    this.config.onDrawerOpen();
                }
            }
            if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
                this.$activeSource.attr('aria-expanded', 'true');
            }
            this.$nodes.page.on('touchmove.drawer', function () {
                return false;
            });
            this.$nodes.page.on('click.drawer', $.proxy(function () {
                this.close();
                return false;
            }, this));
        }
    };
    Drawer.prototype.close = function () {
        if (!this.drawerIsOpen) { // don't close a closed drawer
            return;
        }
        $(document.activeElement).trigger('blur');
        this.$nodes.page.prepareTransition({ disableExisting: true });
        this.$drawer.prepareTransition({ disableExisting: true });
        this.$nodes.parent.removeClass(this.config.dirOpenClass + ' ' + this.config.openClass);
        this.drawerIsOpen = false;
        this.removeTrapFocus(this.$drawer, 'drawer_focus');
        this.$nodes.page.off('.drawer');
    };
    Drawer.prototype.trapFocus = function ($container, eventNamespace) {
        var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';
        $container.attr('tabindex', '-1');
        $container.focus();
        $(document).on(eventName, function (evt) {
            if ($container[0] !== evt.target && !$container.has(evt.target).length) {
                $container.focus();
            }
        });
    };
    Drawer.prototype.removeTrapFocus = function ($container, eventNamespace) {
        var eventName = eventNamespace ? 'focusin.' + eventNamespace : 'focusin';
        $container.removeAttr('tabindex');
        $(document).off(eventName);
    };
    return Drawer;
})();
$(document).ready(function() {
    $(vela.init);
    $('body').on('ajaxCart.afterCartLoad', function(evt, cart) {
        vela.RightDrawer.open();
    });
    {% if resetPassword %}
    vela.resetPasswordSuccess();
    {% endif %}
});
$(window).load(function() {
    $(vela.slideShow);
    $(vela.productImage);
});