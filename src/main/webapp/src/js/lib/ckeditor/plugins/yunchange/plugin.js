// Keeps track of changes to the content and fires a "change" event
CKEDITOR.plugins.add( 'mgchange',
    {
        icons:"mgchange",
        init : function( editor )
        {
            var timer,
                theMutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
                observer;

            // Avoid firing the event too often
            function somethingChanged()
            {
                // console.trace();
                // don't fire events if the editor is readOnly as they are false detections
                if (editor.readOnly)
                    return;
                if (timer)
                    return;
                timer = setTimeout( function() {
                    timer = 0;
                    editor.fire( 'mgchange' );
                }, 100);

                return false;
            }

            editor.on('change',function(){
                // console.log('CHANGE');
                somethingChanged();
            });

            editor.on('contentDom',function(){
                // console.log('message');
                // console.log(editor.document);
                // console.log('-------');
                // ------------

                editor.document.$.oninput = function(){
                    // console.log('ON-INPUT');
                    somethingChanged();
                };

                editor.document.$.onpropertychange = function(){
                    // console.log('ON-IE-INPUT');
                    somethingChanged();
                };

            });
        } //Init
    } );
