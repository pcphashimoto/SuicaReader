//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Add markup for labels
//>>label: Label
//>>group: Tizen:Core

define( [
	"jquery",
	"jqm/jquery.mobile.core"
	], function ( jQuery ) {

//>>excludeEnd("jqmBuildExclude");

/*
 *
 * This software is licensed under the MIT licence (as defined by the OSI at
 * http://www.opensource.org/licenses/mit-license.php)
 * 
 * ***************************************************************************
 * Copyright (C) 2011 by Intel Corporation Ltd.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 */

// Add markup for labels


(function($, undefined) {

$(document).bind("pagecreate create", function(e) {
    $(":jqmData(role='label')", e.target).not(":jqmData(role='none'), :jqmData(role='nojs')").each(function() {
        $(this).addClass("jquery-mobile-ui-label")
               .html($("<span>", {"class": "jquery-mobile-ui-label-text"}).text($(this).text()));
    });
});

})(jQuery);

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
} );
//>>excludeEnd("jqmBuildExclude");

