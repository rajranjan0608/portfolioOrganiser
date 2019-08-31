var host=location.origin.replace(/^http/,"http");
	
    socket=io.connect(host);

    var sockId;

    function searchUsers(){
        
        socket.emit("searchUsers",document.getElementById("users_search").value);
    }

    if(document.getElementById("users_search").value==""){
        document.getElementById("searchResults").style.display="none";
    }
    
    socket.on("searchUsers",function(data){
        
        if(document.getElementById("users_search").value==""){
            document.getElementById("searchResults").style.display="none";
        }else{
            document.getElementById("searchResults").style.display="block";
        }
        
        document.getElementById("searchResults").innerHTML="";

        if(data.usersFound==false){
            document.getElementById("searchResults").innerHTML="<h4 style='color:white;'>"+data.message+"</h4>";
        }else{
            data.forEach(function(user){
                document.getElementById("searchResults").innerHTML+=
                
                "<div style='width:200px; margin:10px; margin-left:76px; display:inline-block; cursor:pointer' onclick=location.href='/user/"+user.username+"' class='card text-center'>"+

                    "<div class='card-body'>"+
                        "<img style='margin-top:5px; width:50px' class='img-fluid img-profile rounded-circle mx-auto mb-2' src='"+user.profileImage+"' alt=''><br>" +  
                        "<span class='text-muted'>@"+user.username+"</span>"+
                    "</div>"+

                    "<div class='card-footer'>"+
                        user.fullName+
                    "</div>"+

                "</div>" 
            });	
            
        }
        
    });