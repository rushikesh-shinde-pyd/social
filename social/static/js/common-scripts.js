/*---LEFT BAR ACCORDION----*/
$(function() {
    $('#nav-accordion').dcAccordion({
        eventType: 'click',
        autoClose: true,
        saveState: true,
        disableLink: true,
        speed: 'slow',
        showCount: false,
        autoExpand: true,
//        cookie: 'dcjq-accordion-1',
        classExpand: 'dcjq-current-parent'
    });
});

var Script = function () {


//    sidebar dropdown menu auto scrolling

    jQuery('#sidebar .sub-menu > a').click(function () {
        var o = ($(this).offset());
        diff = 250 - o.top;
        if(diff>0)
            $("#sidebar").scrollTo("-="+Math.abs(diff),500);
        else
            $("#sidebar").scrollTo("+="+Math.abs(diff),500);
    });



//    sidebar toggle

    $(function() {
        function responsiveView() {
        var wSize = $(window).width();
            if (wSize <= 768) {
                $('#container').addClass('sidebar-close');
                $('#sidebar > ul').hide();
            }

            if (wSize > 768) {
                $('#container').removeClass('sidebar-close');
                $('#sidebar > ul').show();
            }
        }
        $(window).on('load', responsiveView);
        $(window).on('resize', responsiveView);
    });

    $('.fa-bars').click(function () {
        if ($('#sidebar > ul').is(":visible") === true) {
            $('#main-content').css({
                'margin-left': '0px'
            });
            $('#sidebar').css({
                'margin-left': '-210px'
            });
            $('#sidebar > ul').hide();
            $("#container").addClass("sidebar-closed");
        } else {
            $('#main-content').css({
                'margin-left': '210px'
            });
            $('#sidebar > ul').show();
            $('#sidebar').css({
                'margin-left': '0'
            });
            $("#container").removeClass("sidebar-closed");
        }
    });

// custom scrollbar
    $("#sidebar").niceScroll({styler:"fb",cursorcolor:"#4ECDC4", cursorwidth: '3', cursorborderradius: '10px', background: '#404040', spacebarenabled:false, cursorborder: ''});

    $("html").niceScroll({styler:"fb",cursorcolor:"#4ECDC4", cursorwidth: '6', cursorborderradius: '10px', background: '#404040', spacebarenabled:false,  cursorborder: '', zindex: '1000'});

// widget tools

    jQuery('.panel .tools .fa-chevron-down').click(function () {
        var el = jQuery(this).parents(".panel").children(".panel-body");
        if (jQuery(this).hasClass("fa-chevron-down")) {
            jQuery(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
            el.slideUp(200);
        } else {
            jQuery(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
            el.slideDown(200);
        }
    });

    jQuery('.panel .tools .fa-times').click(function () {
        jQuery(this).parents(".panel").parent().remove();
    });


//    tool tips

    $('.tooltips').tooltip();

//    popovers

    $('.popovers').popover();



// custom bar chart

    if ($(".custom-bar-chart")) {
        $(".bar").each(function () {
            var i = $(this).find(".value").html();
            $(this).find(".value").html("");
            $(this).find(".value").animate({
                height: i
            }, 2000)
        })
    }


}();


// create category form validation
$('form[name="create-category"]').submit(function(event){
    $(".category-error").remove();
    var category = $('[name="category-name"]');
    var subcategory = $('[name="subcategory-name"]');
    var ele_indices = [];
    if (!category.val().trim()){
        category.after('<span class="category-error text-danger">Invalid category!</span>');
    }
    if (!subcategory.val().trim()){
        subcategory.after('<span class="category-error text-danger">Invalid subcategory!</span>');
    }
    $(this).find(ele_indices[0]).focus();
    if (ele_indices.length > 0 ){
        event.preventDefault();
    }
});


// post creation form validation
$('form[name="post-create-form"]').submit(function(event){
    $(".category-error").remove();
    var category = $('[name="category"]');
    var subcategory = $('[name="subcategory"]');
    var title = $('[name="post-title"]');
    var content = $('[name="post-content"]');
    var ele_indices = [];
    if (category.val() == "None"){
        category.after('<span class="category-error text-danger">Select category!</span>');
        ele_indices.push($(category));
    }
    if (subcategory.val() == "None"){
        subcategory.after('<span class="category-error text-danger">Select subcategory!</span>');
        ele_indices.push($(subcategory));
    }
    if (!title.val().trim()){
        title.after('<span class="category-error text-danger">Enter valid input!</span>');
        ele_indices.push($(title));
    }
    if (!content.val().trim()){
        content.after('<span class="category-error text-danger">Enter valid input!</span>');
        ele_indices.push($(content));
    }
    $(this).find(ele_indices[0]).focus();
    if (ele_indices.length > 0 ){
        event.preventDefault();
    }

});


// ****************search form****************

// search form validation
$(".search-form").submit(function(event){
    var query = $('[name="query"]').val().trim();
    var location = $('[name="filter-location"]');
    var obj = new RegExp('^[a-z]{2,20}\\s[a-z]{2,20}\\s*[a-z]*$');
    if (!obj.test(query)){
        
        event.preventDefault();
    } 
    if (!location.val().trim()){
        location.remove();
    }
});


// toggle gender filter
$("#gender-toogle").click(function(){
    $("#gender-ul").slideToggle();
})


// toggle location filter
$("#location-toggle").click(function(){
    var location = $('[name="filter-location"]');
    var flag = false;
    location.fadeIn(function(){
        flag = true;
        $(this).focus();
    });
    if (flag){
        location.fadeOut();
    }
})


// preventing user from typing space at the beginning at input
$('[name="filter-location"]').keydown(function(event){
    var location = $(this).val().trim();
    if (event.keyCode == 32) {
        event.preventDefault();
    }
})


// clear all applied filters
$("#clear-filters").click(function(event){
    form = $(".search-form");
    form.find('[name="filter-location"]').removeAttr('value');
    form.find('[name="filter-gender"]').removeAttr('checked');
})


// toggle all the filters
$("#searchfilters").click(function(event){
    $(".filters-dropdown").toggle();
});

// ****************search form end****************