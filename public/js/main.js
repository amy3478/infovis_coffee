$(function(){
  
  $(".dropdown-menu li a").click(function(){
    
    $(".btn:first-child").innerHtml = $(this).text()+"<span class='caret'></span>";
  });

});