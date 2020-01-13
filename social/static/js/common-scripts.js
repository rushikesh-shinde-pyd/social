
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
    var obj = new RegExp('^[a-z]{2,20}\\s*[a-z]*\\s*[a-z]*[a-z\\s]*$');
    if (!obj.test(query)){
        event.preventDefault();
    } 
    if (!location.val().trim()){
        location.remove();
    }
});


$(document).ready(function(){
    $('.filter').click(function(event){
        // $('.filter').siblings().slideUp();
        // $(this).siblings().slideToggle();
        $('.filter').not($(this)).siblings().slideUp();
        $(this).siblings().slideToggle();
    })
});

// toggle gender filter
// $("#gender-toogle").click(function(){
//     $("#gender-ul").slideToggle();
// })


// toggle location filter
// $("#location-toggle").click(function(){
//     var location = $('#location-input');
//     // var flag = false;
//     // location.fadeIn(function(){
//     //     flag = true;
//     //     $(this).focus();
//     // });
//     // if (flag){
//     //     location.fadeOut();
//     // }
//     location.slideToggle();
// })


// preventing user from typing space at the beginning at input
$('[name="filter-location"]').keydown(function(event){
    var location = $(this).val().trim();
    if (event.keyCode === 32 && !$(this).val().length) {
        event.preventDefault();
    }
})


// clear all applied filters
$("#clear-filters").click(function(event){
    $(".search-form").trigger('reset');
})


// toggle all the filters
$(".glyphicon-filter").click(function(event){
    $(".filters-dropdown").slideToggle();
});

// ****************search form end****************





$('.close-comment-form').click(function(){
    $(this).parents(".comment-form-wrapper").slideUp();
});

$('.add-comment').click(function(){
    $(this).parent().siblings(".comment-form-wrapper").fadeToggle();
    $(this).parent().siblings(".comment-form-wrapper").find('[name="comment-textarea"]').focus();
});




// reply
$('.close-reply-form').click(function(){
    $(this).parents(".reply-form-wrapper").slideUp();
});

$(document).on('click', '.add-reply', function(event){
    $(this).parents('.reply-container').siblings(".reply-form-wrapper").fadeToggle('fast');
    $(this).parents(".reply-container").siblings('.reply-form-wrapper').find('[name="reply-textarea"]').focus();
});


$(document).on('keydown', '[name="reply-textarea"]', function(event){
    var reply_btn = $('[name="reply-btn"]');
    if (event.which === 32 && !$(this).val().length){
        reply_btn.attr('disabled', true);
        event.preventDefault();
    }else{
        reply_btn.attr('disabled', false);
    }
});

$(document).on('keyup', '[name="reply-textarea"]', function(event){
    var reply_btn = $('[name="reply-btn"]');
    if ($(this).val().trim().length === 0){
        reply_btn.attr('disabled', true);
    }
});

// $('.reply-or-replies').click(function(event){
//         var replies = $(this).parents('.comment-reply-wrapper').children('.reply-wrapper');
//         replies.slice(3).hide();
//         $(this).parents('.comment-reply-wrapper').find('.reply-container').slideUp();
//         // $(this).parents('.comment-reply-wrapper').find('.reply-container').children(".reply-wrapper").slice(0,1).show('slow');
//     })
    

$(document).on('click', '.reply-or-replies', function(event){
    var replies = $(this).parents('.comment-reply-wrapper').find('.reply-container').children('.reply-wrapper');
    replies.slice(1).hide();
    $(this).parents('.comment-reply-wrapper').find('.reply-container').slideToggle();
})


$(document).on('click', '.expand-replies', function(){
    var replies = $(this).parents('.comment-reply-wrapper').find('.reply-container').children('.reply-wrapper');
    console.log('replies');
    if ($(this).text() === 'Show less'){
        replies.slice(1).hide();
        $(this).text('Show all replies');
        $(this).parents('.comment-reply-wrapper').find('.reply-container').css({
            'height': 'unset',
            'overflow': 'hidden',
        });
    }else{
        if (replies.length <= 5){
            $(this).parents('.comment-reply-wrapper').find('.reply-container').css({
                'height': 'unset',
                'overflow': 'hidden',
            });    
        }else{
            $(this).parents('.comment-reply-wrapper').find('.reply-container').css({
                'height': '400px',
                'overflow': 'auto',
            });
        }
        
        $(this).text('Show less');
        replies.slice().show();
    }
});



$(document).on('click', '.comment-icon', function(event){
    var comments = $(this).parents('.panel-heading').find('.comment-banner').children('.comment-reply-wrapper');
    comments.slice(0,1).show();
    $(this).parents('.panel-heading').find('.comment-reply-banner').slideToggle();  
})


$(document).on('click', '.expand-comments', function(){
    var comments = $(this).parents('.comment-reply-banner').find('.comment-reply-wrapper');
    if ($(this).text() === 'Show less'){
        comments.slice(1).hide();
        $(this).text('Show all comments');
        $(this).parents('.comment-reply-banner').css({
            'height': 'unset',
            'overflow': 'hidden',
        });
    }else{
        if (comments.length <= 5){
            $(this).parents('.comment-reply-banner').css({
                'height': 'unset',
                'overflow': 'hidden',
            });    
        }else{
            $(this).parents('.comment-reply-banner').css({
                'height': '400px',
                'overflow': 'auto',
            });
        }
        
        $(this).text('Show less');
        comments.slice().show();
    }
});



(function($) {
    var comments = $('.comment-banner');
    comments.each(function(index){
        var x = $(this).children('.comment-reply-wrapper');
        if (x.length == 1){
            $(this).find('.expand-comments').remove();
        }
    })
  })($);


//   (function($) {
//     var replies = $('.reply-container');
//     replies.each(function(index){
//         var x = $(this).children('.reply-wrapper');
//         if (x.length == 1){
//             console.log('Hello');
//             $(this).children('.expand-replies').remove();
//         }
//     })
//   })(jQuery);

