# jsRazor: Cutting-Enge Client Templates

Stupidly simple and unbeatably powerful client-side templating solution. The entire library is tiny and consists of only two functionals that can be combined with each other to achieve any possible custom output.

## Example

You have some JSON data:

  var data_Themes =
  [
	  { name: "Dreaming Theme", colors: ["#2A1910", "#9E7064", "#B0967C", "#E7435E", "#6D4F3F"] },
    { name: "Moth Theme", colors: ["#30382D", "#565539", "#78765F", "#403F2B"] },
    { name: "5 Dark Theme", colors: ["#000000", "#280705", "#2E0500", "#3B0000", "#3C1100"] },
    { name: "Blue Volcano Theme", colors: ["#5077FF", "#8A84FF", "#81C1FF"] }
  ];

Create output template:

  <div id="example">
    <ul>
      <!--repeatfrom:themes-->
      <li> 
        <div class="name">{name} ({CountColors} colors)</div>
        <!--repeatfrom:colors-->
        <div class="wrap">
          <div class="color" style="background-color:{item};">
            <!--showfrom:dark-->
            <span style="color:white">{item}</span>
            <!--showstop:dark-->
            <!--showfrom:light-->
            <span style="color:black">{item}</span>
            <!--showstop:light-->
          </div>
          <div class="rgb">({r},{g},{b})</div>
        </div>
        <!--repeatstop:colors-->
      </li>  
      <!--repeatstop:themes-->
    </ul>
  </div>

Write JavaScript controller code:

  var tmp = $("#example").html();

  // repeat themes
  tmp = $.jsrazor.repeat(tmp, "themes", data_Themes, function (tmp, idx, item)
  {
    // repeat colors
    tmp = $.jsrazor.repeat(tmp, "colors", item.colors, function (tmp, idx, item)
    {
      // toggle dark/light fragment
      tmp = $.jsrazor.toggle(tmp, "dark", hex2rgb(item).mid <= 128);
      tmp = $.jsrazor.toggle(tmp, "light", hex2rgb(item).mid > 128);
      // output some custom values
      tmp = tmp
        .replace("{r}", hex2rgb(item).r)
        .replace("{g}", hex2rgb(item).g)
        .replace("{b}", hex2rgb(item).b);

      return tmp;
    });
    // output some custom values
    tmp = tmp
      .replace("{CountColors}", item.colors.length);

    return tmp;
  });

  $("#example").html(tmp);

You're done:

  picture here

## Authors

[Roman Gubarenko] (https://github.com/rgubarenko)