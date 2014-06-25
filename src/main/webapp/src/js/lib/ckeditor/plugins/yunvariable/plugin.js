(function(){
    function addCombo(editor, comboName,lang, entries){
        var config = editor.config;
        var names = entries.split( ';' ),
            values = [];

        // Create style objects for all fonts.
        var yunvariable = {};
        for ( var i = 0 ; i < names.length ; i++ ){
            var parts = names[ i ];
            if ( parts ){
                parts = parts.split( '/' );

                var vars = {},
                    name = names[ i ] = parts[ 0 ];

                vars[ 'var' ] = values[ i ] = parts[ 1 ] || name;

                yunvariable[ name ] = parts[1];
                // styles[ name ] = new CKEDITOR.style( styleDefinition, vars );
                // styles[ name ]._.definition.name = name;
            } else {
                names.splice( i--, 1 );
            }
        }

        editor.ui.addRichCombo( comboName,{
            label : lang.yunvariable.label,
            title: lang.yunvariable.panelTitle,
            className: 'cke_' + 'yunvariable',
            panel :
            {
                css : [CKEDITOR.skin.getPath("editor")].concat( config.contentsCss ),
                multiSelect : false,
                attributes: { 'aria-label': lang.yunvariable.panelTitle }
            },

            init : function(){
                this.startGroup( lang.yunvariable.panelTitle );

                for ( var i = 0 ; i < names.length ; i++ )
                {
                    var name = names[ i ];
                    // Add the tag entry to the panel list.
                    this.add( name, name, name );
                }
            },
            onClick : function( value ){
                editor.focus();
                var style = yunvariable[ value ];
                var block = editor.document.createElement( 'span' );
                block.setText(' '+style+' ');
                editor.insertElement(block);
            },
            onRender : function(){
                editor.on( 'selectionChange', function( ev ){},this);
            }
        });

        //--
    }

    CKEDITOR.plugins.add('yunvariable',{
        lang: ['zh-cn'],
        requires: [ 'richcombo' ],

        init: function( editor ){
            var config = editor.config;
            addCombo(editor, 'yunvariable',editor.lang, config.yunvariable_val);
        }
    });
})();

CKEDITOR.config.yunvariable_val = '联系人姓名/%%联系人姓名%%;联系人公司/%%联系人公司%%';