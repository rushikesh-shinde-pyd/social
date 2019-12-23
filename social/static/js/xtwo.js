

/* ****************************************
                POST MODULE 
**************************************** */


// removing comments
function remove_comment_from_page(comment_id, post_id, data){
    if (data.total_comments==0){
        $("#post-id-" + post_id).find("#comment-count").text('');
        $("#post-id-" + post_id).find(".comments-replies").find("h5").slideUp();
        $("#post-id-" + post_id).find("#comment-div-id-" + comment_id).remove();
    }else{
        $("#post-id-" + post_id).find("#comment-div-id-" + comment_id).remove();
        $("#post-id-" + post_id).find("#comment-count").text(data.total_comments);
    }
    
}

function remove_comment(comment_id, post_id){
    $.ajax({
        url: "{% url 'social:remove-comment' %}",
        type: "POST",
        data: {
            'csrfmiddlewaretoken': '{{ csrf_token }}',
            'comment_id': comment_id,
            'post_id': post_id,
        },
        success: function(data){
            remove_comment_from_page(comment_id, post_id, data);
        },
        error: function(data){
            console.log(data);
        },
        complete: function(data){
            console.log(data);
        }
    });
}


// show/hide post comment's reply panel
$(document).on('click', 'button[name="show-replies"]', function(){
    if ($(this).text().trim() == 'Hide replies'){
    $('.reply-div').slideUp();
    $(this).text('show-replies');
    }else{
        $('.reply-div').slideUp();
        $(this).parent().find('.reply-div').slideDown();
        $('button[name="show-replies"]').text("show-replies");
        $(this).text('Hide replies');
    }
});


// replying comments
function add_reply_to_page(comment_id, post_id, data){
    if (data.total_replies == "1 reply"){
        console.log('reply added');
        $("#post-id-" + post_id).find("#comment-id-" + comment_id).append(`
        <button style="background-color:transparent; color: #2b6eff; border:none; margin-left: 10px;" name="show-replies">show replies</button>
        <h5 id="reply-count" style="padding:0px 15px;">${data.total_replies}</h5>
        <div class="replies">
            <div class="reply-wrapper">
                <ul  style="margin-left:50px" class="list-group reply-div">
                    <div style="margin:10px 0px;"><strong class="replier">${data.reply_user_fname} ${data.reply_user_lname}</strong> replied <span class="reply-timestamp"><small>just now</small></span><br></div>
                    <li class="list-group-item" style="display:inline-block;">${data.reply_message}</li>
                </ul>
            </div>
        </div>
    `);
    }else{
        $("#post-id-" + post_id).find("#comment-id-" + comment_id).find('.replies').prepend(`
        <div class="reply-wrapper">
            <ul  style="margin-left:50px" class="list-group reply-div">
                <div style="margin:10px 0px;"><strong class="replier">${data.reply_user_fname} ${data.reply_user_lname}</strong> replied <span class="reply-timestamp"><small>just now</small></span><br></div>
                <li class="list-group-item" style="display:inline-block;">${data.reply_message}</li>
            </ul>
        </div>
        `)
        
    }
    $("#comment-id-" + comment_id).find('.reply-div').slideDown();
    //$("#comment-id-" + comment_id).find('.replies').slideDown();
    $("#comment-id-" + comment_id).find("#reply-count").text(data.total_replies);
    $("#comment-id-" + comment_id).find('button[name="show-replies"]').text('Hide replies');
    //$("#comment-id-" + comment_id).find(".comments-replies").slideDown();
    $("#comment-id-" + comment_id).find("#hidden-reply-count").slideDown().text(data.total_replies);
    return false;
}


