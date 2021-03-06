var url = window.location.hostname + window.location.pathname;

// chrome.storage.sync.clear(function() {
chrome.storage.sync.get( url, function( items ) {
  settings = {};
  items = items[ url ];
  console.log( items );
  settings.ids = items.ids || {};
  settings.tags = items.tags || {};
  settings.classes = items.classes || {};
  settings.tree = items.tree || {};
  console.log( settings );
  stylePage();
} );

var element = document;

var stylePage;
var methods = {};
var parse;

methods.open_dialog = function() {
  let parsed = parse( element );
  console.log( parsed );

  var toggle = function( toggleme ) {
    return function( e ) {
      toggleme.toggle();
    };
  };
  dialog = $( '<div id="fluid-dialog" />' );
  let settings_container = $( '<fluid id="fluid-settings" />' );
  let source = $( '<fluid id="fluid-source" />' );
  let container = $( '<fluid />' );
  let classes = $( '<fluid class="fluid-classes" />' );
  let class_title = $( '<label class="fluid-title"> Classes </label>' );
  let classes_container = $( '<fluid />' );
  class_title.click( toggle( classes_container ) );
  classes.append( class_title );
  for ( let class_name in parsed.classes ) {
    let properties = parsed.classes[ class_name ];
    let class_container = $( '<fluid name="' + class_name + '" />' );
    let class_name_container = $( '<label>' + class_name + '</label>' );
    let properties_container = $( '<fluid />' );
    class_name_container.click( toggle( properties_container ) );
    class_container.append( class_name_container );
    for ( let class_property in properties ) {
      let property_container = $( '<fluid class="fluid-property"/>' );
      let property_name = $( '<input class="fluid-name" />' );
      property_name.val( class_property );
      let property_val = $( '<input class="fluid-value" />' );
      property_val.val( properties[ class_property ] );
      property_container.append( property_name ).append( ':' ).append( property_val );
      properties_container.append( property_container );
    }
    properties_container.toggle();
    class_container.append( properties_container );
    classes_container.append( class_container );
  }
  classes_container.toggle();
  classes.append( classes_container );

  settings_container.append( classes );

  let ids = $( '<fluid class="fluid-ids" />' );
  let id_title = $( '<label class="fluid-title"> Ids </label>' );
  let ids_container = $( '<fluid />' );
  id_title.click( toggle( ids_container ) );
  ids.append( id_title );
  for ( let id_name in parsed.ids ) {
    let properties = parsed.ids[ id_name ];
    let id_container = $( '<fluid name="' + id_name + '" />' );
    let id_name_container = $( '<label>' + id_name + '</label>' );
    let properties_container = $( '<fluid />' );
    id_name_container.click( toggle( properties_container ) );
    id_container.append( id_name_container );
    for ( let id_property in properties ) {
      let property_container = $( '<fluid class="fluid-property" />' );
      let property_name = $( '<input class="fluid-name" />' );
      property_name.val( id_property );
      let property_val = $( '<input class="fluid-value" />' );
      property_val.val( properties[ id_property ] );
      property_container.append( property_name ).append( ':' ).append( property_val );
      properties_container.append( property_container );
    }
    properties_container.toggle();
    id_container.append( properties_container );
    ids_container.append( id_container );
  }
  ids_container.toggle();
  ids.append( ids_container );
  settings_container.append( ids );

  let attrs = $( '<fluid id="fluid-attrs" />' );
  let attrs_title = $( '<label class="fluid-title"> Attributes </label>' );
  attrs.append( attrs_title );
  let attrs_container = $( '<fluid class="fluid-attrs-container"/>' );
  for ( let property in parsed.attrs ) {
    let property_container = $( '<fluid class="fluid-property"/>' );
    let property_name = $( '<input class="fluid-name" value="' + property + '"/>' );
    let property_value = $( '<input class="fluid-value" value="' + parsed.attrs[ property ] + '" />' );
    property_container.append( property_name ).append( ':' ).append( property_value );
    attrs_container.append( property_container );
  }
  attrs.append( attrs_container );
  settings_container.append( attrs );

  dialog.append( settings_container );
  let save_button = $( '<button class="fluid-save"> Save </button>' );
  save_button.click( save );
  dialog.append( save_button );

  for ( var x in parsed[ 'tags' ] ) {
    var title = x.split( '.' )[ 0 ];
  }
  for ( x in parsed[ 'ids' ] ) {
    if ( x != '' ) {
      title += '#' + x;
    }
  }
  for ( x in parsed[ 'classes' ] ) {
    if ( x != '' ) {
      title += '.' + x;
    }
  }

  let box = dialog.dialog( {
    height: $( window ).height(),
    dialogClass: 'fluid-dialog-box',
    position: {
      my: 'right center',
      at: 'right center',
      of: window
    },
    title: title,
    close: removeMouseOver
  } );
  mouseOver();
  console.log( box );
};

var save = function() {
  console.log( dialog );
  let dialog_settings = dialog.find( '#fluid-settings' );
  console.log( dialog_settings );
  let classes = {};
  dialog_settings.find( '.fluid-classes' ).each( function() {
    $( this ).find( '[name]' ).each( function() {
      let properties = {};
      $( this ).find( '.fluid-property' ).each( function() {
        let inputs = $( this ).children();
        console.log( inputs );
        properties[ $( inputs[ 0 ] ).val() ] = $( inputs[ 1 ] ).val();
      } );
      classes[ $( this ).attr( 'name' ) ] = properties;
    } );
  } );
  for ( let key in classes ) {
    settings.classes[ key ] = classes[ key ];
  }
  let ids = {};
  dialog_settings.find( '.fluid-ids' ).each( function() {
    $( this ).find( '[name]' ).each( function() {
      let properties = {};
      $( this ).find( '.fluid-property' ).each( function() {
        let inputs = $( this ).children();
        console.log( inputs );
        properties[ $( inputs[ 0 ] ).val() ] = $( inputs[ 1 ] ).val();
      } );
      ids[ $( this ).attr( 'name' ) ] = properties;
    } );
  } );
  for ( let key in ids ) {
    settings.ids[ key ] = ids[ key ];
  }
  let attrs = {};
  dialog_settings.find( '#fluid-attrs' ).each( function() {
    $( this ).find( '.fluid-property' ).each( function() {
      let inputs = $( this ).children();
      attrs[ $( inputs[ 0 ] ).val() ] = $( inputs[ 1 ] ).val();
      console.log( attrs );
    } );
  } );
  let path = JSON.stringify( getPath() );
  settings.tree[ path ] = attrs;
  console.log( settings );
  let sync = {};
  sync[ url ] = settings;
  chrome.storage.sync.set( sync, function( err ) {
    if ( err ) console.error( err );
    else console.log( 'done!' );
    chrome.storage.sync.get( url, function( items ) {
      console.log( items );
    } );
  } );
};

var getPath = function() {
  let path = [];
  let curr = element;
  while ( curr.parentNode ) {
    let parent = curr.parentNode;
    var index = Array.prototype.indexOf.call( parent.children, curr );
    path.push( index );
    curr = parent;
  }
  return path;
};

var retrieveValues = function( el ) {
  let retrieve = {};
  $( el ).find( '.fluid-property' ).each( function() {
    let inputs = $( this ).children( 'input' );
    retrieve[ inputs[ 0 ].val() ] = inputs[ 1 ].val();
  } );

  return retrieve;
};

chrome.runtime.onMessage.addListener( function( req ) {
  let method = req.method;
  delete req.method;
  methods[ method ]( req, element );
} );

// console.log(document);
document.addEventListener( 'contextmenu', function( e ) {
  element = e.target;
} );