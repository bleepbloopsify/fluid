var elements = document.getElementsByTagName( '*' );
document.body.style.cursor = 'pointer';

var selected;
var color;

for ( var x = 0; x < elements.length; x++ ) {
  elements[ x ].addEventListener( 'mouseover', function( e ) {
    e.preventDefault();
    if ( this.parentNode == selected || selected == null ) {
      if ( selected != null ) {
        selected.style.backgroundColor = color;
        selected.removeEventListener( select_out );
      }
      selected = this;
      color = selected.style.backgroundColor;
      color = color == '' ? 'transparent' : color;
      selected.style.backgroundColor = 'lightblue';
      selected.addEventListener( 'mouseout', select_out );
    }
  } );
}

document.addEventListener( 'click', select_click );

function parse( element ) {
  var output = { 'tag': {}, 'class': {}, 'id': {}, 'attr': {} };
  var classes = element.className.split( ' ' );
  for ( var i = 0; i < classes.length; i++ ) {
    var style_list = getStyleWithCSSSelector( '.' + classes[ i ] );
    if ( style_list != null ) {
      for ( var a = 0; a < style_list.length; a++ ) {
        var style = style_list[ a ][ 'styleDefinition' ];
        var split = style.split( '{' );
        var class_list = split[ 0 ].split( ' ' );
        for ( var x = 0; x < class_list.length; x++ ) {
          if ( class_list[ x ].indexOf( classes[ i ] ) != -1 ) {
            var class_name = class_list[ x ].trim().replace( ',', '' );
            var attrs = split[ 1 ].replace( '}', '' ).trim().split( ';' );
            if ( output[ 'class' ][ class_name ] == null ) {
              output[ 'class' ][ class_name ] = {};
            }
            for ( var b = 0; b < attrs.length; b++ ) {
              var attr_split = attrs[ b ].split( ':' );
              if ( attr_split[ 0 ] != null && attr_split[ 1 ] != null ) {
                output[ 'class' ][ class_name ][ attr_split[ 0 ].trim() ] = attr_split[ 1 ].trim();
              }
            }
          }
        }
      }
    } else {
      output[ 'class' ][ classes[ i ] ] = '';
    }
  }
  var id = element.id.split( ' ' );
  for ( i = 0; i < id.length; i++ ) {
    style_list = getStyleWithCSSSelector( '#' + id[ i ] );
    if ( style_list != null ) {
      for ( a = 0; a < style_list.length; a++ ) {
        style = style_list[ a ][ 'styleDefinition' ];
        split = style.split( '{' );
        var id_list = split[ 0 ].split( ' ' );
        for ( x = 0; x < id_list.length; x++ ) {
          if ( id_list[ x ].indexOf( id[ i ] ) != -1 ) {
            var id_name = id_list[ x ].trim().replace( ',', '' );
            attrs = split[ 1 ].replace( '}', '' ).trim().split( ';' );
            if ( output[ 'id' ][ id_name ] == null ) {
              output[ 'id' ][ id_name ] = {};
            }
            for ( b = 0; b < attrs.length; b++ ) {
              attr_split = attrs[ b ].split( ':' );
              if ( attr_split[ 0 ] != null && attr_split[ 1 ] != null ) {
                output[ 'id' ][ id_name ][ attr_split[ 0 ].trim() ] = attr_split[ 1 ].trim();
              }
            }
          }
        }
      }
    } else {
      output[ 'id' ][ id[ i ] ] = '';
    }
  }
  var tag = element.tagName.toLowerCase();
  style_list = getStyleWithCSSSelector( tag );
  if ( style_list != null ) {
    for ( a = 0; a < style_list.length; a++ ) {
      style = style_list[ a ][ 'styleDefinition' ];
      split = style.split( '{' );
      var tag_list = split[ 0 ].split( ' ' );
      for ( x = 0; x < tag_list.length; x++ ) {
        if ( tag_list[ x ].indexOf( tag ) != -1 ) {
          attrs = split[ 1 ].replace( '}', '' ).trim().split( ';' );
          var tag_name = tag_list[ x ].trim().replace( ',', '' );
          if ( output[ 'tag' ][ tag_name ] == null ) {
            output[ 'tag' ][ tag_name ] = {};
          }
          for ( b = 0; b < attrs.length; b++ ) {
            attr_split = attrs[ b ].split( ':' );
            if ( attr_split[ 0 ] != null && attr_split[ 1 ] != null ) {
              output[ 'tag' ][ tag_name ][ attr_split[ 0 ].trim() ] = attr_split[ 1 ].trim();
            }
          }
        }
      }
    }
  } else {
    output[ 'tag' ][ tag ] = '';
  }
  for ( var c in output[ 'class' ] ) {
    for ( var attribute in output[ 'class' ][ c ] ) {
      output[ 'attr' ][ attribute ] = output[ 'class' ][ c ][ attribute ];
    }
  }
  for ( c in output[ 'id' ] ) {
    for ( attribute in output[ 'id' ][ c ] ) {
      output[ 'attr' ][ attribute ] = output[ 'id' ][ c ][ attribute ];
    }
  }
  for ( c in output[ 'tag' ] ) {
    for ( attribute in output[ 'tag' ][ c ] ) {
      output[ 'attr' ][ attribute ] = output[ 'tag' ][ c ][ attribute ];
    }
  }
  return output;
}