function reply_to_comment(comment_id, post_id){
    $(".remove-comment").slideDown();
    $('#comment-id-' + comment_id).find(".remove-comment").slideUp();
    $("#post-id-" + post_id).find(".reply-div").slideUp();
    $('button[name="show-replies"]').text("show-replies");
    $("#post-id-" + post_id).find('#comment-id-' + comment_id).find(".replies").slideDown();
    $('form[name="reply-to-comment"]').slideUp();
    $("#comment-id-" + comment_id).find('textarea[name="reply-area"]').parent().slideDown();
        $('textarea[name="reply-area"]').keyup(function(){
            var char_len = $(this).val().trim().length;
            if (char_len > 0){
                $(this).parent().find('input[type="submit"]').attr('disabled', false).slideDown();
            }else if(char_len == 0){
                $(this).parent().find('input[type="submit"]').attr('disabled', true).slideUp();
            }
        });
        $('#comment-id-' + comment_id).find('form[name="reply-to-comment"]').submit(function(event){
            event.preventdefault;
            var reply = $(this).find('textarea[name="reply-area"]').val().trim();
            $.ajax({
                url: "{% url 'social:reply-to-comment' %}",
                type: "POST",
                data: {
                    'csrfmiddlewaretoken': '{{ csrf_token }}',
                    'comment_id': comment_id,
                    'reply': reply,
                },
                success: function(data){
                    add_reply_to_page(comment_id, post_id, data);
                },
                error: function(data){
                    console.log(data);
                },
                complete: function(data){
                    console.log(data);
                }
            });
            $(this).find('input[type="submit"]').attr('disabled', true).slideUp();
            $('form[name="reply-to-comment"]').trigger("reset");
            return false;
        });
        return false;
}


// commenting post
function add_comment_to_page(id, data){
    $("#post-id-" + id).find("#comment-count").text(data.total_comments);
    if (data.total_comments == 1){
        $("#post-id-" + id).find(".comments-replies").prepend(`
            <h5>Comments</h5>
        `);
        $("#post-id-" + id).find(".comment-wrapper").prepend(`
        <div id="comment-div-id-${data.comment_id}">
            <div style="margin:10px 10px;"><strong class="commenter">${data.comment_user_fname} ${data.comment_user_lname}</strong> commented <span class="comment-timestamp"><small>just now</small></span></div>
            <ul class="list-group comment-div" id="comment-id-${data.comment_id}">
                <li class="list-group-item" style="display:inline-block;">
                    ${data.comment_message}
                </li>
                <i style="cursor:pointer;" onclick="reply_to_comment(${data.comment_id}, ${id})" class="fa fa-reply remove-comment" aria-hidden="true"></i>
                <i style="cursor:pointer;" onclick="remove_comment(${data.comment_id}, ${id})" class="fa fa-trash" aria-hidden="true"></i>
                <form style="display:none; padding-left:15px; padding-right:15px;" name="reply-to-comment" method="post">
                    {% csrf_token %}
                    <textarea style="margin:10px 0px;" class="form-control" placeholder="Reply here..." name="reply-area"></textarea>
                    <input class="btn btn-primary" type="submit" style="display:none" disabled name="reply" value="Reply">
                </form>
            </ul>
        </div>
    `);
    }else{
        $("#post-id-" + id).find(".comment-wrapper").prepend(`
        <div id="comment-div-id-${data.comment_id}">
            <div style="margin:10px 10px;"><strong class="commenter">${data.comment_user_fname} ${data.comment_user_lname}</strong> commented <span class="comment-timestamp"><small>just now</small></span></div>
            <ul class="list-group comment-div" id="comment-id-${data.comment_id}">
                <li class="list-group-item" style="display:inline-block;">
                    ${data.comment_message}
                </li>
                <i style="cursor:pointer;" onclick="reply_to_comment(${data.comment_id}, ${id})" class="fa fa-reply remove-comment" aria-hidden="true"></i>
                <i style="cursor:pointer;" onclick="remove_comment(${data.comment_id}, ${id})" class="fa fa-trash" aria-hidden="true"></i>
                <form style="display:none; padding-left:15px; padding-right:15px;" name="reply-to-comment" method="post">
                    {% csrf_token %}
                    <textarea style="margin:10px 0px;" class="form-control" placeholder="Reply here..." name="reply-area"></textarea>
                    <input class="btn btn-primary" type="submit" style="display:none" disabled name="reply" value="Reply">
                </form>
            </ul>
        </div>
    `);    
    }
}

