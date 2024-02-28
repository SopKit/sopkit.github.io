


let tool_html = `

<div class="sopkit_toolbar">
<h1><a href="http://sopkit.github.io/" target="_blank"> SopKit</a></h1>

<div class="search">
    <a href="http://sopkit.github.io/SopKit" target="_blank"> 
        <img height="30" src="https://cdn.jsdelivr.net/gh/SopKit/svg-pack@main/svg/search-outline.svg" alt="" srcset="">
    </a>
</div>
<div class="toolbar"></div>
</div>
<style>
.sopkit_toolbar {
font-size: small;
position: absolute;
color: aliceblue;
bottom: 1%;
left: 50%;
transform: translate(-50%, -50%);
background-image: linear-gradient(to left top, #977dfe, #6878ff);
position: absolute;
width: 180px;
height: 60px;
padding: 10px;
overflow: hidden;
border-radius: 60px;
text-align: center;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
transition: all 0.3s ease-in-out;
z-index: 1000; /* Ensure the toolbar stays on top of other elements */
justify-content: flex-start;
}
h1 {
margin-left: 20px;
}
.sopkit_toolbar:hover {
background-image: linear-gradient(to left top, #fe7dfa, #6878ff);
position: absolute;
border: 4px solid #e8cccc;
/* linear-gradient(to left top, #7F61F6, #ff4ee2); */
}
.sopkit_toolbar a {
color: aliceblue;
text-decoration: none;
}

.sopkit_tool {
background-color: #f0f0f0;
border-radius: 50%;
padding: 10px;
margin: 5px;
cursor: pointer;
transition: background-color 0.3s; /* Add a smooth transition effect */
}

.sopkit_tool:hover {
background-color: #e0e0e0;
}

.search {
background-color: #dcddee;
padding: 20px;
border-radius: 50%;
display: flex;
text-align: center;
align-items: center;
justify-content: center;
/* border: 2px solid red; */
margin-left: 10px;
transition: all 0.3s ease-in-out;
margin-right: 0;
justify-content: flex-end;
position: absolute;
right: 2px;
z-index: 999;
}

.sopkit_toolbar:hover .search {
background-color: #dcd5df;
padding: 20px;
}

.sopkit_toolbar .search:hover {
background-color: #ffffff;
padding: 20px;
}

.search::before {
/* content: ""; */
position: absolute;
height: 100%;
width: 2px;
background-color: #6878ff;
left: 0;
}
a {
margin: 0;
padding: 0;
}
</style>

`;

document.body.insertAdjacentHTML( 'beforeend', tool_html );