function select_click( e ) {
  e.preventDefault();
  console.log( parse( selected ) );
}

function select_out( e ) {
  e.preventDefault();
  this.style.backgroundColor = color;
  selected = null;
}

function getStyleWithCSSSelector( cssSelector ) {
  var styleSheets = window.document.styleSheets;
  var styleSheetsLength = styleSheets.length;
  var arStylesWithCSSSelector = [];

  //in order to not find class which has the current name as prefix
  var arValidCharsAfterCssSelector = [ ' ', '.', ',', '#', '>', '+', ':', '[' ];

  //loop through all the stylessheets in the bor
  for ( var i = 0; i < styleSheetsLength; i++ ) {
    var classes = styleSheets[ i ].rules || styleSheets[ i ].cssRules;
    if ( classes != null ) {
      var classesLength = classes.length;
      for ( var x = 0; x < classesLength; x++ ) {
        //check for any reference to the class in the selector string
        if ( typeof classes[ x ].selectorText != 'undefined' ) {
          var matchClass = false;

          if ( classes[ x ].selectorText === cssSelector ) { //exact match
            matchClass = true;
          } else { //check for it as part of the selector string
            for ( var j = 0; j < arValidCharsAfterCssSelector.length; j++ ) {
              var cssSelectorWithNextChar = cssSelector + arValidCharsAfterCssSelector[ j ];

              if ( classes[ x ].selectorText.indexOf( cssSelectorWithNextChar ) != -1 ) {
                matchClass = true;
                //break out of for-loop
                break;
              }
            }
          }

          if ( matchClass === true ) {
            //console.log("Found "+ cssSelectorWithNextChar + " in css class definition " + classes[x].selectorText);
            var styleDefinition;
            if ( classes[ x ].cssText ) {
              styleDefinition = classes[ x ].cssText;
            } else {
              styleDefinition = classes[ x ].style.cssText;
            }
            if ( styleDefinition.indexOf( classes[ x ].selectorText ) == -1 ) {
              styleDefinition = classes[ x ].selectorText + '{' + styleDefinition + '}';
            }
            arStylesWithCSSSelector.push( { 'selectorText': classes[ x ].selectorText, 'styleDefinition': styleDefinition } );
          }
        }
      }
    }
  }
  if ( arStylesWithCSSSelector.length == 0 ) {
    return null;
  } else {
    return arStylesWithCSSSelector;
  }
}