function comment(id){
     $("#post-id-" + id).find(".glyphicon-comment").click(function(){
    }); 
    $("#post-id-" + id).find(".write-comment").slideUp();    
    $(".write-comment").slideUp();
    $("#post-id-" + id).find(".write-comment").slideDown();
    $(".write-comment").find('.comment-box').keyup(function(){
        var char_len = $(this).val().trim().length;
        if (char_len > 0){
            $('input[name="comment"]').attr('disabled', false).slideDown();
        }else if(char_len == 0){
            $('input[name="comment"]').attr('disabled', true).slideUp();
        }
    });
    $("#comment-form-" + id).submit(function(event){
        event.preventdefault;
        var post_id = $("#comment-form-" + id).find('input[name="post-id"]').val().trim();
        var post_comment = $("#comment-form-" + id).find('.comment-box').val().trim();
        $.ajax({
                url: "{% url 'social:comment' %}",
                type: "POST",
                data: {
                    'csrfmiddlewaretoken': '{{ csrf_token }}',
                    'post_id': post_id,
                    'comment': post_comment,
                },
                success: function(data){
                    add_comment_to_page(id, data);
                },
                error: function(data){
                    console.log(data);
                },
                complete: function(data){
                }
    });
    $(this).find('input[type="submit"]').attr('disabled', false).slideUp();
    $("#comment-form-" + id).trigger("reset");
    return false;
});
return false;
}


// post deletion
function delete_post(id){
    var title = $("#post-id-" + id).find("#post-title").text();
    $("#deletepromptmodal").modal("show");
    $("#deletepromptmodal").find("#delete_title").text(title);
    $("#delete_confirm").click(function(){
        $.ajax({
            url: "{% url 'social:ajax_requests' %}",
            type: "POST",
            data: {
                'csrfmiddlewaretoken': '{{ csrf_token }}',
                'id': id,
                'request_type': 'delete',
            },
            success: function(data){
                console.log(data)
                if (data.deleted){
                    $("#post-id-" + id).remove();
                }
            },
            error: function(data){
                console.log(data)
            }
        });
        $("#deletepromptmodal").modal("hide");
        $("#delete_message").modal("show");
    });
}


// post updation
function update_to_page(id, data){
    $("#post-id-" + id).find("#post-title").text(data.title);
    $("#post-id-" + id).find("#post-text").text(data.text);
    $("#post-id-" + id).find("#post-published").text({{data.published_date|timesince}});
}


function update_post(id){
    var title = $("#post-id-" + id).find("#post-title").text().trim();
    var content = $("#post-id-" + id).find("#post-text").text().trim();
    $(".post-update-form").find("#update-post-title").val(title);
    $(".post-update-form").find("#update-post-content").val(content);

    $(".post-update-form").submit(function(event){
        event.preventDefault();
        var title = $(".post-update-form").find("#update-post-title").val().trim();
        var content = $(".post-update-form").find("#update-post-content").val().trim();
        $.ajax({
            url: "{% url 'social:ajax_requests' %}",
            type: "POST",
            data: {
                'id': id,
                'title': title,
                'content': content,
                'csrfmiddlewaretoken': '{{ csrf_token }}',
                'request_type': 'update',
            },
            success: function(data){
                if (data.updated){
                    update_to_page(id, data);
                }
            },
            error: function(data){
                console.log(data)
            }
        });
        $('.post-update-form').trigger("reset");
        $("#updateModal").modal("hide");
        $("#update_message").modal("show");
        return false;
    });
}


// like posts
function like(id){
    $("#post-id-" + id).find(".like").addClass("likedislikeclass");
        $.ajax({
                url: "{% url 'social:likedislike-requests' %}",
                type: "POST",
                data: {
                    'post_id': id,
                    'action': 'like',
                    'csrfmiddlewaretoken': '{{ csrf_token }}',
                },
                success: function(data){
                    if (data.dislike){
                        if (data.dislike_count == 0){
                            $("#post-id-" + id).find("#dislike-count").text('');
                        }else{
                            $("#post-id-" + id).find("#dislike-count").text(data.dislike_count);
                        }
                        $("#post-id-" + id).find("#like-count").text(data.like_count);
                        $("#post-id-" + id).find(".undodislike").attr("onclick", "dislike(" + id + ")");
                        $("#post-id-" + id).find(".undodislike").removeClass("likedislikeclass").addClass("dislike");
                    }else{
                        $("#post-id-" + id).find("#like-count").text(data.like_count);
                    }
                },
                error: function(data){
                    console.log(data);
                }
            });
    $("#post-id-" + id).find(".like").attr("onclick", "undolike(" + id + ")");
    $("#post-id-" + id).find(".like").removeClass("like").addClass("undolike");
}


