'use strict';
/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */

(function($) {

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var Sage = {
    // All pages
    'common': {
      init: function() {
        var $wrapperMenuLinks = $( '.w-nav-topo' ),
            $formInscricao = $( '.form-inscricao' );

        // Controla o menu flutuante
        $( window ).on( 'scroll', function() {
            var currentPosition = $( this ).scrollTop(),
              scrollLimit = $wrapperMenuLinks.outerHeight();
          if( currentPosition >= scrollLimit * 2 ) {
            $wrapperMenuLinks.addClass( 'fixed-menu' );
            $wrapperMenuLinks.css( 'top', currentPosition );
          } else {
            $wrapperMenuLinks.css( 'top', 0 );
            $wrapperMenuLinks.removeClass( 'fixed-menu' );
          }
        } );

        $( '.w-links a:not( .link-rede )' ).click( function() {
          $( '.w-links a' ).removeClass( 'active' );
          $( this ).addClass( 'active' );
        } );

        // Inicializa o slider dos convidados
        $( '.lista-convidados' ).bxSlider( {
          minSlides: 3,
          maxSlides: 3,
          auto: true,
          controls: false,
          pause: 4000,
          autoHover: true,
          slideWidth: $( '.w-lista-convidados' ).width() / 3
        } );

        // Configura as âncoras dos menus
        $( 'a[data-ancora]' ).on( 'click', function( e ) {
          e.preventDefault();
          $( 'html, body' ).animate( {
            scrollTop: $( '#' + $( this ).attr( 'data-ancora' ) ).offset().top - $wrapperMenuLinks.outerHeight()
          }, 400, 'swing' );
        } );

        // Envio de inscrição
        $formInscricao.submit( function( e ) {
          var $submit = $( this ).find( ':submit' ),
              submitText = $submit.attr( 'value' );
          e.preventDefault();
          $submit
              .attr( 'value', 'Aguarde...' )
              .addClass( 'aguarde' );

          $.post( $( this ).attr( 'action' ), $( this ).serializeArray(), function( data ) {
            $submit
                .attr( 'value', submitText )
                .removeClass( 'aguarde' );

            if ( data.status == true ) {
              $submit
                  .attr( 'disabled', true )
                  .attr( 'value', 'Inscrição efetuada' )
                  .addClass( 'sucesso' );
            } else {
              alert( 'Houve um erro no envio, mano :(' );
            }
          } );
        } );
      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
      }
    },
    // Home page
    'home': {
      init: function() {
        // JavaScript to be fired on the home page
      },
      finalize: function() {
        // JavaScript to be fired on the home page, after the init JS
      }
    },
    // About us page, note the change from about-us to about_us.
    'about_us': {
      init: function() {
        // JavaScript to be fired on the about us page
      }
    }
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {
    fire: function(func, funcname, args) {
      var fire;
      var namespace = Sage;
      funcname = (funcname === undefined) ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === 'function';

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function() {
      // Fire common init JS
      UTIL.fire('common');

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');
    }
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
