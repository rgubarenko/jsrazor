/*!
 * jsRazor Plugin v1.0.0
 * http://github.com/rgubarenko/jsrazor
 *
 * The most simple and powerful way of client-side templating. 
 * Can work with or without jQuery - no framework dependancy. 
 *
 * Copyright © 2013 Roman Gubarenko (roman@makeitsoft.com)
 * Released under the MIT license
 */


; (function ($)
{
  var _util =
  {
    findFragments: function (text, lim1, lim2)
    {
      // collect list of matches starting with lim1 and ending with lim2
      var matches = new Array();
      var lastIdx = 0;
      while (lastIdx < text.length - 1)
      {
        var match = {};

        // index of starting lim1
        match.idx1 = text.indexOf(lim1, lastIdx);
        if (match.idx1 < 0) break;
        lastIdx = match.idx1 + lim1.length;

        // index of ending lim2
        match.idx2 = text.indexOf(lim2, lastIdx);
        if (match.idx2 < 0) break;

        // template between lim1 and lim2
        match.temp = text.substr(lastIdx, match.idx2 - lastIdx);
        lastIdx = match.idx2 + lim2.length;

        matches.push(match);
      }

      return matches;
    },

    replaceAll: function (str, search, replace)
    {
      var idx;
      while ((idx = str.indexOf(search)) >= 0)
      {
        str = str.substr(0, idx) + replace + str.substr(idx + search.length);
      }
      return str;
    }
  };

  var jsrazor =
  {
    settings:
    {
      limiterFormat: "<!--{type}:{name}-->"
    },

    repeat: function (fragment, name, items, render)
    {
      try
      {
        // validate input params
        if (typeof (fragment) != "string") throw "Invalid fragment";
        else if (typeof (name) != "string") throw "Invalid name";
        else if (!(items instanceof Array)) throw "Invalid data items array";
        else if (render && typeof (render) != "function") throw "Invalid rendering callback";

        var output = fragment;

        // starting and ending fragment limiters
        var lim1 = this.settings.limiterFormat.replace("{type}", "repeatfrom").replace("{name}", name);
        var lim2 = this.settings.limiterFormat.replace("{type}", "repeatstop").replace("{name}", name);

        // get list of matches starting with lim1 and ending with lim2
        var matches = _util.findFragments(output, lim1, lim2);

        // render data to every place where match is found
        for (var i = matches.length - 1; i >= 0; i--)
        {
          var match = matches[i];

          // render output for current matched repeater
          var repeaterOutput = "";
          for (var itemIdx = 0; itemIdx < items.length; itemIdx++)
          {
            var item = items[itemIdx];

            // render template for current item
            var itemOutput = match.temp;

            // invoke render callback to render the template
            if (render)
            {
              itemOutput = render(itemOutput, itemIdx, item);
              if (typeof (itemOutput) != "string") throw "Rendering callback must return string value";
            }

            // automatically render values for some known objects
            // for string and number, output the values to {item} placeholder
            if (typeof (item) == "string" || typeof (item) == "number")
            {
              itemOutput = _util.replaceAll(itemOutput, "{item}", "" + item);
            }
              // for JSON object, output applicable properties to placeholders
            else if (item && item.constructor && item.constructor === {}.constructor)
            {
              // automatically render placeholders for all applicable item properties
              for (var key in item)
              {
                if (item.hasOwnProperty(key) && (typeof (item[key]) == "string" || typeof (item[key]) == "number"))
                {
                  itemOutput = _util.replaceAll(itemOutput, "{" + key + "}", "" + item[key]);
                }
              }
            }

            repeaterOutput += itemOutput;
          }

          // now replace content from lim1 to lim2 to with rendered repeater output
          output = output.substr(0, match.idx1) + repeaterOutput + output.substr(match.idx2 + lim2.length);
        }

        return output;
      }
      catch (ex)
      {
        throw "jsrazor.repeat() error: " + ex;
      }
    },

    toggle: function (fragment, name, flag)
    {
      try
      {
        // validate input params
        if (typeof (fragment) != "string") throw "Invalid fragment";
        else if (typeof (name) != "string") throw "Invalid name";

        var output = fragment;

        // starting and ending comment tags surrounding toggling area
        var lim1 = this.settings.limiterFormat.replace("{type}", "showfrom").replace("{name}", name);
        var lim2 = this.settings.limiterFormat.replace("{type}", "showstop").replace("{name}", name);

        // get list of matches starting with lim1 and ending with lim2
        var matches = _util.findFragments(output, lim1, lim2);

        // render data to every place where match is found
        for (var i = matches.length - 1; i >= 0; i--)
        {
          var match = matches[i];

          // render output for current toggling area
          var toggleOutput = "";
          if (flag) toggleOutput = match.temp; // if visible, leave content without limiters
          else toggleOutput = ""; // otherwise, dont show content nor limiters

          // now replace content from lim1 to lim2 to with rendered toggle output
          output = output.substr(0, match.idx1) + toggleOutput + output.substr(match.idx2 + lim2.length);
        }

        return output;
      }
      catch (ex)
      {
        throw "jsrazor.toggle() error: " + ex;
      }
    }
  };

  // set as jQuery plugin or window global
  $.jsrazor = jsrazor;
  
})(typeof (jQuery) == "function" ? jQuery : window);