// undolike posts
function undolike(id){
    $("#post-id-" + id).find(".undolike").removeClass("likedislikeclass");
        $.ajax({
                url: "{% url 'social:likedislike-requests' %}",
                type: "POST",
                data: {
                    'post_id': id,
                    'action': 'dislike',
                    'csrfmiddlewaretoken': '{{ csrf_token }}',
                },
                success: function(data){
                    if (data.like_count == 0){
                        $("#post-id-" + id).find("#like-count").text('');
                    }else{
                        $("#post-id-" + id).find("#like-count").text(data.like_count);
                    }
                },
                error: function(data){
                    console.log(data);
                }
            });
    $("#post-id-" + id).find(".undolike").attr("onclick", "like(" + id + ")");
    $("#post-id-" + id).find(".undolike").removeClass("undolike").addClass("like");
}


// dislike posts
function dislike(id){
    $("#post-id-" + id).find(".dislike").addClass("likedislikeclass");
        $.ajax({
                url: "{% url 'social:dislike-requests' %}",
                type: "POST",
                data: {
                    'post_id': id,
                    'action': 'like',
                    'csrfmiddlewaretoken': '{{ csrf_token }}',
                },
                success: function(data){
                    console.log(data);
                    if (data.like){
                        if (data.like_count == 0){
                            $("#post-id-" + id).find("#like-count").text('');
                        }else{
                            $("#post-id-" + id).find("#like-count").text(data.like_count);
                        }
                        $("#post-id-" + id).find("#dislike-count").text(data.dislike_count);
                        $("#post-id-" + id).find(".undolike").attr("onclick", "like(" + id + ")");
                        $("#post-id-" + id).find(".undolike").removeClass("likedislikeclass").addClass("like");

                    }else{
                        $("#post-id-" + id).find("#dislike-count").text(data.dislike_count);
                    }
                },
                error: function(data){
                    console.log(data);
                }
            });
    $("#post-id-" + id).find(".dislike").attr("onclick", "undodislike(" + id + ")");
    $("#post-id-" + id).find(".dislike").removeClass("dislike").addClass("undodislike");
}


// undodislike posts
function undodislike(id){
    $("#post-id-" + id).find(".undodislike").removeClass("likedislikeclass");
        $.ajax({
                url: "{% url 'social:dislike-requests' %}",
                type: "POST",
                data: {
                    'post_id': id,
                    'action': 'dislike',
                    'csrfmiddlewaretoken': '{{ csrf_token }}',
                },
                success: function(data){
                    if (data.dislike_count == 0){
                        $("#post-id-" + id).find("#dislike-count").text("");
                    }else{
                        $("#post-id-" + id).find("#dislike-count").text(data.dislike_count);
                    }
                },
                error: function(data){
                    console.log(data);
                }
            });
    $("#post-id-" + id).find(".undodislike").attr("onclick", "dislike(" + id + ")");
    $("#post-id-" + id).find(".undodislike").removeClass("undodislike").addClass("dislike");
}


// closing comment panel
$('input[name="close-comment"]').click(function(){
    $(this).parent().parent().slideUp();
});


// show less posts
 $("#show_less").click(function(){
    $(".mb").slice(5).hide();
    window.scrollTo(0, 0); 
    $("#show_more").show();
    $("#show_more").attr('data-showmorecount', 10);
    $(this).hide();
});

// show more posts
$("#show_more").click(function(){
    var num_posts = $(".mb").length;
    var count = parseInt($(this).attr('data-showmorecount'));
    console.log(num_posts, count);
    if (num_posts < count){
        // $("#show_less").slideDown();
        $(this).hide();
        // $("#show_more").text("Show less");
        $("#show_less").css('display', 'inline-block');
        $(this).attr('data-showmorecount', 10);
        // $(".mb").slice(5).hide();
        
    }else{
        $(".mb").slice(0,count).slideDown();
        $(".mb").slice(count).slideUp();
        $(this).attr('data-showmorecount', count+5);
    }
    
}); 

$(document).ready(function(){
    $(".category-thumbnail").slice(4).hide();
}); 


$(document).on('mouseenter mouseleave', ".post-div", function(){
    $(this).find(".post-actions").fadeToggle();
});



$(".category-expansion").click(function(){
    if ($(this).text().trim() == 'Show less'){
        $(this).text("Show all categories");
        $(".category-thumbnail").slice(4).fadeOut();
    }else{
        $(this).text("Show less");
        $(".category-thumbnail").slice().fadeIn();
    }
});
